// @ts-nocheck
import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { db } from '../lib/db'
import { guardAgent } from '../lib/stateMachine'
import { rankActions, decideAutoExecute, computeUrgency, computeChannelSynergy } from '../lib/prioritization'
import { ActionRiskTier, AgentType, AgentCycleStatus } from '@prisma/client'
import crypto from 'crypto'

const router = Router()

function requireCronSecret(req: Request, res: Response, next: Function) {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'UNAUTHORIZED' })
  }
  next()
}

const ActionSchema = z.object({
  title:            z.string().min(1).max(200),
  description:      z.string().min(1).max(2000),
  pillar:           z.string().min(1),
  goal:             z.string().min(1),
  metric:           z.string().min(1),
  targetValue:      z.number().int().min(0).max(100).optional(),
  estimatedImpact:  z.number().int().min(0).max(100),
  estimatedEffort:  z.number().int().min(1).max(5),
  riskTier:         z.enum(['LOW', 'MEDIUM', 'HIGH']),
  actionType:       z.string().min(1),
  actionPayload:    z.record(z.unknown()),
  channelSynergy:   z.array(z.string()).default([]),
  urgencySignal:    z.number().int().min(0).max(100).default(50),
})

const CallbackSchema = z.object({
  audit_id:   z.string(),
  cycle_id:   z.string().optional(),
  agent_type: z.enum(['SEO', 'CRO', 'REPUTATION', 'CONTENT', 'MEDIA_BUYER']),
  status:     z.enum(['success', 'error']),
  actions:    z.array(ActionSchema).default([]),
  error:      z.string().optional(),
})

const VALID_ACTION_TYPES: Record<AgentType, string[]> = {
  SEO:         ['UPDATE_META', 'ADD_SCHEMA', 'FIX_SITEMAP', 'UPDATE_ROBOTS', 'ADD_CITATION', 'OPTIMIZE_HEADINGS'],
  CRO:         ['ADD_CTA', 'FIX_BOOKING_WIDGET', 'ADD_TRUST_BADGE', 'IMPROVE_FORM', 'ADD_TESTIMONIAL'],
  REPUTATION:  ['GMB_UPDATE', 'REQUEST_REVIEW', 'RESPOND_REVIEW', 'UPDATE_LISTING'],
  CONTENT:     ['PUBLISH_CONTENT', 'UPDATE_COPY', 'ADD_FAQ', 'ADD_LOCATION_PAGE', 'UPDATE_SERVICE_PAGE'],
  MEDIA_BUYER: ['CREATE_CAMPAIGN', 'UPDATE_AD_COPY', 'ADJUST_BUDGET', 'ADD_KEYWORD', 'PAUSE_CAMPAIGN'],
}

async function updateCycleStatus(cycleId: string) {
  const executions = await db.agentExecution.findMany({ where: { cycleId }, select: { status: true } })
  const allComplete = executions.every((e) => ['COMPLETE', 'FAILED'].includes(e.status))
  const allFailed   = executions.every((e) => e.status === 'FAILED')
  let newStatus: AgentCycleStatus = 'PROCESSING'
  if (allComplete && allFailed) newStatus = 'FAILED'
  else if (allComplete) newStatus = 'COMPLETE'
  else if (executions.some((e) => e.status === 'COMPLETE')) newStatus = 'PARTIAL'
  await db.agentCycle.update({ where: { id: cycleId }, data: { status: newStatus, completedAt: allComplete ? new Date() : undefined } })
}

function getPillarScore(snapshot: any, pillar: string): number {
  const map: Record<string, string> = { conversion: 'conversionScore', seo: 'seoScore', reputation: 'reputationScore', content: 'contentScore', technical: 'technicalScore', mobile: 'mobileScore', trust: 'trustScore', local: 'localScore', accessibility: 'accessibilityScore', performance: 'performanceScore', overall: 'overallScore' }
  return snapshot[map[pillar.toLowerCase()] ?? 'overallScore'] ?? snapshot.overallScore ?? 0
}

