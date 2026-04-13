// @ts-nocheck
import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { requireAuth } from '../lib/auth'
import { db } from '../lib/db'
import { guardAgent } from '../lib/stateMachine'
import { rankActions, decideAutoExecute, computeUrgency, computeChannelSynergy } from '../lib/prioritization'
import { ActionStatus, ActionRiskTier, AgentType, Prisma } from '@prisma/client'
import crypto from 'crypto'

const router = Router()

const CreateTaskSchema = z.object({
  businessId:      z.string().cuid(),
  agentType:       z.enum(['SEO', 'CRO', 'REPUTATION', 'CONTENT', 'MEDIA_BUYER']),
  title:           z.string().min(1).max(200),
  description:     z.string().min(1).max(2000),
  pillar:          z.string().min(1),
  goal:            z.string().min(1),
  metric:          z.string().min(1),
  baselineValue:   z.number().int().min(0).max(100),
  targetValue:     z.number().int().min(0).max(100).optional(),
  estimatedImpact: z.number().int().min(0).max(100).optional(),
  estimatedEffort: z.number().int().min(1).max(5).optional(),
  riskTier:        z.enum(['LOW', 'MEDIUM', 'HIGH']),
  actionType:      z.string().min(1),
  actionPayload:   z.record(z.unknown()),
})

const ListTasksSchema = z.object({
  businessId: z.string().cuid(),
  status:     z.union([
    z.enum(['PENDING','APPROVED','REJECTED','EXECUTING','COMPLETED','FAILED','SUPERSEDED']),
    z.literal('ACTIVE'),
  ]).optional(),
  agentType:  z.enum(['SEO','CRO','REPUTATION','CONTENT','MEDIA_BUYER']).optional(),
  riskTier:   z.enum(['LOW','MEDIUM','HIGH']).optional(),
  pillar:     z.string().optional(),
  limit:      z.coerce.number().int().min(1).max(100).default(20),
  cursor:     z.string().optional(),
})

const RejectTaskSchema = z.object({
  reason: z.string().max(500).optional(),
})

const UpdateTaskSchema = z.object({
  title:           z.string().min(1).max(200).optional(),
  description:     z.string().min(1).max(2000).optional(),
  actionPayload:   z.record(z.unknown()).optional(),
  estimatedImpact: z.number().int().min(0).max(100).optional(),
  estimatedEffort: z.number().int().min(1).max(5).optional(),
})

async function assertOwnership(userId: string, businessId: string): Promise<boolean> {
  const business = await db.business.findFirst({
    where: { id: businessId, userId },
    select: { id: true },
  })
  return !!business
}

// POST /api/tasks
router.post('/', requireAuth, async (req: Request, res: Response) => {
  const parse = CreateTaskSchema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ error: 'VALIDATION_FAILED', details: parse.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })) })
  }
  const data   = parse.data
  const userId = (req as any).auth!.userId
  if (!(await assertOwnership(userId, data.businessId))) return res.status(403).json({ error: 'FORBIDDEN' })
  const business = await db.business.findUnique({ where: { id: data.businessId }, select: { state: true } })
  if (!business) return res.status(404).json({ error: 'NOT_FOUND' })
  const blocked = guardAgent(business.state, data.agentType as AgentType)
  if (blocked) return res.status(400).json({ error: 'AGENT_BLOCKED', reason: blocked })
  const urgency  = computeUrgency(data.baselineValue)
  const synergy  = computeChannelSynergy([data.pillar])
  const ranked   = rankActions([{ id: 'tmp', agentType: data.agentType as AgentType, pillar: data.pillar, estimatedImpact: data.estimatedImpact ?? 50, estimatedEffort: data.estimatedEffort ?? 3, urgencySignal: urgency, learningSignal: 0, learningConfidence: 0, channelSynergy: synergy, moatScore: 0 }], business.state)
  const priority = ranked[0]?.priority ?? 50
  const latestSnapshot = await db.auditSnapshot.findFirst({ where: { businessId: data.businessId }, orderBy: { createdAt: 'desc' }, select: { id: true } })
  if (!latestSnapshot) return res.status(400).json({ error: 'NO_AUDIT_EXISTS', message: 'Run an audit first' })
  const latestCycle = await db.agentCycle.findFirst({ where: { businessId: data.businessId }, orderBy: { triggeredAt: 'desc' }, select: { id: true } })
  if (!latestCycle) return res.status(400).json({ error: 'NO_CYCLE_EXISTS' })
  const latestExecution = await db.agentExecution.findFirst({ where: { cycleId: latestCycle.id, agentType: data.agentType as AgentType }, orderBy: { startedAt: 'desc' }, select: { id: true } })
  if (!latestExecution) return res.status(400).json({ error: 'NO_EXECUTION_EXISTS' })
  const task = await db.weeklyAction.create({
    data: { businessId: data.businessId, snapshotId: latestSnapshot.id, cycleId: latestCycle.id, executionId: latestExecution.id, agentType: data.agentType as AgentType, status: 'PENDING', riskTier: data.riskTier as ActionRiskTier, title: data.title, description: data.description, pillar: data.pillar, goal: data.goal, metric: data.metric, baselineValue: data.baselineValue, targetValue: data.targetValue, estimatedImpact: data.estimatedImpact, estimatedEffort: data.estimatedEffort, priority, actionType: data.actionType, actionPayload: data.actionPayload, idempotencyKey: crypto.randomBytes(16).toString('hex') },
    select: { id: true, status: true, priority: true, idempotencyKey: true, createdAt: true },
  })
  return res.status(201).json({ taskId: task.id, status: task.status, priority: task.priority, idempotencyKey: task.idempotencyKey, createdAt: task.createdAt.toISOString() })
})

