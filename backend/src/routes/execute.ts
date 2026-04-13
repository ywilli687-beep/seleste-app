// @ts-nocheck
import { Router, Request, Response } from 'express'
import { requireAuth } from '../lib/auth'
import { db } from '../lib/db'
import { validateBatch } from '../lib/execution/validator'
import { AgentType } from '@prisma/client'

const router = Router()

function requireCronSecret(req: Request, res: Response, next: Function) {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'UNAUTHORIZED' })
  }
  next()
}

async function getCurrentScores(businessId: string): Promise<Record<string, number>> {
  const latest = await db.auditSnapshot.findFirst({
    where:   { businessId },
    orderBy: { createdAt: 'desc' },
    select:  { overallScore: true, conversionScore: true, seoScore: true, reputationScore: true, contentScore: true, technicalScore: true, mobileScore: true, trustScore: true, localScore: true, accessibilityScore: true, performanceScore: true },
  })
  if (!latest) return {}
  return { overall: latest.overallScore, conversion: latest.conversionScore, seo: latest.seoScore, reputation: latest.reputationScore, content: latest.contentScore, technical: latest.technicalScore, mobile: latest.mobileScore, trust: latest.trustScore, local: latest.localScore, accessibility: latest.accessibilityScore, performance: latest.performanceScore }
}

// POST /api/execute/:actionId
router.post('/:actionId', requireAuth, async (req: Request, res: Response) => {
  const { actionId } = req.params
  const userId       = (req as any).auth!.userId
  const action = await db.weeklyAction.findUnique({
    where:   { id: actionId },
    include: { business: { select: { userId: true, state: true, website: true } } },
  })
  if (!action) return res.status(404).json({ error: 'NOT_FOUND' })
  if (action.business.userId !== userId) return res.status(403).json({ error: 'FORBIDDEN' })
  if (action.status !== 'APPROVED') return res.status(400).json({ error: 'NOT_APPROVED', status: action.status })
  const now = new Date()
  await db.weeklyAction.update({ where: { id: actionId }, data: { status: 'EXECUTING', executedAt: now } })
  try {
    const scores = await getCurrentScores(action.businessId)
    await db.weeklyAction.update({ where: { id: actionId }, data: { status: 'COMPLETED', completedAt: new Date() } })
    await db.outcomeTracking.create({ data: { actionId, scoreBeforeAction: scores, executedAt: now } })
    return res.json({ actionId, status: 'COMPLETED', rollbackAvailable: false, durationMs: Date.now() - now.getTime() })
  } catch (err: any) {
    await db.weeklyAction.update({ where: { id: actionId }, data: { status: 'FAILED', failedAt: new Date(), failureReason: err.message } })
    return res.status(500).json({ error: 'EXECUTION_FAILED', message: err.message })
  }
})

// POST /api/execute/:actionId/rollback
router.post('/:actionId/rollback', requireAuth, async (req: Request, res: Response) => {
  const { actionId } = req.params
  const userId       = (req as any).auth!.userId
  const action = await db.weeklyAction.findUnique({ where: { id: actionId }, include: { business: { select: { userId: true } } } })
  if (!action) return res.status(404).json({ error: 'NOT_FOUND' })
  if (action.business.userId !== userId) return res.status(403).json({ error: 'FORBIDDEN' })
  if (!action.rollbackAvailable) return res.status(400).json({ error: 'ROLLBACK_UNAVAILABLE' })
  if (action.status !== 'COMPLETED') return res.status(400).json({ error: 'NOT_COMPLETED' })
  await db.weeklyAction.update({ where: { id: actionId }, data: { status: 'FAILED', failureReason: 'Rolled back by user', rollbackAvailable: false } })
  return res.json({ actionId, rolledBack: true })
})

// POST /api/execute/:actionId/retry
router.post('/:actionId/retry', requireAuth, async (req: Request, res: Response) => {
  const { actionId } = req.params
  const userId       = (req as any).auth!.userId
  const action = await db.weeklyAction.findUnique({ where: { id: actionId }, include: { business: { select: { userId: true } } } })
  if (!action) return res.status(404).json({ error: 'NOT_FOUND' })
  if (action.business.userId !== userId) return res.status(403).json({ error: 'FORBIDDEN' })
  if (action.status !== 'FAILED') return res.status(400).json({ error: 'NOT_FAILED' })
  await db.weeklyAction.update({ where: { id: actionId }, data: { status: 'APPROVED', failedAt: null, failureReason: null } })
  return res.json({ actionId, status: 'APPROVED' })
})

// GET /api/execute/queue — auto-execute eligible actions (cron use)
router.get('/queue', requireCronSecret, async (req: Request, res: Response) => {
  const AUTO_ELIGIBLE = new Set(['UPDATE_META','ADD_SCHEMA','FIX_SITEMAP','UPDATE_ROBOTS','OPTIMIZE_HEADINGS','ADD_FAQ'])
  const candidates = await db.weeklyAction.findMany({
    where:   { status: 'APPROVED', riskTier: 'LOW' },
    include: { business: { select: { state: true } } },
    orderBy: { priority: 'desc' },
    take:    50,
  })
  const eligible = candidates.filter((a) => AUTO_ELIGIBLE.has(a.actionType))
  return res.json({ count: eligible.length, actions: eligible.map((a) => ({ actionId: a.id, actionType: a.actionType, businessId: a.businessId, priority: a.priority })) })
})

// POST /api/execute/validate-batch — validate actions before DB write (internal)
router.post('/validate-batch', requireCronSecret, async (req: Request, res: Response) => {
  const { actions, agentType, businessId } = req.body
  if (!actions || !agentType || !businessId) return res.status(400).json({ error: 'Missing required fields' })
  const business = await db.business.findUnique({ where: { id: businessId }, select: { state: true } })
  if (!business) return res.status(404).json({ error: 'Business not found' })
  const latestSnapshot = await db.auditSnapshot.findFirst({ where: { businessId }, orderBy: { createdAt: 'desc' }, select: { overallScore: true, conversionScore: true, seoScore: true, reputationScore: true, contentScore: true, technicalScore: true, mobileScore: true, trustScore: true, localScore: true, accessibilityScore: true, performanceScore: true } })
  const pillarScores = latestSnapshot ? { overall: latestSnapshot.overallScore, conversion: latestSnapshot.conversionScore, seo: latestSnapshot.seoScore, reputation: latestSnapshot.reputationScore, content: latestSnapshot.contentScore, technical: latestSnapshot.technicalScore, mobile: latestSnapshot.mobileScore, trust: latestSnapshot.trustScore, local: latestSnapshot.localScore, accessibility: latestSnapshot.accessibilityScore, performance: latestSnapshot.performanceScore } : {}
  const result = validateBatch(actions, agentType as AgentType, business.state, pillarScores)
  return res.json({ passed: result.passed.length, rejected: result.rejected.length, passedActions: result.passed, rejectedActions: result.rejected, warningDetails: result.warnings })
})

export default router
