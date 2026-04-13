// @ts-nocheck
import { db } from '@/lib/db'
import type {
  AuditResult, PageSignals, PillarScores, RevenueLeak,
  AuditConfidence, AppliedRule, ScoreDelta, Vertical,
  MarketSegmentSummary, Grade, PillarId
} from '@/types/audit'
import { PILLARS, PILLAR_DB_FIELD, computeGrade } from '@/lib/engine'
import { getLevelInfo, computeStreak, ACHIEVEMENTS } from '@/lib/gamification'

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function extractHostname(url: string): string {
  try {
    return new URL(url.startsWith('http') ? url : 'https://' + url)
      .hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  }
}

export function normalizeDomain(url: string): string {
  return extractHostname(url)
}

export function generateSlug(domain: string): string {
  return domain
    .replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 60)
}

export async function uniqueSlug(base: string): Promise<string> {
  // No slug field in new schema — return base unchanged
  return base
}

// Map audit vertical strings to Industry enum values
function mapVerticalToIndustry(vertical: string): string {
  const MAP: Record<string, string> = {
    AUTO_REPAIR:   'AUTO_REPAIR',
    CAR_WASH:      'OTHER',
    RESTAURANT:    'RESTAURANT',
    HOME_SERVICES: 'OTHER',
    LOCAL_SERVICE: 'OTHER',
    DENTAL:        'DENTAL',
    LEGAL:         'LAW_FIRM',
    REAL_ESTATE:   'REAL_ESTATE',
    FITNESS:       'GYM_FITNESS',
    BEAUTY_SALON:  'SALON_SPA',
    PLUMBING:      'PLUMBING',
    HVAC:          'HVAC',
    LANDSCAPING:   'LANDSCAPING',
    CLEANING:      'OTHER',
    PET_SERVICES:  'VETERINARY',
  }
  return MAP[vertical] ?? 'OTHER'
}

// ─────────────────────────────────────────────────────────────────────────────
// UPSERT BUSINESS
// Finds or creates a Business record using the new schema (no domain/slug fields)
// ─────────────────────────────────────────────────────────────────────────────

