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
const db_1 = require("@/lib/db");
const router = (0, express_1.Router)();
function getDashboardData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        // All queries run in parallel — 6 parallel DB calls instead of 12+
        const [totalAudits, totalBusinesses, recentAudits, gradeBreakdown, verticalBreakdown, topRules, avgScore, marketSegments, 
        // P3 Fix Gap7: single conditional aggregation replaces 10+ individual count() round trips
        rawSignalStats,] = yield Promise.all([
            db_1.db.auditSnapshot.count(),
            db_1.db.business.count(),
            db_1.db.auditSnapshot.findMany({
                where: { triggeredByUser: userId },
                take: 20,
                orderBy: { createdAt: 'desc' },
                include: { business: { include: { signals: true } } },
            }),
            db_1.db.auditSnapshot.groupBy({
                by: ['grade'],
                _count: { id: true },
                orderBy: { grade: 'asc' },
            }),
            db_1.db.business.groupBy({
                by: ['vertical'],
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
            }),
            db_1.db.appliedRuleRecord.groupBy({
                by: ['ruleId', 'ruleLabel', 'pillarId'],
                _count: { id: true },
                orderBy: { _count: { id: 'desc' } },
                take: 12,
            }),
            db_1.db.auditSnapshot.aggregate({
                _avg: { overallScore: true },
                _min: { overallScore: true },
                _max: { overallScore: true },
            }),
            db_1.db.marketSegment.findMany({
                orderBy: { businessCount: 'desc' },
                take: 8,
            }),
            // One query, one round trip, all 10 signals — conditional aggregation in Postgres
            db_1.db.$queryRaw `
      SELECT signal, label, present, total FROM (VALUES
        ('hasCTA',         'CTA above fold',             (SELECT COUNT(*) FILTER (WHERE "hasCTA")         FROM "BusinessSignals"), (SELECT COUNT(*) FROM "BusinessSignals")),
        ('hasBooking',     'Online booking',             (SELECT COUNT(*) FILTER (WHERE "hasBooking")     FROM "BusinessSignals"), (SELECT COUNT(*) FROM "BusinessSignals")),
        ('hasReviews',     'Reviews displayed',          (SELECT COUNT(*) FILTER (WHERE "hasReviews")     FROM "BusinessSignals"), (SELECT COUNT(*) FROM "BusinessSignals")),
        ('hasGBP',         'Google Business Profile',    (SELECT COUNT(*) FILTER (WHERE "hasGBP")         FROM "BusinessSignals"), (SELECT COUNT(*) FROM "BusinessSignals")),
        ('hasAnalytics',   'Analytics installed',        (SELECT COUNT(*) FILTER (WHERE "hasAnalytics")   FROM "BusinessSignals"), (SELECT COUNT(*) FROM "BusinessSignals")),
        ('hasSSL',         'SSL / HTTPS',                (SELECT COUNT(*) FILTER (WHERE "hasSSL")         FROM "BusinessSignals"), (SELECT COUNT(*) FROM "BusinessSignals")),
        ('hasSchema',      'Schema markup',              (SELECT COUNT(*) FILTER (WHERE "hasSchema")      FROM "BusinessSignals"), (SELECT COUNT(*) FROM "BusinessSignals")),
        ('hasPixel',       'Remarketing pixel',          (SELECT COUNT(*) FILTER (WHERE "hasPixel")       FROM "BusinessSignals"), (SELECT COUNT(*) FROM "BusinessSignals")),
        ('hasPricing',     'Pricing shown',              (SELECT COUNT(*) FILTER (WHERE "hasPricing")     FROM "BusinessSignals"), (SELECT COUNT(*) FROM "BusinessSignals")),
        ('hasContactForm', 'Contact form',               (SELECT COUNT(*) FILTER (WHERE "hasContactForm") FROM "BusinessSignals"), (SELECT COUNT(*) FROM "BusinessSignals"))
      ) AS t(signal, label, present, total)
      ORDER BY present ASC
    `,
        ]);
        // Shape signal stats — sort worst-first (already sorted by ORDER BY present ASC)
        const signalStats = rawSignalStats.map(r => {
            const present = Number(r.present);
            const total = Number(r.total);
            return {
                signal: r.signal,
                label: r.label,
                presentCount: present,
                missingCount: total - present,
                total,
                presentPct: total > 0 ? Math.round((present / total) * 100) : 0,
            };
        });
        return {
            totalAudits,
            totalBusinesses,
            avgScore: Math.round((_a = avgScore._avg.overallScore) !== null && _a !== void 0 ? _a : 0),
            minScore: (_b = avgScore._min.overallScore) !== null && _b !== void 0 ? _b : 0,
            maxScore: (_c = avgScore._max.overallScore) !== null && _c !== void 0 ? _c : 0,
            recentAudits: recentAudits.map((a) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                return ({
                    id: a.id,
                    overallScore: a.overallScore,
                    grade: a.grade,
                    leakagePct: a.leakagePct,
                    createdAt: a.createdAt.toISOString(),
                    scoreDelta: a.scoreDelta,
                    business: {
                        id: a.business.id,
                        domain: a.business.domain,
                        name: (_a = a.business.businessName) !== null && _a !== void 0 ? _a : null,
                        vertical: a.business.vertical,
                        city: (_b = a.business.city) !== null && _b !== void 0 ? _b : null,
                        state: (_c = a.business.state) !== null && _c !== void 0 ? _c : null,
                        hasCTA: (_e = (_d = a.business.signals) === null || _d === void 0 ? void 0 : _d.hasCTA) !== null && _e !== void 0 ? _e : false,
                        hasBooking: (_g = (_f = a.business.signals) === null || _f === void 0 ? void 0 : _f.hasBooking) !== null && _g !== void 0 ? _g : false,
                        hasReviews: (_j = (_h = a.business.signals) === null || _h === void 0 ? void 0 : _h.hasReviews) !== null && _j !== void 0 ? _j : false,
                        hasGBP: (_l = (_k = a.business.signals) === null || _k === void 0 ? void 0 : _k.hasGBP) !== null && _l !== void 0 ? _l : false,
                        hasAnalytics: (_o = (_m = a.business.signals) === null || _m === void 0 ? void 0 : _m.hasAnalytics) !== null && _o !== void 0 ? _o : false,
                    },
                });
            }),
            gradeBreakdown: gradeBreakdown.map((g) => ({
                grade: g.grade,
                count: g._count.id,
            })),
            verticalBreakdown: verticalBreakdown.map((v) => ({
                vertical: v.vertical,
                count: v._count.id,
            })),
            topRules: topRules.map((r) => ({
                ruleId: r.ruleId,
                ruleLabel: r.ruleLabel,
                pillarId: r.pillarId,
                count: r._count.id,
                pct: totalAudits > 0 ? Math.round((r._count.id / totalAudits) * 100) : 0,
            })),
            signalStats,
            marketSegments: marketSegments.map((ms) => {
                var _a, _b;
                return ({
                    segmentKey: ms.segmentKey,
                    vertical: ms.vertical,
                    city: (_a = ms.city) !== null && _a !== void 0 ? _a : null,
                    state: (_b = ms.state) !== null && _b !== void 0 ? _b : null,
                    businessCount: ms.businessCount,
                    avgScore: ms.avgOverallScore ? Math.round(ms.avgOverallScore) : null,
                    opportunityScore: ms.opportunityScore ? Math.round(ms.opportunityScore) : null,
                    pctHasCTA: ms.pctHasCTA ? Math.round(ms.pctHasCTA) : null,
                    pctHasBooking: ms.pctHasBooking ? Math.round(ms.pctHasBooking) : null,
                    pctHasGBP: ms.pctHasGBP ? Math.round(ms.pctHasGBP) : null,
                });
            }),
        };
    });
}
router.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    try {
        const data = yield getDashboardData(userId);
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}));
exports.default = router;
