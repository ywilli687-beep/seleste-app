import { Request, Response, Router } from 'express'
import { db } from '@/lib/db'

const router = Router()

router.get('/:businessId', async (req: Request, res: Response) => {
  const businessId = req.params.businessId as string

  try {
    const biz = await db.business.findUnique({ where: { id: businessId } })
    const lastAudit = await db.auditSnapshot.findFirst({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      select: { overallScore: true },
    })

    if (!biz || !lastAudit) {
      return res.status(404).send('Business or audit not found')
    }

    const score = Number(lastAudit.overallScore)
    let grade = 'D'; let color = '#EF4444'
    if (score >= 75) { grade = 'A'; color = '#10B981' }
    else if (score >= 60) { grade = 'B'; color = '#C8A96E' }
    else if (score >= 45) { grade = 'C'; color = '#F59E0B' }

    const name = (biz.businessName || biz.domain || 'Business').toUpperCase()

    const svg = `
<svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="60" rx="12" fill="#111118"/>
  <rect x="0.5" y="0.5" width="199" height="59" rx="11.5" stroke="rgba(255,255,255,0.08)"/>
  <text x="20" y="26" fill="#8A857E" font-family="Inter, system-ui" font-size="10" font-weight="600" letter-spacing="0.05em">SELESTE VERIFIED</text>
  <text x="20" y="44" fill="#F4F1EC" font-family="Inter, system-ui" font-size="14" font-weight="700">${name}</text>
  <circle cx="170" cy="30" r="18" fill="${color}" fill-opacity="0.1"/>
  <text x="170" y="35" text-anchor="middle" fill="${color}" font-family="Inter, system-ui" font-size="14" font-weight="800">${grade}</text>
</svg>`.trim()

    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    return res.status(200).send(svg)

  } catch (error) {
    console.error('[Badge API Error]', error)
    return res.status(500).send('Internal Server Error')
  }
})

export default router