router.post('/', requireCronSecret, async (req: Request, res: Response) => {
  const parse = CallbackSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: 'INVALID_PAYLOAD', details: parse.error.errors })
  const payload = parse.data
  const snapshot = await db.auditSnapshot.findUnique({ where: { id: payload.audit_id }, include: { business: { select: { id: true, state: true, industry: true } } } })
  if (!snapshot) return res.status(400).json({ error: 'SNAPSHOT_NOT_FOUND' })
  let cycle: any
  if (payload.cycle_id) {
    cycle = await db.agentCycle.findUnique({ where: { id: payload.cycle_id }, select: { id: true, businessId: true, status: true } })
    if (!cycle) return res.status(400).json({ error: 'CYCLE_NOT_FOUND' })
    if (cycle.businessId !== snapshot.businessId) return res.status(400).json({ error: 'CYCLE_SNAPSHOT_MISMATCH' })
  } else {
    // No cycle_id provided — create one automatically for this n8n callback
    cycle = await db.agentCycle.create({
      data: {
        businessId:     snapshot.businessId,
        snapshotId:     snapshot.id,
        status:         'PROCESSING',
        idempotencyKey: `n8n-${snapshot.id}-${payload.agent_type}-${Date.now()}`,
        timeoutAt:      new Date(Date.now() + 30 * 60 * 1000), // 30 min timeout
        webhookPayload: req.body,
      }
    })
  }
  const cycleId   = cycle.id
  const agentType = payload.agent_type as AgentType
  const business  = snapshot.business
  const existingExecution = await db.agentExecution.findFirst({ where: { cycleId, agentType, status: { in: ['COMPLETE', 'FAILED'] as AgentCycleStatus[] } }, select: { id: true } })
  if (existingExecution) return res.json({ received: true, actionsCreated: 0, actionsRejected: 0, rejectionReasons: ['Duplicate callback'], cycleStatus: cycle.status })
  const blocked = guardAgent(business.state, agentType)
  if (blocked) {
    await db.agentExecution.create({ data: { cycleId, agentType, status: 'FAILED', validationStatus: 'FAILED_SCHEMA', validationErrors: [blocked], completedAt: new Date() } })
    return res.json({ received: true, actionsCreated: 0, actionsRejected: payload.actions.length, rejectionReasons: [blocked], cycleStatus: cycle.status })
  }
  if (payload.status === 'error') {
    await db.agentExecution.create({ data: { cycleId, agentType, status: 'FAILED', validationStatus: 'FAILED_SCHEMA', rawOutput: payload as any, validationErrors: [payload.error ?? 'Agent reported error'], completedAt: new Date() } })
    await updateCycleStatus(cycleId)
    return res.json({ received: true, actionsCreated: 0, actionsRejected: 0, rejectionReasons: [payload.error ?? 'Agent error'], cycleStatus: cycle.status })
  }
  const validActions: typeof payload.actions = []
  const rejectionReasons: string[] = []
  for (const action of payload.actions) {
    if (!VALID_ACTION_TYPES[agentType].includes(action.actionType)) { rejectionReasons.push(`Invalid actionType "${action.actionType}" for ${agentType}`); continue }
    validActions.push(action)
  }
  const execution = await db.agentExecution.create({ data: { cycleId, agentType, status: 'COMPLETE', validationStatus: rejectionReasons.length > 0 ? 'FAILED_SCHEMA' : 'PASSED', rawOutput: payload as any, validationErrors: rejectionReasons.length > 0 ? rejectionReasons : undefined, startedAt: new Date(), completedAt: new Date() } })
  const candidates = validActions.map((a, i) => ({ id: `tmp-${i}`, agentType, pillar: a.pillar, estimatedImpact: a.estimatedImpact, estimatedEffort: a.estimatedEffort, urgencySignal: a.urgencySignal, learningSignal: 0, learningConfidence: 0, channelSynergy: computeChannelSynergy(a.channelSynergy), moatScore: 0 }))
  const ranked    = rankActions(candidates, business.state)
  let actionsCreated = 0
  for (let i = 0; i < validActions.length; i++) {
    const action          = validActions[i]
    const idempotencyKey  = crypto.createHash('sha256').update(`${cycleId}:${agentType}:${action.actionType}:${action.pillar}`).digest('hex')
    const existing        = await db.weeklyAction.findUnique({ where: { idempotencyKey }, select: { id: true } })
    if (existing) continue
    const autoDecision    = decideAutoExecute(action.riskTier as 'LOW'|'MEDIUM'|'HIGH', business.state, 0, action.estimatedImpact)
    const now             = new Date()
    await db.weeklyAction.create({ data: { businessId: business.id, snapshotId: snapshot.id, cycleId, executionId: execution.id, agentType, status: autoDecision.autoExecute ? 'EXECUTING' : 'PENDING', riskTier: action.riskTier as ActionRiskTier, title: action.title, description: action.description, pillar: action.pillar, goal: action.goal, metric: action.metric, baselineValue: getPillarScore(snapshot, action.pillar), targetValue: action.targetValue, estimatedImpact: action.estimatedImpact, estimatedEffort: action.estimatedEffort, priority: ranked[i]?.priority ?? 50, actionType: action.actionType, actionPayload: action.actionPayload, idempotencyKey, approvedAt: autoDecision.autoExecute ? now : undefined, executedAt: autoDecision.autoExecute ? now : undefined } })
    actionsCreated++
  }
  await db.weeklyAction.updateMany({ where: { businessId: business.id, status: 'PENDING', snapshotId: { not: snapshot.id } }, data: { status: 'SUPERSEDED' } })
  await updateCycleStatus(cycleId)
  const updatedCycle = await db.agentCycle.findUnique({ where: { id: cycleId }, select: { status: true } })
  return res.json({ received: true, actionsCreated, actionsRejected: rejectionReasons.length, rejectionReasons, cycleStatus: updatedCycle?.status ?? 'PROCESSING' })
})

export default router
