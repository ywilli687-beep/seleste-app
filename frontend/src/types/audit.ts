// ─────────────────────────────────────────────────────────────────────────────
// Seleste Audit Engine V2 — Core Types
// These types mirror the Prisma schema and power the full application layer
// ─────────────────────────────────────────────────────────────────────────────

// ── Enums ─────────────────────────────────────────────────────────────────────

export type Vertical =
  | 'AUTO_REPAIR' | 'CAR_WASH' | 'RESTAURANT' | 'HOME_SERVICES' | 'LOCAL_SERVICE'
  | 'DENTAL' | 'LEGAL' | 'REAL_ESTATE' | 'FITNESS' | 'BEAUTY_SALON'
  | 'PLUMBING' | 'HVAC' | 'LANDSCAPING' | 'CLEANING' | 'PET_SERVICES'

export type Grade = 'A' | 'B' | 'C' | 'D'
export type RuleType = 'CAP' | 'PENALTY'
export type AuditTrigger = 'MANUAL' | 'SCHEDULED' | 'API' | 'BULK_IMPORT'
export type OpportunityLevel = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL'
export type OutreachStatus = 'NOT_CONTACTED' | 'IDENTIFIED' | 'CONTACTED' | 'RESPONDED' | 'DEMO_SCHEDULED' | 'CONVERTED' | 'CHURNED' | 'DECLINED'

export type PillarId =
  | 'conversion' | 'trust' | 'performance' | 'ux' | 'discoverability'
  | 'content' | 'data' | 'technical' | 'brand' | 'scalability'

// ── Audit Input ───────────────────────────────────────────────────────────────

export type LoadingStage =
  | 'fetching'
  | 'hard_signals'
  | 'ai_signals'
  | 'scoring'
  | 'narrative'
  | 'saving'
  | 'done'

export interface AuditRequest {
  url: string
  businessName?: string
  location: string
  vertical: Vertical
  monthlyRevenue?: number
  triggeredBy?: AuditTrigger
}

// ── Page Signals ──────────────────────────────────────────────────────────────
// The complete structured signal record for a business page.
// Every field maps to a column in BusinessSignals and a snapshot in AuditSnapshot.

export interface PageSignals {
  // Conversion
  hasCTA: boolean
  hasBooking: boolean
  hasContactForm: boolean
  hasPricing: boolean
  hasGuarantee: boolean
  hasLiveChat: boolean
  hasOnlinePayment: boolean
  ctaText?: string
  bookingPlatform?: string
  conversionFriction?: number   // 1-5

  // Trust
  hasReviews: boolean
  hasContactInfo: boolean
  hasSSL: boolean
  hasAboutPage: boolean
  hasAddress: boolean
  hasTeamPhotos: boolean
  hasLicenseInfo: boolean
  hasAwardsOrCerts: boolean
  hasInsuranceInfo: boolean
  reviewPlatforms: string[]
  estimatedReviewCount?: number
  estimatedRating?: number

  // Performance
  isMobileOptimized: boolean
  hasOptimizedImages: boolean
  hasLazyLoad: boolean
  hasCDN: boolean
  hasCaching: boolean
  estimatedLoadScore?: number   // 1-100

  // Discoverability
  hasGBP: boolean
  hasSchema: boolean
  hasMetaDescription: boolean
  hasH1: boolean
  hasBlog: boolean
  hasLocalKeywords: boolean
  schemaTypes: string[]
  targetKeywords: string[]

  // UX
  hasGoodNav: boolean
  hasMobileMenu: boolean
  hasSiteSearch: boolean
  hasAccessibility: boolean
  navigationDepth?: number

  // Content
  wordCount: number
  hasFAQ: boolean
  hasServiceList: boolean
  hasLocationPages: boolean
  hasVideoContent: boolean
  hasBeforeAfterPhotos: boolean
  contentQualityScore?: number  // 1-10
  primaryServices: string[]
  valueProposition?: string

  // Data & tracking
  hasAnalytics: boolean
  hasPixel: boolean
  hasTagManager: boolean
  hasHeatmaps: boolean
  hasCRMIntegration: boolean
  analyticsPlatform?: string

  // Technical
  hasCMS: boolean
  detectedCMS?: string | null
  techStack: string[]
  hasStructuredData: boolean
  hasXMLSitemap: boolean
  hasRobotsTxt: boolean

  // Brand
  hasLogo: boolean
  hasBrandDiff: boolean
  hasTagline: boolean
  hasConsistentColors: boolean
  brandVoice?: string

  // Meta
  pageTitle?: string
  metaDescription?: string
  h1Text?: string
  pageSummary?: string
  businessDescription?: string
  detectedTopIssues: string[]
}

// ── Hard Signals ──────────────────────────────────────────────────────────────
// Subset of PageSignals that can be determined deterministically from HTML/headers

