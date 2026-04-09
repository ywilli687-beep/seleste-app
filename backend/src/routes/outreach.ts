import { Router, Request, Response } from 'express'
import { db } from '@/lib/db'

const router = Router()

/**
 * GET /api/outreach/list
 * Returns cold outreach candidates — crawled businesses with low scores
 * that haven't been contacted yet.
 *
 * Query params:
 *   maxScore  — max overallScore to include (default: 65)
 *   vertical  — filter by vertical (optional)
 *   metroArea — filter by metro area (optional)
 *   limit     — max results (default: 100, max: 500)
 */
router.get('/list', async (req: Request, res: Response) => {
  const maxScore = Math.min(parseFloat(req.query.maxScore as string) || 65, 100)
  const vertical = req.query.vertical as string | undefined
  const metroArea = req.query.metroArea as string | undefined
  const limit = Math.min(parseInt(req.query.limit as string) || 100, 500)

  try {
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

    const candidates = businesses
      .filter(biz => {
        const snapshot = biz.snapshots[0]
        return snapshot && snapshot.overallScore < maxScore
      })
      .map(biz => {
        const snapshot = biz.snapshots[0]!
        return {
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
          crawledAt: snapshot.crawledAt,
          outreachStatus: biz.outreachStatus,
        }
      })
      .sort((a, b) => a.overallScore - b.overallScore)
      .slice(0, limit)

    res.json({ success: true, count: candidates.length, candidates })
  } catch (err: any) {
    console.error('[outreach] list error:', err.message)
    res.status(500).json({ success: false, error: err.message })
  }
})

/**
 * PATCH /api/outreach/:businessId/status
 * Update the outreach status of a crawled business.
 * Body: { status: string }
 */
router.patch('/:businessId/status', async (req: Request, res: Response) => {
  const businessId = req.params.businessId as string
  const { status } = req.body

  const validStatuses = [
    'NOT_CONTACTED', 'IDENTIFIED', 'CONTACTED', 'RESPONDED',
    'DEMO_SCHEDULED', 'CONVERTED', 'CHURNED', 'DECLINED',
  ]

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid or missing status' })
  }

  try {
    await db.crawledBusiness.update({
      where: { id: businessId },
      data: {
        outreachStatus: status,
        ...(status !== 'NOT_CONTACTED' ? { isClaimed: true, claimedAt: new Date() } : {}),
      },
    })
    res.json({ success: true })
  } catch (err: any) {
    console.error('[outreach] status update error:', err.message)
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
