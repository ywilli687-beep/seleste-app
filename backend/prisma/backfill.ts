/**
 * Backfill: reads each Business record that has null pillar scores,
 * finds its most recent AuditSnapshot, and writes the 6 missing scores back.
 *
 * Run once after deploying the schema migration:
 *   npm run db:backfill
 */

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('Starting backfill...\n')

  // Find businesses missing any of the 6 new pillar scores
  const businesses = await db.business.findMany({
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
  })

  console.log(`Found ${businesses.length} businesses needing backfill\n`)

  let updated = 0
  let skipped = 0

  for (const biz of businesses) {
    // Find their most recent audit snapshot (has all 10 scores)
    const snapshot = await db.auditSnapshot.findFirst({
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
    })

    if (!snapshot) {
      console.log(`  SKIP ${biz.domain} — no audit snapshot found`)
      skipped++
      continue
    }

    await db.business.update({
      where: { id: biz.id },
      data: {
        latestUxScore:          snapshot.uxScore,
        latestContentScore:     snapshot.contentScore,
        latestDataScore:        snapshot.dataScore,
        latestTechnicalScore:   snapshot.technicalScore,
        latestBrandScore:       snapshot.brandScore,
        latestScalabilityScore: snapshot.scalabilityScore,
      },
    })

    console.log(`  ✓ ${biz.domain}`)
    updated++
  }

  console.log(`\nBackfill complete: ${updated} updated, ${skipped} skipped`)
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => db.$disconnect())