// GET /api/tasks
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const parse = ListTasksSchema.safeParse(req.query)
  if (!parse.success) return res.status(400).json({ error: 'VALIDATION_FAILED', details: parse.error.errors })
  const { businessId, status, agentType, riskTier, pillar, limit, cursor } = parse.data
  const userId = (req as any).auth!.userId
  if (!(await assertOwnership(userId, businessId))) return res.status(403).json({ error: 'FORBIDDEN' })
  let statusFilter: Prisma.WeeklyActionWhereInput['status']
  if (status === 'ACTIVE') statusFilter = { in: ['PENDING', 'APPROVED'] as ActionStatus[] }
  else if (status) statusFilter = status as ActionStatus
  const where: Prisma.WeeklyActionWhereInput = { businessId, ...(statusFilter ? { status: statusFilter } : {}), ...(agentType ? { agentType: agentType as AgentType } : {}), ...(riskTier ? { riskTier: riskTier as ActionRiskTier } : {}), ...(pillar ? { pillar } : {}), ...(cursor ? { id: { lt: cursor } } : {}) }
  const [tasks, summary, business] = await Promise.all([
    db.weeklyAction.findMany({ where, orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }], take: limit + 1, select: { id: true, agentType: true, title: true, description: true, pillar: true, status: true, riskTier: true, priority: true, estimatedImpact: true, estimatedEffort: true, baselineValue: true, targetValue: true, createdAt: true, approvedAt: true, executedAt: true, completedAt: true } }),
    db.weeklyAction.groupBy({ by: ['status'], where: { businessId }, _count: true }),
    db.business.findUnique({ where: { id: businessId }, select: { state: true } }),
  ])
  const hasMore   = tasks.length > limit
  const page      = hasMore ? tasks.slice(0, limit) : tasks
  const nextCursor = hasMore ? page[page.length - 1].id : null
  const tasksWithMeta = page.map((t, i) => {
    const autoDecision = decideAutoExecute(t.riskTier as 'LOW'|'MEDIUM'|'HIGH', business!.state, 0, t.estimatedImpact ?? 50)
    return { taskId: t.id, agentType: t.agentType, title: t.title, description: t.description, pillar: t.pillar, status: t.status, riskTier: t.riskTier, priority: t.priority, rank: i + 1, estimatedImpact: t.estimatedImpact, estimatedEffort: t.estimatedEffort, baselineValue: t.baselineValue, targetValue: t.targetValue, autoExecuteEligible: autoDecision.autoExecute, createdAt: t.createdAt.toISOString(), approvedAt: t.approvedAt?.toISOString() ?? null, executedAt: t.executedAt?.toISOString() ?? null, completedAt: t.completedAt?.toISOString() ?? null }
  })
  const summaryMap = { pending: 0, approved: 0, executing: 0, completed: 0, failed: 0 }
  for (const row of summary) { const key = row.status.toLowerCase() as keyof typeof summaryMap; if (key in summaryMap) summaryMap[key] = row._count }
  return res.json({ tasks: tasksWithMeta, nextCursor, hasMore, summary: summaryMap })
})

