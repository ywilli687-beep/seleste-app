import { Router, Request, Response } from 'express'
import { generateVerticalLandingPage } from '@/lib/ai'

const router = Router()

const VALID_VERTICALS = new Set([
  'AUTO_REPAIR', 'CAR_WASH', 'RESTAURANT', 'HOME_SERVICES', 'LOCAL_SERVICE',
  'DENTAL', 'LEGAL', 'REAL_ESTATE', 'FITNESS', 'BEAUTY_SALON',
  'PLUMBING', 'HVAC', 'LANDSCAPING', 'CLEANING', 'PET_SERVICES',
])

// In-memory cache: generated pages are expensive, cache per vertical for 24h
const pageCache = new Map<string, { data: any; generatedAt: number }>()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

/**
 * GET /api/vertical-pages/:vertical
 * Returns AI-generated landing page copy for a given vertical.
 * Cached in memory for 24 hours.
 * No authentication required (used for public SEO pages).
 */
router.get('/:vertical', async (req: Request, res: Response) => {
  const vertical = (req.params.vertical as string).toUpperCase()

  if (!VALID_VERTICALS.has(vertical)) {
    return res.status(400).json({ success: false, error: `Unknown vertical: ${vertical}` })
  }

  // Check cache
  const cached = pageCache.get(vertical)
  if (cached && Date.now() - cached.generatedAt < CACHE_TTL_MS) {
    return res.json({ success: true, data: cached.data, cached: true })
  }

  try {
    const data = await generateVerticalLandingPage(vertical)
    if (!data) {
      return res.status(500).json({ success: false, error: 'Failed to generate page copy' })
    }

    pageCache.set(vertical, { data, generatedAt: Date.now() })
    return res.json({ success: true, data, cached: false })
  } catch (err: any) {
    console.error('[vertical-pages] error:', err.message)
    return res.status(500).json({ success: false, error: err.message })
  }
})

export default router
