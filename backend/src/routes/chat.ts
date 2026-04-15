// @ts-nocheck
import { Router, Request, Response } from 'express'
import { requireAuth } from '../lib/auth'
import { db } from '../lib/db'
import Anthropic from '@anthropic-ai/sdk'

const router = Router()
const client = new Anthropic()

router.post('/', requireAuth, async (req: Request, res: Response) => {
  const { message, businessId } = req.body
  const userId = (req as any).auth!.userId
  if (!message || !businessId) return res.status(400).json({ error: 'message and businessId required' })

  const business = await db.business.findFirst({
    where:  { id: businessId, userId },
    select: { id: true, name: true, state: true, industry: true },
  })
  if (!business) return res.status(403).json({ error: 'FORBIDDEN' })

  const [latestSnapshot, pendingActions] = await Promise.all([
    db.auditSnapshot.findFirst({
      where:   { businessId },
      orderBy: { createdAt: 'desc' },
      select:  { overallScore: true, conversionScore: true, seoScore: true, reputationScore: true, contentScore: true, technicalScore: true, quickWins: true, scoreDelta: true },
    }),
    db.weeklyAction.findMany({
      where:   { businessId, status: { in: ['PENDING', 'APPROVED'] } },
      orderBy: { priority: 'desc' },
      take:    5,
      select:  { title: true, pillar: true, agentType: true, estimatedImpact: true, riskTier: true },
    }),
  ])

  const context = `
Business: ${business.name}
Industry: ${business.industry.replace(/_/g, ' ')}
Current state: ${(business.state ?? 'NO_FOUNDATION').replace(/_/g, ' ')}
${latestSnapshot ? `
Latest audit scores:
- Overall: ${latestSnapshot.overallScore}/100
- SEO: ${latestSnapshot.seoScore}/100
- Conversion: ${latestSnapshot.conversionScore}/100
- Reputation: ${latestSnapshot.reputationScore}/100
- Content: ${latestSnapshot.contentScore}/100
- Technical: ${latestSnapshot.technicalScore}/100
Score delta vs last audit: ${JSON.stringify(latestSnapshot.scoreDelta ?? 'first audit')}` : 'No audit data yet.'}
${pendingActions.length > 0 ? `
Top pending actions:
${pendingActions.map((a, i) => `${i + 1}. [${a.agentType}] ${a.title} — ${a.pillar}, +${a.estimatedImpact ?? '?'} pts, ${a.riskTier} risk`).join('\n')}` : 'No pending actions.'}`.trim()

  try {
    const response = await client.messages.create({
      model:       'claude-haiku-4-5-20251001',
      max_tokens:  400,
      temperature: 0.3,
      system: `You are Seleste, an AI advisor for local business websites.
You have access to this business's real audit scores and pending actions.
Be direct, specific, and action-oriented. Always reference the actual scores.
Never give generic advice — tie every recommendation to the specific numbers.
Keep responses to 3–5 sentences unless asked for detail.
When asked what to fix first, reference the highest-impact pending action.
Plain text only — no markdown headers, no bullet points unless listing steps.`,
      messages: [{ role: 'user', content: `${context}\n\nUser question: ${message}` }],
    })
    const reply = response.content.filter((b) => b.type === 'text').map((b) => (b as any).text).join('')
    return res.json({ reply, tokensUsed: response.usage.input_tokens + response.usage.output_tokens })
  } catch (err: any) {
    return res.status(500).json({ error: 'AI response failed', message: err.message })
  }
})

export default router
