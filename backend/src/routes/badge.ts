import { Request, Response, Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

/**
 * Public Badge API
 * Returns a dynamic SVG badge for a business based on its latest audit score.
 * /api/badge/[businessId]
 */
router.get('/:businessId', async (req: Request, res: Response) => {
  const { businessId } = req.params

  try {
    const biz = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        audits: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    if (!biz || biz.audits.length === 0) {
      return res.status(404).send('Business or audit not found')
    }

    const lastAudit = biz.audits[0]
    const score = Number(lastAudit.overallScore)
    
    // Grade logic (75=A, 60=B, 45=C)
    let grade = 'D'
    let color = '#EF4444' // Red
    if (score >= 75) { grade = 'A'; color = '#10B981'; } // Green
    else if (score >= 60) { grade = 'B'; color = '#C8A96E'; } // Gold
    else if (score >= 45) { grade = 'C'; color = '#F59E0B'; } // Amber

    // Dynamic SVG response
    const svg = `
      <svg width="200" height="60" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="60" rx="12" fill="#111118"/>
        <rect x="0.5" y="0.5" width="199" height="59" rx="11.5" stroke="rgba(255,255,255,0.08)"/>
        
        <text x="20" y="26" fill="#8A857E" font-family="Inter, system-ui" font-size="10" font-weight="600" letter-spacing="0.05em">SELESTE VERIFIED</text>
        <text x="20" y="44" fill="#F4F1EC" font-family="Inter, system-ui" font-size="14" font-weight="700">${biz.name.toUpperCase()}</text>
        
        <circle cx="170" cy="30" r="18" fill="${color}" fill-opacity="0.1"/>
        <text x="170" y="35" text-anchor="middle" fill="${color}" font-family="Inter, system-ui" font-size="14" font-weight="800">${grade}</text>
      </svg>
    `.trim()

    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 'public, max-age=3600') // Cache for 1 hour
    return res.status(200).send(svg)

  } catch (error) {
    console.error('[Badge API Error]', error)
    return res.status(500).send('Internal Server Error')
  }
})

export default router
