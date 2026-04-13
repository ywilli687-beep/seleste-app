// @ts-nocheck
import { Router } from 'express'
import { ClerkExpressRequireAuth, RequireAuthProp, StrictAuthProp } from '@clerk/clerk-sdk-node'
import { db } from '@/lib/db'
import { runFullCycle } from '../lib/agents/runners/run-cycle'

const router = Router()

// @ts-ignore
router.get('/page/:userId', ClerkExpressRequireAuth(), async (req: RequireAuthProp<any>, res) => {
  try {
    const { userId } = req.params
    if (req.auth.userId !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' })
    }

    const business = await db.business.findFirst({
      where: { createdByUser: userId }
    })

    if (!business) {
      return res.json({
        success: true,
        data: {
          state: 'no_cycle',
          planTier: 'free',
          latestCycle: null,
          nextCycleAt: null,
          cycleCount: 0,
          weeklyActions: [],
          agentOutputs: [],
          integrations: [],
          reportingOutput: null
        }
      })
    }

    // Fetch the latest cycle
    const latestCycle = await db.agentCycle.findFirst({
      where: { businessId: business.id },
      orderBy: { createdAt: 'desc' },
      include: { runs: true, weeklyActions: true }
    })

    if (!latestCycle) {
      return res.json({
        success: true,
        data: {
          state: 'no_cycle',
          planTier: business.isSubscriber ? 'pro' : 'free',
          latestCycle: null,
          nextCycleAt: null,
          cycleCount: 0,
          weeklyActions: [],
          agentOutputs: [],
          integrations: [
            { platform: 'google_analytics', displayName: 'Google Analytics 4', status: 'missing', unlocks: 'traffic insights', chipColor: 'blue' }
          ],
          reportingOutput: null
        }
      })
    }

    const state = latestCycle.status === 'running' ? 'cycle_running' : 
                  latestCycle.status === 'failed' ? 'cycle_failed' : 'cycle_complete'

    // Mock the specific outputs
    const agentOutputs = latestCycle.runs.map((r: any) => ({
      agentId: r.agentId,
      agentName: r.agentId.split('_').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      status: r.status,
      completedAt: r.createdAt.toISOString(),
      durationMs: r.durationMs,
      chipColor: 'green2'
    }))

    const reportingRun = latestCycle.runs.find((r: any) => r.agentId === 'reporting_agent')

    return res.json({
      success: true,
      data: {
        state,
        planTier: business.isSubscriber ? 'pro' : 'free',
        latestCycle: {
          id: latestCycle.id,
          status: latestCycle.status,
          trigger: latestCycle.trigger,
          completedAt: latestCycle.completedAt?.toISOString() || null,
          agentsRun: latestCycle.agentsRun,
          agentsFailed: latestCycle.agentsFailed,
          durationMs: latestCycle.durationMs
        },
        cycleCount: 1, // mock
        weeklyActions: latestCycle.weeklyActions,
        agentOutputs,
        integrations: [
          { platform: 'google_analytics', displayName: 'Google Analytics 4', status: 'missing', unlocks: 'traffic insights', chipColor: 'blue' }
        ],
        reportingOutput: reportingRun ? reportingRun.outputJson : null
      }
    })
  } catch (error: any) {
    console.error('Agents page fetch error:', error)
    res.status(500).json({ success: false, error: 'Internal Server Error' })
  }
})

// @ts-ignore
router.post('/approve/:actionId', ClerkExpressRequireAuth(), async (req: RequireAuthProp<any>, res) => {
  try {
    const { actionId } = req.params
    const { userId } = req.auth

    // 1. Find the action and ensure it belongs to the user's business
    const action = await db.weeklyAction.findUnique({
      where: { id: actionId },
      include: { business: true }
    })

    if (!action) {
      return res.status(404).json({ success: false, error: 'Action not found' })
    }

    if (action.business.createdByUser !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized to approve this action' })
    }

    // 2. Mark as approved
    await db.weeklyAction.update({
      where: { id: actionId },
      data: { status: 'approved', completedAt: new Date() }
    })

    // 3. TRIGGER EXECUTION (OPTIONAL)
    // If the action has draftContent and is a 'reputation' task, 
    // we could trigger an execution webhook (n8n or direct API)
    if (action.category === 'reputation' && action.draftContent) {
      console.log(`[Execution] Triggering autonomous execution for ${action.title}...`)
      // e.g. await triggerExecutionAgent(action)
    }

    res.json({ success: true, message: 'Action approved and queued for execution' })
  } catch (error: any) {
    console.error('Approval Error:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// @ts-ignore
router.post('/weekly', ClerkExpressRequireAuth(), async (req: RequireAuthProp<any>, res) => {
  try {
    const { businessId } = req.body
    const cycle = await runFullCycle(businessId, 'manual')
    return res.json({ success: true, cycle })
  } catch (error: any) {
    console.error('Error running manual cycle:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

export default router
