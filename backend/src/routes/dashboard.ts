import { Router, Request, Response } from 'express'
import { getDashboardData } from '@/lib/data'

const router = Router()

router.get('/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId as string
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  try {
    const data = await getDashboardData(userId)
    if (!data) {
      return res.status(404).json({ success: false, error: 'No audits found for user' })
    }
    
    res.json({ success: true, data })
  } catch (err: any) {
    console.error('[Dashboard API Error]', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
