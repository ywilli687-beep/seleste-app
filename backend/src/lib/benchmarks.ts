import { db } from '@/lib/db'

const PILLARS = [
  'conversion', 'seo', 'reputation', 'content',
  'ux', 'mobile', 'trust', 'performance', 'local', 'accessibility',
]

// Maps pillar names to the actual AuditSnapshot score columns
const PILLAR_COLUMN_MAP: Record<string, string> = {
  conversion:    'conversionScore',
  seo:           'discoverScore',
  reputation:    'trustScore',
  content:       'contentScore',
  ux:            'uxScore',
  mobile:        'performanceScore',
  trust:         'trustScore',
  performance:   'performanceScore',
  local:         'discoverScore',
  accessibility: 'uxScore',
}

// Maps pillar names to CrawlerSnapshot score columns (different naming convention)
const CRAWLER_PILLAR_COLUMN_MAP: Record<string, string> = {
  conversion:    'conversionScore',
  seo:           'seoScore',
  reputation:    'reputationScore',
  content:       'contentScore',
  ux:            'uxScore',
  mobile:        'mobileScore',
  trust:         'trustScore',
  performance:   'performanceScore',
  local:         'localScore',
  accessibility: 'accessibilityScore',
}

export interface PillarStats {
  mean: number
  median: number
  p25: number
  p75: number
  p90: number
  sampleSize: number
}

export interface BenchmarkContext {
  vertical: Record<string, PillarStats | null>
  market: Record<string, PillarStats | null> | null
}

// ─────────────────────────────────────────────────────────────────────────────
// computeAndStoreBenchmarks
// Queries AuditSnapshot data and upserts VerticalBenchmark + MarketBenchmark rows.
// Never throws — benchmark failures must not affect the audit flow.
// ─────────────────────────────────────────────────────────────────────────────

