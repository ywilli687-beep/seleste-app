import Anthropic from '@anthropic-ai/sdk'
import { db } from '../../db'
import { AGENT_REGISTRY } from '../registry'

// The Eval framework checks that prompts are robust against diverse business profiles
export interface EvalCase {
  caseId: string
  description: string
  context: any
  assertions: {
    type: 'has_keys' | 'max_length' | 'does_not_contain' | 'custom'
    value?: any
    fn?: (output: any) => boolean
  }[]
}

export const GOLDEN_CASES_REPORTING: EvalCase[] = [
  {
    caseId: 'reporting_all_agents_failed',
    description: 'When all upstream agents fail, the reporting agent should not fabricate data',
    context: {
      business: { businessName: 'Plumbing Pros', vertical: 'home_services' },
      audit: { overallScore: 40, grade: 'C' },
      benchmarks: {},
      previousOutputs: {}
    },
    assertions: [
      { type: 'has_keys', value: ['executiveSummary', 'dashboardHeadline'] },
      { type: 'custom', fn: (output: any) => output.dashboardHeadline.includes('compiling') || output.dashboardHeadline.includes('ran') }
    ]
  },
  {
    caseId: 'reporting_score_decline',
    description: 'When the score declines, the reporting agent must acknowledge it immediately',
    context: {
      business: { businessName: 'Dental Care', vertical: 'healthcare' },
      audit: {},
      benchmarks: {},
      historicalContext: {
        scoreTrajectory: [84, 82], // Declined
      },
      previousOutputs: {
        optimization_agent: { droppedSignals: ['google_reviews'] }
      }
    },
    assertions: [
      { type: 'does_not_contain', value: 'amazing' },
      { type: 'does_not_contain', value: 'crushing it' },
      { type: 'custom', fn: (output: any) => output.executiveSummary.toLowerCase().includes('drop') || output.executiveSummary.toLowerCase().includes('decline') }
    ]
  }
]

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

export async function runAgentEval(agentId: string, systemPrompt: string, testCases: EvalCase[]) {
  const reg = AGENT_REGISTRY[agentId]
  if (!reg) throw new Error('Agent not found')

  let passed = 0
  let failed = 0
  let costUsd = 0

  for (const tCase of testCases) {
    console.log(`[EVAL] Running ${tCase.caseId}...`)
    
    const userMessage = `Context: ${JSON.stringify(tCase.context, null, 2)}`

    const res = await anthropic.messages.create({
      model: reg.model,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })

    const text = (res.content[0] as any)?.text || ''
    
    // basic cost tracking for evals
    costUsd += (res.usage.input_tokens * 0.003 / 1000) + (res.usage.output_tokens * 0.015 / 1000) 

    try {
      const output = JSON.parse(text.replace(/^```json/, '').replace(/```$/, ''))
      
      let casePassed = true
      for (const assert of tCase.assertions) {
        if (assert.type === 'has_keys') {
          const keys = assert.value as string[]
          if (!keys.every(k => k in output)) casePassed = false
        }
        if (assert.type === 'does_not_contain') {
          if (JSON.stringify(output).toLowerCase().includes(assert.value.toLowerCase())) casePassed = false
        }
        if (assert.type === 'custom' && assert.fn) {
          if (!assert.fn(output)) casePassed = false
        }
      }

      if (casePassed) passed++
      else {
        failed++
        console.warn(`[EVAL FAILED] ${tCase.caseId}`)
      }
    } catch (e) {
      failed++
      console.warn(`[EVAL CRASH] ${tCase.caseId} returned malformed JSON`)
    }
  }

  // Save Eval run to DB
  await db.agentEvalRun.create({
    data: {
      agentId,
      promptVersion: reg.currentVersion,
      totalCases: testCases.length,
      passed,
      failed,
      criticalFailed: 0,
      costUsd,
      triggeredBy: 'eval_runner',
      branchName: 'main'
    }
  })

  return { passed, failed, costUsd }
}
