import Anthropic from '@anthropic-ai/sdk'
import type { PageSignals, PillarScores, AuditRequest, AppliedRule } from '@/types/audit'
import type { HardSignals } from './fetcher'

import { getBenchmarkContext } from './benchmarks'
import { buildVerticalSystemPrompt } from './verticalContext'
import { validateAndLog } from './narrativeValidator'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL EXTRACTION
// Extracts 60+ structured signals from real HTML
// Hard signals are injected directly (can't be overridden by AI)
// ─────────────────────────────────────────────────────────────────────────────

export async function extractSignals(
  html: string,
  url: string,
  hard: HardSignals,
  vertical: string,
): Promise<PageSignals> {
  const trimmed = html.slice(0, 22000)

  const prompt = `You are a website growth analyst. Extract structured signals from this local business website HTML.

URL: ${url}
Page title: ${hard.pageTitle}
Word count: ${hard.wordCount}
Vertical: ${vertical.replace('_', ' ').toLowerCase()}
CMS: ${hard.detectedCMS ?? 'unknown'}
Tech stack: ${hard.techStack.join(', ') || 'unknown'}

PRE-DETECTED (do not override these exact values):
hasSSL=${hard.isSSL}, hasMetaDescription=${hard.hasMetaDescription}, hasH1=${hard.hasH1},
hasSchema=${hard.hasSchema}, schemaTypes=${JSON.stringify(hard.schemaTypes)},
hasAnalytics=${hard.hasAnalytics}, analyticsPlatform=${JSON.stringify(hard.analyticsPlatform)},
hasPixel=${hard.hasPixel}, hasTagManager=${hard.hasTagManager},
hasCDN=${hard.hasCDN}, hasCaching=${hard.hasCaching}, hasLazyLoad=${hard.hasLazyLoad},
isMobileOptimized=${hard.isMobileOptimized}, hasOptimizedImages=${hard.hasOptimizedImages},
hasCMS=${hard.hasCMS}, hasXMLSitemap=${hard.hasXMLSitemap},
wordCount=${hard.wordCount}, h1Text=${JSON.stringify(hard.h1Text)},
metaDescription=${JSON.stringify(hard.metaDescription)}, pageTitle=${JSON.stringify(hard.pageTitle)},
hasReviewStructure=${hard.hasReviewSignals}, hasPhoneNumber=${hard.hasPhoneNumber}, hasNavElement=${hard.hasNavLinks}

\`\`\`
${trimmed}
\`\`\`

DETECTION RULES — apply these exact criteria, do not use general judgment:

hasReviews: if hasReviewStructure=true above, set true. Otherwise, look for visible quoted testimonials
  from named customers. Set false if only a generic "Read our reviews" link exists.

hasCTA: true ONLY if the HTML contains a button, <a> tag, or form submit that uses action-oriented text
  visible above the first 30% of the page content. Action text includes: Call, Book, Schedule, Request,
  Get a Quote, Contact Us, Order, Buy, Reserve, Sign Up, Start, Try. 
  Set false if the only action elements are in the footer or navigation menu.

hasGoodNav: if hasNavElement=true above, set true. Otherwise set false.

hasBrandDiff: true ONLY if the HTML contains explicit text stating a unique claim — a specific guarantee,
  a number of years in business, an award name, a certification, a named specialty, or a stated
  differentiator (e.g. "family owned since 1987", "5-star rated", "certified by X", "the only Y in Z").
  Set false if the page only has generic phrases like "quality service" or "we care about customers".

conversionFriction: score 1–5 using this exact rubric:
  1 = Phone number AND booking/contact form both visible above fold, no obstacles
  2 = Phone number visible above fold, form exists but below fold
  3 = Contact info requires scrolling OR form has more than 5 fields
  4 = No phone number visible, only a contact form with 5+ fields, or form is on a separate page
  5 = No visible contact method above fold, form is buried or broken, or site has no contact mechanism

Return ONLY valid JSON, no markdown:
{
  "hasCTA": boolean,
  "hasBooking": boolean,
  "hasContactForm": boolean,
  "hasPricing": boolean,
  "hasGuarantee": boolean,
  "hasLiveChat": boolean,
  "hasOnlinePayment": boolean,
  "ctaText": string | null,
  "bookingPlatform": string | null,
  "conversionFriction": 1-5,
  "hasReviews": boolean,
  "hasContactInfo": boolean,
  "hasSSL": ${hard.isSSL},
  "hasAboutPage": boolean,
  "hasAddress": boolean,
  "hasTeamPhotos": boolean,
  "hasLicenseInfo": boolean,
  "hasAwardsOrCerts": boolean,
  "hasInsuranceInfo": boolean,
  "reviewPlatforms": string[],
  "estimatedReviewCount": number | null,
  "estimatedRating": number | null,
  "isMobileOptimized": ${hard.isMobileOptimized},
  "hasOptimizedImages": ${hard.hasOptimizedImages},
  "hasLazyLoad": ${hard.hasLazyLoad},
  "hasCDN": ${hard.hasCDN},
  "hasCaching": ${hard.hasCaching},
  "estimatedLoadScore": number | null,
  "hasGBP": boolean,
  "hasSchema": ${hard.hasSchema},
  "hasMetaDescription": ${hard.hasMetaDescription},
  "hasH1": ${hard.hasH1},
  "hasBlog": boolean,
  "hasLocalKeywords": boolean,
  "schemaTypes": ${JSON.stringify(hard.schemaTypes)},
  "targetKeywords": string[],
  "hasGoodNav": boolean,
  "hasMobileMenu": boolean,
  "hasSiteSearch": boolean,
  "hasAccessibility": boolean,
  "navigationDepth": number | null,
  "wordCount": ${hard.wordCount},
  "hasFAQ": boolean,
  "hasServiceList": boolean,
  "hasLocationPages": boolean,
  "hasVideoContent": boolean,
  "hasBeforeAfterPhotos": boolean,
  "contentQualityScore": 1-10,
  "primaryServices": string[],
  "valueProposition": string | null,
  "hasAnalytics": ${hard.hasAnalytics},
  "hasPixel": ${hard.hasPixel},
  "hasTagManager": ${hard.hasTagManager},
  "hasHeatmaps": boolean,
  "hasCRMIntegration": boolean,
  "analyticsPlatform": ${JSON.stringify(hard.analyticsPlatform)},
  "hasCMS": ${hard.hasCMS},
  "detectedCMS": ${JSON.stringify(hard.detectedCMS)},
  "techStack": ${JSON.stringify(hard.techStack)},
  "hasStructuredData": ${hard.hasSchema},
  "hasXMLSitemap": ${hard.hasXMLSitemap},
  "hasRobotsTxt": boolean,
  "hasLogo": boolean,
  "hasBrandDiff": boolean,
  "hasTagline": boolean,
  "hasConsistentColors": boolean,
  "brandVoice": "professional" | "casual" | "technical" | "friendly" | null,
  "pageTitle": ${JSON.stringify(hard.pageTitle)},
  "metaDescription": ${JSON.stringify(hard.metaDescription)},
  "h1Text": ${JSON.stringify(hard.h1Text)},
  "pageSummary": "2-3 sentences: what does this business do, who do they serve, what does the page offer?",
  "businessDescription": "1 sentence describing the business",
  "detectedTopIssues": ["issue1", "issue2", "issue3", "issue4", "issue5"]
}`

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    temperature: 0,   // deterministic output — same HTML always produces same signals
    messages: [{ role: 'user', content: prompt }],
  })

  const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('')

  try {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON')
    const p = JSON.parse(match[0]) as Partial<PageSignals>

    return {
      hasCTA: !!p.hasCTA,
      hasBooking: !!p.hasBooking,
      hasContactForm: !!p.hasContactForm,
      hasPricing: !!p.hasPricing,
      hasGuarantee: !!p.hasGuarantee,
      hasLiveChat: !!p.hasLiveChat,
      hasOnlinePayment: !!p.hasOnlinePayment,
      ctaText: p.ctaText ?? undefined,
      bookingPlatform: p.bookingPlatform ?? undefined,
      conversionFriction: p.conversionFriction ?? undefined,
      hasReviews: !!p.hasReviews,
      hasContactInfo: !!p.hasContactInfo,
      hasSSL: hard.isSSL,
      hasAboutPage: !!p.hasAboutPage,
      hasAddress: !!p.hasAddress,
      hasTeamPhotos: !!p.hasTeamPhotos,
      hasLicenseInfo: !!p.hasLicenseInfo,
      hasAwardsOrCerts: !!p.hasAwardsOrCerts,
      hasInsuranceInfo: !!p.hasInsuranceInfo,
      reviewPlatforms: Array.isArray(p.reviewPlatforms) ? p.reviewPlatforms : [],
      estimatedReviewCount: p.estimatedReviewCount ?? undefined,
      estimatedRating: p.estimatedRating ?? undefined,
      isMobileOptimized: hard.isMobileOptimized,
      hasOptimizedImages: hard.hasOptimizedImages,
      hasLazyLoad: hard.hasLazyLoad,
      hasCDN: hard.hasCDN,
      hasCaching: hard.hasCaching,
      estimatedLoadScore: p.estimatedLoadScore ?? undefined,
      hasGBP: !!p.hasGBP,
      hasSchema: hard.hasSchema,
      hasMetaDescription: hard.hasMetaDescription,
      hasH1: hard.hasH1,
      hasBlog: !!p.hasBlog,
      hasLocalKeywords: !!p.hasLocalKeywords,
      schemaTypes: hard.schemaTypes,
      targetKeywords: Array.isArray(p.targetKeywords) ? p.targetKeywords.slice(0, 10) : [],
      hasGoodNav: !!p.hasGoodNav,
      hasMobileMenu: !!p.hasMobileMenu,
      hasSiteSearch: !!p.hasSiteSearch,
      hasAccessibility: !!p.hasAccessibility,
      navigationDepth: p.navigationDepth ?? undefined,
      wordCount: hard.wordCount,
      hasFAQ: !!p.hasFAQ,
      hasServiceList: !!p.hasServiceList,
      hasLocationPages: !!p.hasLocationPages,
      hasVideoContent: !!p.hasVideoContent,
      hasBeforeAfterPhotos: !!p.hasBeforeAfterPhotos,
      contentQualityScore: p.contentQualityScore ?? undefined,
      primaryServices: Array.isArray(p.primaryServices) ? p.primaryServices.slice(0, 10) : [],
      valueProposition: p.valueProposition ?? undefined,
      hasAnalytics: hard.hasAnalytics,
      hasPixel: hard.hasPixel,
      hasTagManager: hard.hasTagManager,
      hasHeatmaps: !!p.hasHeatmaps,
      hasCRMIntegration: !!p.hasCRMIntegration,
      analyticsPlatform: hard.analyticsPlatform ?? undefined,
      hasCMS: hard.hasCMS,
      detectedCMS: hard.detectedCMS,
      techStack: hard.techStack,
      hasStructuredData: hard.hasSchema,
      hasXMLSitemap: hard.hasXMLSitemap,
      hasRobotsTxt: !!p.hasRobotsTxt,
      hasLogo: !!p.hasLogo,
      hasBrandDiff: !!p.hasBrandDiff,
      hasTagline: !!p.hasTagline,
      hasConsistentColors: !!p.hasConsistentColors,
      brandVoice: p.brandVoice ?? undefined,
      pageTitle: hard.pageTitle,
      metaDescription: hard.metaDescription,
      h1Text: hard.h1Text,
      pageSummary: p.pageSummary ?? '',
      businessDescription: p.businessDescription ?? '',
      detectedTopIssues: Array.isArray(p.detectedTopIssues) ? p.detectedTopIssues : [],
    }
  } catch {
    return buildFallback(hard)
  }
}

