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
const express_1 = require("express");
const zod_1 = require("zod");
const fetcher_1 = require("@/lib/fetcher");
const ai_1 = require("@/lib/ai");
const engine_1 = require("@/lib/engine");
const data_1 = require("@/lib/data");
const router = (0, express_1.Router)();
// ── P2 Fix Gap4: Zod schema replaces manual if-check ──────────────────────────
const AuditSchema = zod_1.z.object({
    url: zod_1.z.string().min(1, 'URL is required'),
    businessName: zod_1.z.string().max(120).optional(),
    location: zod_1.z.string().min(2, 'Location is required').max(120),
    vertical: zod_1.z.enum([
        'AUTO_REPAIR', 'CAR_WASH', 'RESTAURANT', 'HOME_SERVICES', 'LOCAL_SERVICE',
        'DENTAL', 'LEGAL', 'REAL_ESTATE', 'FITNESS', 'BEAUTY_SALON',
        'PLUMBING', 'HVAC', 'LANDSCAPING', 'CLEANING', 'PET_SERVICES',
    ]),
    monthlyRevenue: zod_1.z.number().positive().optional(),
    triggeredBy: zod_1.z.enum(['MANUAL', 'SCHEDULED', 'API', 'BULK_IMPORT']).default('MANUAL'),
    userId: zod_1.z.string().nullable().optional(),
});
// ── P1 Fix Gap3: SSRF protection ──────────────────────────────────────────────
// Blocks requests to private IPs, localhost, and AWS metadata endpoint.
function isSafeUrl(rawUrl) {
    try {
        let url = rawUrl.trim();
        if (!/^https?:\/\//i.test(url))
            url = 'https://' + url;
        const { hostname, protocol } = new URL(url);
        // Must be http or https
        if (!['http:', 'https:'].includes(protocol))
            return false;
        const blocked = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254.169.254'];
        if (blocked.some(b => hostname === b || hostname.endsWith('.' + b)))
            return false;
        // RFC1918 private ranges
        if (/^10\./.test(hostname))
            return false;
        if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname))
            return false;
        if (/^192\.168\./.test(hostname))
            return false;
        if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(hostname))
            return false;
        return true;
    }
    catch (_a) {
        return false;
    }
}
// ── P1 Fix Gap2: Simple in-memory rate limiter ────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT = 10; // max requests
const WINDOW_MS = 60000; // per 60 seconds
function checkRateLimit(ip) {
    const now = Date.now();
    const record = rateLimitMap.get(ip);
    if (!record || now > record.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return true; // allowed
    }
    if (record.count >= RATE_LIMIT)
        return false; // blocked
    record.count++;
    return true; // allowed
}
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        // Rate limit check
        const ip = ((_a = req.headers['x-forwarded-for']) === null || _a === void 0 ? void 0 : _a.split(',')[0].trim()) || req.socket.remoteAddress || 'unknown';
        if (!checkRateLimit(ip)) {
            return res.status(429).json({ success: false, error: 'Too many requests — please wait a minute before trying again.' });
        }
        const body = req.body;
        const parsed = AuditSchema.safeParse(body);
        if (!parsed.success) {
            const msg = (_c = (_b = parsed.error.issues[0]) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : 'Invalid input';
            return res.status(400).json({ success: false, error: msg });
        }
        const rawInput = parsed.data;
        // Normalize and validate URL
        let cleanUrl = rawInput.url.trim();
        if (!/^https?:\/\//i.test(cleanUrl))
            cleanUrl = 'https://' + cleanUrl;
        // SSRF protection
        if (!isSafeUrl(cleanUrl)) {
            return res.status(400).json({ success: false, error: 'Invalid or disallowed URL' });
        }
        const input = Object.assign(Object.assign({}, rawInput), { url: cleanUrl });
        // ── 1. Fetch real page ─────────────────────────────────────────────────────
        const page = yield (0, fetcher_1.fetchPage)(input.url);
        if (page.error && !page.html) {
            return res.status(422).json({ success: false, error: `Could not fetch website: ${page.error}` });
        }
        // ── 2. Hard signals (deterministic, no AI) ────────────────────────────────
        const hard = (0, fetcher_1.extractHardSignals)(page);
        // ── 3. AI signal extraction ───────────────────────────────────────────────
        const signals = yield (0, ai_1.extractSignals)(page.html, page.finalUrl, hard);
        // ── 4. Rules engine ────────────────────────────────────────────────────────
        const { caps, penalties, applied } = (0, engine_1.applyRules)(signals);
        // ── 5. Scoring ─────────────────────────────────────────────────────────────
        const pillarScores = (0, engine_1.computePillarScores)(signals, caps, penalties);
        const overallScore = (0, engine_1.computeWeightedScore)(pillarScores);
        const { grade, label: gradeLabel } = (0, engine_1.computeGrade)(overallScore);
        // ── 6. Analytics ───────────────────────────────────────────────────────────
        const revenueLeak = (0, engine_1.computeRevenueLeak)(pillarScores, input.monthlyRevenue);
        const confidence = (0, engine_1.computeConfidence)(signals);
        const recommendations = (0, engine_1.selectRecommendations)(pillarScores, input.vertical);
        // ── 7. Personalized roadmap (P2 fix — uses actual audit results) ──────────
        const roadmap = (0, engine_1.buildRoadmap)(pillarScores, signals, applied);
        // ── 8. Live benchmark (all 10 pillars now correct after P0 fix) ───────────
        const locationParts = input.location.split(',').map(s => s.trim());
        const state = (_d = locationParts[1]) !== null && _d !== void 0 ? _d : undefined;
        const liveBenchmark = yield (0, data_1.getLiveBenchmark)(input.vertical, state).catch(() => null);
        const benchmark = (_e = liveBenchmark !== null && liveBenchmark !== void 0 ? liveBenchmark : engine_1.STATIC_BENCHMARKS[input.vertical]) !== null && _e !== void 0 ? _e : engine_1.STATIC_BENCHMARKS.LOCAL_SERVICE;
        // ── 9. AI narrative ────────────────────────────────────────────────────────
        const { narrative, quickWins, topIssues } = yield (0, ai_1.writeNarrative)(input, pillarScores, overallScore, signals, applied);
        // ── 10. Persist to database ────────────────────────────────────────────────
        let businessId = '';
        let auditId = '';
        let verticalPercentile;
        let delta = undefined;
        try {
            const business = yield (0, data_1.upsertBusiness)({
                url: page.finalUrl,
                businessName: input.businessName,
                vertical: input.vertical,
                location: input.location,
                overallScore,
                grade,
                pillarScores,
            });
            businessId = business.id;
            yield (0, data_1.upsertBusinessSignals)(businessId, signals);
            delta = yield (0, data_1.computeScoreDelta)(businessId, pillarScores, overallScore);
            verticalPercentile = yield (0, data_1.getVerticalPercentile)(input.vertical, overallScore);
            const resultForDb = {
                auditId: '', // filled after save
                businessId,
                input,
                signals,
                appliedRules: applied,
                pillarScores,
                overallScore,
                grade,
                gradeLabel,
                revenueLeak,
                confidence,
                recommendations,
                benchmark,
                verticalPercentile,
                aiNarrative: narrative,
                aiQuickWins: quickWins,
                aiTopIssues: topIssues,
                roadmap,
                delta,
                createdAt: new Date().toISOString(),
                auditVersion: '2.1', // bumped for this fix release
            };
            const snapshot = yield (0, data_1.saveAuditSnapshot)({
                businessId,
                result: resultForDb,
                delta,
                benchmarkAvg: benchmark.avg,
                benchmarkTop: benchmark.top,
                userId: (_f = input.userId) !== null && _f !== void 0 ? _f : undefined,
            });
            auditId = snapshot.id;
            // Bug 4 fix: trim city/state before passing to updateMarketSegment
            const [city, st] = locationParts;
            (0, data_1.updateMarketSegment)(input.vertical, st, city).catch(err => console.error('[Market Segment Update Error]', err));
        }
        catch (dbErr) {
            // DB errors never block the user from seeing their audit result
            console.error('[DB Error — audit result still returned]', dbErr);
        }
        const result = {
            auditId,
            businessId,
            input,
            signals,
            appliedRules: applied,
            pillarScores,
            overallScore,
            grade,
            gradeLabel,
            revenueLeak,
            confidence,
            recommendations,
            benchmark,
            verticalPercentile,
            aiNarrative: narrative,
            aiQuickWins: quickWins,
            aiTopIssues: topIssues,
            roadmap,
            delta,
            createdAt: new Date().toISOString(),
            auditVersion: '2.1',
        };
        return res.json({ success: true, result });
    }
    catch (err) {
        console.error('[Audit Error]', err);
        return res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Internal server error' });
    }
}));
exports.default = router;
