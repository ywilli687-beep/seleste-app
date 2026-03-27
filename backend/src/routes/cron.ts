import express from 'express'
import { db } from '@/lib/db'

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

export default router
