import { Router, Request, Response } from 'express'
import { db } from '@/lib/db'

const router = Router()

function generateSvg(score: number, grade: string, businessName: string): string {
  const color = score >= 75 ? '#22c55e' : score >= 60 ? '#facc15' : '#ef4444'
  const textColor = '#1a1a1a'
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="70" viewBox="0 0 220 70">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8f9fa"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.1"/>
    </filter>
  </defs>
  <rect width="216" height="66" x="2" y="2" rx="12" fill="url(#bg)" stroke="#e5e7eb" stroke-width="1.5" filter="url(#shadow)"/>
  
  <!-- Score Circle -->
  <circle cx="35" cy="35" r="22" fill="none" stroke="#e5e7eb" stroke-width="4"/>
  <circle cx="35" cy="35" r="22" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="138.2" stroke-dashoffset="${138.2 - (138.2 * score) / 100}" transform="rotate(-90 35 35)" stroke-linecap="round"/>
  
  <text x="35" y="40" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="900" fill="${textColor}" text-anchor="middle">${score}</text>
  
  <!-- Text Content -->
  <text x="70" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="10" font-weight="600" fill="#6b7280" text-transform="uppercase" letter-spacing="0.5">Verified Audit</text>
  <text x="70" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="700" fill="${textColor}">${businessName.length > 18 ? businessName.substring(0, 15) + '...' : businessName}</text>
  <text x="70" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="9" font-weight="500" fill="#9ca3af">Powered by Seleste AI</text>
</svg>`
}

// GET /api/badge/:idOrSlug
router.get('/:idOrSlug', async (req: Request, res: Response) => {
  try {
    const identifier = req.params.idOrSlug as string
    
    // Attempt lookup by ID first, then slug
    const business = await db.business.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ]
      }
    })

    if (!business || business.latestOverallScore === null) {
      return res.status(404).json({ error: 'Business not found or no score available' })
    }

    const svg = generateSvg(
      business.latestOverallScore,
      business.latestGrade ?? 'D',
      business.businessName || business.domain
    )

    res.setHeader('Content-Type', 'image/svg+xml')
    res.setHeader('Cache-Control', 'public, max-age=3600') // Cache for 1 hour
    res.send(svg)

  } catch (error) {
    console.error('Badge generation error:', error)
    res.status(500).json({ error: 'Failed to generate badge' })
  }
})

export default router
