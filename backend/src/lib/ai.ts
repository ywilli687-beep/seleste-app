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
): Promise<PageSignals> {
  const trimmed = html.slice(0, 22000)

  const prompt = `You are a website growth analyst. Extract structured signals from this local business website HTML.

URL: ${url}
Page title: ${hard.pageTitle}
Word count: ${hard.wordCount}
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
metaDescription=${JSON.stringify(hard.metaDescription)}, pageTitle=${JSON.stringify(hard.pageTitle)}

HTML:
\`\`\`
${trimmed}
\`\`\`

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
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
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

  const prompt = `You are a senior growth strategist. Write a specific, direct audit report for this local business owner.

Business: ${input.businessName || input.url}
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
    model: 'claude-sonnet-4-5',
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
