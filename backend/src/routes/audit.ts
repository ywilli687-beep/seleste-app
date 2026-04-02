import { Router, Request, Response } from 'express'
import { db } from '@/lib/db'
import { z } from 'zod'
import { fetchPage, extractHardSignals } from '@/lib/fetcher'
import Anthropic from '@anthropic-ai/sdk'
import {
  upsertBusiness, upsertBusinessSignals, saveAuditSnapshot,
  getVerticalPercentile, updateMarketSegment
} from '@/lib/data'
import { awardXP, type XPEventType } from '@/lib/gamification'
import { AUDIT_VERSION } from '@/lib/constants'
import type { AuditResult } from '@/types/audit'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
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
    const input = AuditSchema.parse(req.body)
    
    // ── 1. Fast Page Fetch ─────────────────────────────────────────────────────
    console.log('[STAGE 1] Fetching target:', input.url)
    const page = await fetchPage(input.url)
    if (page.error && !page.html) {
        return res.status(422).json({ success: false, error: `Analysis failed: ${page.error}` })
    }

    // ── 2. Fast Hard Signals ───────────────────────────────────────────────────
    const hard = extractHardSignals(page)

    // ── 3. High-Speed Consolidated Anthropic Scan (Single Call) ─────────────────
    console.log('[STAGE 3] Performing Intelligence Deep-Scan (Sonnet 3.5)...')
    
    const prompt = `Perform a comprehensive digital audit for a ${input.vertical} in ${input.location}.
Website HTML Analysis:
URL: ${input.url}
Title: ${hard.pageTitle}
Vertical: ${input.vertical}

${page.html?.slice(0, 30000)}

Analyze for:
1. Conversion System (Pillar 1)
2. Trust & Credibility (Pillar 2)
3. Performance (Pillar 3)
...all 10 pillars.

Return ONLY VALID JSON matching this exact structure:
{
  "overallScore": number (0-100),
  "pillarScores": {
    "conversion": number, "trust": number, "performance": number, "ux": number,
    "discoverability": number, "content": number, "data": number, "technical": number,
    "brand": number, "scalability": number
  },
  "grade": "A"|"B"|"C"|"D",
  "gradeLabel": "Strong Performer"|"Above Average"|"Needs Improvement"|"At Risk",
  "revenueLeak": number,
  "confidence": number,
  "recommendations": [{"prio": "high"|"med", "title": string, "impact": string}],
  "aiNarrative": string (HTML formatted paragraphs),
  "aiQuickWins": [string],
  "aiTopIssues": [string],
  "roadmap": [{"q": number, "task": string, "impact": string}],
  "signals": { ...PageSignals structure... }
}`

    const msg = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 3000,
      temperature: 0,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('')
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Intelligence extraction timed out or failed.')
    const intelligence = JSON.parse(match[0])

    // ── 4. Persist Analysis ────────────────────────────────────────────────────
    console.log('[STAGE 4] Saving analysis to OS...')
    const business = await upsertBusiness({
      url: page.finalUrl,
      businessName: input.businessName,
      vertical: input.vertical,
      location: input.location,
      overallScore: intelligence.overallScore,
      grade: intelligence.grade,
      pillarScores: intelligence.pillarScores,
    })

    const verticalPercentile = await getVerticalPercentile(input.vertical, intelligence.overallScore)

    const resultForDb: AuditResult = {
      auditId: '',
      businessId: business.id,
      slug: business.slug as string,
      input,
      signals: intelligence.signals,
      appliedRules: [],
      pillarScores: intelligence.pillarScores,
      overallScore: intelligence.overallScore,
      grade: intelligence.grade,
      gradeLabel: intelligence.gradeLabel,
      revenueLeak: intelligence.revenueLeak,
      confidence: intelligence.confidence,
      recommendations: intelligence.recommendations,
      benchmark: { avg: 65, top: 85 }, // Defaults
      verticalPercentile,
      aiNarrative: intelligence.aiNarrative,
      aiQuickWins: intelligence.aiQuickWins,
      aiTopIssues: intelligence.aiTopIssues,
      roadmap: intelligence.roadmap,
      createdAt: new Date().toISOString(),
      auditVersion: AUDIT_VERSION,
    }

    const snapshot = await saveAuditSnapshot({
      businessId: business.id,
      result: resultForDb,
      userId: input.userId ?? undefined,
    })

    res.json({ success: true, result: { ...resultForDb, auditId: snapshot.id } })

    // Async jobs
    const [city, st] = input.location.split(',').map(s => s.trim())
    updateMarketSegment(input.vertical, st, city).catch(() => null)
    if (input.userId) {
        awardXP({ type: 'first_audit', userId: input.userId, businessId: business.id, auditId: snapshot.id }).catch(() => null)
    }

  } catch (err: any) {
    console.error('[CRITICAL AUDIT ERROR]', err)
    res.status(500).json({ success: false, error: err.message || 'The intelligence engine is temporarily overloaded.' })
  }
})

export default router
