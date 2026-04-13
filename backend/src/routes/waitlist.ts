// @ts-nocheck
import { Router, Request, Response } from 'express'
import { db } from '@/lib/db'
import { z } from 'zod'

const WaitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
  source: z.string().optional(),
  score: z.number().int().optional(),
  vertical: z.string().optional(),
})

const router = Router()

/**
 * POST /api/waitlist
 * Anonymous friendly route to upsert waitlist entries.
 * Pre-filled for authenticated users via frontend, but no auth required here.
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body
    const parsed = WaitlistSchema.safeParse(body)
    
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Invalid input'
      return res.status(400).json({ success: false, error: msg })
    }

    const { email, source, score, vertical } = parsed.data

    const waitlistEntry = await db.waitlist.upsert({
      where: { email },
      update: {
        source,
        score,
        vertical,
      },
      create: {
        email,
        source,
        score,
        vertical,
      },
    })

    return res.json({ success: true, data: waitlistEntry })
  } catch (err) {
    console.error('[Waitlist API Error]', err)
    return res.status(500).json({ success: false, error: 'Failed to join waitlist. Please try again.' })
  }
})

export default router