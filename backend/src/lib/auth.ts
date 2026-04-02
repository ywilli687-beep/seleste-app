import { createClerkClient } from '@clerk/clerk-sdk-node'
import type { Request, Response, NextFunction } from 'express'

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! })

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthenticated' })
    }
    await clerk.verifyToken(token)
    next()
  } catch {
    return res.status(401).json({ success: false, error: 'Unauthenticated' })
  }
}
