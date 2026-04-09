/**
 * outreach.ts — Cold Outreach CSV Generator
 *
 * generateOutreachList(opts) — queries CrawledBusiness + latest CrawlerSnapshot
 *   for businesses that score below a threshold and haven't been contacted yet.
 *   Returns a list of outreach candidates sorted by lowest score (highest opportunity).
 *
 * exportToCsv(candidates, filePath) — writes the candidate list to a CSV file.
 */
import { db } from './db'
import fs from 'fs'
import path from 'path'
import { stringify } from 'csv-stringify/sync'

export interface OutreachCandidate {
  businessId: string
  url: string
  businessName: string
  vertical: string
  metroArea: string
  overallScore: number
  conversionScore: number
  seoScore: number
  reputationScore: number
  hasSsl: boolean
  hasBookingWidget: boolean
  crawledAt: string
  outreachStatus: string
}

export interface OutreachOptions {
  maxScore?: number      // Only include businesses scoring below this (default: 65)
  vertical?: string      // Filter by vertical
  metroArea?: string     // Filter by metro area
  limit?: number         // Max results (default: 500)
}

// ─────────────────────────────────────────────────────────────────────────────
// generateOutreachList
// Finds un-contacted businesses with low scores — highest opportunity first.
// ─────────────────────────────────────────────────────────────────────────────
export async function generateOutreachList(
  opts: OutreachOptions = {},
): Promise<OutreachCandidate[]> {
  const { maxScore = 65, vertical, metroArea, limit = 500 } = opts

  const businesses = await db.crawledBusiness.findMany({
    where: {
      status: 'CRAWLED',
      outreachStatus: 'NOT_CONTACTED',
      ...(vertical ? { vertical } : {}),
      ...(metroArea ? { metroArea } : {}),
    },
    include: {
      snapshots: {
        orderBy: { crawledAt: 'desc' },
        take: 1,
      },
    },
    take: limit * 3, // Over-fetch to allow score filtering
  })

  const candidates: OutreachCandidate[] = []

  for (const biz of businesses) {
    const snapshot = biz.snapshots[0]
    if (!snapshot) continue
    if (snapshot.overallScore >= maxScore) continue

    candidates.push({
      businessId: biz.id,
      url: biz.url,
      businessName: biz.businessName || 'Unknown Business',
      vertical: biz.vertical,
      metroArea: biz.metroArea,
      overallScore: Math.round(snapshot.overallScore),
      conversionScore: Math.round(snapshot.conversionScore),
      seoScore: Math.round(snapshot.seoScore),
      reputationScore: Math.round(snapshot.reputationScore),
      hasSsl: snapshot.hasSsl,
      hasBookingWidget: snapshot.hasBookingWidget,
      crawledAt: snapshot.crawledAt.toISOString(),
      outreachStatus: biz.outreachStatus,
    })
  }

  // Sort by score ascending (lowest = highest opportunity first)
  candidates.sort((a, b) => a.overallScore - b.overallScore)

  return candidates.slice(0, limit)
}

// ─────────────────────────────────────────────────────────────────────────────
// exportToCsv
// Writes outreach candidates to a CSV file. Creates the output directory
// if it doesn't exist. Returns the absolute path of the written file.
// ─────────────────────────────────────────────────────────────────────────────
export function exportToCsv(
  candidates: OutreachCandidate[],
  filePath: string,
): string {
  const absolute = path.resolve(filePath)
  const dir = path.dirname(absolute)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const csvContent = stringify(candidates, {
    header: true,
    columns: [
      { key: 'businessName', header: 'Business Name' },
      { key: 'url', header: 'Website' },
      { key: 'vertical', header: 'Vertical' },
      { key: 'metroArea', header: 'Metro Area' },
      { key: 'overallScore', header: 'Overall Score' },
      { key: 'conversionScore', header: 'Conversion Score' },
      { key: 'seoScore', header: 'SEO Score' },
      { key: 'reputationScore', header: 'Reputation Score' },
      { key: 'hasSsl', header: 'Has SSL' },
      { key: 'hasBookingWidget', header: 'Has Booking' },
      { key: 'crawledAt', header: 'Last Crawled' },
      { key: 'outreachStatus', header: 'Outreach Status' },
    ],
  })

  fs.writeFileSync(absolute, csvContent, 'utf-8')
  console.log(`[outreach] Exported ${candidates.length} candidates to ${absolute}`)
  return absolute
}
