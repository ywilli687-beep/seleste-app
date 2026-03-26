import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { fetchPage, extractHardSignals } from '@/lib/fetcher'
import { extractSignals, writeNarrative } from '@/lib/ai'
import {
  applyRules, computePillarScores, computeWeightedScore, computeGrade,
  computeRevenueLeak, computeConfidence, selectRecommendations,
  buildRoadmap, STATIC_BENCHMARKS,
} from '@/lib/engine'

import {
  upsertBusiness, upsertBusinessSignals, saveAuditSnapshot,
  computeScoreDelta, getLiveBenchmark, getVerticalPercentile, updateMarketSegment,
} from '@/lib/data'
import { runPostAuditJobs } from '@/lib/jobs'
import { awardXP, computeStreak, checkAndAwardAchievements, type AchievementContext } from '@/lib/gamification'
import type { AuditResult } from '@/types/audit'

const router = Router()

// ── P2 Fix Gap4: Zod schema replaces manual if-check ──────────────────────────
const AuditSchema = z.object({
  url: z.string().min(1, 'URL is required'),
  businessName: z.string().max(120).optional(),
  location: z.string().min(2, 'Location is required').max(120),
  vertical: z.enum([
    'AUTO_REPAIR', 'CAR_WASH', 'RESTAURANT', 'HOME_SERVICES', 'LOCAL_SERVICE',
    'DENTAL', 'LEGAL', 'REAL_ESTATE', 'FITNESS', 'BEAUTY_SALON',
    'PLUMBING', 'HVAC', 'LANDSCAPING', 'CLEANING', 'PET_SERVICES',
  ]),
  monthlyRevenue: z.number().positive().optional(),
  triggeredBy: z.enum(['MANUAL', 'SCHEDULED', 'API', 'BULK_IMPORT']).default('MANUAL'),
  userId: z.string().nullable().optional(),
})

// ── P1 Fix Gap3: SSRF protection ──────────────────────────────────────────────
// Blocks requests to private IPs, localhost, and AWS metadata endpoint.
function isSafeUrl(rawUrl: string): boolean {
  try {
    let url = rawUrl.trim()
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url
    const { hostname, protocol } = new URL(url)

    // Must be http or https
    if (!['http:', 'https:'].includes(protocol)) return false

    const blocked = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254.169.254']
    if (blocked.some(b => hostname === b || hostname.endsWith('.' + b))) return false

    // RFC1918 private ranges
    if (/^10\./.test(hostname)) return false
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(hostname)) return false
    if (/^192\.168\./.test(hostname)) return false
    if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(hostname)) return false

    return true
  } catch {
    return false
  }
}

// ── P1 Fix Gap2: Simple in-memory rate limiter ────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10   // max requests
const WINDOW_MS  = 60_000  // per 60 seconds

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true  // allowed
  }

  if (record.count >= RATE_LIMIT) return false  // blocked

  record.count++
  return true  // allowed
}

