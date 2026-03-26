"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSignals = extractSignals;
exports.writeNarrative = writeNarrative;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const engine_1 = require("./engine");
const anthropic = new sdk_1.default({ apiKey: process.env.ANTHROPIC_API_KEY });
// ─────────────────────────────────────────────────────────────────────────────
// SIGNAL EXTRACTION
// Extracts 60+ structured signals from real HTML
// Hard signals are injected directly (can't be overridden by AI)
// ─────────────────────────────────────────────────────────────────────────────
function extractSignals(html, url, hard) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
        const trimmed = html.slice(0, 22000);
        const prompt = `You are a website growth analyst. Extract structured signals from this local business website HTML.

URL: ${url}
Page title: ${hard.pageTitle}
Word count: ${hard.wordCount}
CMS: ${(_a = hard.detectedCMS) !== null && _a !== void 0 ? _a : 'unknown'}
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
}`;
        const msg = yield anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }],
        });
        const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('');
        try {
            const match = text.match(/\{[\s\S]*\}/);
            if (!match)
                throw new Error('No JSON');
            const p = JSON.parse(match[0]);
            return {
                hasCTA: !!p.hasCTA,
                hasBooking: !!p.hasBooking,
                hasContactForm: !!p.hasContactForm,
                hasPricing: !!p.hasPricing,
                hasGuarantee: !!p.hasGuarantee,
                hasLiveChat: !!p.hasLiveChat,
                hasOnlinePayment: !!p.hasOnlinePayment,
                ctaText: (_b = p.ctaText) !== null && _b !== void 0 ? _b : undefined,
                bookingPlatform: (_c = p.bookingPlatform) !== null && _c !== void 0 ? _c : undefined,
                conversionFriction: (_d = p.conversionFriction) !== null && _d !== void 0 ? _d : undefined,
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
                estimatedReviewCount: (_e = p.estimatedReviewCount) !== null && _e !== void 0 ? _e : undefined,
                estimatedRating: (_f = p.estimatedRating) !== null && _f !== void 0 ? _f : undefined,
                isMobileOptimized: hard.isMobileOptimized,
                hasOptimizedImages: hard.hasOptimizedImages,
                hasLazyLoad: hard.hasLazyLoad,
                hasCDN: hard.hasCDN,
                hasCaching: hard.hasCaching,
                estimatedLoadScore: (_g = p.estimatedLoadScore) !== null && _g !== void 0 ? _g : undefined,
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
                navigationDepth: (_h = p.navigationDepth) !== null && _h !== void 0 ? _h : undefined,
                wordCount: hard.wordCount,
                hasFAQ: !!p.hasFAQ,
                hasServiceList: !!p.hasServiceList,
                hasLocationPages: !!p.hasLocationPages,
                hasVideoContent: !!p.hasVideoContent,
                hasBeforeAfterPhotos: !!p.hasBeforeAfterPhotos,
                contentQualityScore: (_j = p.contentQualityScore) !== null && _j !== void 0 ? _j : undefined,
                primaryServices: Array.isArray(p.primaryServices) ? p.primaryServices.slice(0, 10) : [],
                valueProposition: (_k = p.valueProposition) !== null && _k !== void 0 ? _k : undefined,
                hasAnalytics: hard.hasAnalytics,
                hasPixel: hard.hasPixel,
                hasTagManager: hard.hasTagManager,
                hasHeatmaps: !!p.hasHeatmaps,
                hasCRMIntegration: !!p.hasCRMIntegration,
                analyticsPlatform: (_l = hard.analyticsPlatform) !== null && _l !== void 0 ? _l : undefined,
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
                brandVoice: (_m = p.brandVoice) !== null && _m !== void 0 ? _m : undefined,
                pageTitle: hard.pageTitle,
                metaDescription: hard.metaDescription,
                h1Text: hard.h1Text,
                pageSummary: (_o = p.pageSummary) !== null && _o !== void 0 ? _o : '',
                businessDescription: (_p = p.businessDescription) !== null && _p !== void 0 ? _p : '',
                detectedTopIssues: Array.isArray(p.detectedTopIssues) ? p.detectedTopIssues : [],
            };
        }
        catch (_q) {
            return buildFallback(hard);
        }
    });
}
function buildFallback(hard) {
    var _a;
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
        hasHeatmaps: false, hasCRMIntegration: false, analyticsPlatform: (_a = hard.analyticsPlatform) !== null && _a !== void 0 ? _a : undefined,
        hasCMS: hard.hasCMS, detectedCMS: hard.detectedCMS, techStack: hard.techStack,
        hasStructuredData: hard.hasSchema, hasXMLSitemap: hard.hasXMLSitemap, hasRobotsTxt: false,
        hasLogo: false, hasBrandDiff: false, hasTagline: false, hasConsistentColors: false,
        pageTitle: hard.pageTitle, metaDescription: hard.metaDescription, h1Text: hard.h1Text,
        pageSummary: 'Page analysis unavailable — conservative defaults applied.',
        businessDescription: '', detectedTopIssues: [],
    };
}
// ─────────────────────────────────────────────────────────────────────────────
// NARRATIVE + STRUCTURED OUTPUTS
// Returns narrative HTML + structured quick wins + top issues for DB storage
// ─────────────────────────────────────────────────────────────────────────────
function writeNarrative(input, scores, overall, signals, applied) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const weak = engine_1.PILLARS.filter(p => scores[p.id] < 50).map(p => `${p.name}: ${scores[p.id]}/100`).join(', ') || 'none';
        const strong = engine_1.PILLARS.filter(p => scores[p.id] >= 65).map(p => `${p.name}: ${scores[p.id]}/100`).join(', ') || 'none';
        const topRules = applied.slice(0, 6).map(a => a.rule.label).join('; ') || 'none';
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
}`;
        const msg = yield anthropic.messages.create({
            model: 'claude-sonnet-4-5',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }],
        });
        const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('').trim();
        try {
            const match = text.match(/\{[\s\S]*\}/);
            if (!match)
                throw new Error('No JSON');
            const parsed = JSON.parse(match[0]);
            return {
                narrative: (_a = parsed.narrative) !== null && _a !== void 0 ? _a : '',
                quickWins: Array.isArray(parsed.quickWins) ? parsed.quickWins.slice(0, 5) : [],
                topIssues: Array.isArray(parsed.topIssues) ? parsed.topIssues.slice(0, 5) : [],
            };
        }
        catch (_b) {
            return { narrative: '<p>AI analysis unavailable. Scores are deterministic and accurate.</p>', quickWins: [], topIssues: [] };
        }
    });
}
