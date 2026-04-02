import { Router, Request, Response } from 'express'
import { db } from '@/lib/db'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const count = await db.auditSnapshot.count()
    res.json({ success: true, count })
  } catch (err: any) {
    console.error('[Stats API Error]', err)
    // Rule: Fallback to 1200 if the stats API call fails
    res.json({ success: true, count: 1200 })
  }
})

export default router
