// @ts-nocheck
import { db } from '../../db'
import { runAgent } from './run-agent'
import { AgentContext } from '../types'
import { SPECIALIST_AGENT_PROMPTS } from '../prompts/specialist-agents'
import { REPORTING_AGENT_SYSTEM_PROMPT, buildReportingPrompt } from '../prompts/reporting'

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

  const auditContextMsg = `
Business: ${context.businessName ?? 'Unknown'}
Vertical: ${context.vertical}
City: ${context.locationCity ?? 'Unknown'}
Overall score: ${context.overallScore ?? 'n/a'}/100
Grade: ${context.grade ?? 'n/a'}
Revenue leakage: ${context.revenueLeak != null ? `$${context.revenueLeak}/month` : 'unknown'}
Top issues: ${(context.issues ?? []).join(', ') || 'none detected'}

Analyze this business and return your WeeklyAction proposal.`

  // 3. Specialist agents run in parallel (reputation, SEO, content, CRO, paid media)
  const specialistIds = ['reputation_agent', 'local_seo_agent', 'creative_strategist', 'cro_agent', 'paid_media_strategist']

  const specialistResults = await Promise.allSettled(
    specialistIds.map(id =>
      runAgent(id, cycle.id, context, SPECIALIST_AGENT_PROMPTS[id] ?? '', auditContextMsg)
    )
  )

  for (let i = 0; i < specialistIds.length; i++) {
    const id = specialistIds[i]
    const result = specialistResults[i]
    if (result.status === 'fulfilled') {
      context.previousOutputs[id] = result.value
      agentsRun.push(id)

      // Persist WeeklyAction proposal from each specialist
      try {
        const proposal = result.value
        if (proposal?.title) {
          await db.weeklyAction.create({
            data: {
              cycleId: cycle.id,
              businessId,
              title: proposal.title ?? 'Untitled',
              description: proposal.description ?? '',
              draftContent: proposal.draftContent ?? null,
              category: proposal.category ?? 'reputation',
              estimatedLift: parseInt(proposal.estimatedLift) || 5,
              effort: proposal.effort ?? 'Medium',
              rank: i + 1,
              status: 'pending',
              agentVersion: '2.2.0',
            },
          })
        }
      } catch (saveErr: any) {
        console.error(`[run-cycle] Failed to save WeeklyAction for ${id}:`, saveErr.message)
      }
    } else {
      agentsFailed.push(id)
      console.error(`Agent ${id} failed:`, result.reason)
    }
  }

  // 4. Reporting agent runs last — summarises specialist outputs
  const scopedCtxForReport = {
    business: { name: context.businessName, vertical: context.vertical, city: context.locationCity },
    audit: { overallScore: context.overallScore, grade: context.grade, revenueLeak: context.revenueLeak },
    benchmarks: { medianScore: context.medianScore, topGaps: context.topGaps },
    previousOutputs: context.previousOutputs,
  }

  try {
    const reportOutput = await runAgent(
      'reporting_agent',
      cycle.id,
      context,
      REPORTING_AGENT_SYSTEM_PROMPT,
      buildReportingPrompt(scopedCtxForReport),
    )
    context.previousOutputs['reporting_agent'] = reportOutput
    agentsRun.push('reporting_agent')
  } catch (err) {
    agentsFailed.push('reporting_agent')
    console.error('Agent reporting_agent failed:', err)
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
