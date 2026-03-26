"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATIC_BENCHMARKS = exports.RULES = exports.PILLAR_DB_FIELD = exports.PILLARS = void 0;
exports.applyRules = applyRules;
exports.computePillarScores = computePillarScores;
exports.computeWeightedScore = computeWeightedScore;
exports.computeGrade = computeGrade;
exports.computeRevenueLeak = computeRevenueLeak;
exports.computeConfidence = computeConfidence;
exports.selectRecommendations = selectRecommendations;
exports.buildRoadmap = buildRoadmap;
// ── Pillars ────────────────────────────────────────────────────────────────────
exports.PILLARS = [
    { id: 'conversion', name: 'Conversion System', weight: 0.25, icon: '🎯' },
    { id: 'trust', name: 'Trust & Credibility', weight: 0.15, icon: '🛡️' },
    { id: 'performance', name: 'Performance', weight: 0.15, icon: '⚡' },
    { id: 'ux', name: 'UX & Experience', weight: 0.10, icon: '✨' },
    { id: 'discoverability', name: 'Discoverability', weight: 0.10, icon: '🔍' },
    { id: 'content', name: 'Content & Messaging', weight: 0.08, icon: '📝' },
    { id: 'data', name: 'Data & Tracking', weight: 0.07, icon: '📊' },
    { id: 'technical', name: 'Technical Infrastructure', weight: 0.05, icon: '⚙️' },
    { id: 'brand', name: 'Brand & Differentiation', weight: 0.03, icon: '💎' },
    { id: 'scalability', name: 'Scalability', weight: 0.02, icon: '📈' },
];
// ── Explicit pillar → DB field map (P0 Fix 3) ─────────────────────────────────
// Replaces dynamic string construction (which produced wrong field names like
// 'latestDiscoverabilityScore' instead of the actual 'latestDiscoverScore').
// Used by getLiveBenchmark and updateMarketSegment in data/index.ts.
exports.PILLAR_DB_FIELD = {
    conversion: 'latestConversionScore',
    trust: 'latestTrustScore',
    performance: 'latestPerformanceScore',
    ux: 'latestUxScore',
    discoverability: 'latestDiscoverScore', // truncated — matches schema column name
    content: 'latestContentScore',
    data: 'latestDataScore',
    technical: 'latestTechnicalScore',
    brand: 'latestBrandScore',
    scalability: 'latestScalabilityScore',
};
// ── Rules Engine ───────────────────────────────────────────────────────────────
exports.RULES = {
    conversion: [
        { id: 'no_cta', label: 'No CTA above the fold', cap: 20, pen: 0, fn: s => !s.hasCTA },
        { id: 'no_booking', label: 'No online booking system', cap: 35, pen: 0, fn: s => !s.hasBooking },
        { id: 'no_form', label: 'No contact form', cap: 45, pen: 0, fn: s => !s.hasContactForm },
        { id: 'no_pricing', label: 'No pricing information', cap: 0, pen: 10, fn: s => !s.hasPricing },
        { id: 'no_guarantee', label: 'No guarantee or warranty', cap: 0, pen: 8, fn: s => !s.hasGuarantee },
        { id: 'high_friction', label: 'High conversion friction detected', cap: 0, pen: 12, fn: s => { var _a; return ((_a = s.conversionFriction) !== null && _a !== void 0 ? _a : 0) >= 4; } },
        { id: 'no_payment', label: 'No online payment option', cap: 0, pen: 5, fn: s => !s.hasOnlinePayment },
    ],
    trust: [
        { id: 'no_reviews', label: 'No reviews or testimonials', cap: 22, pen: 0, fn: s => !s.hasReviews },
        { id: 'no_contact', label: 'No visible contact information', cap: 12, pen: 0, fn: s => !s.hasContactInfo },
        { id: 'no_ssl', label: 'No HTTPS / SSL certificate', cap: 0, pen: 20, fn: s => !s.hasSSL },
        { id: 'no_about', label: 'No about or team page', cap: 0, pen: 8, fn: s => !s.hasAboutPage },
        { id: 'no_address', label: 'No physical address', cap: 0, pen: 10, fn: s => !s.hasAddress },
        { id: 'no_team', label: 'No team photos', cap: 0, pen: 6, fn: s => !s.hasTeamPhotos },
        { id: 'no_license', label: 'No license or credentials shown', cap: 0, pen: 5, fn: s => !s.hasLicenseInfo },
    ],
    performance: [
        { id: 'no_mobile', label: 'Not mobile-optimized', cap: 35, pen: 0, fn: s => !s.isMobileOptimized },
        { id: 'no_img_opt', label: 'Images not optimized', cap: 0, pen: 10, fn: s => !s.hasOptimizedImages },
        { id: 'no_lazy', label: 'No lazy loading', cap: 0, pen: 5, fn: s => !s.hasLazyLoad },
        { id: 'no_cdn', label: 'No CDN detected', cap: 0, pen: 8, fn: s => !s.hasCDN },
        { id: 'no_cache', label: 'No caching strategy', cap: 0, pen: 7, fn: s => !s.hasCaching },
    ],
    discoverability: [
        { id: 'no_gbp', label: 'No Google Business Profile', cap: 30, pen: 0, fn: s => !s.hasGBP },
        { id: 'no_schema', label: 'No schema markup', cap: 0, pen: 12, fn: s => !s.hasSchema },
        { id: 'no_meta', label: 'Missing meta description', cap: 0, pen: 8, fn: s => !s.hasMetaDescription },
        { id: 'no_h1', label: 'Missing or weak H1', cap: 0, pen: 8, fn: s => !s.hasH1 },
        { id: 'no_local_kw', label: 'No local keywords detected', cap: 0, pen: 6, fn: s => !s.hasLocalKeywords },
        { id: 'no_blog', label: 'No blog or content hub', cap: 0, pen: 8, fn: s => !s.hasBlog },
    ],
    ux: [
        { id: 'no_nav', label: 'Poor navigation structure', cap: 0, pen: 12, fn: s => !s.hasGoodNav },
        { id: 'no_mob_menu', label: 'No mobile navigation menu', cap: 40, pen: 0, fn: s => !s.hasMobileMenu },
        { id: 'no_search', label: 'No site search', cap: 0, pen: 5, fn: s => !s.hasSiteSearch },
        { id: 'no_a11y', label: 'No accessibility features', cap: 0, pen: 5, fn: s => !s.hasAccessibility },
    ],
    content: [
        { id: 'thin_content', label: 'Thin homepage content (<300 words)', cap: 42, pen: 0, fn: s => s.wordCount < 300 },
        { id: 'no_services', label: 'No clear service list', cap: 0, pen: 10, fn: s => !s.hasServiceList },
        { id: 'no_faq', label: 'No FAQ section', cap: 0, pen: 7, fn: s => !s.hasFAQ },
        { id: 'no_uvp', label: 'No clear value proposition', cap: 0, pen: 10, fn: s => !s.hasBrandDiff },
        { id: 'no_location', label: 'No location-specific pages', cap: 0, pen: 6, fn: s => !s.hasLocationPages },
        { id: 'no_media', label: 'No video or before/after content', cap: 0, pen: 5, fn: s => !s.hasVideoContent && !s.hasBeforeAfterPhotos },
    ],
    data: [
        { id: 'no_analytics', label: 'No analytics platform', cap: 22, pen: 0, fn: s => !s.hasAnalytics },
        { id: 'no_pixel', label: 'No remarketing pixel', cap: 0, pen: 15, fn: s => !s.hasPixel },
        { id: 'no_gtm', label: 'No tag manager', cap: 0, pen: 5, fn: s => !s.hasTagManager },
        { id: 'no_heatmap', label: 'No heatmap or session tool', cap: 0, pen: 5, fn: s => !s.hasHeatmaps },
    ],
    technical: [
        { id: 'no_cms', label: 'No CMS detected', cap: 0, pen: 8, fn: s => !s.hasCMS },
        { id: 'no_sitemap', label: 'No XML sitemap', cap: 0, pen: 7, fn: s => !s.hasXMLSitemap },
        { id: 'no_structured', label: 'No structured data', cap: 0, pen: 5, fn: s => !s.hasStructuredData },
    ],
    brand: [
        { id: 'no_logo', label: 'No logo detected', cap: 25, pen: 0, fn: s => !s.hasLogo },
        { id: 'no_tagline', label: 'No tagline or brand statement', cap: 0, pen: 8, fn: s => !s.hasTagline },
        { id: 'no_diff', label: 'Weak brand differentiation', cap: 0, pen: 10, fn: s => !s.hasBrandDiff },
    ],
    scalability: [
        { id: 'no_crm', label: 'No CRM integration detected', cap: 0, pen: 10, fn: s => !s.hasCRMIntegration },
        { id: 'no_tracking', label: 'Missing conversion tracking', cap: 0, pen: 10, fn: s => !s.hasAnalytics && !s.hasTagManager },
    ],
};
// ── Apply Rules (Bug 2 fixed) ──────────────────────────────────────────────────
// Previously pen accumulated before each push so rule N's stored finalScore
// included all prior penalties, making the audit trace numbers wrong.
// Fix: each AppliedRule now stores the true state AFTER this rule is applied,
// not a mid-loop snapshot. Actual pillar scoring in computePillarScores is
// unchanged and was always correct.
function applyRules(signals) {
    var _a, _b;
    const caps = {};
    const penalties = {};
    const applied = [];
    for (const [pillarId, rules] of Object.entries(exports.RULES)) {
        let cap = 100;
        let pen = 0;
        for (const rule of rules) {
            if (rule.fn(signals)) {
                const base = Math.min(100, (_b = (_a = baseScorers[pillarId]) === null || _a === void 0 ? void 0 : _a.call(baseScorers, signals)) !== null && _b !== void 0 ? _b : 50);
                // Apply this rule's contribution before recording
                if (rule.cap > 0 && rule.cap < cap)
                    cap = rule.cap;
                if (rule.pen > 0)
                    pen += rule.pen;
                applied.push({
                    pillarId,
                    rule,
                    type: rule.cap > 0 ? 'CAP' : 'PENALTY',
                    baseScore: Math.min(base, cap), // base clamped by active cap
                    finalScore: Math.max(0, Math.min(cap, base) - pen), // true post-rule score
                });
            }
        }
        if (cap < 100)
            caps[pillarId] = cap;
        if (pen > 0)
            penalties[pillarId] = pen;
    }
    return { caps, penalties, applied };
}
// ── Base Scoring ───────────────────────────────────────────────────────────────
const baseScorers = {
    conversion: s => {
        let n = 10;
        if (s.hasCTA)
            n += 22;
        if (s.hasBooking)
            n += 25;
        if (s.hasContactForm)
            n += 13;
        if (s.hasPricing)
            n += 10;
        if (s.hasGuarantee)
            n += 7;
        if (s.hasLiveChat)
            n += 8;
        if (s.hasOnlinePayment)
            n += 5;
        return n;
    },
    trust: s => {
        let n = 5;
        if (s.hasSSL)
            n += 15;
        if (s.hasContactInfo)
            n += 12;
        if (s.hasAddress)
            n += 10;
        if (s.hasReviews)
            n += 22;
        if (s.hasAboutPage)
            n += 10;
        if (s.hasTeamPhotos)
            n += 8;
        if (s.hasLicenseInfo)
            n += 7;
        if (s.hasAwardsOrCerts)
            n += 6;
        if (s.hasInsuranceInfo)
            n += 5;
        return n;
    },
    performance: s => {
        let n = 35;
        if (s.isMobileOptimized)
            n += 22;
        if (s.hasOptimizedImages)
            n += 13;
        if (s.hasLazyLoad)
            n += 10;
        if (s.hasCDN)
            n += 12;
        if (s.hasCaching)
            n += 8;
        return Math.min(n, 95);
    },
    ux: s => {
        let n = 25;
        if (s.hasGoodNav)
            n += 22;
        if (s.hasMobileMenu)
            n += 18;
        if (s.isMobileOptimized)
            n += 15;
        if (s.hasServiceList)
            n += 8;
        if (s.hasSiteSearch)
            n += 7;
        if (s.hasAccessibility)
            n += 5;
        return n;
    },
    discoverability: s => {
        let n = 10;
        if (s.hasGBP)
            n += 25;
        if (s.hasSchema)
            n += 18;
        if (s.hasMetaDescription)
            n += 13;
        if (s.hasH1)
            n += 10;
        if (s.hasBlog)
            n += 12;
        if (s.hasLocalKeywords)
            n += 12;
        return n;
    },
    content: s => {
        let n = 10;
        if (s.wordCount >= 800)
            n += 25;
        else if (s.wordCount >= 400)
            n += 18;
        else if (s.wordCount >= 300)
            n += 12;
        if (s.hasServiceList)
            n += 18;
        if (s.hasFAQ)
            n += 13;
        if (s.hasBlog)
            n += 10;
        if (s.hasLocationPages)
            n += 8;
        if (s.hasVideoContent)
            n += 8;
        if (s.hasBeforeAfterPhotos)
            n += 8;
        return n;
    },
    data: s => {
        let n = 5;
        if (s.hasAnalytics)
            n += 35;
        if (s.hasPixel)
            n += 25;
        if (s.hasTagManager)
            n += 18;
        if (s.hasHeatmaps)
            n += 10;
        if (s.hasCRMIntegration)
            n += 7;
        return n;
    },
    technical: s => {
        let n = 35;
        if (s.hasSSL)
            n += 18;
        if (s.hasCMS)
            n += 15;
        if (s.hasXMLSitemap)
            n += 12;
        if (s.hasStructuredData)
            n += 12;
        if (s.techStack.length > 0)
            n += 8;
        return Math.min(n, 95);
    },
    brand: s => {
        let n = 20;
        if (s.hasLogo)
            n += 30;
        if (s.hasBrandDiff)
            n += 25;
        if (s.hasTagline)
            n += 15;
        if (s.hasConsistentColors)
            n += 10;
        return n;
    },
    scalability: s => {
        let n = 20;
        if (s.hasCMS)
            n += 30;
        if (s.hasAnalytics)
            n += 18;
        if (s.hasPixel)
            n += 12;
        if (s.hasCRMIntegration)
            n += 15;
        if (s.hasTagManager)
            n += 5;
        return n;
    },
};
function computePillarScores(signals, caps, penalties) {
    var _a, _b;
    const scores = {};
    for (const p of exports.PILLARS) {
        let score = baseScorers[p.id](signals);
        score = Math.min(score, (_a = caps[p.id]) !== null && _a !== void 0 ? _a : 100);
        score = Math.max(0, score - ((_b = penalties[p.id]) !== null && _b !== void 0 ? _b : 0));
        scores[p.id] = Math.round(Math.min(100, Math.max(0, score)));
    }
    return scores;
}
function computeWeightedScore(scores) {
    return Math.round(exports.PILLARS.reduce((acc, p) => acc + scores[p.id] * p.weight, 0));
}
function computeGrade(score) {
    if (score >= 75)
        return { grade: 'A', label: 'Strong Performer' };
    if (score >= 60)
        return { grade: 'B', label: 'Above Average' };
    if (score >= 45)
        return { grade: 'C', label: 'Needs Improvement' };
    return { grade: 'D', label: 'Critical Gaps Found' };
}
// ── Revenue Leakage ────────────────────────────────────────────────────────────
function computeRevenueLeak(scores, monthlyRevenue) {
    const cl = Math.max(0, (100 - scores.conversion) * 0.0025);
    const tl = Math.max(0, (100 - scores.trust) * 0.0015);
    const pl = Math.max(0, (100 - scores.performance) * 0.001);
    const ul = Math.max(0, (100 - scores.ux) * 0.0008);
    const total = Math.min(0.65, cl + tl + pl + ul);
    const totalPct = Math.round(total * 100);
    return {
        totalPct,
        conversionPct: Math.round(cl * 100),
        trustPct: Math.round(tl * 100),
        performancePct: Math.round(pl * 100),
        uxPct: Math.round(ul * 100),
        estimatedMonthlyLoss: monthlyRevenue ? Math.round(monthlyRevenue * total) : undefined,
        breakdown: [
            { label: 'Conversion gaps', pillar: 'conversion', pct: Math.round(cl * 100), icon: '🎯' },
            { label: 'Trust deficit', pillar: 'trust', pct: Math.round(tl * 100), icon: '🛡️' },
            { label: 'Performance friction', pillar: 'performance', pct: Math.round(pl * 100), icon: '⚡' },
            { label: 'UX friction', pillar: 'ux', pct: Math.round(ul * 100), icon: '✨' },
        ].filter(x => x.pct > 0),
    };
}
// ── Confidence ─────────────────────────────────────────────────────────────────
function computeConfidence(signals) {
    const checks = [
        signals.hasSSL, signals.hasGBP, signals.hasAnalytics, signals.hasContactInfo,
        signals.hasSchema, signals.hasMetaDescription, signals.isMobileOptimized,
        signals.hasCMS, signals.hasLogo, signals.hasH1, signals.hasReviews, signals.hasServiceList,
    ];
    const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    const missing = [];
    if (!signals.hasGBP)
        missing.push('Google Business Profile not linked — local SEO data limited');
    if (!signals.hasAnalytics)
        missing.push('No analytics platform detected');
    if (!signals.hasSchema)
        missing.push('No schema markup — rich results unavailable');
    if (signals.estimatedReviewCount == null)
        missing.push('Review count unverified — requires GBP API');
    return { pct, missingSignals: missing };
}
// ── Static Benchmarks ─────────────────────────────────────────────────────────
// Fallback when DB has fewer than 5 records for a vertical.
// Array order matches PILLARS: conversion, trust, performance, ux, discoverability,
// content, data, technical, brand, scalability
exports.STATIC_BENCHMARKS = {
    AUTO_REPAIR: { avg: [50, 46, 54, 50, 44, 43, 38, 48, 40, 36], top: [82, 78, 84, 80, 74, 70, 68, 80, 66, 60] },
    CAR_WASH: { avg: [48, 50, 60, 54, 46, 42, 36, 50, 38, 34], top: [80, 82, 88, 84, 72, 68, 66, 82, 62, 58] },
    RESTAURANT: { avg: [54, 60, 58, 62, 50, 58, 44, 54, 52, 42], top: [85, 88, 86, 90, 76, 84, 72, 82, 78, 68] },
    HOME_SERVICES: { avg: [46, 48, 52, 48, 42, 40, 36, 46, 38, 34], top: [78, 80, 82, 78, 72, 70, 64, 78, 64, 58] },
    LOCAL_SERVICE: { avg: [48, 48, 54, 50, 44, 42, 38, 48, 40, 36], top: [80, 80, 84, 80, 72, 70, 66, 80, 64, 60] },
    DENTAL: { avg: [52, 62, 56, 58, 46, 50, 40, 52, 44, 38], top: [84, 90, 86, 88, 74, 78, 70, 82, 72, 65] },
    LEGAL: { avg: [50, 65, 55, 56, 44, 55, 38, 50, 50, 38], top: [82, 92, 84, 86, 72, 80, 68, 80, 78, 64] },
    REAL_ESTATE: { avg: [58, 58, 60, 62, 50, 56, 48, 56, 52, 44], top: [86, 86, 88, 90, 78, 82, 76, 84, 78, 70] },
    FITNESS: { avg: [55, 54, 62, 60, 48, 50, 42, 54, 50, 42], top: [84, 82, 90, 88, 76, 76, 70, 82, 76, 68] },
    BEAUTY_SALON: { avg: [50, 55, 58, 58, 44, 48, 38, 50, 48, 38], top: [80, 84, 86, 86, 72, 74, 66, 78, 74, 64] },
    PLUMBING: { avg: [44, 46, 52, 48, 42, 40, 34, 46, 38, 34], top: [76, 78, 82, 78, 70, 68, 62, 76, 62, 58] },
    HVAC: { avg: [46, 48, 53, 50, 43, 42, 36, 48, 40, 36], top: [78, 80, 83, 80, 72, 70, 64, 78, 64, 60] },
    LANDSCAPING: { avg: [44, 46, 52, 48, 40, 40, 34, 46, 38, 32], top: [76, 78, 82, 78, 68, 68, 62, 76, 62, 56] },
    CLEANING: { avg: [46, 48, 54, 50, 42, 42, 36, 48, 40, 34], top: [78, 80, 84, 80, 70, 70, 64, 78, 64, 58] },
    PET_SERVICES: { avg: [50, 52, 56, 55, 44, 48, 38, 50, 44, 38], top: [80, 82, 86, 84, 72, 74, 66, 78, 70, 64] },
};
const VERTICAL_GROUP = {
    RESTAURANT: 'food_retail',
    CAR_WASH: 'food_retail',
    PET_SERVICES: 'food_retail',
    CLEANING: 'trades_home',
    LANDSCAPING: 'trades_home',
    PLUMBING: 'trades_home',
    HVAC: 'trades_home',
    HOME_SERVICES: 'trades_home',
    AUTO_REPAIR: 'trades_home',
    DENTAL: 'health_legal',
    LEGAL: 'health_legal',
    REAL_ESTATE: 'health_legal',
    LOCAL_SERVICE: 'health_legal',
    FITNESS: 'beauty_fitness',
    BEAUTY_SALON: 'beauty_fitness',
};
const RECS_BY_GROUP = {
    food_retail: [
        { pillar: 'conversion', tab: 'revenue_leaks', icon: '🗓️', iconColor: 'red', impact: 'Very High', effort: 'Medium', timeframe: '0–30 days', title: 'Add online ordering or table booking', desc: 'Restaurants and food businesses with online ordering see 40%+ higher revenue per customer. Visitors who can\'t order or book instantly go to whoever makes it effortless.' },
        { pillar: 'conversion', tab: 'revenue_leaks', icon: '📍', iconColor: 'red', impact: 'High', effort: 'Low', timeframe: '0–7 days', title: 'Move your primary action above the fold', desc: 'Order Now, Book a Table, or Get a Quote needs to be visible in the first screen. You\'re losing customers in the first 3 seconds every single day.' },
        { pillar: 'trust', tab: 'revenue_leaks', icon: '⭐', iconColor: 'red', impact: 'Very High', effort: 'Low', timeframe: '0–14 days', title: 'Display Google and Yelp reviews prominently', desc: '93% of diners check reviews before choosing. No visible ratings at the top of your page = customers comparing you unfavorably against competitors who do show them.' },
        { pillar: 'discoverability', tab: 'revenue_leaks', icon: '🗺️', iconColor: 'red', impact: 'Very High', effort: 'Low', timeframe: '0–7 days', title: 'Complete your Google Business Profile', desc: 'GBP shows your hours, photos, menu, and reviews directly in search results. Incomplete listings lose customers to competitors with complete ones before anyone even clicks.' },
        { pillar: 'performance', tab: 'revenue_leaks', icon: '📱', iconColor: 'red', impact: 'High', effort: 'Medium', timeframe: '0–30 days', title: 'Fix mobile loading speed', desc: '70% of restaurant searches happen on mobile, often right before dining decisions. A slow-loading menu or booking page sends hungry customers to your competitor.' },
        { pillar: 'trust', tab: 'quick_wins', icon: '🔒', iconColor: 'green', impact: 'High', effort: 'Low', timeframe: '0–3 days', title: 'Add SSL / HTTPS', desc: 'Browsers show a security warning on non-HTTPS sites. For food businesses, this kills trust at the exact moment someone is deciding whether to order.' },
        { pillar: 'data', tab: 'quick_wins', icon: '📊', iconColor: 'green', impact: 'High', effort: 'Low', timeframe: '0–3 days', title: 'Install Google Analytics 4', desc: 'Free and 30 minutes to set up. You need to know whether customers find you through search, maps, or social — so you know where to invest.' },
        { pillar: 'content', tab: 'quick_wins', icon: '📋', iconColor: 'green', impact: 'Medium', effort: 'Low', timeframe: '0–7 days', title: 'Add a scannable menu or service list', desc: 'Visitors need to know what you offer in under 10 seconds. A clear, well-structured menu or service list is the #1 conversion lever for food and retail businesses.' },
        { pillar: 'conversion', tab: 'quick_wins', icon: '📬', iconColor: 'green', impact: 'Medium', effort: 'Low', timeframe: '0–7 days', title: 'Add a contact or inquiry form', desc: 'Not everyone calls. A form captures leads 24/7 — especially for catering inquiries, group bookings, and special event requests.' },
        { pillar: 'trust', tab: 'quick_wins', icon: '📍', iconColor: 'green', impact: 'Medium', effort: 'Low', timeframe: '0–3 days', title: 'Show address and hours prominently', desc: 'People need to know you\'re real and nearby. Address and hours in the header remove friction for anyone deciding whether to visit.' },
        { pillar: 'discoverability', tab: 'high_impact', icon: '🏗️', iconColor: 'blue', impact: 'High', effort: 'Medium', timeframe: '30–60 days', title: 'Add Restaurant or LocalBusiness schema', desc: 'Schema markup enables star ratings, price range, cuisine type, and hours directly in Google search results — giving you more real estate and higher click-through.' },
        { pillar: 'data', tab: 'high_impact', icon: '🎯', iconColor: 'blue', impact: 'Very High', effort: 'Low', timeframe: '30–60 days', title: 'Install Meta Pixel and run retargeting', desc: 'Someone who looked at your menu but didn\'t order is a warm lead. Retargeting them on Instagram and Facebook with a photo of your best dish converts at 4–6× the rate of cold ads.' },
        { pillar: 'content', tab: 'high_impact', icon: '✍️', iconColor: 'blue', impact: 'High', effort: 'High', timeframe: '30–90 days', title: 'Build a local content and photo strategy', desc: 'High-quality food photos and local blog content (neighborhood guides, seasonal menus, event recaps) drive consistent organic search traffic and social sharing.' },
        { pillar: 'trust', tab: 'high_impact', icon: '👥', iconColor: 'blue', impact: 'Medium', effort: 'Low', timeframe: '30–60 days', title: 'Add staff and kitchen photos', desc: 'Customers trust places where they can see the people and the space. Authentic behind-the-scenes photos outperform stock imagery every time.' },
        { pillar: 'data', tab: 'high_impact', icon: '🔁', iconColor: 'blue', impact: 'High', effort: 'Medium', timeframe: '30–60 days', title: 'Set up conversion tracking for orders', desc: 'Tag your order confirmation page and booking completion as GA4 goals. This tells you exactly which traffic source drives actual revenue — not just visits.' },
    ],
    trades_home: [
        { pillar: 'conversion', tab: 'revenue_leaks', icon: '🗓️', iconColor: 'red', impact: 'Very High', effort: 'Medium', timeframe: '0–30 days', title: 'Add online scheduling or quote request', desc: 'Home service customers want to schedule without calling. Competitors using Jobber, ServiceTitan, or Calendly are capturing the same leads you\'re losing to voicemail.' },
        { pillar: 'conversion', tab: 'revenue_leaks', icon: '📍', iconColor: 'red', impact: 'High', effort: 'Low', timeframe: '0–7 days', title: 'Put a call or quote CTA above the fold', desc: 'Trades customers decide fast. If your phone number or "Get a Quote" button isn\'t visible without scrolling, you\'re losing the most motivated prospects.' },
        { pillar: 'trust', tab: 'revenue_leaks', icon: '⭐', iconColor: 'red', impact: 'Very High', effort: 'Low', timeframe: '0–14 days', title: 'Feature reviews and completed job photos', desc: '87% of homeowners check reviews before hiring a trades business. Before/after photos of completed jobs are the single most powerful trust signal in your category.' },
        { pillar: 'discoverability', tab: 'revenue_leaks', icon: '🗺️', iconColor: 'red', impact: 'Very High', effort: 'Low', timeframe: '0–7 days', title: 'Optimize Google Business Profile', desc: 'Homeowners search "plumber near me" when something breaks. A complete, photo-rich GBP with fresh reviews gets you into the Local 3-Pack that captures 60% of clicks.' },
        { pillar: 'performance', tab: 'revenue_leaks', icon: '📱', iconColor: 'red', impact: 'High', effort: 'Medium', timeframe: '0–30 days', title: 'Fix mobile speed and call button', desc: 'Most homeowners search on mobile during an emergency. A slow page or a phone number that isn\'t click-to-call costs you the job before you ever pick up the phone.' },
        { pillar: 'trust', tab: 'quick_wins', icon: '🔒', iconColor: 'green', impact: 'High', effort: 'Low', timeframe: '0–3 days', title: 'Show license, insurance, and warranty', desc: 'Homeowners won\'t hire an unlicensed contractor. Your license number, insurance confirmation, and any warranty you offer should be visible on your homepage.' },
        { pillar: 'data', tab: 'quick_wins', icon: '📊', iconColor: 'green', impact: 'High', effort: 'Low', timeframe: '0–3 days', title: 'Install Google Analytics 4', desc: 'You need to know which zip codes your customers are coming from, what services they searched for, and which season your site traffic peaks. Free and essential.' },
        { pillar: 'content', tab: 'quick_wins', icon: '📋', iconColor: 'green', impact: 'Medium', effort: 'Low', timeframe: '0–7 days', title: 'List every service with a one-line description', desc: 'Don\'t make homeowners guess whether you do what they need. A specific service list — with service area — improves both conversion and local SEO ranking.' },
        { pillar: 'conversion', tab: 'quick_wins', icon: '📬', iconColor: 'green', impact: 'Medium', effort: 'Low', timeframe: '0–7 days', title: 'Add a quote request form', desc: 'Many homeowners prefer not to call — especially for larger or more complex jobs. A form that asks the right qualifying questions saves you time and captures more leads.' },
        { pillar: 'trust', tab: 'quick_wins', icon: '📍', iconColor: 'green', impact: 'Medium', effort: 'Low', timeframe: '0–3 days', title: 'Add service area and physical address', desc: 'Homeowners want to know you\'re local. Show your service radius, covered zip codes, or city list — and a real business address if you have one.' },
        { pillar: 'discoverability', tab: 'high_impact', icon: '🏗️', iconColor: 'blue', impact: 'High', effort: 'Medium', timeframe: '30–60 days', title: 'Add LocalBusiness + Service schema', desc: 'Schema markup helps Google display your services, service area, and reviews in rich search results — giving you visual prominence over competitors without it.' },
        { pillar: 'data', tab: 'high_impact', icon: '🎯', iconColor: 'blue', impact: 'Very High', effort: 'Low', timeframe: '30–60 days', title: 'Install Meta Pixel for re-engagement', desc: 'Someone who visited your site but didn\'t call is a warm lead. A retargeting campaign showing a completed job photo or a seasonal offer converts them days later.' },
        { pillar: 'content', tab: 'high_impact', icon: '✍️', iconColor: 'blue', impact: 'High', effort: 'High', timeframe: '30–90 days', title: 'Build service + location landing pages', desc: 'One page per service × one page per key city = compound local SEO. "AC repair Austin" and "AC repair Dallas" should be separate pages, each ranking for their term.' },
        { pillar: 'trust', tab: 'high_impact', icon: '👥', iconColor: 'blue', impact: 'Medium', effort: 'Low', timeframe: '30–60 days', title: 'Add team photos and technician bios', desc: 'People are letting you into their home. Showing real faces with names and years of experience removes the biggest objection in your category: "who is showing up?"' },
        { pillar: 'data', tab: 'high_impact', icon: '🔁', iconColor: 'blue', impact: 'High', effort: 'Medium', timeframe: '30–60 days', title: 'Track quote requests as GA4 conversions', desc: 'Tag your quote form submission and thank-you page as GA4 goals. This tells you exactly what marketing drove a booked job — not just a site visit.' },
    ],
    health_legal: [
        { pillar: 'conversion', tab: 'revenue_leaks', icon: '🗓️', iconColor: 'red', impact: 'Very High', effort: 'Medium', timeframe: '0–30 days', title: 'Add online appointment scheduling', desc: 'Dental practices and legal firms with online booking fill 30% more appointments. Patients and clients won\'t leave a voicemail — they\'ll book with whoever makes it instant.' },
        { pillar: 'conversion', tab: 'revenue_leaks', icon: '📍', iconColor: 'red', impact: 'High', effort: 'Low', timeframe: '0–7 days', title: 'Make your primary action impossible to miss', desc: 'Book a Consultation, Schedule an Appointment, or Get a Free Case Review needs to be above the fold. High-value clients make fast decisions about who to contact first.' },
        { pillar: 'trust', tab: 'revenue_leaks', icon: '⭐', iconColor: 'red', impact: 'Very High', effort: 'Low', timeframe: '0–14 days', title: 'Show credentials, reviews, and awards', desc: 'Patients and legal clients are making high-stakes decisions. Displaying verified credentials, board certifications, bar admissions, and genuine reviews is non-negotiable for trust.' },
        { pillar: 'discoverability', tab: 'revenue_leaks', icon: '🗺️', iconColor: 'red', impact: 'Very High', effort: 'Low', timeframe: '0–7 days', title: 'Claim and optimize Google Business Profile', desc: 'Healthcare and legal searches have the highest local intent of any category. A complete GBP with specialties, hours, and recent reviews puts you in front of patients actively seeking care.' },
        { pillar: 'performance', tab: 'revenue_leaks', icon: '📱', iconColor: 'red', impact: 'High', effort: 'Medium', timeframe: '0–30 days', title: 'Fix mobile performance and readability', desc: 'Over 60% of health and legal searches happen on mobile. A slow, hard-to-read site communicates exactly the wrong thing about the quality of your practice.' },
        { pillar: 'trust', tab: 'quick_wins', icon: '🔒', iconColor: 'green', impact: 'High', effort: 'Low', timeframe: '0–3 days', title: 'Ensure HTTPS and display trust seals', desc: 'Patients and clients sharing personal and legal information need to see HTTPS. Display your BBB rating, HIPAA compliance badge, or bar association membership prominently.' },
        { pillar: 'data', tab: 'quick_wins', icon: '📊', iconColor: 'green', impact: 'High', effort: 'Low', timeframe: '0–3 days', title: 'Install Google Analytics 4', desc: 'You need to know which services drive the most appointment requests, which search terms bring your highest-value clients, and how people navigate your site before converting.' },
        { pillar: 'content', tab: 'quick_wins', icon: '📋', iconColor: 'green', impact: 'Medium', effort: 'Low', timeframe: '0–7 days', title: 'List your practice areas or specialties', desc: 'Patients and clients need to immediately confirm you handle their specific situation. Clear specialty pages with plain-language descriptions reduce the #1 reason people leave without contacting.' },
        { pillar: 'conversion', tab: 'quick_wins', icon: '📬', iconColor: 'green', impact: 'Medium', effort: 'Low', timeframe: '0–7 days', title: 'Add a confidential inquiry or intake form', desc: 'Many clients won\'t call about a sensitive legal or health matter. A discreet form with a clear privacy statement captures leads who would otherwise leave without contacting.' },
        { pillar: 'trust', tab: 'quick_wins', icon: '📍', iconColor: 'green', impact: 'Medium', effort: 'Low', timeframe: '0–3 days', title: 'Show office location and parking info', desc: 'First-time patients and clients are often anxious. Knowing exactly where you are, where to park, and what to expect on arrival reduces friction at every step.' },
        { pillar: 'discoverability', tab: 'high_impact', icon: '🏗️', iconColor: 'blue', impact: 'High', effort: 'Medium', timeframe: '30–60 days', title: 'Add Physician, Attorney, or LocalBusiness schema', desc: 'Structured data markup enables specialties, education, accepted insurance, and reviews to appear directly in Google results — establishing authority before the click.' },
        { pillar: 'data', tab: 'high_impact', icon: '🎯', iconColor: 'blue', impact: 'Very High', effort: 'Low', timeframe: '30–60 days', title: 'Run education-based retargeting ads', desc: 'Someone who read about a procedure or legal situation but didn\'t book is researching. Retargeting them with an educational resource or consultation offer converts at 3–5× cold traffic.' },
        { pillar: 'content', tab: 'high_impact', icon: '✍️', iconColor: 'blue', impact: 'High', effort: 'High', timeframe: '30–90 days', title: 'Build condition or practice area content hubs', desc: 'One in-depth page per condition, procedure, or practice area builds topical authority with Google and answers the questions patients and clients are already asking.' },
        { pillar: 'trust', tab: 'high_impact', icon: '👥', iconColor: 'blue', impact: 'Medium', effort: 'Low', timeframe: '30–60 days', title: 'Add professional bios with real photos', desc: 'Patients and clients are choosing to trust a specific person with their health or legal situation. Real headshots, credentials, and genuine background stories convert.' },
        { pillar: 'data', tab: 'high_impact', icon: '🔁', iconColor: 'blue', impact: 'High', effort: 'Medium', timeframe: '30–60 days', title: 'Track appointment bookings as conversions', desc: 'Configure GA4 to fire a conversion event when a booking is confirmed. This is the only way to know which channels and which pages actually drive new patients or clients.' },
    ],
    beauty_fitness: [
        { pillar: 'conversion', tab: 'revenue_leaks', icon: '🗓️', iconColor: 'red', impact: 'Very High', effort: 'Medium', timeframe: '0–30 days', title: 'Add online class or appointment booking', desc: 'Fitness studios and salons using Mindbody, Vagaro, or Acuity fill 35% more slots than those that require a call. Your competitors\' clients are booking online right now.' },
        { pillar: 'conversion', tab: 'revenue_leaks', icon: '📍', iconColor: 'red', impact: 'High', effort: 'Low', timeframe: '0–7 days', title: 'Lead with your offer above the fold', desc: 'Book Your First Class Free, New Client Special, or Reserve Your Spot needs to be the first thing visitors see. Impulse-driven categories lose 60% of visitors in the first scroll.' },
        { pillar: 'trust', tab: 'revenue_leaks', icon: '⭐', iconColor: 'red', impact: 'Very High', effort: 'Low', timeframe: '0–14 days', title: 'Display before/after results and reviews', desc: 'Social proof is the entire purchase decision in beauty and fitness. Transformation photos, authentic client testimonials, and a visible star rating are your primary conversion tools.' },
        { pillar: 'discoverability', tab: 'revenue_leaks', icon: '🗺️', iconColor: 'red', impact: 'Very High', effort: 'Low', timeframe: '0–7 days', title: 'Optimize Google Business Profile with photos', desc: 'Beauty and fitness searches have massive local intent. A GBP with current photos, class schedule, pricing, and 4.5+ star reviews puts you in the Local 3-Pack your competitors are fighting for.' },
        { pillar: 'performance', tab: 'revenue_leaks', icon: '📱', iconColor: 'red', impact: 'High', effort: 'Medium', timeframe: '0–30 days', title: 'Make your booking flow seamless on mobile', desc: '80% of beauty and fitness discovery happens on Instagram and Google — both mobile. If your booking flow has friction or loads slowly, you\'re losing clients at the moment of intent.' },
        { pillar: 'trust', tab: 'quick_wins', icon: '🔒', iconColor: 'green', impact: 'High', effort: 'Low', timeframe: '0–3 days', title: 'Add SSL and display certifications', desc: 'Personal training certifications, cosmetology licenses, and safety protocol badges build immediate trust. They signal you\'re a real professional, not a hobbyist.' },
        { pillar: 'data', tab: 'quick_wins', icon: '📊', iconColor: 'green', impact: 'High', effort: 'Low', timeframe: '0–3 days', title: 'Install Google Analytics 4', desc: 'You need to know whether customers find you through Instagram, Google, or word-of-mouth — and which services they look at before booking. Free and takes 30 minutes.' },
        { pillar: 'content', tab: 'quick_wins', icon: '📋', iconColor: 'green', impact: 'Medium', effort: 'Low', timeframe: '0–7 days', title: 'List every class, service, and pricing', desc: 'Visitors want to know exactly what you offer and what it costs before they book. Clear service menus with prices outperform "contact for pricing" every time in this category.' },
        { pillar: 'conversion', tab: 'quick_wins', icon: '📬', iconColor: 'green', impact: 'Medium', effort: 'Low', timeframe: '0–7 days', title: 'Add a new client intro offer form', desc: 'Capture leads who aren\'t ready to book today with a "Try your first class for free" or "New client consultation" form. Follow up with an email sequence to convert them.' },
        { pillar: 'trust', tab: 'quick_wins', icon: '📍', iconColor: 'green', impact: 'Medium', effort: 'Low', timeframe: '0–3 days', title: 'Show studio location, parking, and hours', desc: 'First-time visitors to a fitness studio or salon need to know what to expect. Clear location info, parking guidance, and what to bring reduce the anxiety that prevents first visits.' },
        { pillar: 'discoverability', tab: 'high_impact', icon: '🏗️', iconColor: 'blue', impact: 'High', effort: 'Medium', timeframe: '30–60 days', title: 'Add HealthClub, BeautySalon, or SportsClub schema', desc: 'Structured data enables your class schedule, pricing, and reviews to appear in rich search results. This gives you more visual prominence than competitors relying on plain blue links.' },
        { pillar: 'data', tab: 'high_impact', icon: '🎯', iconColor: 'blue', impact: 'Very High', effort: 'Low', timeframe: '30–60 days', title: 'Run Instagram and Facebook retargeting', desc: 'Someone who visited your site but didn\'t book is window-shopping. Retargeting them with a transformation photo or a limited-time offer on Instagram converts at 5–8× the rate of cold ads.' },
        { pillar: 'content', tab: 'high_impact', icon: '✍️', iconColor: 'blue', impact: 'High', effort: 'High', timeframe: '30–90 days', title: 'Build a results and transformation content hub', desc: 'Before/after galleries, client success stories, and instructor spotlights drive organic search traffic and social sharing. This is the category where content compounds fastest.' },
        { pillar: 'trust', tab: 'high_impact', icon: '👥', iconColor: 'blue', impact: 'Medium', effort: 'Low', timeframe: '30–60 days', title: 'Feature trainer or stylist profiles with real photos', desc: 'Clients choose a specific trainer or stylist, not just a gym or salon. Individual profiles with photos, specialties, and personality dramatically increase booking rates.' },
        { pillar: 'data', tab: 'high_impact', icon: '🔁', iconColor: 'blue', impact: 'High', effort: 'Medium', timeframe: '30–60 days', title: 'Track class bookings and first-time visits', desc: 'Tag your booking confirmation as a GA4 goal and separate new client vs returning client events. This is how you calculate client acquisition cost and retention rate accurately.' },
    ],
};
function selectRecommendations(scores, vertical) {
    const weak = [...exports.PILLARS].sort((a, b) => scores[a.id] - scores[b.id]).slice(0, 6).map(p => p.id);
    const group = (vertical && VERTICAL_GROUP[vertical]) ? VERTICAL_GROUP[vertical] : 'trades_home';
    const pool = RECS_BY_GROUP[group];
    const f = pool.filter(r => weak.includes(r.pillar));
    return {
        revenue_leaks: f.filter(r => r.tab === 'revenue_leaks').slice(0, 4),
        quick_wins: f.filter(r => r.tab === 'quick_wins').slice(0, 4),
        high_impact: f.filter(r => r.tab === 'high_impact').slice(0, 4),
    };
}
// ── Personalized Roadmap (P2 Fix) ─────────────────────────────────────────────
// Previously: a static list of 18 items returned identically for every business.
// Now: built from the specific rules that fired and actual signal values, so
// a business that already has analytics won't be told to install analytics.
function buildRoadmap(scores, signals, applied) {
    const fired = new Set(applied.map(r => r.rule.id));
    const sprint30 = [];
    if (fired.has('no_gbp'))
        sprint30.push('Claim / optimize Google Business Profile');
    if (fired.has('no_ssl'))
        sprint30.push('Install SSL certificate + redirect HTTP → HTTPS');
    if (fired.has('no_cta'))
        sprint30.push('Add primary CTA button above the fold');
    if (fired.has('no_reviews'))
        sprint30.push('Email last 20 customers requesting a Google review');
    if (fired.has('no_analytics'))
        sprint30.push('Install Google Analytics 4 with conversion tracking');
    if (fired.has('no_form'))
        sprint30.push('Add contact form with confirmation page tracking');
    if (fired.has('no_address'))
        sprint30.push('Add physical address to header and footer');
    if (fired.has('no_contact'))
        sprint30.push('Make phone number click-to-call on mobile');
    const sprint60 = [];
    if (fired.has('no_booking'))
        sprint60.push('Integrate online booking (Calendly, Setmore, or custom)');
    if (fired.has('no_pixel'))
        sprint60.push('Install Meta Pixel and build first retargeting audience');
    if (fired.has('no_schema'))
        sprint60.push('Add LocalBusiness + FAQ schema markup');
    if (fired.has('no_img_opt'))
        sprint60.push('Convert all images to WebP and enable lazy loading');
    if (fired.has('no_team'))
        sprint60.push('Add team / about page with real staff photos and bios');
    if (fired.has('no_services'))
        sprint60.push('Build a clear, specific service list with descriptions');
    if (signals.wordCount < 600)
        sprint60.push('Expand homepage content to 600+ words with local keywords');
    if (fired.has('no_local_kw'))
        sprint60.push('Write 4 location-specific service landing pages');
    const sprint90 = [];
    if (fired.has('no_blog') || scores.content < 50)
        sprint90.push('Launch monthly local content program (4 articles/mo)');
    if (scores.trust < 55)
        sprint90.push('Run active Google review collection via email + SMS');
    if (fired.has('no_pixel') || fired.has('no_gtm'))
        sprint90.push('Set up email lead nurture sequence (5-email welcome flow)');
    sprint90.push('A/B test homepage CTA copy, color, and placement');
    sprint90.push('Configure GA4 conversion goals: calls, form fills, bookings');
    sprint90.push('Run first quarterly competitor benchmark audit');
    // Universal pads if sprints are sparse
    const pad30 = [
        'Audit NAP consistency across all online directories',
        'Verify mobile rendering on real iOS and Android devices',
        'Set up Google Search Console and submit XML sitemap',
    ];
    const pad60 = [
        'Set up Google Search Console and submit XML sitemap',
        'Add FAQ section answering top 5 customer questions',
        'Enable click-to-call tracking in Google Analytics',
    ];
    while (sprint30.length < 4 && pad30.length)
        sprint30.push(pad30.shift());
    while (sprint60.length < 4 && pad60.length)
        sprint60.push(pad60.shift());
    return {
        '30': sprint30.slice(0, 6),
        '60': sprint60.slice(0, 6),
        '90': sprint90.slice(0, 6),
    };
}
