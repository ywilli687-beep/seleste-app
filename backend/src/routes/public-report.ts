// @ts-nocheck
import { Router, Request, Response } from 'express'
import { getPublicReport } from '@/lib/data'
import { writeAuditTeaser } from '@/lib/ai'

const router = Router()

/**
 * GET /api/public-report/:slug
 * Fetches high-level audit data for a public shareable report.
 * Includes an AI-generated teaser summary for unauthenticated users.
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

    // Generate AI teaser for unauthenticated view
    const { snapshot } = report
    const sortedPillars = Object.entries(snapshot.pillarScores)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 3)
      .map(([name, score]) => ({ name, score, avg: null }))

    const annualLeakage = snapshot.revenueLeakage != null ? snapshot.revenueLeakage * 12 : null

    const teaser = await writeAuditTeaser({
      website: report.business.domain,
      industry: report.business.vertical ?? 'LOCAL_SERVICE',
      overallScore: Math.round(snapshot.totalScore),
      estimatedRevenueLeakage: annualLeakage,
      topPillars: sortedPillars,
    })

    return res.json({ success: true, report: { ...report, teaser } })

  } catch (err) {
    console.error('[GET Public Report Error]', err)
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve the report. Please try again later.'
    })
  }
})

export default router
