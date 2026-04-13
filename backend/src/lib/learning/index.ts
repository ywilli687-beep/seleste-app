// @ts-nocheck
import { db } from '../db'
import { AgentType, BusinessState, Industry, OutcomeSignal } from '@prisma/client'

export interface LearnedPattern {
  industry:        Industry
  state:           BusinessState
  agentType:       AgentType
  actionType:      string
  pillar:          string
  sampleSize:      number
  avgTargetDelta:  number
  avgOverallDelta: number
  successRate:     number
  avgEffortScore:  number
  confidenceScore: number
}

export interface CronResult {
  runDate:           string
  outcomesProcessed: number
  outcomesSkipped:   number
  businessesAudited: number
  agentCyclesFired:  number
  reportGenerated:   boolean
  errors:            string[]
  durationMs:        number
}

export interface WeeklyReport {
  runDate:    string
  period:     { from: string; to: string }
  businesses: { total: number; crawlerEnrolled: number; audited: number; improved: number; declined: number }
  actions:    { created: number; approved: number; completed: number; failed: number; autoExecuted: number; completionRate: number }
  learning:   { outcomesRecorded: number; patternsUpdated: number; avgSuccessRate: number; topPerformingActions: Array<{ actionType: string; successRate: number; avgDelta: number; sampleSize: number }> }
  topMovers:  Array<{ businessId: string; businessName: string; scoreDelta: number; newScore: number }>
  weeklyInsight: string
}

const MIN_SAMPLES_FOR_CONFIDENCE = 10
const HIGH_CONFIDENCE_SAMPLES    = 30

function computeConfidence(sampleSize: number): number {
  if (sampleSize < 3)                              return 0.0
  if (sampleSize < MIN_SAMPLES_FOR_CONFIDENCE)     return 0.3 * (sampleSize / MIN_SAMPLES_FOR_CONFIDENCE)
  if (sampleSize >= HIGH_CONFIDENCE_SAMPLES)       return 0.95
  const range    = HIGH_CONFIDENCE_SAMPLES - MIN_SAMPLES_FOR_CONFIDENCE
  const progress = sampleSize - MIN_SAMPLES_FOR_CONFIDENCE
  return 0.3 + (0.65 * (progress / range))
}

