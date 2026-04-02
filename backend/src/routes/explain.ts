import { Router, Request, Response } from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = Router()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

router.post('/', async (req: Request, res: Response) => {
  try {
    const context = req.body

    let userPrompt = ''
    switch (context.type) {
      case 'overall_score':
        userPrompt = `Business: ${context.businessName} (${context.vertical})\nOverall score: ${context.score}/100 — Grade ${context.grade} (${context.gradeLabel})\nTop pillar: ${context.topPillar} | Lowest pillar: ${context.lowestPillar}\nRevenue leakage: ${context.revenueLeak}%\n\nExplain what this overall score means for this specific business.\nWhat does grade ${context.grade} tell them about where they stand?\nWhat's the single most important thing this score reveals?`
        break
      case 'revenue_leakage':
        userPrompt = `Business: ${context.businessName} (${context.vertical})\nRevenue leakage estimate: ${context.leakPercent}%\nLowest pillars driving this: ${context.lowestPillars.join(', ')}\n\nExplain what the revenue leakage estimate means in plain English.\nHow is this calculated conceptually? What does ${context.leakPercent}% actually mean for a ${context.vertical} business?\nWhat's the most direct action to reduce it?`
        break
      case 'pillar':
        userPrompt = `Business: ${context.businessName} (${context.vertical})\nPillar: ${context.pillarName}\nScore: ${context.pillarScore}/100 | Weight: ${context.pillarWeight}% of total score | Industry avg: ${context.industryAvg}\n\nExplain what the "${context.pillarName}" pillar measures in plain English.\nThen tell them specifically what a score of ${context.pillarScore} means for their ${context.vertical} business.\nCompare to the industry average of ${context.industryAvg} if it's meaningful.`
        break
      case 'signal':
        userPrompt = `Business: ${context.businessName} (${context.vertical})\nSignal: ${context.signalName}\nDetected: ${context.signalValue}\n\nExplain what "${context.signalName}" is and why it matters for a ${context.vertical} business.\nThen tell them what it means that this signal ${context.signalValue} on their site.\nKeep it to 2–3 sentences.`
        break
      default:
        return res.status(400).json({ success: false, error: 'Invalid context type' })
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      temperature: 0.7,
      system: 'You are an expert digital marketing advisor inside Seleste, a website audit tool.\nAn owner clicked a "?" icon next to an audit element. Explan what that element means for their specific business in plain, direct English.\nRules:\n- Never use jargon without explaining it\n- Make it personal: reference their business name, vertical, and actual score\n- Never be generic\n- Be honest but constructive\n- Length: 2-4 sentences max. Tight and useful.\n- No filler intros (e.g. "Great question!")\n- Write in second person ("your site", "this means you")',
      messages: [{ role: 'user', content: userPrompt }]
    })

    const explanation = message.content[0].type === 'text' ? message.content[0].text : 'Explanation unavailable.'

    return res.json({ success: true, explanation })
  } catch (err) {
    console.error('[Explain Error]', err)
    return res.status(500).json({ success: false, error: 'Failed to generate explanation' })
  }
})

export default router
