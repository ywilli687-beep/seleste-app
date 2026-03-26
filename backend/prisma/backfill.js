"use strict";
/**
 * Backfill: reads each Business record that has null pillar scores,
 * finds its most recent AuditSnapshot, and writes the 6 missing scores back.
 *
 * Run once after deploying the schema migration:
 *   npm run db:backfill
 */
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
const client_1 = require("@prisma/client");
const db = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting backfill...\n');
        // Find businesses missing any of the 6 new pillar scores
        const businesses = yield db.business.findMany({
            where: {
                OR: [
                    { latestUxScore: null },
                    { latestContentScore: null },
                    { latestDataScore: null },
                    { latestTechnicalScore: null },
                    { latestBrandScore: null },
                    { latestScalabilityScore: null },
                ],
            },
            select: { id: true, domain: true },
        });
        console.log(`Found ${businesses.length} businesses needing backfill\n`);
        let updated = 0;
        let skipped = 0;
        for (const biz of businesses) {
            // Find their most recent audit snapshot (has all 10 scores)
            const snapshot = yield db.auditSnapshot.findFirst({
                where: { businessId: biz.id },
                orderBy: { createdAt: 'desc' },
                select: {
                    uxScore: true,
                    contentScore: true,
                    dataScore: true,
                    technicalScore: true,
                    brandScore: true,
                    scalabilityScore: true,
                },
            });
            if (!snapshot) {
                console.log(`  SKIP ${biz.domain} — no audit snapshot found`);
                skipped++;
                continue;
            }
            yield db.business.update({
                where: { id: biz.id },
                data: {
                    latestUxScore: snapshot.uxScore,
                    latestContentScore: snapshot.contentScore,
                    latestDataScore: snapshot.dataScore,
                    latestTechnicalScore: snapshot.technicalScore,
                    latestBrandScore: snapshot.brandScore,
                    latestScalabilityScore: snapshot.scalabilityScore,
                },
            });
            console.log(`  ✓ ${biz.domain}`);
            updated++;
        }
        console.log(`\nBackfill complete: ${updated} updated, ${skipped} skipped`);
    });
}
main()
    .catch(err => { console.error(err); process.exit(1); })
    .finally(() => db.$disconnect());