function avg(nums: number[]): number {
  if (nums.length === 0) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

async function updateLearningSignal(key: {
  industry:   Industry
  state:      BusinessState
  agentType:  AgentType
  actionType: string
  pillar:     string
}): Promise<void> {
  const outcomes = await db.outcomeTracking.findMany({
    where: {
      signal: { not: 'NO_SIGNAL' },
      action: { agentType: key.agentType, actionType: key.actionType, pillar: key.pillar, status: 'COMPLETED', business: { industry: key.industry, state: key.state } },
    },
    select: { targetPillarDelta: true, overallDelta: true, signal: true, action: { select: { estimatedEffort: true } } },
  })
  if (outcomes.length === 0) return
  const sampleSize      = outcomes.length
  const successCount    = outcomes.filter((o) => o.signal === 'SCORE_IMPROVED').length
  const successRate     = successCount / sampleSize
  const avgTargetDelta  = avg(outcomes.map((o) => o.targetPillarDelta ?? 0))
  const avgOverallDelta = avg(outcomes.map((o) => o.overallDelta ?? 0))
  const avgEffortScore  = avg(outcomes.map((o) => o.action.estimatedEffort ?? 3))
  const confidenceScore = computeConfidence(sampleSize)
  await db.learningSignal.upsert({
    where: { industry_state_pillar_agentType_actionType: { industry: key.industry, state: key.state, pillar: key.pillar, agentType: key.agentType, actionType: key.actionType } },
    create: { ...key, sampleSize, avgTargetDelta, avgOverallDelta, successRate, avgEffortScore, confidenceScore },
    update: { sampleSize, avgTargetDelta, avgOverallDelta, successRate, avgEffortScore, confidenceScore },
  })
}

export async function processOutcome(outcomeId: string): Promise<void> {
  const outcome = await db.outcomeTracking.findUnique({
    where:   { id: outcomeId },
    include: { action: { select: { agentType: true, actionType: true, pillar: true, estimatedEffort: true, business: { select: { industry: true, state: true } } } } },
  })
  if (!outcome || !outcome.scoreAfterAction) return
  const before         = outcome.scoreBeforeAction as Record<string, number>
  const after          = outcome.scoreAfterAction  as Record<string, number>
  const pillarKey      = outcome.action.pillar.toLowerCase()
  const targetDelta    = (after[pillarKey] ?? 0) - (before[pillarKey] ?? 0)
  const overallDelta   = (after['overall']  ?? 0) - (before['overall']  ?? 0)
  const signal: OutcomeSignal = targetDelta > 3 ? 'SCORE_IMPROVED' : targetDelta < -3 ? 'SCORE_DECLINED' : 'SCORE_UNCHANGED'
  await db.outcomeTracking.update({ where: { id: outcomeId }, data: { targetPillarDelta: targetDelta, overallDelta, signal, outcomeRecordedAt: new Date() } })
  await db.weeklyAction.update({ where: { id: outcome.actionId }, data: { outcomeSignal: signal } })
  await updateLearningSignal({ industry: outcome.action.business.industry, state: outcome.action.business.state, agentType: outcome.action.agentType, actionType: outcome.action.actionType, pillar: outcome.action.pillar })
}

export async function closeOutcomeLoops(): Promise<{ processed: number; skipped: number }> {
  const openOutcomes = await db.outcomeTracking.findMany({
    where:   { signal: 'NO_SIGNAL' },
    include: { action: { select: { businessId: true, completedAt: true } } },
  })
  let processed = 0
  let skipped   = 0
  for (const outcome of openOutcomes) {
    if (!outcome.action.completedAt) { skipped++; continue }
    const followUp = await db.auditSnapshot.findFirst({
      where:   { businessId: outcome.action.businessId, createdAt: { gt: outcome.action.completedAt } },
      orderBy: { createdAt: 'asc' },
      select:  { id: true, overallScore: true, conversionScore: true, seoScore: true, reputationScore: true, contentScore: true, technicalScore: true, mobileScore: true, trustScore: true, localScore: true, accessibilityScore: true, performanceScore: true },
    })
    if (!followUp) { skipped++; continue }
    await db.outcomeTracking.update({
      where: { id: outcome.id },
      data:  { scoreAfterAction: { overall: followUp.overallScore, conversion: followUp.conversionScore, seo: followUp.seoScore, reputation: followUp.reputationScore, content: followUp.contentScore, technical: followUp.technicalScore, mobile: followUp.mobileScore, trust: followUp.trustScore, local: followUp.localScore, accessibility: followUp.accessibilityScore, performance: followUp.performanceScore }, followUpSnapshotId: followUp.id },
    })
    await processOutcome(outcome.id)
    processed++
  }
  return { processed, skipped }
}

export async function getTopPatterns(industry: Industry, state: BusinessState, limit: number = 10): Promise<LearnedPattern[]> {
  const signals = await db.learningSignal.findMany({
    where:   { industry, state, confidenceScore: { gte: 0.4 }, successRate: { gte: 0.5 } },
    orderBy: [{ successRate: 'desc' }, { avgTargetDelta: 'desc' }],
    take:    limit,
  })
  return signals.map((s) => ({ industry: s.industry, state: s.state, agentType: s.agentType, actionType: s.actionType, pillar: s.pillar, sampleSize: s.sampleSize, avgTargetDelta: s.avgTargetDelta ?? 0, avgOverallDelta: s.avgOverallDelta ?? 0, successRate: s.successRate ?? 0, avgEffortScore: s.avgEffortScore ?? 3, confidenceScore: s.confidenceScore ?? 0 }))
}

export async function generateWeeklyReport(runDate: string): Promise<WeeklyReport> {
  const to   = new Date(runDate)
  const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000)
  const [totalBusinesses, enrolledBusinesses] = await Promise.all([
    db.business.count(),
    db.business.count({ where: { crawlerEnrolled: true } }),
  ])
  const weeklyAudits = await db.auditSnapshot.findMany({
    where:  { createdAt: { gte: from, lte: to } },
    select: { businessId: true, overallScore: true, scoreDelta: true, business: { select: { name: true } } },
  })
  const improved = weeklyAudits.filter((a) => ((a.scoreDelta as any)?.overall ?? 0) > 0).length
  const declined = weeklyAudits.filter((a) => ((a.scoreDelta as any)?.overall ?? 0) < 0).length
  const [created, approved, completed, failed] = await Promise.all([
    db.weeklyAction.count({ where: { createdAt:   { gte: from, lte: to } } }),
    db.weeklyAction.count({ where: { approvedAt:  { gte: from, lte: to } } }),
    db.weeklyAction.count({ where: { completedAt: { gte: from, lte: to } } }),
    db.weeklyAction.count({ where: { failedAt:    { gte: from, lte: to } } }),
  ])
  const autoExecuted      = await db.weeklyAction.count({ where: { completedAt: { gte: from, lte: to }, riskTier: 'LOW' } })
  const completionRate    = approved > 0 ? Math.round((completed / approved) * 100) : 0
  const outcomesRecorded  = await db.outcomeTracking.count({ where: { outcomeRecordedAt: { gte: from, lte: to }, signal: { not: 'NO_SIGNAL' } } })
  const updatedSignals    = await db.learningSignal.findMany({ where: { updatedAt: { gte: from, lte: to } }, select: { successRate: true } })
  const avgSuccessRate    = updatedSignals.length > 0 ? Math.round(avg(updatedSignals.map((s) => s.successRate ?? 0)) * 100) : 0
  const topActions        = await db.learningSignal.findMany({ where: { sampleSize: { gte: 5 }, successRate: { gte: 0.6 } }, orderBy: [{ successRate: 'desc' }, { avgTargetDelta: 'desc' }], take: 5, select: { actionType: true, successRate: true, avgTargetDelta: true, sampleSize: true } })
  const topMovers         = weeklyAudits.map((a) => ({ businessId: a.businessId, businessName: a.business.name, scoreDelta: (a.scoreDelta as any)?.overall ?? 0, newScore: a.overallScore })).sort((a, b) => b.scoreDelta - a.scoreDelta).slice(0, 5)
  const weeklyInsight     = completed === 0
    ? 'No actions completed this week — approve pending items in your inbox to start improving scores.'
    : improved > declined
      ? `${improved} businesses improved scores this week with a ${avgSuccessRate}% action success rate.`
      : `${completed} actions completed this week across ${weeklyAudits.length} businesses audited.`
  return { runDate, period: { from: from.toISOString(), to: to.toISOString() }, businesses: { total: totalBusinesses, crawlerEnrolled: enrolledBusinesses, audited: weeklyAudits.length, improved, declined }, actions: { created, approved, completed, failed, autoExecuted, completionRate }, learning: { outcomesRecorded, patternsUpdated: updatedSignals.length, avgSuccessRate, topPerformingActions: topActions.map((s) => ({ actionType: s.actionType, successRate: Math.round((s.successRate ?? 0) * 100), avgDelta: Math.round(s.avgTargetDelta ?? 0), sampleSize: s.sampleSize })) }, topMovers, weeklyInsight }
}

