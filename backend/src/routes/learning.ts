// @ts-nocheck
import { Router, Request, Response } from 'express'
import { requireAuth } from '../lib/auth'
import { db } from '../lib/db'
import { runWeeklyCron, generateWeeklyReport, getTopPatterns, processOutcome, closeOutcomeLoops } from '../lib/learning'
import { Industry, BusinessState } from '@prisma/client'

const router = Router()

function requireCronSecret(req: Request, res: Response, next: Function) {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'UNAUTHORIZED' })
  }
  next()
}

// POST /api/learning/cron — trigger weekly cron manually
router.post('/cron', requireCronSecret, async (req: Request, res: Response) => {
  const result = await runWeeklyCron()
  return res.json(result)
})

// POST /api/learning/close-loops — close open outcome loops
router.post('/close-loops', requireCronSecret, async (req: Request, res: Response) => {
  const result = await closeOutcomeLoops()
  return res.json(result)
})

// POST /api/learning/process-outcome/:outcomeId
router.post('/process-outcome/:outcomeId', requireCronSecret, async (req: Request, res: Response) => {
  await processOutcome(req.params.outcomeId)
  return res.json({ processed: true, outcomeId: req.params.outcomeId })
})

// GET /api/learning/patterns
router.get('/patterns', requireAuth, async (req: Request, res: Response) => {
  const { industry, state, limit } = req.query
  if (!industry || !state) return res.status(400).json({ error: 'industry and state are required' })
  const patterns = await getTopPatterns(industry as Industry, state as BusinessState, limit ? parseInt(limit as string) : 10)
  return res.json({ patterns })
})

// GET /api/learning/report
router.get('/report', requireAuth, async (req: Request, res: Response) => {
  const report = await generateWeeklyReport(new Date().toISOString())
  return res.json(report)
})

// GET /api/learning/signals — internal use by agents
router.get('/signals', requireCronSecret, async (req: Request, res: Response) => {
  const { industry, state, minConfidence } = req.query
  const where: any = {}
  if (industry)       where.industry = industry
  if (state)          where.state    = state
  if (minConfidence)  where.confidenceScore = { gte: parseFloat(minConfidence as string) }
  const signals = await db.learningSignal.findMany({ where, orderBy: [{ successRate: 'desc' }, { sampleSize: 'desc' }], take: 50 })
  return res.json({ signals, count: signals.length })
})

// POST /api/learning/internal/weekly — called by n8n at end of weekly run
router.post('/internal/weekly', requireCronSecret, async (req: Request, res: Response) => {
  const { run_date } = req.body
  const report = await generateWeeklyReport(run_date ?? new Date().toISOString())
  console.log('[WeeklyReport] insight:', report.weeklyInsight)
  return res.json({ generated: true, insight: report.weeklyInsight })
})

// GET /api/learning/dashboard — learning stats for admin UI
router.get('/dashboard', requireAuth, async (req: Request, res: Response) => {
  const [totalSignals, highConfidenceSignals, totalOutcomes, successfulOutcomes, recentPatterns] = await Promise.all([
    db.learningSignal.count(),
    db.learningSignal.count({ where: { confidenceScore: { gte: 0.6 } } }),
    db.outcomeTracking.count({ where: { signal: { not: 'NO_SIGNAL' } } }),
    db.outcomeTracking.count({ where: { signal: 'SCORE_IMPROVED' } }),
    db.learningSignal.findMany({ where: { confidenceScore: { gte: 0.5 } }, orderBy: { updatedAt: 'desc' }, take: 10, select: { agentType: true, actionType: true, pillar: true, successRate: true, avgTargetDelta: true, sampleSize: true, confidenceScore: true, industry: true, state: true } }),
  ])
  const overallSuccessRate = totalOutcomes > 0 ? Math.round((successfulOutcomes / totalOutcomes) * 100) : 0
  return res.json({
    signals:  { total: totalSignals, highConfidence: highConfidenceSignals, coverage: totalSignals > 0 ? Math.round((highConfidenceSignals / totalSignals) * 100) : 0 },
    outcomes: { total: totalOutcomes, successful: successfulOutcomes, successRate: overallSuccessRate },
    recentPatterns: recentPatterns.map((p) => ({ agentType: p.agentType, actionType: p.actionType, pillar: p.pillar, industry: p.industry, state: p.state, successRate: Math.round((p.successRate ?? 0) * 100), avgDelta: Math.round(p.avgTargetDelta ?? 0), sampleSize: p.sampleSize, confidence: Math.round((p.confidenceScore ?? 0) * 100) })),
    coldStart: totalSignals < 10,
    coldStartMessage: totalSignals < 10 ? `${totalSignals} patterns learned — needs ${10 - totalSignals} more completed actions to reach baseline confidence` : null,
  })
})

export default router
