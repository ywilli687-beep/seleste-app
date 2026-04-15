import { createClerkClient } from '@clerk/clerk-sdk-node'
import type { Request, Response, NextFunction } from 'express'

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! })

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthenticated' })
    }
    const payload = await clerk.verifyToken(token)
    const userId = payload.sub
    if (!userId) {
      console.error('[requireAuth] verifyToken succeeded but sub is empty, payload keys:', Object.keys(payload))
      return res.status(401).json({ success: false, error: 'Unauthenticated' })
    }
    ;(req as any).auth = { userId }
    next()
  } catch (err: any) {
    console.error('[requireAuth] verifyToken failed:', err?.message)
    return res.status(401).json({ success: false, error: 'Unauthenticated' })
  }
}
