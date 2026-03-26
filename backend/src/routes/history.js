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
function getUserHistory(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const audits = yield db_1.db.auditSnapshot.findMany({
            where: { triggeredByUser: userId },
            orderBy: { createdAt: 'desc' },
            take: 100,
            include: {
                business: {
                    select: {
                        id: true, domain: true, businessName: true, vertical: true,
                        city: true, state: true, scoreHistory: true,
                    },
                },
            },
        });
        // Group by business domain — most recent audit per business + full history
        const byDomain = new Map();
        for (const a of audits) {
            const d = a.business.domain;
            if (!byDomain.has(d))
                byDomain.set(d, []);
            byDomain.get(d).push(a);
        }
        return Array.from(byDomain.entries()).map(([domain, snaps]) => {
            var _a, _b, _c;
            const latest = snaps[0];
            const history = snaps.map((s) => ({
                id: s.id,
                createdAt: s.createdAt.toISOString(),
                overallScore: s.overallScore,
                grade: s.grade,
                scoreDelta: s.scoreDelta,
            }));
            return {
                domain,
                businessId: latest.business.id,
                businessName: (_a = latest.business.businessName) !== null && _a !== void 0 ? _a : null,
                vertical: latest.business.vertical,
                city: (_b = latest.business.city) !== null && _b !== void 0 ? _b : null,
                state: (_c = latest.business.state) !== null && _c !== void 0 ? _c : null,
                latestScore: latest.overallScore,
                latestGrade: latest.grade,
                latestLeakage: latest.leakagePct,
                lastAuditedAt: latest.createdAt.toISOString(),
                auditCount: snaps.length,
                history,
            };
        });
    });
}
router.get('/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    try {
        const businesses = yield getUserHistory(userId);
        res.json({ success: true, businesses });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}));
exports.default = router;
