import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { isSafeUrl, checkRateLimit } from '@/lib/validation'
import { fetchPage, extractHardSignals } from '@/lib/fetcher'
import { extractSignals, writeNarrative } from '@/lib/ai'
import {
  applyRules,
  computePillarScores,
  computeWeightedScore,
  computeGrade,
  computeRevenueLeak,
  computeConfidence,
  selectRecommendations,
  buildRoadmap,
  STATIC_BENCHMARKS,
} from '@/lib/engine'
import {
  upsertBusiness,
  upsertBusinessSignals,
  saveAuditSnapshot,
  computeScoreDelta,
  getVerticalPercentile,
  updateMarketSegment,
  getLiveBenchmark,
} from '@/lib/data'
import { awardXP } from '@/lib/gamification'
import { AUDIT_VERSION } from '@/lib/constants'
import { computeAndStoreBenchmarks } from '@/lib/benchmarks'
import type { AuditResult, Vertical } from '@/types/audit'

const router = Router()

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

router.post('/', async (req: Request, res: Response) => {
  try {
    // ── 0. Validate input ──────────────────────────────────────────────────────
    const input = AuditSchema.parse(req.body)

    // ── 0a. SSRF protection — block private/internal URLs ──────────────────────
    if (!isSafeUrl(input.url)) {
      return res.status(400).json({ success: false, error: 'URL is not allowed.' })
    }

    // ── 0b. Rate limiting ──────────────────────────────────────────────────────
    const ip = (req.headers['x-forwarded-for'] as string ?? '').split(',')[0].trim()
      || req.socket.remoteAddress
      || 'unknown'
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ success: false, error: 'Too many requests. Please wait a minute.' })
    }

    // ── 1. Fetch real page ─────────────────────────────────────────────────────
    console.log('[AUDIT] Stage 1: Fetching', input.url)
    const page = await fetchPage(input.url)
    if (page.error && !page.html) {
      return res.status(422).json({ success: false, error: `Could not reach that website: ${page.error}` })
    }

    // ── 2. Deterministic hard signals (no AI) ──────────────────────────────────
    console.log('[AUDIT] Stage 2: Extracting hard signals')
    const hard = extractHardSignals(page)

    // Enforce HTML cap before sending to AI (80k chars)
    const cappedHtml = page.html.slice(0, 80000)

    // ── 3. AI soft signal extraction (temperature: 0 — no drift) ──────────────
    // Hard signals are injected into the prompt and locked.
    // Only soft signals (hasCTA, hasBooking, hasBrandDiff, etc.) are AI-inferred.
    console.log('[AUDIT] Stage 3: AI soft signal extraction (temp:0)')
    const signals = await extractSignals(cappedHtml, page.finalUrl, hard, input.vertical)

    // ── 4. Deterministic rules engine ─────────────────────────────────────────
    // This is the source of truth for all scores. AI cannot change these.
    console.log('[AUDIT] Stage 4: Running rules engine')
    const { caps, penalties, applied } = applyRules(signals)
    const pillarScores = computePillarScores(signals, caps, penalties)
    const overallScore = computeWeightedScore(pillarScores)
    const { grade, label: gradeLabel } = computeGrade(overallScore)
    const revenueLeak = computeRevenueLeak(pillarScores, input.monthlyRevenue)
    const confidence = computeConfidence(signals)

    // ── 5. Recommendations + roadmap (deterministic, based on fired rules) ─────
    const recommendations = selectRecommendations(pillarScores, input.vertical)
    const roadmap = buildRoadmap(pillarScores, signals, applied)

    // ── 6. Benchmark — live DB first, static fallback ──────────────────────────
    const [city, state] = input.location.split(',').map(s => s.trim())
    const liveBenchmark = await getLiveBenchmark(input.vertical, state).catch(() => null)
    const staticBm = STATIC_BENCHMARKS[input.vertical as Vertical]
    const benchmarkAvg = liveBenchmark?.avg ?? staticBm.avg
    const benchmarkTop = liveBenchmark?.top ?? staticBm.top
    const benchmark = {
      avg: benchmarkAvg,
      top: benchmarkTop,
      count: liveBenchmark?.count,
    }

    // ── 7. AI narrative (narrative copy only — scores already computed above) ──
    console.log('[AUDIT] Stage 7: Writing AI narrative')
    const { narrative: aiNarrative, quickWins: aiQuickWins, topIssues: aiTopIssues } =
      await writeNarrative(input, pillarScores, overallScore, signals, applied)

    // ── 8. DB writes — ordered, all awaited ───────────────────────────────────
    console.log('[AUDIT] Stage 8: Persisting to database')

    // 8a. Upsert the permanent business record with real pillar scores
    const business = await upsertBusiness({
      url: page.finalUrl,
      businessName: input.businessName,
      vertical: input.vertical,
      location: input.location,
      overallScore,
      grade,
      pillarScores,
      userId: input.userId ?? null,
    })

    // 8b. Upsert living signal record for this business
    await upsertBusinessSignals(business.id, signals)

    // 8c. Score delta vs previous audit
    const delta = await computeScoreDelta(business.id, pillarScores, overallScore)

    // 8d. Vertical percentile (returns null if < 5 records — UI must handle null)
    const verticalPercentile = await getVerticalPercentile(input.vertical, overallScore)

    // 8e. Assemble the full result object
    const resultForDb: AuditResult = {
      auditId: '',         // filled after snapshot is created
      businessId: business.id,
      slug: business.slug as string,
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
      aiNarrative,
      aiQuickWins,
      aiTopIssues,
      roadmap,
      createdAt: new Date().toISOString(),
      auditVersion: AUDIT_VERSION,
    }

    // 8f. Save immutable audit snapshot with full rule trace
    // Derive benchmark enrichment fields
    const snapshotVertical: string = input.vertical
    const locationParts = input.location.split(',').map((s: string) => s.trim())
    const snapshotMetroArea: string | null = locationParts.length >= 2
      ? `${locationParts[0]}-${locationParts[1]}`
      : null
    const reviewCount = signals.estimatedReviewCount ?? 0
    const snapshotBusinessSize: string = reviewCount > 500 ? 'MEDIUM' : 'SMALL'
    const snapshotLeakageEstimate: number | null =
      revenueLeak.estimatedMonthlyLoss != null ? revenueLeak.estimatedMonthlyLoss : null

    const snapshot = await saveAuditSnapshot({
      businessId: business.id,
      result: resultForDb,
      delta,
      benchmarkAvg,
      benchmarkTop,
      userId: input.userId ?? null,
      vertical: snapshotVertical,
      metroArea: snapshotMetroArea,
      businessSize: snapshotBusinessSize,
      leakageEstimate: snapshotLeakageEstimate,
    })

    // ── 9. Respond with complete result ───────────────────────────────────────
    res.json({ success: true, result: { ...resultForDb, auditId: snapshot.id } })

    // ── 10. Fire-and-forget async jobs (never awaited — cannot block response) ─
    updateMarketSegment(input.vertical, state, city).catch((err) =>
      console.error('[AUDIT] updateMarketSegment failed:', err)
    )

    // Trigger n8n specialist agents
    const webhookUrl = process.env.SEL_MASTER_AGENT_WEBHOOK
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audit_id: snapshot.id,
          business_name: business.businessName,
          website: input.url,
          industry: input.vertical,
          scores: pillarScores,
          overall_score: overallScore,
          raw_results: resultForDb,
        }),
      }).catch((err) => console.error('[AUDIT] n8n webhook failed:', err))
    }
    if (input.userId) {
      awardXP({
        type: 'first_audit',
        userId: input.userId,
        businessId: business.id,
        auditId: snapshot.id,
      }).catch((err) => console.error('[AUDIT] awardXP failed:', err))
    }

    // Fire-and-forget benchmark recomputation after every successful audit
    computeAndStoreBenchmarks().catch((err) =>
      console.error('[AUDIT] computeAndStoreBenchmarks failed:', err)
    )

  } catch (err: any) {
    console.error('[AUDIT] Critical error:', err)

    // Zod validation errors — return field-level messages
    if (err?.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid input.',
        details: err.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`),
      })
    }

    res.status(500).json({
      success: false,
      error: err.message || 'Audit failed. Please try again.',
    })
  }
})

export default router