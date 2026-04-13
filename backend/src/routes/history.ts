// @ts-nocheck
import { Router, Request, Response } from 'express'
import { db } from '@/lib/db'

const router = Router()

async function getUserHistory(userId: string) {
  const audits = await db.auditSnapshot.findMany({
    where: { triggeredByUser: userId },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      business: {
        select: {
          id: true, domain: true, businessName: true, vertical: true,
          city: true, state: true, scoreHistory: true,
        },
      },
    },
  })

  // Group by business domain — most recent audit per business + full history
  const byDomain = new Map<string, typeof audits>()
  for (const a of audits) {
    const d = a.business.domain
    if (!byDomain.has(d)) byDomain.set(d, [])
    byDomain.get(d)!.push(a)
  }

  return Array.from(byDomain.entries()).map(([domain, snaps]) => {
    const latest = snaps[0]
    const history = snaps.map((s: any) => ({
      id:           s.id,
      createdAt:    s.createdAt.toISOString(),
      overallScore: s.overallScore,
      grade:        s.grade as 'A' | 'B' | 'C' | 'D',
      scoreDelta:   s.scoreDelta,
    }))
    return {
      domain,
      businessId:   latest.business.id,
      businessName: latest.business.businessName ?? null,
      vertical:     latest.business.vertical,
      city:         latest.business.city ?? null,
      state:        latest.business.state ?? null,
      latestScore:  latest.overallScore,
      latestGrade:  latest.grade as 'A' | 'B' | 'C' | 'D',
      latestLeakage: latest.leakagePct,
      lastAuditedAt: latest.createdAt.toISOString(),
      auditCount:   snaps.length,
      history,
    }
  })
}

router.get('/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId as string
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  try {
    const businesses = await getUserHistory(userId)
    res.json({ success: true, businesses })
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router