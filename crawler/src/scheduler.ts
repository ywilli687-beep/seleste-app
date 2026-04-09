/**
 * scheduler.ts — Cron Job Orchestrator
 *
 * Daily 3am UTC   — crawlBatch(500): crawl up to 500 PENDING businesses
 * Weekly Sun 2am  — runDiscovery for all verticals × metro areas
 */
import cron from 'node-cron'
import { crawlBatch } from './crawler'
import { runDiscovery } from './discovery'

// ── Target Matrix ─────────────────────────────────────────────────────────────
// Expand these lists to grow the proprietary data engine.
const VERTICALS = [
  'AUTO_REPAIR', 'DENTAL', 'PLUMBING', 'HVAC', 'LANDSCAPING',
  'FITNESS', 'BEAUTY_SALON', 'CLEANING', 'PET_SERVICES', 'RESTAURANT',
]

const METRO_AREAS = [
  'Austin TX', 'Dallas TX', 'Houston TX', 'San Antonio TX',
  'Phoenix AZ', 'Denver CO', 'Atlanta GA', 'Miami FL',
  'Charlotte NC', 'Nashville TN',
]

// ─────────────────────────────────────────────────────────────────────────────
// startScheduler
// Registers both cron jobs and starts the scheduler.
// Call once from index.ts.
// ─────────────────────────────────────────────────────────────────────────────
export function startScheduler() {
  console.log('[scheduler] Starting Seleste crawler scheduler')

  // ── Daily crawl job — 3:00 AM UTC ─────────────────────────────────────────
  cron.schedule('0 3 * * *', async () => {
    console.log('[scheduler] Daily crawl job started')
    try {
      await crawlBatch(500)
    } catch (err: any) {
      console.error('[scheduler] Daily crawl job failed:', err.message)
    }
  }, { timezone: 'UTC' })

  // ── Weekly discovery job — Sunday 2:00 AM UTC ─────────────────────────────
  cron.schedule('0 2 * * 0', async () => {
    console.log('[scheduler] Weekly discovery job started')
    let total = 0

    for (const vertical of VERTICALS) {
      for (const metroArea of METRO_AREAS) {
        try {
          const added = await runDiscovery(vertical, metroArea, { limit: 50 })
          total += added
          // Brief pause between discovery calls to avoid hammering Outscraper
          await sleep(2000)
        } catch (err: any) {
          console.error(`[scheduler] Discovery failed for ${vertical}/${metroArea}:`, err.message)
        }
      }
    }

    console.log(`[scheduler] Weekly discovery complete. Total new targets: ${total}`)
  }, { timezone: 'UTC' })

  console.log('[scheduler] Jobs registered: daily crawl @ 3am UTC, discovery @ Sun 2am UTC')
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