// POST /api/tasks/:taskId/approve
router.post('/:taskId/approve', requireAuth, async (req: Request, res: Response) => {
  const { taskId } = req.params
  const userId     = (req as any).auth!.userId
  const task       = await db.weeklyAction.findUnique({ where: { id: taskId }, include: { business: { select: { userId: true, state: true } } } })
  if (!task) return res.status(404).json({ error: 'NOT_FOUND' })
  if (task.business.userId !== userId) return res.status(403).json({ error: 'FORBIDDEN' })
  if (task.status !== 'PENDING') return res.status(409).json({ error: 'ALREADY_PROCESSED', status: task.status })
  const learningSignal = await db.learningSignal.findFirst({ where: { agentType: task.agentType, actionType: task.actionType }, select: { confidenceScore: true } })
  const confidence     = learningSignal?.confidenceScore ?? 0
  const autoDecision   = decideAutoExecute(task.riskTier as 'LOW'|'MEDIUM'|'HIGH', task.business.state, confidence, task.estimatedImpact ?? 50)
  const newStatus      = autoDecision.autoExecute ? 'EXECUTING' : 'APPROVED'
  const now            = new Date()
  await db.weeklyAction.update({ where: { id: taskId }, data: { status: newStatus, approvedAt: now, executedAt: autoDecision.autoExecute ? now : undefined } })
  return res.json({ taskId, status: newStatus, autoExecuted: autoDecision.autoExecute, message: autoDecision.reason })
})

// POST /api/tasks/:taskId/reject
router.post('/:taskId/reject', requireAuth, async (req: Request, res: Response) => {
  const { taskId } = req.params
  const userId     = (req as any).auth!.userId
  const { reason } = RejectTaskSchema.parse(req.body)
  const task       = await db.weeklyAction.findUnique({ where: { id: taskId }, include: { business: { select: { userId: true } } } })
  if (!task) return res.status(404).json({ error: 'NOT_FOUND' })
  if (task.business.userId !== userId) return res.status(403).json({ error: 'FORBIDDEN' })
  if (task.status !== 'PENDING') return res.status(409).json({ error: 'ALREADY_PROCESSED', status: task.status })
  const now = new Date()
  await db.weeklyAction.update({ where: { id: taskId }, data: { status: 'REJECTED', rejectedAt: now, rejectionReason: reason } })
  return res.json({ taskId, status: 'REJECTED', rejectedAt: now.toISOString() })
})

// POST /api/tasks/:taskId/execute
router.post('/:taskId/execute', requireAuth, async (req: Request, res: Response) => {
  const { taskId } = req.params
  const userId     = (req as any).auth!.userId
  const task       = await db.weeklyAction.findUnique({ where: { id: taskId }, include: { business: { select: { userId: true } } } })
  if (!task) return res.status(404).json({ error: 'NOT_FOUND' })
  if (task.business.userId !== userId) return res.status(403).json({ error: 'FORBIDDEN' })
  if (task.status === 'EXECUTING') return res.status(409).json({ error: 'ALREADY_EXECUTING' })
  if (task.status !== 'APPROVED') return res.status(400).json({ error: 'NOT_APPROVED', status: task.status })
  const now = new Date()
  await db.weeklyAction.update({ where: { id: taskId }, data: { status: 'EXECUTING', executedAt: now } })
  return res.json({ taskId, status: 'EXECUTING', executedAt: now.toISOString(), estimatedCompletionMs: null })
})

// POST /api/tasks/:taskId/retry
router.post('/:taskId/retry', requireAuth, async (req: Request, res: Response) => {
  const { taskId } = req.params
  const userId     = (req as any).auth!.userId
  const task       = await db.weeklyAction.findUnique({ where: { id: taskId }, include: { business: { select: { userId: true } } } })
  if (!task) return res.status(404).json({ error: 'NOT_FOUND' })
  if (task.business.userId !== userId) return res.status(403).json({ error: 'FORBIDDEN' })
  if (task.status !== 'FAILED') return res.status(400).json({ error: 'NOT_FAILED', status: task.status })
  await db.weeklyAction.update({ where: { id: taskId }, data: { status: 'APPROVED', failedAt: null, failureReason: null } })
  return res.json({ taskId, status: 'APPROVED', message: 'Task reset to APPROVED' })
})

// POST /api/tasks/:taskId/update
router.post('/:taskId/update', requireAuth, async (req: Request, res: Response) => {
  const { taskId } = req.params
  const userId     = (req as any).auth!.userId
  const parse      = UpdateTaskSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: 'VALIDATION_FAILED', details: parse.error.errors })
  const task = await db.weeklyAction.findUnique({ where: { id: taskId }, include: { business: { select: { userId: true } } } })
  if (!task) return res.status(404).json({ error: 'NOT_FOUND' })
  if (task.business.userId !== userId) return res.status(403).json({ error: 'FORBIDDEN' })
  if (!['PENDING', 'APPROVED'].includes(task.status)) return res.status(400).json({ error: 'NOT_EDITABLE', status: task.status })
  const updates      = parse.data
  const updatedFields = Object.keys(updates).filter((k) => updates[k as keyof typeof updates] !== undefined)
  await db.weeklyAction.update({ where: { id: taskId }, data: updates })
  return res.json({ taskId, updatedAt: new Date().toISOString(), updatedFields })
})

export default router
