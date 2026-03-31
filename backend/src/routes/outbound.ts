import { Router, Request, Response } from 'express'
import { db } from '@/lib/db'
import crypto from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const router = Router()

// GET /api/outbound/shoot-cold-emails
// (Secured by a cron secret in production)
router.get('/shoot-cold-emails', async (req: Request, res: Response) => {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // 1. Find 50 businesses that haven't been claimed nor emailed
    const prospects = await db.business.findMany({
      where: {
        hasClaimed: false,
        doNotContact: false,
        outboundEmailedAt: null,
        ownerEmail: { not: null }
      },
      take: 50,
      orderBy: { latestOverallScore: 'asc' } // Target the lowest scores who need the most help
    })

    const sentEmails = []

    for (const biz of prospects) {
      if (!biz.ownerEmail) continue

      const score = biz.latestOverallScore ?? 50
      const revenueLeak = 3500 // Generic placeholder or computed from their vertical/traffic
      const hash = crypto.createHash('md5').update(`${biz.id}-${Date.now()}`).digest('hex')

      // 2. Dispatch personalized automated cold email
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <p>Hi ${biz.ownerName ? biz.ownerName.split(' ')[0] : 'there'},</p>
          <p>Our AI recently ran an automated digital audit on <strong>${biz.domain}</strong> and noticed a few critical conversion blockers.</p>
          <p>Currently, your website is scoring <strong>${score}/100</strong>, which means you are likely bleeding upwards of $${revenueLeak}/mo to local competitors.</p>
          <p><a href="${process.env.FRONTEND_URL}/report/${biz.slug}" style="background: #eab308; color: #000; padding: 10px 16px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Your Full Audit Report</a></p>
          <p>Claim your business to access the 90-day growth roadmap before your competitors do.</p>
          <p>Best,<br>The Seleste Growth Engine</p>
        </div>
      `

      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'reports@seleste.io',
          to: biz.ownerEmail,
          subject: `Private Audit Results for ${biz.businessName || biz.domain}`,
          html: htmlBody
        })

        // 3. Mark as emailed
        await db.business.update({
          where: { id: biz.id },
          data: { 
            outboundEmailedAt: new Date(),
            outboundEmailHash: hash 
          }
        })
        
        sentEmails.push(biz.ownerEmail)
      } catch (err) {
        console.error('Failed to send outbound to', biz.ownerEmail, err)
      }

      // Respect strict rate limits
      await new Promise(r => setTimeout(r, 1000))
    }

    res.json({ success: true, count: sentEmails.length, emails: sentEmails })
  } catch (err: any) {
    console.error('Outbound Cron Error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