export async function computeAndStoreBenchmarks(): Promise<void> {
  try {
    let verticalCount = 0
    let marketCount = 0

    // ── Vertical benchmarks (grouped by vertical + pillar) ──
    for (const pillar of PILLARS) {
      const col = PILLAR_COLUMN_MAP[pillar]

      const crawlerCol = CRAWLER_PILLAR_COLUMN_MAP[pillar]

      // Get all distinct verticals that have enough data (across both tables)
      const verticals = await db.$queryRawUnsafe<{ vertical: string }[]>(`
        SELECT DISTINCT vertical FROM "AuditSnapshot"
        WHERE vertical IS NOT NULL AND "${col}" IS NOT NULL
        UNION
        SELECT DISTINCT vertical FROM "CrawlerSnapshot"
        WHERE vertical IS NOT NULL AND "${crawlerCol}" IS NOT NULL
      `)

      for (const { vertical } of verticals) {
        const rows = await db.$queryRawUnsafe<{
          sample_size: bigint
          mean: number
          median: number
          p25: number
          p75: number
          p90: number
        }[]>(`
          SELECT
            COUNT(*) AS sample_size,
            AVG(score) AS mean,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY score) AS median,
            PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY score) AS p25,
            PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY score) AS p75,
            PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY score) AS p90
          FROM (
            SELECT "${col}" AS score FROM "AuditSnapshot"
            WHERE vertical = $1 AND "${col}" IS NOT NULL
            UNION ALL
            SELECT "${crawlerCol}" AS score FROM "CrawlerSnapshot"
            WHERE vertical = $1 AND "${crawlerCol}" IS NOT NULL
          ) combined
        `, vertical)

        const row = rows[0]
        if (!row) continue
        const sampleSize = Number(row.sample_size)
        if (sampleSize < 5) continue

        await db.verticalBenchmark.upsert({
          where: { vertical_pillar: { vertical, pillar } },
          create: {
            vertical,
            pillar,
            sampleSize,
            mean: Number(row.mean),
            median: Number(row.median),
            p25: Number(row.p25),
            p75: Number(row.p75),
            p90: Number(row.p90),
            computedAt: new Date(),
          },
          update: {
            sampleSize,
            mean: Number(row.mean),
            median: Number(row.median),
            p25: Number(row.p25),
            p75: Number(row.p75),
            p90: Number(row.p90),
            computedAt: new Date(),
          },
        })
        verticalCount++
      }
    }

    // ── Market benchmarks (grouped by vertical + metroArea + pillar) ──
    for (const pillar of PILLARS) {
      const col = PILLAR_COLUMN_MAP[pillar]
      const crawlerCol = CRAWLER_PILLAR_COLUMN_MAP[pillar]

      const markets = await db.$queryRawUnsafe<{ vertical: string; metro_area: string }[]>(`
        SELECT DISTINCT vertical, "metroArea" AS metro_area
        FROM "AuditSnapshot"
        WHERE vertical IS NOT NULL AND "metroArea" IS NOT NULL AND "${col}" IS NOT NULL
        UNION
        SELECT DISTINCT vertical, "metroArea" AS metro_area
        FROM "CrawlerSnapshot"
        WHERE vertical IS NOT NULL AND "metroArea" IS NOT NULL AND "${crawlerCol}" IS NOT NULL
      `)

      for (const { vertical, metro_area } of markets) {
        const rows = await db.$queryRawUnsafe<{
          sample_size: bigint
          mean: number
          median: number
          p75: number
        }[]>(`
          SELECT
            COUNT(*) AS sample_size,
            AVG(score) AS mean,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY score) AS median,
            PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY score) AS p75
          FROM (
            SELECT "${col}" AS score FROM "AuditSnapshot"
            WHERE vertical = $1 AND "metroArea" = $2 AND "${col}" IS NOT NULL
            UNION ALL
            SELECT "${crawlerCol}" AS score FROM "CrawlerSnapshot"
            WHERE vertical = $1 AND "metroArea" = $2 AND "${crawlerCol}" IS NOT NULL
          ) combined
        `, vertical, metro_area)

        const row = rows[0]
        if (!row) continue
        const sampleSize = Number(row.sample_size)
        if (sampleSize < 3) continue

        await db.marketBenchmark.upsert({
          where: { vertical_metroArea_pillar: { vertical, metroArea: metro_area, pillar } },
          create: {
            vertical,
            metroArea: metro_area,
            pillar,
            sampleSize,
            mean: Number(row.mean),
            median: Number(row.median),
            p75: Number(row.p75),
            computedAt: new Date(),
          },
          update: {
            sampleSize,
            mean: Number(row.mean),
            median: Number(row.median),
            p75: Number(row.p75),
            computedAt: new Date(),
          },
        })
        marketCount++
      }
    }

    console.log(`Benchmarks computed: ${verticalCount} vertical rows, ${marketCount} market rows`)
  } catch (err) {
    console.error('[benchmarks] computeAndStoreBenchmarks failed:', err)
    // Never rethrow — benchmark failures must not affect audit flow
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getBenchmarkContext
// Returns benchmark stats for a given vertical (and optionally metro area).
// Returns null for any pillar with no benchmark data yet (graceful degradation).
// ─────────────────────────────────────────────────────────────────────────────

export async function getBenchmarkContext(
  vertical: string,
  metroArea: string | null,
): Promise<BenchmarkContext> {
  try {
    const verticalRows = await db.verticalBenchmark.findMany({
      where: { vertical },
    })

    const verticalMap: Record<string, PillarStats | null> = {}
    for (const pillar of PILLARS) {
      const row = verticalRows.find(r => r.pillar === pillar)
      verticalMap[pillar] = row
        ? {
            mean: row.mean,
            median: row.median,
            p25: row.p25,
            p75: row.p75,
            p90: row.p90,
            sampleSize: row.sampleSize,
          }
        : null
    }

    let marketMap: Record<string, PillarStats | null> | null = null

    if (metroArea) {
      const marketRows = await db.marketBenchmark.findMany({
        where: { vertical, metroArea },
      })

      marketMap = {}
      for (const pillar of PILLARS) {
        const row = marketRows.find(r => r.pillar === pillar)
        marketMap[pillar] = row
          ? {
              mean: row.mean,
              median: row.median,
              p25: 0,      // MarketBenchmark doesn't store p25
              p75: row.p75,
              p90: 0,      // MarketBenchmark doesn't store p90
              sampleSize: row.sampleSize,
            }
          : null
      }
    }

    return { vertical: verticalMap, market: marketMap }
  } catch (err) {
    console.error('[benchmarks] getBenchmarkContext failed:', err)
    // Graceful degradation — return nulls for all pillars
    const nullMap: Record<string, null> = {}
    for (const pillar of PILLARS) nullMap[pillar] = null
    return { vertical: nullMap, market: null }
  }
}
