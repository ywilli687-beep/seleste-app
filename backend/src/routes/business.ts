// @ts-nocheck
import { Router, Request, Response } from 'express'
import { requireAuth } from '../lib/auth'
import { db } from '../lib/db'
import { getStateConstraints } from '../lib/stateMachine'
import { BusinessState } from '@prisma/client'

const router = Router()

async function assertOwnership(userId: string, businessId: string): Promise<boolean> {
  const b = await db.business.findFirst({ where: { id: businessId, userId }, select: { id: true } })
  return !!b
}

const STATE_NEXT_REQUIREMENTS: Record<BusinessState, string> = {
  NO_FOUNDATION:     'Overall score >= 30',
  CONVERSION_BROKEN: 'Overall >= 50 AND conversion >= 45',
  LOW_VISIBILITY:    'Overall >= 65 AND SEO >= 55',
  SCALING:           'Overall >= 80 for 2 consecutive crawler audits',
  OPTIMIZING:        'Maintain score >= 75 to stay in OPTIMIZING',
}

// GET /api/business/:businessId/state
router.get('/:businessId/state', requireAuth, async (req: Request, res: Response) => {
  const { businessId } = req.params
  const userId         = (req as any).auth!.userId
  if (!(await assertOwnership(userId, businessId))) return res.status(403).json({ error: 'FORBIDDEN' })
  const business = await db.business.findUnique({
    where:  { id: businessId },
    select: { state: true, crawlerEnrolled: true, nextCrawlAt: true },
  })
  if (!business) return res.status(404).json({ error: 'NOT_FOUND' })
  const latestSnapshot = await db.auditSnapshot.findFirst({
    where:   { businessId },
    orderBy: { createdAt: 'desc' },
    select:  { overallScore: true, createdAt: true },
  })
  const constraints    = getStateConstraints(business.state)
  const agentPermissions = Object.fromEntries(
    Object.entries(constraints).map(([agent, c]) => [agent, { allowed: !c.blocked, reason: c.reason }])
  )
  return res.json({
    businessId,
    state:                 business.state,
    overallScore:          latestSnapshot?.overallScore ?? null,
    lastAuditAt:           latestSnapshot?.createdAt?.toISOString() ?? null,
    nextCrawlAt:           business.nextCrawlAt?.toISOString() ?? null,
    crawlerEnrolled:       business.crawlerEnrolled,
    agentPermissions,
    nextStateRequirements: STATE_NEXT_REQUIREMENTS[business.state],
  })
})

// GET /api/business/:businessId/audits
router.get('/:businessId/audits', requireAuth, async (req: Request, res: Response) => {
  const { businessId } = req.params
  const userId         = (req as any).auth!.userId
  if (!(await assertOwnership(userId, businessId))) return res.status(403).json({ error: 'FORBIDDEN' })
  const limit  = Math.min(parseInt(req.query.limit as string) || 10, 50)
  const cursor = req.query.cursor as string | undefined
  const audits = await db.auditSnapshot.findMany({
    where:   { businessId, ...(cursor ? { id: { lt: cursor } } : {}) },
    orderBy: { createdAt: 'desc' },
    take:    limit + 1,
    select:  { id: true, overallScore: true, scoreDelta: true, triggerType: true, createdAt: true },
  })
  const hasMore    = audits.length > limit
  const page       = hasMore ? audits.slice(0, limit) : audits
  const nextCursor = hasMore ? page[page.length - 1].id : null
  return res.json({
    audits: page.map((a) => ({
      auditId:      a.id,
      overallScore: a.overallScore,
      scoreDelta:   (a.scoreDelta as any)?.overall ?? null,
      triggerType:  a.triggerType,
      createdAt:    a.createdAt.toISOString(),
    })),
    nextCursor,
    hasMore,
  })
})

// POST /api/business/:businessId/enroll-crawler
router.post('/:businessId/enroll-crawler', requireAuth, async (req: Request, res: Response) => {
  const { businessId } = req.params
  const userId         = (req as any).auth!.userId
  if (!(await assertOwnership(userId, businessId))) return res.status(403).json({ error: 'FORBIDDEN' })
  const intervalDays = Math.min(Math.max(parseInt(req.body.intervalDays) || 7, 1), 30)
  const nextCrawlAt  = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000)
  await db.business.update({
    where: { id: businessId },
    data:  { crawlerEnrolled: true, crawlIntervalDays: intervalDays, nextCrawlAt },
  })
  return res.json({ businessId, crawlerEnrolled: true, nextCrawlAt: nextCrawlAt.toISOString(), intervalDays })
})

// DELETE /api/business/:businessId/enroll-crawler
router.delete('/:businessId/enroll-crawler', requireAuth, async (req: Request, res: Response) => {
  const { businessId } = req.params
  const userId         = (req as any).auth!.userId
  if (!(await assertOwnership(userId, businessId))) return res.status(403).json({ error: 'FORBIDDEN' })
  await db.business.update({ where: { id: businessId }, data: { crawlerEnrolled: false, nextCrawlAt: null } })
  return res.json({ businessId, crawlerEnrolled: false })
})

// POST /api/business/:businessId/crawler/tick
// Called by weekly cron to advance nextCrawlAt after each run
router.post('/:businessId/crawler/tick', async (req: Request, res: Response) => {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'UNAUTHORIZED' })
  }
  const { businessId } = req.params
  const business = await db.business.findUnique({ where: { id: businessId }, select: { crawlIntervalDays: true } })
  if (!business) return res.status(404).json({ error: 'NOT_FOUND' })
  const nextCrawlAt = new Date(Date.now() + business.crawlIntervalDays * 24 * 60 * 60 * 1000)
  await db.business.update({ where: { id: businessId }, data: { lastCrawlAt: new Date(), nextCrawlAt } })
  return res.json({ businessId, nextCrawlAt: nextCrawlAt.toISOString() })
})

// GET /api/internal/crawler/due
// Returns businesses due for a crawl run — called by n8n weekly workflow
router.get('/internal/crawler/due', async (req: Request, res: Response) => {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'UNAUTHORIZED' })
  }
  const now        = new Date()
  const businesses = await db.business.findMany({
    where: {
      crawlerEnrolled: true,
      nextCrawlAt:     { lte: now },
      OR: [{ crawlCooldownUntil: null }, { crawlCooldownUntil: { lt: now } }],
    },
    select: { id: true, name: true, website: true, industry: true, state: true },
    take:   100,
  })
  return res.json({ businesses })
})

export default router