export async function upsertBusiness(params: {
  url: string
  businessName?: string
  vertical: string
  location: string
  overallScore: number
  grade: any
  pillarScores: any
  userId?: string | null
}) {
  const [city, state] = params.location.split(',').map(s => s.trim())
  const website  = params.url
  const name     = params.businessName ?? extractHostname(website)
  const industry = mapVerticalToIndustry(params.vertical)

  // Prefer match on userId+website, then fall back to website alone
  let existing: any = null
  if (params.userId) {
    existing = await db.business.findFirst({ where: { userId: params.userId, website } })
  }
  if (!existing) {
    existing = await db.business.findFirst({ where: { website } })
  }

  let record: any
  if (existing) {
    record = await db.business.update({
      where: { id: existing.id },
      data: {
        name,
        industry,
        city,
        region: state,
        vertical: params.vertical,
        // Claim anonymous record for a user if they just signed in
        ...(params.userId && !existing.userId ? { userId: params.userId } : {}),
      },
    })
  } else {
    const createData: any = {
      name,
      website,
      industry,
      city,
      region: state,
      vertical: params.vertical,
    }
    if (params.userId) createData.userId = params.userId

    record = await db.business.create({ data: createData })
  }

  // Attach synthetic compat fields so audit.ts callers don't crash
  return {
    ...record,
    slug:         null,
    businessName: name,
    domain:       extractHostname(website),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UPSERT BUSINESS SIGNALS
// Maps old PageSignals field names to new BusinessSignals schema
// ─────────────────────────────────────────────────────────────────────────────

export async function upsertBusinessSignals(businessId: string, signals: any) {
  const data = {
    hasSSL:            signals.hasSSL            ?? false,
    hasH1:             signals.hasH1             ?? false,
    hasSchemaMarkup:   signals.hasSchema         ?? false,
    hasSitemap:        false,
    hasRobotsTxt:      signals.hasRobotsTxt      ?? false,
    hasBookingWidget:  signals.hasBooking        ?? false,
    hasMobileViewport: signals.isMobileOptimized ?? false,
    pageLoadMs:        signals.estimatedLoadScore != null
                         ? Math.round(signals.estimatedLoadScore * 10) : null,
    imageCount:        null,
    imagesWithAlt:     null,
    internalLinkCount: null,
    wordCount:         signals.wordCount         ?? null,
    cmsDetected:       signals.detectedCMS       ?? null,
    hasCallToAction:   signals.hasCTA            ?? false,
    hasPricingInfo:    signals.hasPricing        ?? false,
    hasTestimonials:   signals.hasAwardsOrCerts  ?? false,
    hasContactInfo:    signals.hasContactInfo    ?? false,
    hasBusinessHours:  signals.hasAddress        ?? false,
    hasLocationInfo:   signals.hasAddress        ?? false,
    hasFAQ:            signals.hasFAQ            ?? false,
    hasLiveChat:       signals.hasLiveChat       ?? false,
    hasTrustBadges:    signals.hasAwardsOrCerts  ?? false,
    hasGoogleReviews:  signals.hasGBP            ?? false,
    reviewRating:      signals.estimatedRating   ?? null,
    reviewCount:       signals.estimatedReviewCount ?? null,
    ctaClarity:        null,
    contentQuality:    signals.contentQualityScore ?? null,
    brandConsistency:  null,
  }

  return db.businessSignals.upsert({
    where:  { businessId },
    update: data,
    create: { businessId, ...data },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// SAVE AUDIT SNAPSHOT
// Maps old pillar score names + extra fields to the new AuditSnapshot schema
// ─────────────────────────────────────────────────────────────────────────────

export async function saveAuditSnapshot(params: {
  businessId: string
  result: any
  delta?: any
  benchmarkAvg: number[]
  benchmarkTop: number[]
  userId?: string | null
  vertical?: string | null
  metroArea?: string | null
  businessSize?: string | null
  leakageEstimate?: number | null
}) {
  const { result, delta } = params
  const ps = result.pillarScores ?? {}

  // Old pillar keys → new schema columns
  // conversion    → conversionScore
  // discoverability → seoScore  (SEO is about discoverability)
  // trust          → reputationScore + trustScore
  // content        → contentScore
  // technical      → technicalScore
  // performance    → mobileScore + performanceScore
  // ux             → accessibilityScore
  // brand          → localScore (closest proxy)
  const conversionScore    = Math.round(ps.conversion     ?? 0)
  const seoScore           = Math.round(ps.discoverability ?? 0)
  const reputationScore    = Math.round(ps.trust           ?? 0)
  const contentScore       = Math.round(ps.content         ?? 0)
  const technicalScore     = Math.round(ps.technical       ?? 0)
  const mobileScore        = Math.round(ps.performance     ?? 0)
  const trustScore         = Math.round(ps.trust           ?? 0)
  const localScore         = Math.round(ps.brand           ?? 0)
  const accessibilityScore = Math.round(ps.ux              ?? 0)
  const performanceScore   = Math.round(ps.performance     ?? 0)

  const triggerMap: Record<string, string> = {
    MANUAL:      'MANUAL',
    SCHEDULED:   'CRAWLER',
    API:         'MANUAL',
    BULK_IMPORT: 'CRAWLER',
  }
  const triggerType = triggerMap[result.input?.triggeredBy ?? 'MANUAL'] ?? 'MANUAL'

  const snapshot = await db.auditSnapshot.create({
    data: {
      businessId:      params.businessId,
      triggerType,
      previousSnapshotId: delta?.previousAuditId ?? null,
      overallScore:    Math.round(result.overallScore ?? 0),
      conversionScore,
      seoScore,
      reputationScore,
      contentScore,
      technicalScore,
      mobileScore,
      trustScore,
      localScore,
      accessibilityScore,
      performanceScore,
      scoreDelta:      delta ? { overall: delta.scoreDelta } : null,
      signals:         result.signals   ?? {},
      narrative:       result.aiNarrative ?? '',
      quickWins:       result.aiQuickWins ?? [],
      roadmap:         result.roadmap   ?? [],
      pageUrl:         result.input?.url ?? '',
      pageStatusCode:  null,
      sslValid:        result.signals?.hasSSL ?? false,
      crawlError:      null,
      verticalAvgScore: params.benchmarkAvg?.[0] ?? null,
      benchmarkData:   {
        avg: params.benchmarkAvg,
        top: params.benchmarkTop,
      },
      auditDurationMs: null,
    },
  })

  return snapshot
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTE SCORE DELTA
// ─────────────────────────────────────────────────────────────────────────────

export async function computeScoreDelta(
  businessId: string,
  currentScores: any,
  currentOverall: number,
): Promise<any> {
  const previous = await db.auditSnapshot.findFirst({
    where:   { businessId },
    orderBy: { createdAt: 'desc' },
    select:  { id: true, createdAt: true, overallScore: true },
  })

  if (!previous) return undefined

  return {
    previousAuditId:  previous.id,
    previousScore:    previous.overallScore,
    previousDate:     previous.createdAt.toISOString(),
    scoreDelta:       currentOverall - previous.overallScore,
    improvedPillars:  [],
    regressedPillars: [],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET VERTICAL PERCENTILE
// New schema has no latestOverallScore on Business — returns null (UI handles null)
// ─────────────────────────────────────────────────────────────────────────────

export async function getVerticalPercentile(
  _vertical: string,
  _score: number,
): Promise<number | null> {
  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE MARKET SEGMENT — not yet migrated, fire-and-forget so safe to no-op
// ─────────────────────────────────────────────────────────────────────────────

export async function updateMarketSegment(
  _vertical: string,
  _state?: string,
  _city?: string,
) {
  // MarketSegment now uses industry FK — full rewrite deferred to Phase 4
}

// ─────────────────────────────────────────────────────────────────────────────
// GET LIVE BENCHMARK — not yet migrated, returns null so static fallback is used
// ─────────────────────────────────────────────────────────────────────────────

export async function getLiveBenchmark(
  _vertical: string,
  _state?: string,
) {
  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD & REPORT STUBS
// These are called by routes that reference the old schema. They are being
// rewritten in a future phase; stubs prevent unhandled crashes.
// ─────────────────────────────────────────────────────────────────────────────

export async function getDashboardData(userId: string, isPro: boolean = false) {
  // Return minimal shape so the dashboard renders an empty state
  // rather than crashing. Full rewrite deferred to Phase 4.
  const latestAudit = await db.auditSnapshot.findFirst({
    where:   { business: { userId } },
    orderBy: { createdAt: 'desc' },
    include: { business: true },
  }).catch(() => null)

  if (!latestAudit) {
    return {
      myBusinessesCount: 0,
      businessName: null,
      overallScore: 0,
      scoreDelta: null,
      grade: 'D',
      pillars: [],
      revenueLeakMonthly: null,
      xpTotal: 0,
      levelId: 1,
      levelName: 'Novice',
      xpToNextLevel: 100,
      unlockedFeatures: [],
      achievements: [],
      newlyEarnedAchievementIds: [],
      streakHistory: new Array(28).fill(0),
      streakDays: 0,
      streakPtsThisMonth: 0,
      totalAudits: 0,
      daysSinceAudit: 0,
      scoreHistory: [],
      quickWin: null,
      issues: [],
      roadmap: [],
      roadmapDurationWeeks: '0',
      verticalMedianScore: 50,
      bookingAdoptionRate: 0,
      topGap: 'No data',
      avgMonthlyImprovement: 0,
      competitorScores: [],
      competitorGap: null,
      recentAudits: [],
      chartData: [],
    }
  }

  const b = latestAudit.business
  return {
    id:               b.id,
    myBusinessesCount: 1,
    businessName:     b.name,
    vertical:         b.vertical,
    city:             b.city,
    state:            b.region,
    slug:             null,
    overallScore:     latestAudit.overallScore,
    scoreDelta:       (latestAudit.scoreDelta as any)?.overall ?? null,
    grade:            computeGrade(latestAudit.overallScore).grade,
    previousGrade:    null,
    pillars: [
      { id: 'conversion',     score: latestAudit.conversionScore,    industryAvg: 50 },
      { id: 'discoverability',score: latestAudit.seoScore,           industryAvg: 50 },
      { id: 'trust',          score: latestAudit.trustScore,         industryAvg: 50 },
      { id: 'content',        score: latestAudit.contentScore,       industryAvg: 50 },
      { id: 'technical',      score: latestAudit.technicalScore,     industryAvg: 50 },
      { id: 'performance',    score: latestAudit.performanceScore,   industryAvg: 50 },
      { id: 'ux',             score: latestAudit.accessibilityScore, industryAvg: 50 },
      { id: 'reputation',     score: latestAudit.reputationScore,    industryAvg: 50 },
      { id: 'local',          score: latestAudit.localScore,         industryAvg: 50 },
      { id: 'mobile',         score: latestAudit.mobileScore,        industryAvg: 50 },
    ],
    revenueLeakMonthly: null,
    leakagePct:       null,
    xpTotal:          0,
    xpRequired:       100,
    levelId:          1,
    levelName:        'Novice',
    xpToNextLevel:    100,
    unlockedFeatures: [],
    achievements:     [],
    newlyEarnedAchievementIds: [],
    streakHistory:    new Array(28).fill(0),
    streakDays:       0,
    streakPtsThisMonth: 0,
    totalAudits:      1,
    daysSinceAudit:   Math.floor((Date.now() - latestAudit.createdAt.getTime()) / 86400000),
    scoreHistory:     [latestAudit.overallScore],
    quickWin:         null,
    issues:           [],
    roadmap:          [],
    roadmapDurationWeeks: '2-3',
    verticalMedianScore: 50,
    bookingAdoptionRate: 0,
    topGap:           'No data',
    avgMonthlyImprovement: 0,
    competitorScores: [],
    competitorGap:    null,
    recentAudits: [{
      id:          latestAudit.id,
      createdAt:   latestAudit.createdAt.toISOString(),
      overallScore: latestAudit.overallScore,
      scoreDelta:  (latestAudit.scoreDelta as any)?.overall ?? null,
      grade:       computeGrade(latestAudit.overallScore).grade,
      inputUrl:    latestAudit.pageUrl,
      version:     'V1',
    }],
    chartData: [{
      date:  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
               .format(latestAudit.createdAt),
      score: latestAudit.overallScore,
    }],
    isAgency:   false,
    workspaces: [],
  }
}

export async function getPublicReport(_slug: string) {
  return null
}

export async function getAuditsByUser(userId: string, limit = 50) {
  return db.auditSnapshot.findMany({
    where:   { business: { userId } },
    orderBy: { createdAt: 'desc' },
    take:    limit,
    include: { business: true },
  }).catch(() => [])
}

export async function getBusinessHistory(domain: string) {
  const business = await db.business.findFirst({ where: { website: domain } }).catch(() => null)
  if (!business) return []
  return db.auditSnapshot.findMany({
    where:   { businessId: business.id },
    orderBy: { createdAt: 'desc' },
    take:    24,
    select: {
      id: true, createdAt: true, overallScore: true, scoreDelta: true,
      conversionScore: true, seoScore: true, reputationScore: true,
      contentScore: true, technicalScore: true, mobileScore: true,
      trustScore: true, localScore: true, accessibilityScore: true, performanceScore: true,
    },
  }).catch(() => [])
}