router.post('/', async (req: Request, res: Response) => {
  try {
    // Rate limit check
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown'
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ success: false, error: 'Too many requests — please wait a minute before trying again.' })
    }

    const body = req.body

    const parsed = AuditSchema.safeParse(body)
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? 'Invalid input'
      return res.status(400).json({ success: false, error: msg })
    }

    const rawInput = parsed.data

    // Normalize and validate URL
    let cleanUrl = rawInput.url.trim()
    if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = 'https://' + cleanUrl

    // SSRF protection
    if (!isSafeUrl(cleanUrl)) {
      return res.status(400).json({ success: false, error: 'Invalid or disallowed URL' })
    }

    const input = { ...rawInput, url: cleanUrl }

    // ── 1. Fetch real page ─────────────────────────────────────────────────────
    const page = await fetchPage(input.url)
    if (page.error && !page.html) {
      return res.status(422).json({ success: false, error: `Could not fetch website: ${page.error}` })
    }

    // ── 2. Hard signals (deterministic, no AI) ────────────────────────────────
    const hard = extractHardSignals(page)

    // ── 3. AI signal extraction ───────────────────────────────────────────────
    const signals = await extractSignals(page.html, page.finalUrl, hard)

    // ── 4. Rules engine ────────────────────────────────────────────────────────
    const { caps, penalties, applied } = applyRules(signals)

    // ── 5. Scoring ─────────────────────────────────────────────────────────────
    const pillarScores = computePillarScores(signals, caps, penalties)
    const overallScore = computeWeightedScore(pillarScores)
    const { grade, label: gradeLabel } = computeGrade(overallScore)

    // ── 6. Analytics ───────────────────────────────────────────────────────────
    const revenueLeak = computeRevenueLeak(pillarScores, input.monthlyRevenue)
    const confidence  = computeConfidence(signals)
    const recommendations = selectRecommendations(pillarScores, input.vertical)

    // ── 7. Personalized roadmap (P2 fix — uses actual audit results) ──────────
    const roadmap = buildRoadmap(pillarScores, signals, applied)

    // ── 8. Live benchmark (all 10 pillars now correct after P0 fix) ───────────
    const locationParts = input.location.split(',').map(s => s.trim())
    const state = locationParts[1] ?? undefined
    const liveBenchmark = await getLiveBenchmark(input.vertical, state).catch(() => null)
    const benchmark = liveBenchmark ?? STATIC_BENCHMARKS[input.vertical] ?? STATIC_BENCHMARKS.LOCAL_SERVICE

    // ── 9. AI narrative ────────────────────────────────────────────────────────
    const { narrative, quickWins, topIssues } = await writeNarrative(
      input, pillarScores, overallScore, signals, applied
    )

    // ── 10. Persist to database ────────────────────────────────────────────────
    let businessId = ''
    let auditId    = ''
    let verticalPercentile: number | undefined
    let delta      = undefined

    try {
      const business = await upsertBusiness({
        url: page.finalUrl,
        businessName: input.businessName,
        vertical: input.vertical,
        location: input.location,
        overallScore,
        grade,
        pillarScores,
      })
      businessId = business.id

      await upsertBusinessSignals(businessId, signals)

      delta              = await computeScoreDelta(businessId, pillarScores, overallScore)
      verticalPercentile = await getVerticalPercentile(input.vertical, overallScore)

      const resultForDb: AuditResult = {
        auditId: '',  // filled after save
        businessId,
        input,
        signals,
        appliedRules: applied,
        pillarScores,
        overallScore,
        grade,
        gradeLabel,
        revenueLeak,
        confidence,
        recommendations,
        benchmark,
        verticalPercentile,
        aiNarrative: narrative,
        aiQuickWins: quickWins,
        aiTopIssues: topIssues,
        roadmap,
        delta,
        createdAt: new Date().toISOString(),
        auditVersion: '2.1',  // bumped for this fix release
      }

      const snapshot = await saveAuditSnapshot({
        businessId,
        result: resultForDb,
        delta,
        benchmarkAvg: benchmark.avg,
        benchmarkTop: benchmark.top,
        userId: input.userId ?? undefined,
      })
      auditId = snapshot.id

      // Bug 4 fix: trim city/state before passing to updateMarketSegment
      const [city, st] = locationParts
      updateMarketSegment(input.vertical, st, city).catch(err =>
        console.error('[Market Segment Update Error]', err)
      )

      // V2 Async Post-Audit Tasks
      Promise.all([
        runPostAuditJobs(auditId),
        (async () => {
          try {
            const uId = input.userId || 'anon'
            const xpType = business.auditCount === 1 ? 'first_audit' : 'subsequent_audit'
            await awardXP({ type: xpType, userId: uId, businessId: business.id, auditId })

            if (delta?.scoreDelta && delta.scoreDelta >= 10) {
              await awardXP({ type: 'score_improved_10', userId: uId, businessId: business.id, auditId })
            }

            const prevGrade = delta ? computeGrade(delta.previousScore).grade : null
            const grades = ['D', 'C', 'B', 'A']
            if (prevGrade && grade !== prevGrade && grades.indexOf(grade) > grades.indexOf(prevGrade)) {
              await awardXP({ type: 'grade_upgraded', userId: uId, businessId: business.id, auditId })
            }

            const { streakDays } = await computeStreak(business.id)
            if (streakDays === 7)  await awardXP({ type: 'streak_7_day',  userId: uId, businessId: business.id })
            if (streakDays === 30) await awardXP({ type: 'streak_30_day', userId: uId, businessId: business.id })

            const context: AchievementContext = {
              totalAudits: business.auditCount,
              bestScore: business.bestScore ? Math.max(business.bestScore, overallScore) : overallScore,
              overallScore,
              maxMonthlyImprovement: delta?.scoreDelta && delta.scoreDelta > 0 ? delta.scoreDelta : 0,
              completedActions: 0, 
              streakDays,
              localRank: business.localRank || null,
              verticalMedian: benchmark.avg.reduce((a,b)=>a+b,0) / benchmark.avg.length // rough estimate
            }
            await checkAndAwardAchievements(uId, business.id, context)
            
          } catch(err) {
            console.error('[Gamification Error]', err)
          }
        })()
      ]).catch(err => console.error('[Background Jobs Global Error]', err))

    } catch (dbErr) {
      // DB errors never block the user from seeing their audit result
      console.error('[DB Error — audit result still returned]', dbErr)
    }

    const result: AuditResult = {
      auditId,
      businessId,
      input,
      signals,
      appliedRules: applied,
      pillarScores,
      overallScore,
      grade,
      gradeLabel,
      revenueLeak,
      confidence,
      recommendations,
      benchmark,
      verticalPercentile,
      aiNarrative: narrative,
      aiQuickWins: quickWins,
      aiTopIssues: topIssues,
      roadmap,
      delta,
      createdAt: new Date().toISOString(),
      auditVersion: '2.1',
    }

    return res.json({ success: true, result })

  } catch (err) {
    console.error('[Audit Error]', err)
    return res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Internal server error' })
  }
})

export default router
