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
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDomain = normalizeDomain;
exports.upsertBusiness = upsertBusiness;
exports.upsertBusinessSignals = upsertBusinessSignals;
exports.saveAuditSnapshot = saveAuditSnapshot;
exports.computeScoreDelta = computeScoreDelta;
exports.updateMarketSegment = updateMarketSegment;
exports.getLiveBenchmark = getLiveBenchmark;
exports.getVerticalPercentile = getVerticalPercentile;
exports.getAuditsByUser = getAuditsByUser;
exports.getBusinessHistory = getBusinessHistory;
const db_1 = require("@/lib/db");
const engine_1 = require("@/lib/engine");
// ─────────────────────────────────────────────────────────────────────────────
// NORMALIZE DOMAIN
// ─────────────────────────────────────────────────────────────────────────────
function normalizeDomain(url) {
    try {
        const u = new URL(url.startsWith('http') ? url : 'https://' + url);
        return u.hostname.replace(/^www\./, '').toLowerCase();
    }
    catch (_a) {
        return url.toLowerCase().replace(/^www\./, '').split('/')[0];
    }
}
// ─────────────────────────────────────────────────────────────────────────────
// UPSERT BUSINESS
// Creates or updates the permanent business profile
// ─────────────────────────────────────────────────────────────────────────────
function upsertBusiness(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const domain = normalizeDomain(params.url);
        const [city, state] = params.location.split(',').map(s => s.trim());
        const existing = yield db_1.db.business.findUnique({ where: { domain } });
        const newEntry = { date: new Date().toISOString(), score: params.overallScore, grade: params.grade };
        const existingHistory = (existing === null || existing === void 0 ? void 0 : existing.scoreHistory)
            ? existing.scoreHistory
            : [];
        const scoreHistory = [...existingHistory, newEntry].slice(-24);
        const business = yield db_1.db.business.upsert({
            where: { domain },
            update: {
                canonicalUrl: params.url,
                businessName: (_a = params.businessName) !== null && _a !== void 0 ? _a : undefined,
                vertical: params.vertical,
                city,
                state,
                latestOverallScore: params.overallScore,
                latestConversionScore: params.pillarScores.conversion,
                latestTrustScore: params.pillarScores.trust,
                latestPerformanceScore: params.pillarScores.performance,
                latestDiscoverScore: params.pillarScores.discoverability,
                latestUxScore: params.pillarScores.ux,
                latestContentScore: params.pillarScores.content,
                latestDataScore: params.pillarScores.data,
                latestTechnicalScore: params.pillarScores.technical,
                latestBrandScore: params.pillarScores.brand,
                latestScalabilityScore: params.pillarScores.scalability,
                latestGrade: params.grade,
                lastAuditedAt: new Date(),
                scoreHistory,
            },
            create: {
                domain,
                canonicalUrl: params.url,
                businessName: (_b = params.businessName) !== null && _b !== void 0 ? _b : null,
                vertical: params.vertical,
                city,
                state,
                latestOverallScore: params.overallScore,
                latestConversionScore: params.pillarScores.conversion,
                latestTrustScore: params.pillarScores.trust,
                latestPerformanceScore: params.pillarScores.performance,
                latestDiscoverScore: params.pillarScores.discoverability,
                latestUxScore: params.pillarScores.ux,
                latestContentScore: params.pillarScores.content,
                latestDataScore: params.pillarScores.data,
                latestTechnicalScore: params.pillarScores.technical,
                latestBrandScore: params.pillarScores.brand,
                latestScalabilityScore: params.pillarScores.scalability,
                latestGrade: params.grade,
                lastAuditedAt: new Date(),
                scoreHistory,
                createdByUser: (_c = params.userId) !== null && _c !== void 0 ? _c : null,
            },
        });
        return business;
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// UPSERT BUSINESS SIGNALS
// Updates the living signal record for this business
// ─────────────────────────────────────────────────────────────────────────────
function upsertBusinessSignals(businessId, signals) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
        return db_1.db.businessSignals.upsert({
            where: { businessId },
            update: {
                hasCTA: signals.hasCTA,
                hasBooking: signals.hasBooking,
                hasContactForm: signals.hasContactForm,
                hasPricing: signals.hasPricing,
                hasGuarantee: signals.hasGuarantee,
                hasLiveChat: signals.hasLiveChat,
                hasOnlinePayment: signals.hasOnlinePayment,
                ctaText: (_a = signals.ctaText) !== null && _a !== void 0 ? _a : null,
                bookingPlatform: (_b = signals.bookingPlatform) !== null && _b !== void 0 ? _b : null,
                conversionFriction: (_c = signals.conversionFriction) !== null && _c !== void 0 ? _c : null,
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
                estimatedReviewCount: (_d = signals.estimatedReviewCount) !== null && _d !== void 0 ? _d : null,
                estimatedRating: (_e = signals.estimatedRating) !== null && _e !== void 0 ? _e : null,
                isMobileOptimized: signals.isMobileOptimized,
                hasOptimizedImages: signals.hasOptimizedImages,
                hasLazyLoad: signals.hasLazyLoad,
                hasCDN: signals.hasCDN,
                hasCaching: signals.hasCaching,
                estimatedLoadScore: (_f = signals.estimatedLoadScore) !== null && _f !== void 0 ? _f : null,
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
                navigationDepth: (_g = signals.navigationDepth) !== null && _g !== void 0 ? _g : null,
                wordCount: signals.wordCount,
                hasFAQ: signals.hasFAQ,
                hasServiceList: signals.hasServiceList,
                hasLocationPages: signals.hasLocationPages,
                hasVideoContent: signals.hasVideoContent,
                hasBeforeAfterPhotos: signals.hasBeforeAfterPhotos,
                contentQualityScore: (_h = signals.contentQualityScore) !== null && _h !== void 0 ? _h : null,
                primaryServices: signals.primaryServices,
                valueProposition: (_j = signals.valueProposition) !== null && _j !== void 0 ? _j : null,
                hasAnalytics: signals.hasAnalytics,
                hasPixel: signals.hasPixel,
                hasTagManager: signals.hasTagManager,
                hasHeatmaps: signals.hasHeatmaps,
                hasCRMIntegration: signals.hasCRMIntegration,
                analyticsplatform: (_k = signals.analyticsPlatform) !== null && _k !== void 0 ? _k : null,
                hasCMS: signals.hasCMS,
                detectedCMS: (_l = signals.detectedCMS) !== null && _l !== void 0 ? _l : null,
                techStack: signals.techStack,
                hasStructuredData: signals.hasStructuredData,
                hasXMLSitemap: signals.hasXMLSitemap,
                hasRobotsTxt: signals.hasRobotsTxt,
                hasLogo: signals.hasLogo,
                hasBrandDiff: signals.hasBrandDiff,
                hasTagline: signals.hasTagline,
                hasConsistentColors: signals.hasConsistentColors,
                brandVoice: (_m = signals.brandVoice) !== null && _m !== void 0 ? _m : null,
                pageTitle: (_o = signals.pageTitle) !== null && _o !== void 0 ? _o : null,
                metaDescription: (_p = signals.metaDescription) !== null && _p !== void 0 ? _p : null,
                h1Text: (_q = signals.h1Text) !== null && _q !== void 0 ? _q : null,
                pageSummary: (_r = signals.pageSummary) !== null && _r !== void 0 ? _r : null,
                businessDescription: (_s = signals.businessDescription) !== null && _s !== void 0 ? _s : null,
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
                ctaText: (_t = signals.ctaText) !== null && _t !== void 0 ? _t : null,
                bookingPlatform: (_u = signals.bookingPlatform) !== null && _u !== void 0 ? _u : null,
                conversionFriction: (_v = signals.conversionFriction) !== null && _v !== void 0 ? _v : null,
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
                estimatedReviewCount: (_w = signals.estimatedReviewCount) !== null && _w !== void 0 ? _w : null,
                estimatedRating: (_x = signals.estimatedRating) !== null && _x !== void 0 ? _x : null,
                isMobileOptimized: signals.isMobileOptimized,
                hasOptimizedImages: signals.hasOptimizedImages,
                hasLazyLoad: signals.hasLazyLoad,
                hasCDN: signals.hasCDN,
                hasCaching: signals.hasCaching,
                estimatedLoadScore: (_y = signals.estimatedLoadScore) !== null && _y !== void 0 ? _y : null,
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
                navigationDepth: (_z = signals.navigationDepth) !== null && _z !== void 0 ? _z : null,
                wordCount: signals.wordCount,
                hasFAQ: signals.hasFAQ,
                hasServiceList: signals.hasServiceList,
                hasLocationPages: signals.hasLocationPages,
                hasVideoContent: signals.hasVideoContent,
                hasBeforeAfterPhotos: signals.hasBeforeAfterPhotos,
                contentQualityScore: (_0 = signals.contentQualityScore) !== null && _0 !== void 0 ? _0 : null,
                primaryServices: signals.primaryServices,
                valueProposition: (_1 = signals.valueProposition) !== null && _1 !== void 0 ? _1 : null,
                hasAnalytics: signals.hasAnalytics,
                hasPixel: signals.hasPixel,
                hasTagManager: signals.hasTagManager,
                hasHeatmaps: signals.hasHeatmaps,
                hasCRMIntegration: signals.hasCRMIntegration,
                analyticsplatform: (_2 = signals.analyticsPlatform) !== null && _2 !== void 0 ? _2 : null,
                hasCMS: signals.hasCMS,
                detectedCMS: (_3 = signals.detectedCMS) !== null && _3 !== void 0 ? _3 : null,
                techStack: signals.techStack,
                hasStructuredData: signals.hasStructuredData,
                hasXMLSitemap: signals.hasXMLSitemap,
                hasRobotsTxt: signals.hasRobotsTxt,
                hasLogo: signals.hasLogo,
                hasBrandDiff: signals.hasBrandDiff,
                hasTagline: signals.hasTagline,
                hasConsistentColors: signals.hasConsistentColors,
                brandVoice: (_4 = signals.brandVoice) !== null && _4 !== void 0 ? _4 : null,
                pageTitle: (_5 = signals.pageTitle) !== null && _5 !== void 0 ? _5 : null,
                metaDescription: (_6 = signals.metaDescription) !== null && _6 !== void 0 ? _6 : null,
                h1Text: (_7 = signals.h1Text) !== null && _7 !== void 0 ? _7 : null,
                pageSummary: (_8 = signals.pageSummary) !== null && _8 !== void 0 ? _8 : null,
                businessDescription: (_9 = signals.businessDescription) !== null && _9 !== void 0 ? _9 : null,
                detectedTopIssues: signals.detectedTopIssues,
            },
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// SAVE AUDIT SNAPSHOT
// Immutable record — never updated, only created
// ─────────────────────────────────────────────────────────────────────────────
function saveAuditSnapshot(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const { result, delta } = params;
        const { pillarScores: ps, revenueLeak: rl, appliedRules } = result;
        const snapshot = yield db_1.db.auditSnapshot.create({
            data: {
                businessId: params.businessId,
                triggeredBy: (_a = result.input.triggeredBy) !== null && _a !== void 0 ? _a : 'MANUAL',
                triggeredByUser: (_b = params.userId) !== null && _b !== void 0 ? _b : null,
                auditVersion: result.auditVersion,
                inputUrl: result.input.url,
                inputLocation: result.input.location,
                inputVertical: result.input.vertical,
                inputMonthlyRevenue: (_c = result.input.monthlyRevenue) !== null && _c !== void 0 ? _c : null,
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
                estimatedMonthlyLoss: (_d = rl.estimatedMonthlyLoss) !== null && _d !== void 0 ? _d : null,
                leakageConversion: rl.conversionPct,
                leakageTrust: rl.trustPct,
                leakagePerformance: rl.performancePct,
                leakageUX: rl.uxPct,
                confidencePct: result.confidence.pct,
                missingSignals: result.confidence.missingSignals,
                signalSnapshot: result.signals,
                aiNarrative: result.aiNarrative,
                aiTopIssues: result.aiTopIssues,
                aiQuickWins: result.aiQuickWins,
                benchmarkAvg: params.benchmarkAvg,
                benchmarkTop: params.benchmarkTop,
                previousAuditId: (_e = delta === null || delta === void 0 ? void 0 : delta.previousAuditId) !== null && _e !== void 0 ? _e : null,
                scoreDelta: (_f = delta === null || delta === void 0 ? void 0 : delta.scoreDelta) !== null && _f !== void 0 ? _f : null,
                improvedPillars: (_g = delta === null || delta === void 0 ? void 0 : delta.improvedPillars) !== null && _g !== void 0 ? _g : [],
                regressedPillars: (_h = delta === null || delta === void 0 ? void 0 : delta.regressedPillars) !== null && _h !== void 0 ? _h : [],
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
        });
        return snapshot;
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// COMPUTE SCORE DELTA
// Compare this audit against the most recent previous one
// ─────────────────────────────────────────────────────────────────────────────
function computeScoreDelta(businessId, currentScores, currentOverall) {
    return __awaiter(this, void 0, void 0, function* () {
        const previous = yield db_1.db.auditSnapshot.findFirst({
            where: { businessId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, createdAt: true, overallScore: true,
                conversionScore: true, trustScore: true, performanceScore: true,
                uxScore: true, discoverScore: true, contentScore: true,
                dataScore: true, technicalScore: true, brandScore: true, scalabilityScore: true,
            },
        });
        if (!previous)
            return undefined;
        const prevPillarMap = {
            conversion: previous.conversionScore, trust: previous.trustScore,
            performance: previous.performanceScore, ux: previous.uxScore,
            discoverability: previous.discoverScore, content: previous.contentScore,
            data: previous.dataScore, technical: previous.technicalScore,
            brand: previous.brandScore, scalability: previous.scalabilityScore,
        };
        const improvedPillars = [];
        const regressedPillars = [];
        for (const pillar of engine_1.PILLARS) {
            const diff = currentScores[pillar.id] - prevPillarMap[pillar.id];
            if (diff >= 5)
                improvedPillars.push(pillar.id);
            else if (diff <= -5)
                regressedPillars.push(pillar.id);
        }
        return {
            previousAuditId: previous.id,
            previousScore: previous.overallScore,
            previousDate: previous.createdAt.toISOString(),
            scoreDelta: currentOverall - previous.overallScore,
            improvedPillars,
            regressedPillars,
        };
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// UPDATE MARKET SEGMENT
// Recomputes aggregate intelligence for the vertical+location segment
// ─────────────────────────────────────────────────────────────────────────────
function updateMarketSegment(vertical, state, city) {
    return __awaiter(this, void 0, void 0, function* () {
        // Bug 4 fix: trim all parts before building the key to prevent leading-space corruption
        const cleanState = (state === null || state === void 0 ? void 0 : state.trim()) || undefined;
        const cleanCity = (city === null || city === void 0 ? void 0 : city.trim()) || undefined;
        const segmentKey = [vertical, cleanState, cleanCity].filter(Boolean).join(':');
        const businesses = yield db_1.db.business.findMany({
            where: Object.assign(Object.assign(Object.assign({ vertical: vertical }, (cleanState ? { state: cleanState } : {})), (cleanCity ? { city: cleanCity } : {})), { latestOverallScore: { not: null } }),
            include: { signals: true },
        });
        if (businesses.length === 0)
            return;
        const scores = businesses.map(b => b.latestOverallScore).sort((a, b) => a - b);
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        const median = scores[Math.floor(scores.length / 2)];
        const p25 = scores[Math.floor(scores.length * 0.25)];
        const p75 = scores[Math.floor(scores.length * 0.75)];
        const p90 = scores[Math.floor(scores.length * 0.9)];
        const sigs = businesses.map(b => b.signals).filter(Boolean);
        const pct = (fn) => sigs.length > 0 ? (sigs.filter(s => fn(s)).length / sigs.length) * 100 : 0;
        // Per-pillar averages using explicit field names (P0 fix — all 10 pillars)
        const pillarField = (field) => {
            const vals = businesses
                .map(b => b[field])
                .filter((v) => v !== null);
            return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
        };
        // P3 Fix Gap6: compute topIssues from AppliedRuleRecord for this segment
        const topRuleRows = yield db_1.db.appliedRuleRecord.groupBy({
            by: ['ruleLabel'],
            where: {
                audit: {
                    business: Object.assign(Object.assign({ vertical: vertical }, (cleanState ? { state: cleanState } : {})), (cleanCity ? { city: cleanCity } : {})),
                },
            },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5,
        });
        const topIssues = topRuleRows.map(r => r.ruleLabel);
        const segmentData = {
            businessCount: businesses.length,
            avgOverallScore: avg,
            medianOverallScore: median,
            p25Score: p25,
            p75Score: p75,
            topDecileScore: p90,
            // All 10 pillar averages — previously only 4 were populated
            avgConversionScore: pillarField('latestConversionScore'),
            avgTrustScore: pillarField('latestTrustScore'),
            avgPerformanceScore: pillarField('latestPerformanceScore'),
            avgUXScore: pillarField('latestUxScore'),
            avgDiscoverScore: pillarField('latestDiscoverScore'),
            avgContentScore: pillarField('latestContentScore'),
            avgDataScore: pillarField('latestDataScore'),
            avgTechnicalScore: pillarField('latestTechnicalScore'),
            avgBrandScore: pillarField('latestBrandScore'),
            avgScalabilityScore: pillarField('latestScalabilityScore'),
            pctHasCTA: pct(s => { var _a; return (_a = s === null || s === void 0 ? void 0 : s.hasCTA) !== null && _a !== void 0 ? _a : false; }),
            pctHasBooking: pct(s => { var _a; return (_a = s === null || s === void 0 ? void 0 : s.hasBooking) !== null && _a !== void 0 ? _a : false; }),
            pctHasReviews: pct(s => { var _a; return (_a = s === null || s === void 0 ? void 0 : s.hasReviews) !== null && _a !== void 0 ? _a : false; }),
            pctHasGBP: pct(s => { var _a; return (_a = s === null || s === void 0 ? void 0 : s.hasGBP) !== null && _a !== void 0 ? _a : false; }),
            pctHasAnalytics: pct(s => { var _a; return (_a = s === null || s === void 0 ? void 0 : s.hasAnalytics) !== null && _a !== void 0 ? _a : false; }),
            pctHasSSL: pct(s => { var _a; return (_a = s === null || s === void 0 ? void 0 : s.hasSSL) !== null && _a !== void 0 ? _a : false; }),
            pctHasSchema: pct(s => { var _a; return (_a = s === null || s === void 0 ? void 0 : s.hasSchema) !== null && _a !== void 0 ? _a : false; }),
            pctHasBlog: pct(s => { var _a; return (_a = s === null || s === void 0 ? void 0 : s.hasBlog) !== null && _a !== void 0 ? _a : false; }),
            pctHasPricing: pct(s => { var _a; return (_a = s === null || s === void 0 ? void 0 : s.hasPricing) !== null && _a !== void 0 ? _a : false; }),
            pctHasMobileMenu: pct(s => { var _a; return (_a = s === null || s === void 0 ? void 0 : s.hasMobileMenu) !== null && _a !== void 0 ? _a : false; }),
            opportunityScore: 100 - avg,
            topIssues,
        };
        yield db_1.db.marketSegment.upsert({
            where: { segmentKey },
            update: segmentData,
            create: Object.assign({ segmentKey, vertical: vertical, state: cleanState !== null && cleanState !== void 0 ? cleanState : null, city: cleanCity !== null && cleanCity !== void 0 ? cleanCity : null }, segmentData),
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// GET LIVE BENCHMARK FROM DB
// Returns real percentile data from actual audited businesses (falls back to static)
// ─────────────────────────────────────────────────────────────────────────────
function getLiveBenchmark(vertical, state) {
    return __awaiter(this, void 0, void 0, function* () {
        // Select all 10 denormalized pillar score fields (now that Business model has all 10)
        const businesses = yield db_1.db.business.findMany({
            where: Object.assign(Object.assign({ vertical: vertical }, (state ? { state } : {})), { latestOverallScore: { not: null } }),
            select: {
                latestConversionScore: true,
                latestTrustScore: true,
                latestPerformanceScore: true,
                latestUxScore: true,
                latestDiscoverScore: true, // discoverability — truncated column name
                latestContentScore: true,
                latestDataScore: true,
                latestTechnicalScore: true,
                latestBrandScore: true,
                latestScalabilityScore: true,
            },
            take: 500,
            orderBy: { lastAuditedAt: 'desc' },
        });
        if (businesses.length < 5)
            return null;
        // Use the explicit field map — no dynamic string construction
        // PILLAR_DB_FIELD maps PillarId → exact column name
        const avgArr = engine_1.PILLARS.map(p => {
            const field = engine_1.PILLAR_DB_FIELD[p.id];
            const vals = businesses
                .map(b => b[field])
                .filter((v) => v !== null);
            return vals.length > 0
                ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
                : 50; // fallback only if truly no data for this pillar
        });
        const topArr = engine_1.PILLARS.map(p => {
            const field = engine_1.PILLAR_DB_FIELD[p.id];
            const vals = businesses
                .map(b => b[field])
                .filter((v) => v !== null)
                .sort((a, b) => b - a);
            const top10pct = vals.slice(0, Math.max(1, Math.floor(vals.length * 0.1)));
            return top10pct.length > 0
                ? Math.round(top10pct.reduce((a, b) => a + b, 0) / top10pct.length)
                : 80;
        });
        return { avg: avgArr, top: topArr, count: businesses.length };
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// GET VERTICAL PERCENTILE
// Where does this business rank among all in its vertical?
// ─────────────────────────────────────────────────────────────────────────────
function getVerticalPercentile(vertical, score) {
    return __awaiter(this, void 0, void 0, function* () {
        const total = yield db_1.db.business.count({
            where: { vertical: vertical, latestOverallScore: { not: null } },
        });
        if (total < 5)
            return 50;
        const below = yield db_1.db.business.count({
            where: { vertical: vertical, latestOverallScore: { lt: score } },
        });
        return Math.round((below / total) * 100);
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// GET AUDITS BY USER
// Returns all audit snapshots created by a specific Clerk user
// ─────────────────────────────────────────────────────────────────────────────
function getAuditsByUser(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, limit = 50) {
        return db_1.db.auditSnapshot.findMany({
            where: { triggeredByUser: userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                business: {
                    include: { signals: true },
                },
            },
        });
    });
}
// ─────────────────────────────────────────────────────────────────────────────
// GET BUSINESS AUDIT HISTORY
// Full timeline for a single business — for re-audit / delta view
// ─────────────────────────────────────────────────────────────────────────────
function getBusinessHistory(domain) {
    return __awaiter(this, void 0, void 0, function* () {
        return db_1.db.auditSnapshot.findMany({
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
        });
    });
}
