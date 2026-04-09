/**
 * discovery.ts — Business Discovery Module
 * Three sources:
 *   1. Outscraper Maps API (primary)
 *   2. Playwright Google Maps scrape (fallback)
 *   3. Manual CSV import
 */
import axios from 'axios'
import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { createReadStream } from 'fs'
import readline from 'readline'
import { db } from './db'
import dotenv from 'dotenv'
dotenv.config({ path: '../backend/.env' })

const OUTSCRAPER_API_KEY = process.env.OUTSCRAPER_API_KEY || ''
const OUTSCRAPER_BASE = 'https://api.app.outscraper.com'

export interface DiscoveryTarget {
  url: string
  businessName?: string
  vertical: string
  metroArea: string
}

// ─────────────────────────────────────────────────────────────────────────────
// discoverFromOutscraper
// Queries Outscraper Maps Search API for businesses in a given vertical + metro.
// Returns a list of targets with website URLs (skips listings without websites).
// ─────────────────────────────────────────────────────────────────────────────
export async function discoverFromOutscraper(
  vertical: string,
  metroArea: string,
  limit = 100,
): Promise<DiscoveryTarget[]> {
  if (!OUTSCRAPER_API_KEY) {
    console.warn('[discovery] OUTSCRAPER_API_KEY not set — skipping Outscraper')
    return []
  }

  // Build a human-readable query like "auto repair shops in Austin TX"
  const query = `${verticalToQuery(vertical)} in ${metroArea}`

  try {
    const response = await axios.get(`${OUTSCRAPER_BASE}/maps/search-v3`, {
      headers: { 'X-API-KEY': OUTSCRAPER_API_KEY },
      params: {
        query,
        limit,
        language: 'en',
        region: 'us',
      },
      timeout: 30000,
    })

    const results: any[] = response.data?.data || []
    const targets: DiscoveryTarget[] = []

    for (const biz of results) {
      const website: string = biz.site || biz.website || ''
      if (!website || !website.startsWith('http')) continue
      targets.push({
        url: normalizeUrl(website),
        businessName: biz.name || undefined,
        vertical,
        metroArea,
      })
    }

    console.log(`[discovery] Outscraper: ${targets.length} targets for "${query}"`)
    return targets
  } catch (err: any) {
    console.error('[discovery] Outscraper error:', err.message)
    return []
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// discoverFromPlaywright
// Fallback: scrapes Google Maps directly using Playwright when Outscraper
// is unavailable or quota is exhausted.
// ─────────────────────────────────────────────────────────────────────────────
export async function discoverFromPlaywright(
  vertical: string,
  metroArea: string,
  limit = 30,
): Promise<DiscoveryTarget[]> {
  const query = `${verticalToQuery(vertical)} in ${metroArea}`
  const targets: DiscoveryTarget[] = []
  const browser = await chromium.launch({ headless: true })

  try {
    const page = await browser.newPage()
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Seleste-Crawler/1.0 (business intelligence; contact@seleste.com)',
    })

    const encoded = encodeURIComponent(query)
    await page.goto(`https://www.google.com/maps/search/${encoded}`, { timeout: 30000 })
    await page.waitForTimeout(3000)

    // Scroll to load more results
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('End')
      await page.waitForTimeout(1000)
    }

    const links = await page.$$eval('a[href*="/maps/place/"]', (els) =>
      els.map((el: any) => el.href).filter(Boolean),
    )

    const seen = new Set<string>()
    for (const link of links.slice(0, limit * 2)) {
      if (seen.has(link)) continue
      seen.add(link)

      try {
        const bizPage = await browser.newPage()
        await bizPage.goto(link, { timeout: 20000 })
        await bizPage.waitForTimeout(2000)

        const websiteEl = await bizPage.$('a[data-item-id="authority"]')
        const website = websiteEl ? await websiteEl.getAttribute('href') : null

        if (website && website.startsWith('http')) {
          const name = await bizPage.title()
          targets.push({
            url: normalizeUrl(website),
            businessName: name.replace(' - Google Maps', '').trim() || undefined,
            vertical,
            metroArea,
          })
        }
        await bizPage.close()
        if (targets.length >= limit) break
      } catch {
        // Skip individual listing failures
      }
    }

    console.log(`[discovery] Playwright: ${targets.length} targets for "${query}"`)
  } finally {
    await browser.close()
  }

  return targets
}