function buildFallback(hard: HardSignals): PageSignals {
  return {
    hasCTA: false, hasBooking: false, hasContactForm: false, hasPricing: false,
    hasGuarantee: false, hasLiveChat: false, hasOnlinePayment: false,
    hasReviews: false, hasContactInfo: false, hasSSL: hard.isSSL, hasAboutPage: false,
    hasAddress: false, hasTeamPhotos: false, hasLicenseInfo: false, hasAwardsOrCerts: false,
    hasInsuranceInfo: false, reviewPlatforms: [],
    isMobileOptimized: hard.isMobileOptimized, hasOptimizedImages: hard.hasOptimizedImages,
    hasLazyLoad: hard.hasLazyLoad, hasCDN: hard.hasCDN, hasCaching: hard.hasCaching,
    hasGBP: false, hasSchema: hard.hasSchema, hasMetaDescription: hard.hasMetaDescription,
    hasH1: hard.hasH1, hasBlog: false, hasLocalKeywords: false,
    schemaTypes: hard.schemaTypes, targetKeywords: [],
    hasGoodNav: false, hasMobileMenu: false, hasSiteSearch: false, hasAccessibility: false,
    wordCount: hard.wordCount, hasFAQ: false, hasServiceList: false, hasLocationPages: false,
    hasVideoContent: false, hasBeforeAfterPhotos: false, primaryServices: [],
    hasAnalytics: hard.hasAnalytics, hasPixel: hard.hasPixel, hasTagManager: hard.hasTagManager,
    hasHeatmaps: false, hasCRMIntegration: false, analyticsPlatform: hard.analyticsPlatform ?? undefined,
    hasCMS: hard.hasCMS, detectedCMS: hard.detectedCMS, techStack: hard.techStack,
    hasStructuredData: hard.hasSchema, hasXMLSitemap: hard.hasXMLSitemap, hasRobotsTxt: false,
    hasLogo: false, hasBrandDiff: false, hasTagline: false, hasConsistentColors: false,
    pageTitle: hard.pageTitle, metaDescription: hard.metaDescription, h1Text: hard.h1Text,
    pageSummary: 'Page analysis unavailable — conservative defaults applied.',
    businessDescription: '', detectedTopIssues: [],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BENCHMARK NARRATIVE (Growth Prompt #2)
// 2-3 sentence benchmark summary appended to the main narrative.
// Tells the business owner exactly where they stand vs. peers and what to do.
// ─────────────────────────────────────────────────────────────────────────────

export async function writeBenchmarkNarrative(opts: {
  businessName: string
  industry: string
  overallScore: number
  verticalAvg: number | null
  topQuartile: number | null
  pillarScores: Record<string, number>
  pillarAvgs: Record<string, number | null>
}): Promise<string> {
  const { businessName, industry, overallScore, verticalAvg, topQuartile, pillarScores, pillarAvgs } = opts

  // Find biggest gap pillar
  let biggestGapPillar = ''
  let biggestGap = 0
  for (const [pillar, score] of Object.entries(pillarScores)) {
    const avg = pillarAvgs[pillar]
    if (avg !== null && avg !== undefined) {
      const gap = avg - score
      if (gap > biggestGap) { biggestGap = gap; biggestGapPillar = pillar }
    }
  }

  const pillarTableLines = Object.entries(pillarScores)
    .map(([p, score]) => {
      const avg = pillarAvgs[p]
      return `${p}: yours=${Math.round(score)}, avg=${avg !== null && avg !== undefined ? Math.round(avg) : 'n/a'}`
    })
    .join('\n')

  const prompt = `Business: ${businessName}
Industry: ${industry}
Overall score: ${overallScore} / 100
Industry average: ${verticalAvg !== null ? verticalAvg : 'n/a'} / 100
Top quartile threshold: ${topQuartile !== null ? topQuartile : 'n/a'} / 100

Pillar scores vs. industry averages:
${pillarTableLines}

Biggest gap pillar: ${biggestGapPillar || 'n/a'} (yours: ${biggestGapPillar ? Math.round(pillarScores[biggestGapPillar]) : 'n/a'}, avg: ${biggestGapPillar && pillarAvgs[biggestGapPillar] !== null && pillarAvgs[biggestGapPillar] !== undefined ? Math.round(pillarAvgs[biggestGapPillar]!) : 'n/a'})

Write a 2-3 sentence benchmark summary. Include:
- Whether they are above or below average and by how much
- Their single biggest gap vs. the industry average (name the pillar specifically)
- One concrete action to address that gap

Keep it under 80 words. Write in second person ("Your conversion score..."). Plain English. No bullet points.
If industry average is n/a, skip the comparison sentence and focus on the pillar gap and action.`

  try {
    const verticalPrompt  = buildVerticalSystemPrompt(industry ?? 'OTHER')
    const benchmarkSystem = `${verticalPrompt}\n\nYou are a data analyst writing benchmark summaries for local business owners. Be specific, use numbers, end with one clear priority action.`
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      temperature: 0.4,
      system: benchmarkSystem,
      messages: [{ role: 'user', content: prompt }],
    })
    const raw = msg.content.filter(b => b.type === 'text').map(b => b.text).join('').trim()
    return validateAndLog(raw, industry ?? 'OTHER', 'writeBenchmarkNarrative')
  } catch {
    return ''
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FREE TIER AUDIT TEASER (Growth Prompt #3)
// Short prose summary for unauthenticated users on the public report page.
// Shows score + 3 issues, ends with urgency sentence to drive sign-up.
// ─────────────────────────────────────────────────────────────────────────────

export async function writeAuditTeaser(opts: {
  website: string
  industry: string
  overallScore: number
  estimatedRevenueLeakage: number | null
  topPillars: Array<{ name: string; score: number; avg: number | null }>
}): Promise<string> {
  const { website, industry, overallScore, estimatedRevenueLeakage, topPillars } = opts

  const pillarLines = topPillars.slice(0, 3).map((p, i) =>
    `${i + 1}. ${p.name}: score ${Math.round(p.score)}${p.avg !== null && p.avg !== undefined ? ` (avg: ${Math.round(p.avg)})` : ''}`,
  ).join('\n')

  const prompt = `Business website: ${website}
Industry: ${industry}
Overall score: ${overallScore}
Estimated revenue leakage: ${estimatedRevenueLeakage !== null && estimatedRevenueLeakage !== undefined ? `$${Math.round(estimatedRevenueLeakage)}/year` : 'unknown'}

Top 3 failing pillars:
${pillarLines}

Write a teaser audit summary for an unauthenticated user.
Include the score, the leakage estimate if available, and name 3 specific issues.
End with one sentence that makes signing up feel urgent.
Do NOT use bullet points — write as prose.
Under 120 words total.`

  try {
    const verticalPrompt = buildVerticalSystemPrompt(industry ?? 'OTHER')
    const teaserSystem   = `${verticalPrompt}\n\nYou write teaser audit summaries for local business owners who have not yet signed up. Lead with revenue implication. Name 3 specific issues. End with urgency. Under 120 words.`
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      temperature: 0.5,
      system: teaserSystem,
      messages: [{ role: 'user', content: prompt }],
    })
    const raw = msg.content.filter(b => b.type === 'text').map(b => b.text).join('').trim()
    return validateAndLog(raw, industry ?? 'OTHER', 'writeAuditTeaser')
  } catch {
    return ''
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO VERTICAL LANDING PAGE COPY (Growth Prompt #1)
// Generates keyword-rich copy for a vertical-specific landing page.
// ─────────────────────────────────────────────────────────────────────────────

const VERTICAL_RELATED: Record<string, string[]> = {
  AUTO_REPAIR: ['PLUMBING', 'HVAC', 'HOME_SERVICES'],
  DENTAL: ['FITNESS', 'PET_SERVICES', 'BEAUTY_SALON'],
  RESTAURANT: ['CLEANING', 'LOCAL_SERVICE', 'PET_SERVICES'],
  PLUMBING: ['HVAC', 'AUTO_REPAIR', 'HOME_SERVICES'],
  HVAC: ['PLUMBING', 'AUTO_REPAIR', 'HOME_SERVICES'],
  LEGAL: ['REAL_ESTATE', 'DENTAL', 'FITNESS'],
  REAL_ESTATE: ['LEGAL', 'HOME_SERVICES', 'LANDSCAPING'],
  BEAUTY_SALON: ['FITNESS', 'PET_SERVICES', 'DENTAL'],
  FITNESS: ['BEAUTY_SALON', 'PET_SERVICES', 'DENTAL'],
  CLEANING: ['HOME_SERVICES', 'LANDSCAPING', 'PLUMBING'],
  LANDSCAPING: ['CLEANING', 'HOME_SERVICES', 'HVAC'],
  PET_SERVICES: ['DENTAL', 'FITNESS', 'BEAUTY_SALON'],
  HOME_SERVICES: ['CLEANING', 'LANDSCAPING', 'HVAC'],
  LOCAL_SERVICE: ['HOME_SERVICES', 'CLEANING', 'AUTO_REPAIR'],
  CAR_WASH: ['AUTO_REPAIR', 'PLUMBING', 'CLEANING'],
}

const VERTICAL_LABELS: Record<string, string> = {
  AUTO_REPAIR: 'auto repair shops', DENTAL: 'dental practices', RESTAURANT: 'restaurants',
  PLUMBING: 'plumbers', HVAC: 'HVAC companies', LEGAL: 'law firms',
  REAL_ESTATE: 'real estate agents', BEAUTY_SALON: 'salons and med spas',
  FITNESS: 'gyms and fitness studios', CLEANING: 'cleaning services',
  LANDSCAPING: 'landscaping companies', PET_SERVICES: 'pet service businesses',
  HOME_SERVICES: 'home service companies', LOCAL_SERVICE: 'local service businesses',
  CAR_WASH: 'car wash businesses',
}

export async function generateVerticalLandingPage(vertical: string): Promise<{
  h1: string
  subheadline: string
  whatWeCheck: string[]
  testimonial: { quote: string; name: string; city: string; result: string }
  faq: Array<{ q: string; a: string }>
  metaTitle: string
  metaDescription: string
  relatedVerticals: string[]
} | null> {
  const label = VERTICAL_LABELS[vertical] ?? vertical.toLowerCase().replace(/_/g, ' ')
  const related = (VERTICAL_RELATED[vertical] ?? []).map(v => VERTICAL_LABELS[v] ?? v).slice(0, 3)

  const prompt = `Write landing page copy for Seleste targeting ${label}.

Include:
1. H1 headline — lead with pain or missed revenue, NOT the product name. Max 10 words.
2. Subheadline — one sentence on what the audit reveals. Max 20 words.
3. Three "What we check" bullets specific to ${label} (e.g., online booking presence, review volume, local keyword coverage).
4. A short social proof quote (fabricate a plausible testimonial: first name, city, vertical-specific result with a number).
5. FAQ section with 3 questions a ${label} owner would realistically ask.
6. Meta title (60 chars max) targeting "${label.split(' ')[0]} website audit".
7. Meta description (155 chars max) targeting "${label.split(' ')[0]} website score" and "${label.split(' ')[0]} website review".

Tone: direct, practical, no hype. Write as if explaining to a busy business owner.
Return ONLY valid JSON — no markdown, no preamble:
{
  "h1": "string",
  "subheadline": "string",
  "whatWeCheck": ["string", "string", "string"],
  "testimonial": { "quote": "string", "name": "string", "city": "string", "result": "string" },
  "faq": [{ "q": "string", "a": "string" }, { "q": "string", "a": "string" }, { "q": "string", "a": "string" }],
  "metaTitle": "string",
  "metaDescription": "string"
}`

  try {
    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      temperature: 0.6,
      system: 'You are a conversion copywriter and local SEO expert writing landing pages for Seleste, an AI-powered website audit platform for local businesses. Lead with loss-aversion. Short sentences. No jargon.',
      messages: [{ role: 'user', content: prompt }],
    })

    const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('')
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null
    const parsed = JSON.parse(match[0])
    return { ...parsed, relatedVerticals: related }
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// NARRATIVE + STRUCTURED OUTPUTS
// Returns narrative HTML + structured quick wins + top issues for DB storage
// ─────────────────────────────────────────────────────────────────────────────

const NARRATIVE_SYSTEM_PROMPT = `You are Seleste, an expert digital growth analyst specialising in local businesses.
You write audit narratives that feel like they were written by a senior consultant
who deeply understands the client's specific industry — not a generic AI tool.

## Your output format

Return valid HTML only. No markdown. No preamble. No explanation outside the HTML.
Structure:
  <div class="seleste-narrative">
    <section class="executive-summary">...</section>
    <section class="pillar-breakdown">...</section>
    <section class="quick-wins">...</section>
    <section class="90-day-roadmap">...</section>
  </div>

## Tone rules

- Write in second person ("your website", "your practice", "your shop").
- Use the industry's own language. A dental practice has "new patient acquisition"
  not "lead generation". An auto repair shop has "bays" not "capacity".
- Be specific. Never write "your score is low". Write "your conversion score of 42
  means roughly 6 in 10 visitors leave without taking any action."
- Be direct about revenue impact. Connect every finding to money.
- Avoid filler phrases: "it is important to note", "leveraging", "synergies",
  "holistic approach", "in today's digital landscape".

## Benchmark instructions

You will receive a benchmarkContext JSON object. Use it as follows:

- If vertical benchmark data exists for a pillar: state the percentile explicitly.
  Example: "Your SEO score of 38 puts you in the bottom quartile for {vertical}
  businesses nationally — the industry median is 61."
- If market benchmark data exists: add local context.
  Example: "Locally in {metroArea}, the median is 54, so you are also below
  your immediate competitors."
- If no benchmark data exists for a pillar: omit percentile language entirely.
  Never say "no benchmark available" — just write without the comparison.
- Never invent benchmark numbers. Only use numbers from benchmarkContext.

## Section requirements

executive-summary (150–200 words):
  - Open with the single most important finding, stated as a business consequence.
  - State overall score and what it means in plain English.
  - Name the top 2 revenue leakage sources.
  - End with one sentence on the opportunity if the gaps are closed.

pillar-breakdown:
  - Cover all 10 pillars. Group into: Strengths (score >= 65), Gaps (score < 65).
  - For each pillar: score, one-sentence finding, one concrete fix.
  - Use benchmark context where available.
  - Keep each pillar to 3–4 sentences max.

quick-wins (exactly 3 items):
  - These are actions completable in under 2 weeks with no developer needed.
  - Each win: title, estimated time, estimated revenue impact or risk reduced.
  - Be hyper-specific: not "add a CTA" but "add a click-to-call button above
    the fold on mobile — this is the #1 conversion lever for {vertical}."

90-day-roadmap (3 phases: weeks 1–2, weeks 3–6, weeks 7–12):
  - Each phase: 2–3 actions, owner (owner/agency/developer), expected outcome.
  - Phase 1 should be zero-cost or near-zero-cost actions.
  - Phase 3 should connect to a measurable business outcome (bookings, calls, revenue).`

export async function writeNarrative(
  input: AuditRequest,
  scores: PillarScores,
  overall: number,
  signals: PageSignals,
  applied: AppliedRule[],
): Promise<{ narrative: string; quickWins: string[]; topIssues: string[] }> {

  // Derive vertical and metroArea for benchmark lookup
  const vertical = input.vertical
  const locationParts = (input.location ?? '').split(',').map((s: string) => s.trim())
  const metroArea = locationParts.length >= 2
    ? `${locationParts[0]}-${locationParts[1]}`
    : null

  // Fetch benchmark context (graceful — never throws)
  const benchmarkCtx = await getBenchmarkContext(vertical, metroArea)
  const benchmarkContextJson = JSON.stringify(benchmarkCtx)

  const biz = (input.businessName || input.url).replace(/[<>{}\[\]]/g, '')
  const leakageEstimate = (signals as any).estimatedMonthlyLoss ?? null

  const pillarScoresJson = JSON.stringify({
    conversion: scores.conversion,
    seo: scores.discoverability,
    reputation: scores.trust,
    content: scores.content,
    ux: scores.ux,
    mobile: scores.performance,
    trust: scores.trust,
    performance: scores.performance,
    local: scores.discoverability,
    accessibility: scores.ux,
  })

  const userMessage = `Business: ${biz}
Website: ${input.url}
Vertical: ${vertical}
Metro area: ${metroArea ?? 'unknown'}
Overall score: ${overall}/100
Leakage estimate: ${leakageEstimate !== null ? `$${leakageEstimate}/month` : 'unknown'}

Pillar scores:
${pillarScoresJson}

Key hard signals:
- has_booking_widget: ${signals.hasBooking}
- has_ssl: ${signals.hasSSL}
- review_count: ${signals.estimatedReviewCount ?? 'unknown'}
- star_rating: ${signals.estimatedRating ?? 'unknown'}
- has_schema_markup: ${signals.hasSchema}

Benchmark context:
${benchmarkContextJson}`

  const verticalPrompt = buildVerticalSystemPrompt(vertical ?? 'OTHER')
  const enhancedSystemPrompt = `${verticalPrompt}\n\n${NARRATIVE_SYSTEM_PROMPT}`

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    temperature: 0.7,
    system: enhancedSystemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const rawText = msg.content.filter(b => b.type === 'text').map(b => b.text).join('').trim()
  const text    = validateAndLog(rawText, vertical ?? 'OTHER', 'writeNarrative')

  // Extract quick wins and top issues from applied rules
  const quickWins = applied.slice(0, 3).map(a => a.rule.label)
  const topIssues = applied.slice(0, 5).map(a => a.rule.label)

  // Append benchmark narrative if benchmark data exists
  let benchmarkParagraph = ''
  if (benchmarkCtx.vertical) {
    const pillarAvgs: Record<string, number | null> = {}
    const pillarScoresForBenchmark: Record<string, number> = {
      conversion: scores.conversion, trust: scores.trust, performance: scores.performance,
      ux: scores.ux, discoverability: scores.discoverability, content: scores.content,
      data: scores.data, technical: scores.technical, brand: scores.brand, scalability: scores.scalability,
    }
    for (const [p, stats] of Object.entries(benchmarkCtx.vertical)) {
      pillarAvgs[p] = stats?.mean ?? null
    }

    const verticalAvgEntry = Object.values(benchmarkCtx.vertical).find(s => s !== null)
    const verticalAvg = verticalAvgEntry ? Math.round(
      Object.values(benchmarkCtx.vertical).reduce((acc, s) => acc + (s?.mean ?? 0), 0) /
      Object.values(benchmarkCtx.vertical).filter(s => s !== null).length
    ) : null
    const topQuartile = verticalAvgEntry ? Math.round(
      Object.values(benchmarkCtx.vertical).reduce((acc, s) => acc + (s?.p75 ?? 0), 0) /
      Object.values(benchmarkCtx.vertical).filter(s => s !== null).length
    ) : null

    benchmarkParagraph = await writeBenchmarkNarrative({
      businessName: biz,
      industry: input.vertical,
      overallScore: overall,
      verticalAvg,
      topQuartile,
      pillarScores: pillarScoresForBenchmark,
      pillarAvgs,
    })
  }

  const fullNarrative = benchmarkParagraph
    ? `${text}\n<section class="benchmark-context"><p>${benchmarkParagraph}</p></section>`
    : text

  return {
    narrative: fullNarrative || '<p>AI analysis unavailable. Scores are deterministic and accurate.</p>',
    quickWins,
    topIssues,
  }
}
