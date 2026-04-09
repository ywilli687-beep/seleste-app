import { Router, Request, Response } from 'express'
import { db } from '@/lib/db'
import { selectRecommendations, buildRoadmap } from '@/lib/engine'
import type { AuditResult, PillarScores, PageSignals, AppliedRule, VerticalBenchmark, RevenueLeak, AuditConfidence, PillarId } from '@/types/audit'

const router = Router()

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth?.userId
    const { id } = req.params

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const snapshot = await db.auditSnapshot.findUnique({
      where: { id: id as string },
      include: {
        business: true,
        appliedRules: true,
      }
    })

    if (!snapshot) {
      return res.status(404).json({ success: false, error: 'Report not found' })
    }

    // Verify ownership
    if (snapshot.triggeredByUser !== userId) {
      return res.status(403).json({ success: false, error: 'Forbidden. You do not own this report.' })
    }

    // Reconstruct PillarScores
    const pillarScores: PillarScores = {
      conversion: snapshot.conversionScore,
      trust: snapshot.trustScore,
      performance: snapshot.performanceScore,
      ux: snapshot.uxScore,
      discoverability: snapshot.discoverScore,
      content: snapshot.contentScore,
      data: snapshot.dataScore,
      technical: snapshot.technicalScore,
      brand: snapshot.brandScore,
      scalability: snapshot.scalabilityScore,
    }

    // Reconstruct AppliedRules
    const appliedRules: AppliedRule[] = (snapshot as any).appliedRules.map((r: any) => ({
      pillarId: r.pillarId,
      rule: { id: r.ruleId, label: r.ruleLabel, cap: r.capValue ?? 0, pen: r.penaltyValue ?? 0, fn: () => false }, // Fake fn for now
      type: r.ruleType,
      baseScore: r.baseScore,
      finalScore: r.finalScore,
    }))

    // Reconstruct Signals
    const signals = snapshot.signalSnapshot as unknown as PageSignals

    // Reconstruct Benchmark
    const benchmark: VerticalBenchmark = {
      avg: snapshot.benchmarkAvg as number[],
      top: snapshot.benchmarkTop as number[],
    }

    // Reconstruct Revenue Leak
    const revenueLeak: RevenueLeak = {
      totalPct: snapshot.leakagePct,
      estimatedMonthlyLoss: snapshot.estimatedMonthlyLoss ?? undefined,
      breakdown: [
        { label: 'Conversion Friction', pillar: 'conversion' as PillarId, pct: snapshot.leakageConversion, icon: 'funnel' },
        { label: 'Trust Deficit', pillar: 'trust' as PillarId, pct: snapshot.leakageTrust, icon: 'shield' },
        { label: 'Performance Drag', pillar: 'performance' as PillarId, pct: snapshot.leakagePerformance, icon: 'zap' },
        { label: 'UX Drop-off', pillar: 'ux' as PillarId, pct: snapshot.leakageUX, icon: 'layout' },
      ].filter(b => b.pct > 0),
      conversionPct: snapshot.leakageConversion,
      trustPct: snapshot.leakageTrust,
      performancePct: snapshot.leakagePerformance,
      uxPct: snapshot.leakageUX,
    }

    // Reconstruct Confidence
    const confidence: AuditConfidence = {
      pct: snapshot.confidencePct,
      missingSignals: snapshot.missingSignals,
    }

    // Recompute Recommendations and Roadmap dynamically
    const recommendations = selectRecommendations(pillarScores, snapshot.inputVertical as any)
    const roadmap = buildRoadmap(pillarScores, signals, appliedRules)

    const result: AuditResult = {
      auditId: snapshot.id,
      businessId: snapshot.businessId,
      input: {
        url: snapshot.inputUrl,
        location: snapshot.inputLocation,
        vertical: snapshot.inputVertical as any,
        monthlyRevenue: snapshot.inputMonthlyRevenue ?? undefined,
      },
      signals,
      appliedRules,
      pillarScores,
      overallScore: snapshot.overallScore,
      grade: snapshot.grade as any,
      gradeLabel: 'Reconstructed', // Minor string
      revenueLeak,
      confidence,
      recommendations,
      benchmark,
      verticalPercentile: undefined,
      aiNarrative: snapshot.aiNarrative ?? '',
      aiQuickWins: snapshot.aiQuickWins ?? [],
      aiTopIssues: snapshot.aiTopIssues ?? [],
      roadmap,
      delta: snapshot.scoreDelta !== null ? {
        scoreDelta: snapshot.scoreDelta,
        improvedPillars: snapshot.improvedPillars as any,
        regressedPillars: snapshot.regressedPillars as any,
        previousAuditId: snapshot.previousAuditId ?? '',
        previousScore: 0,
        previousDate: '',
      } : undefined,
      createdAt: snapshot.createdAt.toISOString(),
      auditVersion: '2.1',
    }

    return res.json({ success: true, result })

  } catch (err) {
    console.error('[GET Report Error]', err)
    return res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Internal server error' })
  }
})

/**
 * POST /api/report/:id/share
 * Makes the business report public (if not already) and returns the shareable URL.
 * :id is the AuditSnapshot.id.
 */
router.post('/:id/share', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth?.userId
    const snapshotId = req.params.id as string

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const snapshot = await db.auditSnapshot.findUnique({
      where: { id: snapshotId },
      include: { business: true },
    })

    if (!snapshot) {
      return res.status(404).json({ success: false, error: 'Report not found' })
    }

    if (snapshot.triggeredByUser !== userId) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    // Ensure reportPublic is true and a slug exists
    const business = snapshot.business
    if (!business.slug) {
      return res.status(400).json({ success: false, error: 'Business has no shareable slug' })
    }

    if (!business.reportPublic) {
      await db.business.update({
        where: { id: business.id },
        data: { reportPublic: true },
      })
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://app.seleste.io'
    const shareUrl = `${frontendUrl}/report/${business.slug}`

    return res.json({ success: true, share_url: shareUrl })
  } catch (err) {
    console.error('[POST Share Error]', err)
    return res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Internal server error' })
  }
})

export default router
