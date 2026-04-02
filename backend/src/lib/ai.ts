import Anthropic from '@anthropic-ai/sdk'
import type { PageSignals, PillarScores, AuditRequest, AppliedRule } from '@/types/audit'
import type { HardSignals } from './fetcher'
import { PILLARS } from './engine'

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
// NARRATIVE + STRUCTURED OUTPUTS
// Returns narrative HTML + structured quick wins + top issues for DB storage
// ─────────────────────────────────────────────────────────────────────────────

export async function writeNarrative(
  input: AuditRequest,
  scores: PillarScores,
  overall: number,
  signals: PageSignals,
  applied: AppliedRule[],
): Promise<{ narrative: string; quickWins: string[]; topIssues: string[] }> {

  const weak = PILLARS.filter(p => scores[p.id] < 50).map(p => `${p.name}: ${scores[p.id]}/100`).join(', ') || 'none'
  const strong = PILLARS.filter(p => scores[p.id] >= 65).map(p => `${p.name}: ${scores[p.id]}/100`).join(', ') || 'none'
  const topRules = applied.slice(0, 6).map(a => a.rule.label).join('; ') || 'none'

  const biz = (input.businessName || input.url).replace(/[<>{}\[\]]/g, '')
  const prompt = `You are a senior growth strategist. Write a specific, direct audit report for this local business owner.

Business: ${biz}
Vertical: ${input.vertical.replace('_', ' ')}
Location: ${input.location}
URL: ${input.url}
Summary: ${signals.pageSummary || 'N/A'}
Services detected: ${signals.primaryServices.join(', ') || 'unknown'}

Score: ${overall}/100
Weak pillars: ${weak}
Strong pillars: ${strong}
Key issues: ${topRules}
CTA: ${signals.hasCTA} | Booking: ${signals.hasBooking} | Reviews: ${signals.hasReviews}
SSL: ${signals.hasSSL} | GBP: ${signals.hasGBP} | Analytics: ${signals.hasAnalytics}
Mobile: ${signals.isMobileOptimized} | Schema: ${signals.hasSchema} | Words: ${signals.wordCount}

Return ONLY valid JSON, no markdown:
{
  "narrative": "<p><strong>Overall assessment:</strong> 2-3 specific sentences about this site.</p><p><strong>Biggest revenue risk:</strong> 2-3 sentences on the most costly gap found.</p><p><strong>Quick wins:</strong> 2 sentences with 2-3 specific actions for next 14 days.</p><p><strong>90-day priority:</strong> 2 sentences on the strategic compounding focus.</p>",
  "quickWins": ["specific action 1", "specific action 2", "specific action 3"],
  "topIssues": ["issue 1", "issue 2", "issue 3", "issue 4", "issue 5"]
}`

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('').trim()

  try {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON')
    const parsed = JSON.parse(match[0])
    return {
      narrative: parsed.narrative ?? '',
      quickWins: Array.isArray(parsed.quickWins) ? parsed.quickWins.slice(0, 5) : [],
      topIssues: Array.isArray(parsed.topIssues) ? parsed.topIssues.slice(0, 5) : [],
    }
  } catch {
    return { narrative: '<p>AI analysis unavailable. Scores are deterministic and accurate.</p>', quickWins: [], topIssues: [] }
  }
}
