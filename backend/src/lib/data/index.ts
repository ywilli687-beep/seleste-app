import { db } from '@/lib/db'
import type {
  AuditResult, PageSignals, PillarScores, RevenueLeak,
  AuditConfidence, AppliedRule, ScoreDelta, Vertical,
  MarketSegmentSummary, Grade, PillarId
} from '@/types/audit'
import { PILLARS, PILLAR_DB_FIELD, computeGrade } from '@/lib/engine'
import { getLevelInfo, computeStreak, ACHIEVEMENTS } from '@/lib/gamification'

// ─────────────────────────────────────────────────────────────────────────────
// NORMALIZE DOMAIN
// ─────────────────────────────────────────────────────────────────────────────

export function normalizeDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : 'https://' + url)
    return u.hostname.replace(/^www\./, '').toLowerCase()
  } catch {
    return url.toLowerCase().replace(/^www\./, '').split('/')[0]
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UPSERT BUSINESS
// Creates or updates the permanent business profile
// ─────────────────────────────────────────────────────────────────────────────

export async function upsertBusiness(params: {
  url: string
  businessName?: string
  vertical: Vertical
  location: string
  overallScore: number
  grade: Grade
  pillarScores: PillarScores
  userId?: string | null
}) {
  const domain = normalizeDomain(params.url)
  const [city, state] = params.location.split(',').map(s => s.trim())

  const existing = await db.business.findUnique({ where: { domain } })

  const newEntry = { date: new Date().toISOString(), score: params.overallScore, grade: params.grade }
  const existingHistory: typeof newEntry[] = existing?.scoreHistory
    ? (existing.scoreHistory as typeof newEntry[])
    : []
  const scoreHistory = [...existingHistory, newEntry].slice(-24)

  const business = await db.business.upsert({
    where: { domain },
    update: {
      canonicalUrl: params.url,
      businessName: params.businessName ?? undefined,
      vertical: params.vertical,
      city,
      state,
      latestOverallScore:     params.overallScore,
      latestConversionScore:  params.pillarScores.conversion,
      latestTrustScore:       params.pillarScores.trust,
      latestPerformanceScore: params.pillarScores.performance,
      latestDiscoverScore:    params.pillarScores.discoverability,
      latestUxScore:          params.pillarScores.ux,
      latestContentScore:     params.pillarScores.content,
      latestDataScore:        params.pillarScores.data,
      latestTechnicalScore:   params.pillarScores.technical,
      latestBrandScore:       params.pillarScores.brand,
      latestScalabilityScore: params.pillarScores.scalability,
      latestGrade: params.grade,
      lastAuditedAt: new Date(),
      auditCount: { increment: 1 },
      scoreHistory,
    },
    create: {
      domain,
      canonicalUrl: params.url,
      businessName: params.businessName ?? null,
      vertical: params.vertical,
      city,
      state,
      latestOverallScore:     params.overallScore,
      latestConversionScore:  params.pillarScores.conversion,
      latestTrustScore:       params.pillarScores.trust,
      latestPerformanceScore: params.pillarScores.performance,
      latestDiscoverScore:    params.pillarScores.discoverability,
      latestUxScore:          params.pillarScores.ux,
      latestContentScore:     params.pillarScores.content,
      latestDataScore:        params.pillarScores.data,
      latestTechnicalScore:   params.pillarScores.technical,
      latestBrandScore:       params.pillarScores.brand,
      latestScalabilityScore: params.pillarScores.scalability,
      latestGrade: params.grade,
      lastAuditedAt: new Date(),
      scoreHistory,
      createdByUser: params.userId ?? null,
    },
  })

  return business
}

// ─────────────────────────────────────────────────────────────────────────────
// UPSERT BUSINESS SIGNALS
// Updates the living signal record for this business
// ─────────────────────────────────────────────────────────────────────────────

export async function upsertBusinessSignals(businessId: string, signals: PageSignals) {
  return db.businessSignals.upsert({
    where: { businessId },
    update: {
      hasCTA: signals.hasCTA,
      hasBooking: signals.hasBooking,
      hasContactForm: signals.hasContactForm,
      hasPricing: signals.hasPricing,
      hasGuarantee: signals.hasGuarantee,
      hasLiveChat: signals.hasLiveChat,
      hasOnlinePayment: signals.hasOnlinePayment,
      ctaText: signals.ctaText ?? null,
      bookingPlatform: signals.bookingPlatform ?? null,
      conversionFriction: signals.conversionFriction ?? null,
      hasReviews: signals.hasReviews,
      hasContactInfo: signals.hasContactInfo,
      hasSSL: signals.hasSSL,
      hasAboutPage: signals.hasAboutPage,
      hasAddress: signals.hasAddress,
      hasTeamPhotos: signals.hasTeamPhotos,
      hasLicenseInfo: signals.hasLicenseInfo,
      hasAwardsOrCerts: signals.hasAwardsOrCerts,
      hasInsuranceInfo: signals.hasInsuranceInfo,
      reviewPlatforms: signals.reviewPlatforms,
      estimatedReviewCount: signals.estimatedReviewCount ?? null,
      estimatedRating: signals.estimatedRating ?? null,
      isMobileOptimized: signals.isMobileOptimized,
      hasOptimizedImages: signals.hasOptimizedImages,
      hasLazyLoad: signals.hasLazyLoad,
      hasCDN: signals.hasCDN,
      hasCaching: signals.hasCaching,
      estimatedLoadScore: signals.estimatedLoadScore ?? null,
      hasGBP: signals.hasGBP,
      hasSchema: signals.hasSchema,
      hasMetaDescription: signals.hasMetaDescription,
      hasH1: signals.hasH1,
      hasBlog: signals.hasBlog,
      hasLocalKeywords: signals.hasLocalKeywords,
      schemaTypes: signals.schemaTypes,
      targetKeywords: signals.targetKeywords,
      hasGoodNav: signals.hasGoodNav,
      hasMobileMenu: signals.hasMobileMenu,
      hasSiteSearch: signals.hasSiteSearch,
      hasAccessibility: signals.hasAccessibility,
      navigationDepth: signals.navigationDepth ?? null,
      wordCount: signals.wordCount,
      hasFAQ: signals.hasFAQ,
      hasServiceList: signals.hasServiceList,
      hasLocationPages: signals.hasLocationPages,
      hasVideoContent: signals.hasVideoContent,
      hasBeforeAfterPhotos: signals.hasBeforeAfterPhotos,
      contentQualityScore: signals.contentQualityScore ?? null,
      primaryServices: signals.primaryServices,
      valueProposition: signals.valueProposition ?? null,
      hasAnalytics: signals.hasAnalytics,
      hasPixel: signals.hasPixel,
      hasTagManager: signals.hasTagManager,
      hasHeatmaps: signals.hasHeatmaps,
      hasCRMIntegration: signals.hasCRMIntegration,
      analyticsplatform: signals.analyticsPlatform ?? null,
      hasCMS: signals.hasCMS,
      detectedCMS: signals.detectedCMS ?? null,
      techStack: signals.techStack,
      hasStructuredData: signals.hasStructuredData,
      hasXMLSitemap: signals.hasXMLSitemap,
      hasRobotsTxt: signals.hasRobotsTxt,
      hasLogo: signals.hasLogo,
      hasBrandDiff: signals.hasBrandDiff,
      hasTagline: signals.hasTagline,
      hasConsistentColors: signals.hasConsistentColors,
      brandVoice: signals.brandVoice ?? null,
      pageTitle: signals.pageTitle ?? null,
      metaDescription: signals.metaDescription ?? null,
      h1Text: signals.h1Text ?? null,
      pageSummary: signals.pageSummary ?? null,
      businessDescription: signals.businessDescription ?? null,
      detectedTopIssues: signals.detectedTopIssues,
    },
    create: {
      businessId,
      hasCTA: signals.hasCTA,
      hasBooking: signals.hasBooking,
      hasContactForm: signals.hasContactForm,
      hasPricing: signals.hasPricing,
      hasGuarantee: signals.hasGuarantee,
      hasLiveChat: signals.hasLiveChat,
      hasOnlinePayment: signals.hasOnlinePayment,
      ctaText: signals.ctaText ?? null,
      bookingPlatform: signals.bookingPlatform ?? null,
      conversionFriction: signals.conversionFriction ?? null,
      hasReviews: signals.hasReviews,
      hasContactInfo: signals.hasContactInfo,
      hasSSL: signals.hasSSL,
      hasAboutPage: signals.hasAboutPage,
      hasAddress: signals.hasAddress,
      hasTeamPhotos: signals.hasTeamPhotos,
      hasLicenseInfo: signals.hasLicenseInfo,
      hasAwardsOrCerts: signals.hasAwardsOrCerts,
      hasInsuranceInfo: signals.hasInsuranceInfo,
      reviewPlatforms: signals.reviewPlatforms,
      estimatedReviewCount: signals.estimatedReviewCount ?? null,
      estimatedRating: signals.estimatedRating ?? null,
      isMobileOptimized: signals.isMobileOptimized,
      hasOptimizedImages: signals.hasOptimizedImages,
      hasLazyLoad: signals.hasLazyLoad,
      hasCDN: signals.hasCDN,
      hasCaching: signals.hasCaching,
      estimatedLoadScore: signals.estimatedLoadScore ?? null,
      hasGBP: signals.hasGBP,
      hasSchema: signals.hasSchema,
      hasMetaDescription: signals.hasMetaDescription,
      hasH1: signals.hasH1,
      hasBlog: signals.hasBlog,
      hasLocalKeywords: signals.hasLocalKeywords,
      schemaTypes: signals.schemaTypes,
      targetKeywords: signals.targetKeywords,
      hasGoodNav: signals.hasGoodNav,
      hasMobileMenu: signals.hasMobileMenu,
      hasSiteSearch: signals.hasSiteSearch,
      hasAccessibility: signals.hasAccessibility,
      navigationDepth: signals.navigationDepth ?? null,
      wordCount: signals.wordCount,
      hasFAQ: signals.hasFAQ,
      hasServiceList: signals.hasServiceList,
      hasLocationPages: signals.hasLocationPages,
      hasVideoContent: signals.hasVideoContent,
      hasBeforeAfterPhotos: signals.hasBeforeAfterPhotos,
      contentQualityScore: signals.contentQualityScore ?? null,
      primaryServices: signals.primaryServices,
      valueProposition: signals.valueProposition ?? null,
      hasAnalytics: signals.hasAnalytics,
      hasPixel: signals.hasPixel,
      hasTagManager: signals.hasTagManager,
      hasHeatmaps: signals.hasHeatmaps,
      hasCRMIntegration: signals.hasCRMIntegration,
      analyticsplatform: signals.analyticsPlatform ?? null,
      hasCMS: signals.hasCMS,
      detectedCMS: signals.detectedCMS ?? null,
      techStack: signals.techStack,
      hasStructuredData: signals.hasStructuredData,
      hasXMLSitemap: signals.hasXMLSitemap,
      hasRobotsTxt: signals.hasRobotsTxt,
      hasLogo: signals.hasLogo,
      hasBrandDiff: signals.hasBrandDiff,
      hasTagline: signals.hasTagline,
      hasConsistentColors: signals.hasConsistentColors,
      brandVoice: signals.brandVoice ?? null,
      pageTitle: signals.pageTitle ?? null,
      metaDescription: signals.metaDescription ?? null,
      h1Text: signals.h1Text ?? null,
      pageSummary: signals.pageSummary ?? null,
      businessDescription: signals.businessDescription ?? null,
      detectedTopIssues: signals.detectedTopIssues,
    },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// SAVE AUDIT SNAPSHOT
// Immutable record — never updated, only created
// ─────────────────────────────────────────────────────────────────────────────

export async function saveAuditSnapshot(params: {
  businessId: string
  result: AuditResult
  delta?: ScoreDelta
  benchmarkAvg: number[]
  benchmarkTop: number[]
  userId?: string | null
}) {
  const { result, delta } = params
  const { pillarScores: ps, revenueLeak: rl, appliedRules } = result

  const snapshot = await db.auditSnapshot.create({
    data: {
      businessId: params.businessId,
      triggeredBy: (result.input.triggeredBy as any) ?? 'MANUAL',
      triggeredByUser: params.userId ?? null,
      auditVersion: result.auditVersion,
      inputUrl: result.input.url,
      inputLocation: result.input.location,
      inputVertical: result.input.vertical,
      inputMonthlyRevenue: result.input.monthlyRevenue ?? null,

      overallScore: result.overallScore,
      grade: result.grade,
      gradeLabel: result.gradeLabel,

      conversionScore: ps.conversion,
      trustScore: ps.trust,
      performanceScore: ps.performance,
      uxScore: ps.ux,
      discoverScore: ps.discoverability,
      contentScore: ps.content,
      dataScore: ps.data,
      technicalScore: ps.technical,
      brandScore: ps.brand,
      scalabilityScore: ps.scalability,

      leakagePct: rl.totalPct,
      estimatedMonthlyLoss: rl.estimatedMonthlyLoss ?? null,
      leakageConversion: rl.conversionPct,
      leakageTrust: rl.trustPct,
      leakagePerformance: rl.performancePct,
      leakageUX: rl.uxPct,

      confidencePct: result.confidence.pct,
      missingSignals: result.confidence.missingSignals,

      signalSnapshot: result.signals as any,
      aiNarrative: result.aiNarrative,
      aiTopIssues: result.aiTopIssues,
      aiQuickWins: result.aiQuickWins,

      benchmarkAvg: params.benchmarkAvg,
      benchmarkTop: params.benchmarkTop,

      previousAuditId: delta?.previousAuditId ?? null,
      scoreDelta: delta?.scoreDelta ?? null,
      improvedPillars: delta?.improvedPillars ?? [],
      regressedPillars: delta?.regressedPillars ?? [],

      // Create all applied rule records
      appliedRules: {
        create: appliedRules.map(ar => ({
          pillarId: ar.pillarId,
          ruleId: ar.rule.id,
          ruleLabel: ar.rule.label,
          ruleType: ar.type,
          capValue: ar.type === 'CAP' ? ar.rule.cap : null,
          penaltyValue: ar.type === 'PENALTY' ? ar.rule.pen : null,
          baseScore: ar.baseScore,
          finalScore: ar.finalScore,
        })),
      },
    },
  })

  return snapshot
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPUTE SCORE DELTA
// Compare this audit against the most recent previous one
// ─────────────────────────────────────────────────────────────────────────────

export async function computeScoreDelta(
  businessId: string,
  currentScores: PillarScores,
  currentOverall: number,
): Promise<ScoreDelta | undefined> {
  const previous = await db.auditSnapshot.findFirst({
    where: { businessId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, createdAt: true, overallScore: true,
      conversionScore: true, trustScore: true, performanceScore: true,
      uxScore: true, discoverScore: true, contentScore: true,
      dataScore: true, technicalScore: true, brandScore: true, scalabilityScore: true,
    },
  })

  if (!previous) return undefined

  const prevPillarMap: PillarScores = {
    conversion: previous.conversionScore, trust: previous.trustScore,
    performance: previous.performanceScore, ux: previous.uxScore,
    discoverability: previous.discoverScore, content: previous.contentScore,
    data: previous.dataScore, technical: previous.technicalScore,
    brand: previous.brandScore, scalability: previous.scalabilityScore,
  }

  const improvedPillars: PillarId[] = []
  const regressedPillars: PillarId[] = []

  for (const pillar of PILLARS) {
    const diff = currentScores[pillar.id] - prevPillarMap[pillar.id]
    if (diff >= 5) improvedPillars.push(pillar.id)
    else if (diff <= -5) regressedPillars.push(pillar.id)
  }

  return {
    previousAuditId: previous.id,
    previousScore: previous.overallScore,
    previousDate: previous.createdAt.toISOString(),
    scoreDelta: currentOverall - previous.overallScore,
    improvedPillars,
    regressedPillars,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE MARKET SEGMENT
// Recomputes aggregate intelligence for the vertical+location segment
// ─────────────────────────────────────────────────────────────────────────────

export async function updateMarketSegment(vertical: string, state?: string, city?: string) {
  // Bug 4 fix: trim all parts before building the key to prevent leading-space corruption
  const cleanState = state?.trim() || undefined
  const cleanCity  = city?.trim()  || undefined
  const segmentKey = [vertical, cleanState, cleanCity].filter(Boolean).join(':')

  const businesses = await db.business.findMany({
    where: {
      vertical: vertical as any,
      ...(cleanState ? { state: cleanState } : {}),
      ...(cleanCity  ? { city: cleanCity }   : {}),
      latestOverallScore: { not: null },
    },
    include: { signals: true },
  })

  if (businesses.length === 0) return

  const scores = businesses.map(b => b.latestOverallScore!).sort((a, b) => a - b)
  const avg    = scores.reduce((a, b) => a + b, 0) / scores.length
  const median = scores[Math.floor(scores.length / 2)]
  const p25    = scores[Math.floor(scores.length * 0.25)]
  const p75    = scores[Math.floor(scores.length * 0.75)]
  const p90    = scores[Math.floor(scores.length * 0.9)]

  const sigs = businesses.map(b => b.signals).filter(Boolean)
  const pct  = (fn: (s: NonNullable<typeof sigs[0]>) => boolean) =>
    sigs.length > 0 ? (sigs.filter(s => fn(s!)).length / sigs.length) * 100 : 0

  // Per-pillar averages using explicit field names (P0 fix — all 10 pillars)
  const pillarField = (field: string) => {
    const vals = businesses
      .map(b => b[field as keyof typeof b] as number | null)
      .filter((v): v is number => v !== null)
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  }

  // P3 Fix Gap6: compute topIssues from AppliedRuleRecord for this segment
  const topRuleRows = await db.appliedRuleRecord.groupBy({
    by: ['ruleLabel'],
    where: {
      audit: {
        business: {
          vertical: vertical as any,
          ...(cleanState ? { state: cleanState } : {}),
          ...(cleanCity  ? { city: cleanCity }   : {}),
        },
      },
    },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 5,
  })
  const topIssues = topRuleRows.map(r => r.ruleLabel)

  const segmentData = {
    businessCount:       businesses.length,
    avgOverallScore:     avg,
    medianOverallScore:  median,
    p25Score:            p25,
    p75Score:            p75,
    topDecileScore:      p90,
    // All 10 pillar averages — previously only 4 were populated
    avgConversionScore:  pillarField('latestConversionScore'),
    avgTrustScore:       pillarField('latestTrustScore'),
    avgPerformanceScore: pillarField('latestPerformanceScore'),
    avgUXScore:          pillarField('latestUxScore'),
    avgDiscoverScore:    pillarField('latestDiscoverScore'),
    avgContentScore:     pillarField('latestContentScore'),
    avgDataScore:        pillarField('latestDataScore'),
    avgTechnicalScore:   pillarField('latestTechnicalScore'),
    avgBrandScore:       pillarField('latestBrandScore'),
    avgScalabilityScore: pillarField('latestScalabilityScore'),
    pctHasCTA:        pct(s => s?.hasCTA ?? false),
    pctHasBooking:    pct(s => s?.hasBooking ?? false),
    pctHasReviews:    pct(s => s?.hasReviews ?? false),
    pctHasGBP:        pct(s => s?.hasGBP ?? false),
    pctHasAnalytics:  pct(s => s?.hasAnalytics ?? false),
    pctHasSSL:        pct(s => s?.hasSSL ?? false),
    pctHasSchema:     pct(s => s?.hasSchema ?? false),
    pctHasBlog:       pct(s => s?.hasBlog ?? false),
    pctHasPricing:    pct(s => s?.hasPricing ?? false),
    pctHasMobileMenu: pct(s => s?.hasMobileMenu ?? false),
    opportunityScore: 100 - avg,
    topIssues,
  }

  await db.marketSegment.upsert({
    where: { segmentKey },
    update: segmentData,
    create: {
      segmentKey,
      vertical: vertical as any,
      state: cleanState ?? null,
      city:  cleanCity  ?? null,
      ...segmentData,
    },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// GET LIVE BENCHMARK FROM DB
// Returns real percentile data from actual audited businesses (falls back to static)
// ─────────────────────────────────────────────────────────────────────────────

export async function getLiveBenchmark(vertical: string, state?: string) {
  // Select all 10 denormalized pillar score fields (now that Business model has all 10)
  const businesses = await db.business.findMany({
    where: {
      vertical: vertical as any,
      ...(state ? { state } : {}),
      latestOverallScore: { not: null },
    },
    select: {
      latestConversionScore:  true,
      latestTrustScore:       true,
      latestPerformanceScore: true,
      latestUxScore:          true,
      latestDiscoverScore:    true,   // discoverability — truncated column name
      latestContentScore:     true,
      latestDataScore:        true,
      latestTechnicalScore:   true,
      latestBrandScore:       true,
      latestScalabilityScore: true,
    },
    take: 500,
    orderBy: { lastAuditedAt: 'desc' },
  })

  if (businesses.length < 5) return null

  // Use the explicit field map — no dynamic string construction
  // PILLAR_DB_FIELD maps PillarId → exact column name
  const avgArr = PILLARS.map(p => {
    const field = PILLAR_DB_FIELD[p.id] as keyof typeof businesses[0]
    const vals = businesses
      .map(b => b[field] as number | null)
      .filter((v): v is number => v !== null)
    return vals.length > 0
      ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
      : 50  // fallback only if truly no data for this pillar
  })

  const topArr = PILLARS.map(p => {
    const field = PILLAR_DB_FIELD[p.id] as keyof typeof businesses[0]
    const vals = businesses
      .map(b => b[field] as number | null)
      .filter((v): v is number => v !== null)
      .sort((a, b) => b - a)
    const top10pct = vals.slice(0, Math.max(1, Math.floor(vals.length * 0.1)))
    return top10pct.length > 0
      ? Math.round(top10pct.reduce((a, b) => a + b, 0) / top10pct.length)
      : 80
  })

  return { avg: avgArr, top: topArr, count: businesses.length }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET VERTICAL PERCENTILE
// Where does this business rank among all in its vertical?
// ─────────────────────────────────────────────────────────────────────────────

export async function getVerticalPercentile(vertical: string, score: number): Promise<number | null> {
  const total = await db.business.count({
    where: { vertical: vertical as any, latestOverallScore: { not: null } },
  })
  if (total < 5) return null

  const below = await db.business.count({
    where: { vertical: vertical as any, latestOverallScore: { lt: score } },
  })

  return Math.round((below / total) * 100)
}

// ─────────────────────────────────────────────────────────────────────────────
// GET AUDITS BY USER
// Returns all audit snapshots created by a specific Clerk user
// ─────────────────────────────────────────────────────────────────────────────

export async function getAuditsByUser(userId: string, limit = 50) {
  return db.auditSnapshot.findMany({
    where: { triggeredByUser: userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      business: {
        include: { signals: true },
      },
    },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// GET BUSINESS AUDIT HISTORY
// Full timeline for a single business — for re-audit / delta view
// ─────────────────────────────────────────────────────────────────────────────

export async function getBusinessHistory(domain: string) {
  return db.auditSnapshot.findMany({
    where: { business: { domain } },
    orderBy: { createdAt: 'desc' },
    take: 24,
    select: {
      id: true,
      createdAt: true,
      overallScore: true,
      grade: true,
      scoreDelta: true,
      conversionScore: true,
      trustScore: true,
      performanceScore: true,
      uxScore: true,
      discoverScore: true,
      contentScore: true,
      dataScore: true,
      technicalScore: true,
      brandScore: true,
      scalabilityScore: true,
    },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD V2 DATA PAYLOAD
// Generates the massive DashboardData payload from user's latest state
// ─────────────────────────────────────────────────────────────────────────────

export async function getDashboardData(userId: string) {
  const latestAudit = await db.auditSnapshot.findFirst({
    where: { triggeredByUser: userId },
    orderBy: { createdAt: 'desc' },
    include: { business: { include: { achievements: true, signals: true } } }
  })

  if (!latestAudit) return null

  const { business } = latestAudit
  const myBusinessesCount = await db.auditSnapshot.groupBy({
    by: ['businessId'],
    where: { triggeredByUser: userId }
  }).then(res => res.length)
  
  const xpTotal = business.xpTotal
  const { level, name: levelName, xpNextLevel } = getLevelInfo(xpTotal)
  const newlyEarnedIds = business.pendingNotifications || []

  if (newlyEarnedIds.length > 0) {
    await db.business.update({
      where: { id: business.id },
      data: { pendingNotifications: [] }
    })
  }

  const achievementsPayload = ACHIEVEMENTS.map(ach => {
    const earnedRec = business.achievements.find(r => r.achievementId === ach.id)
    return {
      id: ach.id,
      name: ach.name,
      earned: !!earnedRec,
      earnedAt: earnedRec ? earnedRec.earnedAt.toISOString() : undefined,
      lockedLabel: ach.lockedLabel,
      chipColor: ach.chipColor
    }
  })

  const { streakDays, history } = await computeStreak(business.id)
  
  const segment = await db.marketSegment.findFirst({
    where: { vertical: business.vertical as any, city: business.city }
  }) || await db.marketSegment.findFirst({
    where: { vertical: business.vertical as any }
  })

  const verticalMedianScore = segment?.medianOverallScore ?? 50
  const bookingAdoptionRate = Math.round(segment?.pctHasBooking ?? 20)
  const topGap = segment?.topIssues?.[0] || 'Missing online booking'

  const competitorLinks = await db.competitorLink.findMany({
    where: { primaryId: business.id },
    include: { competitor: true },
    orderBy: { scoreDiff: 'desc' },
    take: 10
  })

  const competitorScores = competitorLinks.map(c => c.competitor.latestOverallScore ?? 50)
  const competitorGap = competitorLinks.length > 0 ? (competitorLinks[0].scoreDiff || 0) : null

  const roadmapRules = await db.appliedRuleRecord.findMany({
    where: { auditId: latestAudit.id, ruleType: 'PENALTY' },
    orderBy: { penaltyValue: 'desc' },
    take: 5
  })
  
  const roadmap = roadmapRules.map((ar, i) => ({
    phase: i + 1,
    feature: ar.ruleLabel,
    impact: ar.penaltyValue ? `${ar.penaltyValue} pts` : 'Medium',
    difficulty: ar.penaltyValue && ar.penaltyValue >= 10 ? 'Hard' : 'Easy'
  }))

  let quickWin = null
  if (roadmap.length > 0) {
    const rw = roadmapRules[0]
    quickWin = {
      action: rw.ruleLabel,
      difficulty: 'Easy',
      estimatePts: rw.penaltyValue || 5,
      implementation: 'Enable this feature to recapture points.'
    }
  }

  const issues = (latestAudit.aiTopIssues || []).map(issue => ({
    feature: issue,
    risk: 'critical' as const,
    description: 'Issue detected by AI'
  }))

  const prevScore = latestAudit.scoreDelta ? latestAudit.overallScore - latestAudit.scoreDelta : null
  const prevGrade = prevScore ? computeGrade(prevScore).grade : null

  return {
    myBusinessesCount,
    businessName: business.businessName || business.domain,
    overallScore: latestAudit.overallScore,
    scoreDelta: latestAudit.scoreDelta,
    grade: latestAudit.grade,
    previousGrade: prevGrade,
    pillars: [
      { id: 'conversion', score: latestAudit.conversionScore, industryAvg: segment?.avgConversionScore||50 },
      { id: 'trust', score: latestAudit.trustScore, industryAvg: segment?.avgTrustScore||50 },
      { id: 'performance', score: latestAudit.performanceScore, industryAvg: segment?.avgPerformanceScore||50 },
      { id: 'discoverability', score: latestAudit.discoverScore, industryAvg: segment?.avgDiscoverScore||50 },
      { id: 'ux', score: latestAudit.uxScore, industryAvg: segment?.avgUXScore||50 },
      { id: 'content', score: latestAudit.contentScore, industryAvg: segment?.avgContentScore||50 },
      { id: 'data', score: latestAudit.dataScore, industryAvg: segment?.avgDataScore||50 },
      { id: 'technical', score: latestAudit.technicalScore, industryAvg: segment?.avgTechnicalScore||50 },
      { id: 'brand', score: latestAudit.brandScore, industryAvg: segment?.avgBrandScore||50 },
      { id: 'scalability', score: latestAudit.scalabilityScore, industryAvg: segment?.avgScalabilityScore||50 },
    ],
    revenueLeakMonthly: latestAudit.estimatedMonthlyLoss,
    
    xpTotal,
    levelId: level,
    levelName,
    xpToNextLevel: xpNextLevel - xpTotal,
    unlockedFeatures: [],
    achievements: achievementsPayload,
    newlyEarnedAchievementIds: newlyEarnedIds,
    
    streakHistory: history,
    streakDays,
    streakPtsThisMonth: 0,
    totalAudits: business.auditCount || 1,
    daysSinceAudit: Math.floor((Date.now() - latestAudit.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
    scoreHistory: ((business.scoreHistory as any[]) || []).map(sh => sh.score),
    
    quickWin,
    issues,
    roadmap,
    roadmapDurationWeeks: '2-3',
    
    verticalMedianScore,
    bookingAdoptionRate,
    topGap,
    avgMonthlyImprovement: business.scoreVelocity || 0,
    competitorScores,
    competitorGap
  }
}