export async function runWeeklyCron(): Promise<CronResult> {
  const start   = Date.now()
  const runDate = new Date().toISOString()
  const errors: string[] = []
  let outcomesProcessed = 0
  let outcomesSkipped   = 0
  let businessesAudited = 0
  let agentCyclesFired  = 0
  try {
    const loopResult  = await closeOutcomeLoops()
    outcomesProcessed = loopResult.processed
    outcomesSkipped   = loopResult.skipped
  } catch (err: any) { errors.push(`Outcome loop: ${err.message}`) }
  const now           = new Date()
  const dueBusinesses = await db.business.findMany({
    where:  { crawlerEnrolled: true, nextCrawlAt: { lte: now }, OR: [{ crawlCooldownUntil: null }, { crawlCooldownUntil: { lt: now } }] },
    select: { id: true, website: true, name: true, industry: true, state: true },
    take:   100,
  })
  const apiUrl     = process.env.VITE_API_URL    ?? 'http://localhost:4000'
  const cronSecret = process.env.CRON_SECRET     ?? ''
  const webhook    = process.env.SEL_MASTER_AGENT_WEBHOOK ?? ''
  for (const business of dueBusinesses) {
    try {
      const auditRes = await fetch(`${apiUrl}/api/audit`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cronSecret}` }, body: JSON.stringify({ url: business.website, businessName: business.name, industry: business.industry, businessId: business.id, _trigger: 'CRAWLER' }) })
      if (!auditRes.ok) { errors.push(`Audit failed for ${business.name}: ${auditRes.status}`); continue }
      const audit       = await auditRes.json()
      businessesAudited++
      const delta       = audit.scoreDelta?.overall ?? 0
      const maxPillar   = audit.scoreDelta ? Math.max(...Object.values(audit.scoreDelta as Record<string, number>).map(Math.abs)) : 0
      if (Math.abs(delta) >= 5 || maxPillar >= 5) {
        if (webhook) {
          try {
            await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ audit_id: audit.auditId, business_name: business.name, website: business.website, industry: business.industry, scores: audit.scores, overall_score: audit.overallScore, raw_results: audit }) })
            agentCyclesFired++
          } catch (err: any) { errors.push(`Webhook failed for ${business.name}: ${err.message}`) }
        }
      }
      const interval = 7
      await db.business.update({ where: { id: business.id }, data: { lastCrawlAt: now, nextCrawlAt: new Date(now.getTime() + interval * 24 * 60 * 60 * 1000) } })
    } catch (err: any) { errors.push(`${business.name}: ${err.message}`) }
  }
  let reportGenerated = false
  try { await generateWeeklyReport(runDate); reportGenerated = true } catch (err: any) { errors.push(`Report: ${err.message}`) }
  return { runDate, outcomesProcessed, outcomesSkipped, businessesAudited, agentCyclesFired, reportGenerated, errors, durationMs: Date.now() - start }
}

export const STATIC_FALLBACK_PATTERNS: Partial<Record<BusinessState, string[]>> = {
  NO_FOUNDATION:     ['ADD_CTA', 'ADD_TRUST_BADGE', 'FIX_BOOKING_WIDGET'],
  CONVERSION_BROKEN: ['FIX_BOOKING_WIDGET', 'IMPROVE_FORM', 'ADD_CTA', 'REQUEST_REVIEW'],
  LOW_VISIBILITY:    ['ADD_SCHEMA', 'FIX_SITEMAP', 'OPTIMIZE_HEADINGS', 'ADD_CITATION'],
  SCALING:           ['UPDATE_META', 'ADD_LOCATION_PAGE', 'REQUEST_REVIEW', 'ADD_FAQ'],
  OPTIMIZING:        ['PUBLISH_CONTENT', 'CREATE_CAMPAIGN', 'UPDATE_COPY', 'ADD_KEYWORD'],
}