export interface HardSignals {
  isSSL: boolean
  hasMetaDescription: boolean
  metaDescription: string
  hasH1: boolean
  h1Text: string
  hasSchema: boolean
  schemaTypes: string[]
  hasAnalytics: boolean
  analyticsPlatform: string | null
  hasPixel: boolean
  hasTagManager: boolean
  hasCDN: boolean
  hasCaching: boolean
  hasLazyLoad: boolean
  isMobileOptimized: boolean
  hasOptimizedImages: boolean
  hasCMS: boolean
  detectedCMS: string | null
  techStack: string[]
  hasXMLSitemap: boolean
  pageTitle: string
  wordCount: number
}

// ── Rules ─────────────────────────────────────────────────────────────────────

export interface Rule {
  id: string
  label: string
  cap: number    // 0 = no cap
  pen: number    // 0 = no penalty
  fn: (s: PageSignals) => boolean
}

export interface AppliedRule {
  pillarId: PillarId
  rule: Rule
  type: RuleType
  baseScore: number
  finalScore: number
}

// ── Scoring ───────────────────────────────────────────────────────────────────

export type PillarScores = Record<PillarId, number>

export interface PillarMeta {
  id: PillarId
  name: string
  weight: number
  icon: string
}

// ── Revenue Leakage ───────────────────────────────────────────────────────────

export interface LeakageBreakdown {
  label: string
  pillar: PillarId
  pct: number
  icon: string
}

export interface RevenueLeak {
  totalPct: number
  estimatedMonthlyLoss?: number
  breakdown: LeakageBreakdown[]
  // By pillar for DB storage
  conversionPct: number
  trustPct: number
  performancePct: number
  uxPct: number
}

// ── Confidence ────────────────────────────────────────────────────────────────

export interface AuditConfidence {
  pct: number
  missingSignals: string[]
}

// ── Recommendations ───────────────────────────────────────────────────────────

export type RecTab = 'revenue_leaks' | 'quick_wins' | 'high_impact'

export interface Recommendation {
  pillar: PillarId
  tab: RecTab
  title: string
  desc: string
  impact: 'Very High' | 'High' | 'Medium' | 'Low'
  effort: 'Low' | 'Medium' | 'High'
  timeframe: string
  icon: string
  iconColor: 'red' | 'green' | 'blue'
}

export interface RecommendationSet {
  revenue_leaks: Recommendation[]
  quick_wins: Recommendation[]
  high_impact: Recommendation[]
}

// ── Benchmark ─────────────────────────────────────────────────────────────────

export interface VerticalBenchmark {
  avg: number[]
  top: number[]
  count?: number  // how many businesses in sample
}

// ── Score Delta ───────────────────────────────────────────────────────────────

export interface ScoreDelta {
  scoreDelta: number
  improvedPillars: PillarId[]
  regressedPillars: PillarId[]
  previousAuditId: string
  previousScore: number
  previousDate: string
}

// ── Full Audit Result ─────────────────────────────────────────────────────────

export interface AuditResult {
  // IDs
  auditId: string
  businessId: string

  // Input
  input: AuditRequest

  // Signals
  signals: PageSignals

  // Scoring
  appliedRules: AppliedRule[]
  pillarScores: PillarScores
  overallScore: number
  grade: Grade
  gradeLabel: string

  // Analysis
  revenueLeak: RevenueLeak
  confidence: AuditConfidence
  recommendations: RecommendationSet
  benchmark: VerticalBenchmark
  verticalPercentile?: number | null

  // AI outputs
  aiNarrative: string
  aiQuickWins: string[]
  aiTopIssues: string[]

  // Roadmap
  roadmap: Record<'30' | '60' | '90', string[]>

  // Trend (if this business has been audited before)
  delta?: ScoreDelta

  // Metadata
  createdAt: string
  auditVersion: string
}

// ── API ────────────────────────────────────────────────────────────────────────

export interface AuditApiResponse {
  success: boolean
  result?: AuditResult
  error?: string
}

// ── Market Intelligence ───────────────────────────────────────────────────────

export interface MarketSegmentSummary {
  vertical: Vertical
  state?: string
  city?: string
  businessCount: number
  avgOverallScore: number
  medianOverallScore: number
  avgLeakagePct: number
  opportunityScore: number
  topIssues: string[]
  signalPrevalence: {
    pctHasCTA: number
    pctHasBooking: number
    pctHasReviews: number
    pctHasGBP: number
    pctHasAnalytics: number
    pctHasSSL: number
    pctHasSchema: number
  }
}

// ── Business Profile (API response shape) ─────────────────────────────────────

export interface BusinessProfile {
  id: string
  domain: string
  businessName?: string
  vertical: Vertical
  city?: string
  state?: string
  latestOverallScore?: number
  latestGrade?: Grade
  lastAuditedAt?: string
  auditCount: number
  scoreHistory?: Array<{ date: string; score: number; grade: Grade }>
  verticalPercentile?: number | null
  marketOpportunity?: OpportunityLevel
  isProspect: boolean
  isClient: boolean
  signals?: Partial<PageSignals>
}
