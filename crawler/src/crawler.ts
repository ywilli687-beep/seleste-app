/**
 * crawler.ts — Core Crawl Engine
 *
 * crawlBusiness(url, vertical, metroArea) — crawls a single URL, scores it,
 *   and writes a CrawlerSnapshot to the database.
 *
 * crawlBatch(batchSize) — pulls PENDING businesses from DB, crawls them with
 *   a 1-second rate limit between requests, marks each CRAWLED or FAILED.
 */
import axios from 'axios'
import { db } from './db'
import { fetchPage, extractHardSignals } from '../../backend/src/lib/fetcher'
import { applyRules, computePillarScores, computeWeightedScore } from '../../backend/src/lib/engine/index'
import type { PageSignals } from '../../backend/src/types/audit'
import type { HardSignals } from '../../backend/src/types/audit'

const USER_AGENT = 'Seleste-Crawler/1.0 (business intelligence; contact@seleste.com)'
const RATE_LIMIT_MS = 1000

// ─────────────────────────────────────────────────────────────────────────────
// robotsAllowed
// Returns true if the crawler is permitted to fetch the given URL.
// Fails open (returns true) on network errors — per build brief.
// ─────────────────────────────────────────────────────────────────────────────
async function robotsAllowed(url: string): Promise<boolean> {
  try {
    const { origin } = new URL(url)
    const robotsUrl = `${origin}/robots.txt`
    const res = await axios.get(robotsUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 8000,
      validateStatus: () => true,
    })

    if (res.status !== 200) return true // No robots.txt — allowed

    const lines = (res.data as string).split('\n')
    let inRelevantBlock = false
    let disallowAll = false

    for (const raw of lines) {
      const line = raw.trim()
      if (line.startsWith('User-agent:')) {
        const agent = line.split(':')[1].trim()
        inRelevantBlock = agent === '*' || agent.toLowerCase().includes('seleste')
      }
      if (inRelevantBlock && line.startsWith('Disallow:')) {
        const path = line.split(':')[1].trim()
        if (path === '/') { disallowAll = true; break }
      }
    }

    return !disallowAll
  } catch {
    return true // Fail open
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// hardSignalsToPageSignals
// Maps the 20-field HardSignals subset → the full PageSignals interface.
// Fields that cannot be determined from static HTML default to safe values.
// ─────────────────────────────────────────────────────────────────────────────
function hardSignalsToPageSignals(hard: HardSignals): PageSignals {
  return {
    // Conversion — cannot reliably detect from static HTML alone
    hasCTA: false,
    hasBooking: false,
    hasContactForm: false,
    hasPricing: false,
    hasGuarantee: false,
    hasLiveChat: false,
    hasOnlinePayment: false,
    conversionFriction: 3,

    // Trust
    hasReviews: false,      // Requires GBP data
    hasContactInfo: false,  // Conservative default
    hasSSL: hard.isSSL,
    hasAboutPage: false,
    hasAddress: false,
    hasTeamPhotos: false,
    hasLicenseInfo: false,
    hasAwardsOrCerts: false,
    hasInsuranceInfo: false,
    reviewPlatforms: [],
    estimatedReviewCount: undefined,
    estimatedRating: undefined,

    // Performance
    isMobileOptimized: hard.isMobileOptimized,
    hasOptimizedImages: hard.hasOptimizedImages,
    hasLazyLoad: hard.hasLazyLoad,
    hasCDN: hard.hasCDN,
    hasCaching: hard.hasCaching,

    // Discoverability
    hasGBP: false,          // Cannot determine from page HTML
    hasSchema: hard.hasSchema,
    hasMetaDescription: hard.hasMetaDescription,
    hasH1: hard.hasH1,
    hasBlog: false,
    hasLocalKeywords: false,
    schemaTypes: hard.schemaTypes,
    targetKeywords: [],

    // UX
    hasGoodNav: false,
    hasMobileMenu: hard.isMobileOptimized, // Proxy
    hasSiteSearch: false,
    hasAccessibility: false,
    navigationDepth: undefined,

    // Content
    wordCount: hard.wordCount,
    hasFAQ: false,
    hasServiceList: false,
    hasLocationPages: false,
    hasVideoContent: false,
    hasBeforeAfterPhotos: false,
    primaryServices: [],

    // Data
    hasAnalytics: hard.hasAnalytics,
    hasPixel: hard.hasPixel,
    hasTagManager: hard.hasTagManager,
    hasHeatmaps: false,
    hasCRMIntegration: false,
    analyticsPlatform: hard.analyticsPlatform || undefined,

    // Technical
    hasCMS: hard.hasCMS,
    detectedCMS: hard.detectedCMS,
    techStack: hard.techStack,
    hasStructuredData: hard.hasSchema,
    hasXMLSitemap: hard.hasXMLSitemap,
    hasRobotsTxt: true,     // We only crawl sites that allow it

    // Brand
    hasLogo: false,
    hasBrandDiff: false,
    hasTagline: false,
    hasConsistentColors: false,

    // Meta
    pageTitle: hard.pageTitle,
    detectedTopIssues: [],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// pillarScoresToSnapshot
// Maps engine PillarScores (10 pillar IDs) → CrawlerSnapshot columns
// ─────────────────────────────────────────────────────────────────────────────
function pillarScoresToSnapshotFields(scores: Record<string, number>) {
  return {
    conversionScore:    scores.conversion    ?? 50,
    seoScore:           scores.discoverability ?? 50,   // seo = discoverability
    reputationScore:    scores.trust         ?? 50,     // reputation = trust
    contentScore:       scores.content       ?? 50,
    uxScore:            scores.ux            ?? 50,
    mobileScore:        scores.performance   ?? 50,     // mobile = performance
    trustScore:         scores.trust         ?? 50,
    performanceScore:   scores.performance   ?? 50,
    localScore:         scores.discoverability ?? 50,   // local = discoverability
    accessibilityScore: scores.ux            ?? 50,     // accessibility = ux
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// crawlBusiness
// Single-URL crawl: fetch → extract signals → score → write CrawlerSnapshot.
// Returns the overallScore, or null on failure.
// ─────────────────────────────────────────────────────────────────────────────
export async function crawlBusiness(
  url: string,
  vertical: string,
  metroArea: string,
  businessId: string,
): Promise<number | null> {
  // 1. Robots.txt check
  const allowed = await robotsAllowed(url)
  if (!allowed) {
    console.log(`[crawler] robots.txt disallows: ${url}`)
    return null
  }

  // 2. Fetch the page
  let page
  try {
    page = await fetchPage(url)
  } catch (err: any) {
    console.error(`[crawler] fetchPage failed for ${url}:`, err.message)
    return null
  }

  // 3. Extract hard signals
  const hard: HardSignals = extractHardSignals(page)

  // 4. Map to full PageSignals
  const signals: PageSignals = hardSignalsToPageSignals(hard)

  // 5. Score
  const { caps, penalties } = applyRules(signals)
  const pillarScores = computePillarScores(signals, caps, penalties)
  const overallScore = computeWeightedScore(pillarScores)
  const snapshotFields = pillarScoresToSnapshotFields(pillarScores as Record<string, number>)

  // 6. Write CrawlerSnapshot
  await db.crawlerSnapshot.create({
    data: {
      businessId,
      url,
      vertical,
      metroArea,
      overallScore,
      ...snapshotFields,
      hasSsl: hard.isSSL,
      hasSchemaMarkup: hard.hasSchema,
      hasBookingWidget: signals.hasBooking,
    },
  })

  return overallScore
}

// ─────────────────────────────────────────────────────────────────────────────
// crawlBatch
// Pulls up to `batchSize` PENDING businesses, crawls them sequentially with
// a 1-second rate limit between each request. Updates DB status after each.
// ─────────────────────────────────────────────────────────────────────────────
export async function crawlBatch(batchSize = 500): Promise<void> {
  const businesses = await db.crawledBusiness.findMany({
    where: { status: 'PENDING' },
    take: batchSize,
    orderBy: { createdAt: 'asc' },
  })

  console.log(`[crawler] Starting batch: ${businesses.length} businesses`)

  for (const biz of businesses) {
    const start = Date.now()

    try {
      const score = await crawlBusiness(biz.url, biz.vertical, biz.metroArea, biz.id)

      await db.crawledBusiness.update({
        where: { id: biz.id },
        data: {
          status: score !== null ? 'CRAWLED' : 'SKIPPED',
          lastCrawledAt: new Date(),
          crawlCount: { increment: 1 },
        },
      })

      console.log(`[crawler] ${biz.url} → score ${score ?? 'skipped'}`)
    } catch (err: any) {
      console.error(`[crawler] Failed ${biz.url}:`, err.message)
      await db.crawledBusiness.update({
        where: { id: biz.id },
        data: {
          status: 'FAILED',
          lastCrawledAt: new Date(),
          crawlCount: { increment: 1 },
        },
      })
    }

    // Enforce 1-second rate limit
    const elapsed = Date.now() - start
    if (elapsed < RATE_LIMIT_MS) {
      await sleep(RATE_LIMIT_MS - elapsed)
    }
  }

  console.log(`[crawler] Batch complete`)
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
