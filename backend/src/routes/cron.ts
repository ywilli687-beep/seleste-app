import express from 'express'
import { db } from '@/lib/db'
import { createClerkClient } from '@clerk/clerk-sdk-node'
import { sendMonthlyScoreEmail } from '@/lib/email'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY || 'sk_test_...' })


const router = express.Router()

// GET /api/cron/cleanup
// Triggered by Vercel Cron or similar. Requires CRON_SECRET auth.
router.get('/cleanup', async (req, res) => {
  const auth = req.headers.authorization
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const deleted = await db.auditFetch.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
    res.json({ deleted: deleted.count })
  } catch (error) {
    console.error('Cron cleanup error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/cron/monthly-scores
router.get('/monthly-scores', async (req, res) => {
  const auth = req.headers.authorization
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Get all businesses with a known creator and a score
  const businesses = await db.business.findMany({
    where: {
      createdByUser: { not: null },
      latestOverallScore: { not: null },
    },
    select: {
      id: true,
      domain: true,
      businessName: true,
      slug: true,
      createdByUser: true,
      latestOverallScore: true,
      // latestGrade is not a direct column, let's omit it from select and compute
      scoreHistory: true, // we might need to parse this depending on JSON format
    },
  })

  let sent = 0
  let failed = 0

  for (const business of businesses) {
    try {
      const userId = business.createdByUser!
      const user = await clerkClient.users.getUser(userId)
      const email = user.emailAddresses[0]?.emailAddress
      if (!email) continue

      // Assuming scoreHistory is an array of objects
      const history = (business.scoreHistory as Array<{ score: number }> | null) ?? []
      const previousScore = history.length >= 2 ? history[history.length - 2].score : null

      const getGrade = (score: number) => {
        if (score >= 75) return 'A'
        if (score >= 60) return 'B'
        if (score >= 45) return 'C'
        return 'D'
      }

      await sendMonthlyScoreEmail({
        to: email,
        businessName: business.businessName,
        domain: business.domain,
        score: business.latestOverallScore!,
        grade: getGrade(business.latestOverallScore!),
        previousScore,
        reportSlug: business.slug,
      })

      sent++
      // Delay for rate limiting
      await new Promise(r => setTimeout(r, 600))
    } catch (err) {
      console.error(`Monthly email failed for ${business.domain}:`, err)
      failed++
    }
  }

  res.json({ sent, failed })
})

export default router
