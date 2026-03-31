import { Router, Request, Response } from 'express'
import { getPublicReport } from '@/lib/data'

const router = Router()

/**
 * GET /api/public-report/:slug
 * Fetches high-level audit data for a public shareable report.
 * No authentication required.
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string
    if (!slug) {
      return res.status(400).json({ success: false, error: 'Slug is required' })
    }

    const report = await getPublicReport(slug)
    
    if (!report) {
      return res.status(404).json({ 
        success: false, 
        error: 'Report not found or set to private. Make sure the URL is correct.' 
      })
    }

    return res.json({ success: true, report })

  } catch (err) {
    console.error('[GET Public Report Error]', err)
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve the report. Please try again later.' 
    })
  }
})

export default router
