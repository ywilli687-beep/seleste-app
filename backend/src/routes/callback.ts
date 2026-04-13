// @ts-nocheck
import { Router, Request, Response } from 'express'
import { db } from '@/lib/db'

const router = Router()

/**
 * POST /api/agents/callback
 * Receives specialized output from n8n agents (e.g. drafted GBP posts).
 * Links the output to a WeeklyAction and marks it as 'pending' for Approval Inbox.
 */
router.post('/', async (req: Request, res: Response) => {
  console.log('[Callback] Received body:', JSON.stringify(req.body))
  const { auditId, agentId, title, description, draftContent, category, estimatedLift } = req.body

  if (!auditId || !title) {
    return res.status(400).json({ success: false, error: 'Missing auditId or title' })
  }

  try {
    // 1. Find the audit snapshot to get business context
    console.log('[Callback] Looking up auditId:', auditId)
    const snapshot = await db.auditSnapshot.findUnique({
      where: { id: auditId },
      include: { business: true }
    })

    if (!snapshot) {
      console.log('[Callback] Snapshot not found for id:', auditId)
      return res.status(404).json({ success: false, error: 'Audit snapshot not found' })
    }

    // 2. Find or Create an Agent Cycle for this week if not exists
    const currentWeekLabel = `2026-W${Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))}`
    
    let cycle = await db.agentCycle.findFirst({
      where: { businessId: snapshot.businessId, weekLabel: currentWeekLabel },
      orderBy: { createdAt: 'desc' }
    })

    if (!cycle) {
      cycle = await db.agentCycle.create({
        data: {
          businessId: snapshot.businessId,
          status: 'partial',
          trigger: 'webhook_agent',
          weekLabel: currentWeekLabel
        }
      })
    }

    // 3. Create the WeeklyAction (Proposal)
    const action = await db.weeklyAction.create({
      data: {
        cycleId: cycle.id,
        businessId: snapshot.businessId,
        title,
        description: description || 'AI specialist analysis',
        draftContent,
        category: category || 'reputation',
        estimatedLift: parseInt(estimatedLift) || 5,
        effort: 'Medium',
        rank: 1,
        status: 'pending',
        agentVersion: '2.2.0'
      }
    })

    console.log(`[Callback] Created proposal for ${snapshot.business.businessName}: ${title}`)

    res.json({ success: true, actionId: action.id })
  } catch (err: any) {
    console.error('[Callback Error]', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router