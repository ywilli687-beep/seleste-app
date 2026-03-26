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
const engine_1 = require("@/lib/engine");
const router = (0, express_1.Router)();
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const userId = (_a = req.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const { id } = req.params;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        const snapshot = yield db_1.db.auditSnapshot.findUnique({
            where: { id },
            include: {
                business: true,
                appliedRules: true,
            }
        });
        if (!snapshot) {
            return res.status(404).json({ success: false, error: 'Report not found' });
        }
        // Verify ownership
        if (snapshot.triggeredByUser !== userId) {
            return res.status(403).json({ success: false, error: 'Forbidden. You do not own this report.' });
        }
        // Reconstruct PillarScores
        const pillarScores = {
            conversion: snapshot.conversionScore,
            trust: snapshot.trustScore,
            performance: snapshot.performanceScore,
            ux: snapshot.uxScore,
            discoverability: snapshot.discoverScore,
            content: snapshot.contentScore,
            data: snapshot.dataScore,
            technical: snapshot.technicalScore,
            brand: snapshot.brandScore,
            scalability: snapshot.scalabilityScore,
        };
        // Reconstruct AppliedRules
        const appliedRules = snapshot.appliedRules.map((r) => {
            var _a, _b;
            return ({
                pillarId: r.pillarId,
                rule: { id: r.ruleId, label: r.ruleLabel, cap: (_a = r.capValue) !== null && _a !== void 0 ? _a : 0, pen: (_b = r.penaltyValue) !== null && _b !== void 0 ? _b : 0, fn: () => false }, // Fake fn for now
                type: r.ruleType,
                baseScore: r.baseScore,
                finalScore: r.finalScore,
            });
        });
        // Reconstruct Signals
        const signals = snapshot.signalSnapshot;
        // Reconstruct Benchmark
        const benchmark = {
            avg: snapshot.benchmarkAvg,
            top: snapshot.benchmarkTop,
        };
        // Reconstruct Revenue Leak
        const revenueLeak = {
            totalPct: snapshot.leakagePct,
            estimatedMonthlyLoss: (_b = snapshot.estimatedMonthlyLoss) !== null && _b !== void 0 ? _b : undefined,
            breakdown: [
                { label: 'Conversion Friction', pillar: 'conversion', pct: snapshot.leakageConversion, icon: 'funnel' },
                { label: 'Trust Deficit', pillar: 'trust', pct: snapshot.leakageTrust, icon: 'shield' },
                { label: 'Performance Drag', pillar: 'performance', pct: snapshot.leakagePerformance, icon: 'zap' },
                { label: 'UX Drop-off', pillar: 'ux', pct: snapshot.leakageUX, icon: 'layout' },
            ].filter(b => b.pct > 0),
            conversionPct: snapshot.leakageConversion,
            trustPct: snapshot.leakageTrust,
            performancePct: snapshot.leakagePerformance,
            uxPct: snapshot.leakageUX,
        };
        // Reconstruct Confidence
        const confidence = {
            pct: snapshot.confidencePct,
            missingSignals: snapshot.missingSignals,
        };
        // Recompute Recommendations and Roadmap dynamically
        const recommendations = (0, engine_1.selectRecommendations)(pillarScores, snapshot.inputVertical);
        const roadmap = (0, engine_1.buildRoadmap)(pillarScores, signals, appliedRules);
        const result = {
            auditId: snapshot.id,
            businessId: snapshot.businessId,
            input: {
                url: snapshot.inputUrl,
                location: snapshot.inputLocation,
                vertical: snapshot.inputVertical,
                monthlyRevenue: (_c = snapshot.inputMonthlyRevenue) !== null && _c !== void 0 ? _c : undefined,
            },
            signals,
            appliedRules,
            pillarScores,
            overallScore: snapshot.overallScore,
            grade: snapshot.grade,
            gradeLabel: 'Reconstructed', // Minor string
            revenueLeak,
            confidence,
            recommendations,
            benchmark,
            verticalPercentile: undefined,
            aiNarrative: (_d = snapshot.aiNarrative) !== null && _d !== void 0 ? _d : '',
            aiQuickWins: (_e = snapshot.aiQuickWins) !== null && _e !== void 0 ? _e : [],
            aiTopIssues: (_f = snapshot.aiTopIssues) !== null && _f !== void 0 ? _f : [],
            roadmap,
            delta: snapshot.scoreDelta !== null ? {
                scoreDelta: snapshot.scoreDelta,
                improvedPillars: snapshot.improvedPillars,
                regressedPillars: snapshot.regressedPillars,
                previousAuditId: (_g = snapshot.previousAuditId) !== null && _g !== void 0 ? _g : '',
                previousScore: 0,
                previousDate: '',
            } : undefined,
            createdAt: snapshot.createdAt.toISOString(),
            auditVersion: '2.1',
        };
        return res.json({ success: true, result });
    }
    catch (err) {
        console.error('[GET Report Error]', err);
        return res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Internal server error' });
    }
}));
exports.default = router;