// ─────────────────────────────────────────────────────────────────────────────
// importFromCsv
// Loads a CSV file with columns: url, businessName (opt), vertical, metroArea
// ─────────────────────────────────────────────────────────────────────────────
export async function importFromCsv(filePath: string): Promise<DiscoveryTarget[]> {
  const absolute = path.resolve(filePath)
  if (!fs.existsSync(absolute)) {
    console.error(`[discovery] CSV not found: ${absolute}`)
    return []
  }

  const targets: DiscoveryTarget[] = []
  const rl = readline.createInterface({ input: createReadStream(absolute) })
  let header: string[] = []

  for await (const line of rl) {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
    if (!header.length) {
      header = cols.map(h => h.toLowerCase())
      continue
    }
    const row: Record<string, string> = {}
    header.forEach((h, i) => { row[h] = cols[i] || '' })

    if (!row.url || !row.vertical || !row.metroarea) continue
    targets.push({
      url: normalizeUrl(row.url),
      businessName: row.businessname || undefined,
      vertical: row.vertical.toUpperCase(),
      metroArea: row.metroarea,
    })
  }

  console.log(`[discovery] CSV import: ${targets.length} targets from ${absolute}`)
  return targets
}

// ─────────────────────────────────────────────────────────────────────────────
// runDiscovery
// Orchestrates discovery and upserts new targets into CrawledBusiness.
// Skips URLs already in the database.
// ─────────────────────────────────────────────────────────────────────────────
export async function runDiscovery(
  vertical: string,
  metroArea: string,
  opts: { limit?: number; csvPath?: string } = {},
): Promise<number> {
  const { limit = 100, csvPath } = opts
  let targets: DiscoveryTarget[] = []

  if (csvPath) {
    targets = await importFromCsv(csvPath)
  } else {
    targets = await discoverFromOutscraper(vertical, metroArea, limit)
    if (targets.length === 0) {
      console.log('[discovery] Outscraper returned 0 — trying Playwright fallback')
      targets = await discoverFromPlaywright(vertical, metroArea, Math.min(limit, 30))
    }
  }

  let added = 0
  for (const t of targets) {
    try {
      await db.crawledBusiness.upsert({
        where: { url: t.url },
        create: {
          url: t.url,
          businessName: t.businessName,
          vertical: t.vertical,
          metroArea: t.metroArea,
          status: 'PENDING',
        },
        update: {}, // Don't overwrite existing records
      })
      added++
    } catch (err: any) {
      console.error(`[discovery] Failed to upsert ${t.url}:`, err.message)
    }
  }

  console.log(`[discovery] Upserted ${added} businesses for ${vertical} / ${metroArea}`)
  return added
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw)
    // Strip trailing slash, query, fragment
    return `${u.protocol}//${u.hostname}${u.pathname}`.replace(/\/$/, '')
  } catch {
    return raw.trim()
  }
}

function verticalToQuery(vertical: string): string {
  const map: Record<string, string> = {
    AUTO_REPAIR: 'auto repair shops',
    CAR_WASH: 'car wash',
    RESTAURANT: 'restaurants',
    HOME_SERVICES: 'home services',
    LOCAL_SERVICE: 'local services',
    DENTAL: 'dentist',
    LEGAL: 'law firms',
    REAL_ESTATE: 'real estate agents',
    FITNESS: 'gyms and fitness centers',
    BEAUTY_SALON: 'beauty salons',
    PLUMBING: 'plumbers',
    HVAC: 'HVAC companies',
    LANDSCAPING: 'landscaping companies',
    CLEANING: 'cleaning services',
    PET_SERVICES: 'pet services',
  }
  return map[vertical] || vertical.toLowerCase().replace(/_/g, ' ')
}
