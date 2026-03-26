import { db } from '../../db'
import { runAgent } from './run-agent'
import { AgentContext } from '../types'

export async function runFullCycle(businessId: string, trigger: string = 'weekly_cycle') {
  // 1. Fetch Business Profile to build base Agent Context
  const business = await db.business.findUnique({
    where: { id: businessId },
    include: {
      audits: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  })

  if (!business) {
    throw new Error('Business not found for cycle')
  }

  const latestAudit = business.audits[0]

  const context: AgentContext = {
    businessId: business.id,
    businessName: business.businessName,
    vertical: business.vertical,
    locationCity: business.city,
    monthlyRevenue: null, // Would fetch from intake or signals

    overallScore: latestAudit?.overallScore ?? null,
    grade: latestAudit?.grade ?? null,
    pillars: null, // Full expansion needed in prod
    issues: latestAudit?.aiTopIssues ?? [],
    revenueLeak: latestAudit?.estimatedMonthlyLoss ?? null,

    medianScore: null,
    topGaps: [],
    previousOutputs: {}
  }

  // 2. Create the Cycle
  // Note: We use ISO week for weekLabel
  const currentWeekLabel = `2026-W${Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))}`

  const cycle = await db.agentCycle.create({
    data: {
      businessId,
      status: 'running',
      trigger,
      weekLabel: currentWeekLabel,
    }
  })

  const agentsFailed: string[] = []
  const agentsRun: string[] = []

  let totalCostUsd = 0
  const startTime = Date.now()

  // 3. Define the sequential sequence 
  // Intake -> Market Intel -> Growth Architect -> Reporting
  const sequence = [
    { id: 'intake_agent', prompt: 'Extract business context...', msg: 'Please extract context from the provided data.' },
    { id: 'growth_architect', prompt: 'You are the Growth Architect.', msg: 'Create a 90 day roadmap.' },
    { id: 'reporting_agent', prompt: 'You are the Reporting Agent.', msg: 'Write a summary report for this business.' }
  ]

  // Loop through sequence
  for (const step of sequence) {
    try {
      const output = await runAgent(
        step.id,
        cycle.id,
        context,
        step.prompt,
        step.msg
      )
      
      context.previousOutputs[step.id] = output
      agentsRun.push(step.id)
    } catch (err) {
      agentsFailed.push(step.id)
      console.error(`Agent ${step.id} failed:`, err)
      // Some agents can fail without breaking the chain
      // Others are critical. For simplicity, we continue.
    }
  }

  // 4. Summarize cost and complete
  const runs = await db.agentRun.findMany({ where: { cycleId: cycle.id } })
  runs.forEach(r => totalCostUsd += (r.actualCostUsd || 0))

  await db.agentCycle.update({
    where: { id: cycle.id },
    data: {
      status: agentsFailed.length > 0 ? (agentsRun.length > 0 ? 'partial' : 'failed') : 'complete',
      completedAt: new Date(),
      agentsRun,
      agentsFailed,
      durationMs: Date.now() - startTime,
      totalCostUsd,
      scoreAtCompletion: latestAudit?.overallScore
    }
  })

  return cycle
}
