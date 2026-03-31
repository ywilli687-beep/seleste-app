import { Router, Request, Response } from 'express'
import { getDashboardData } from '@/lib/data'
import { createClerkClient } from '@clerk/clerk-sdk-node'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY || 'sk_test_...' })

const router = Router()

router.get('/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId as string
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  try {
    const user = await clerkClient.users.getUser(userId)
    const plan = (user.publicMetadata?.plan as string) || 'free'
    const isPro = plan === 'pro'
    
    const data = await getDashboardData(userId, isPro)
    res.json({ success: true, data })
  } catch (err: any) {
    console.error('[Dashboard API Error]', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
