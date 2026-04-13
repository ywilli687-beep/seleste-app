// @ts-nocheck
import Anthropic from '@anthropic-ai/sdk'
import { db } from '../../db'
import { AGENT_REGISTRY } from '../registry'
import { buildScopedContext } from '../coordinator'
import { checkAndLogCost } from '@/lib/data/costs'
import type { AgentContext } from '../types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

export async function runAgent(agentId: string, cycleId: string, fullContext: AgentContext, systemPrompt: string, userMessage: string) {
  const startTime = Date.now()
  const registration = AGENT_REGISTRY[agentId]
  
  if (!registration) {
    throw new Error(`Agent ${agentId} not found in registry`)
  }

  // 1. Build bounded context
  const { context: scopedContext, tokens: contextTokens, truncated } = buildScopedContext(fullContext, agentId)
  
  // 2. Create the initial Database record
  const runRecord = await db.agentRun.create({
    data: {
      cycleId,
      agentId,
      status: 'pending',
      modelUsed: registration.model,
      agentVersion: registration.currentVersion,
      contextTokens,
      truncated,
      truncationSteps: truncated ? ['automatic_cascade'] : []
    }
  })

  try {
    // 3. Call Claude
    const response = await anthropic.messages.create({
      model: registration.model,
      max_tokens: registration.maxTokens > 0 ? registration.maxTokens : 1000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userMessage }
      ]
    })

    const responseText = (response.content[0] as any)?.text || ''
    
    // Parse the JSON. In real implementation, this demands stricter schemas
    const parsedObj = JSON.parse(responseText.trim().replace(/^```json/, '').replace(/```$/, ''))

    const durationMs = Date.now() - startTime
    const promptTokens = response.usage.input_tokens
    const outputTokens = response.usage.output_tokens

    // 4. Log cost explicitly
    const actualCostUsd = await checkAndLogCost(fullContext.businessId, agentId, promptTokens, outputTokens, registration.model)

    // 5. Save the parsed JSON
    await db.agentRun.update({
      where: { id: runRecord.id },
      data: {
        status: 'complete',
        outputJson: parsedObj,
        durationMs,
        promptTokens,
        outputTokens,
        actualCostUsd
      }
    })

    return parsedObj

  } catch (err: any) {
    const durationMs = Date.now() - startTime
    await db.agentRun.update({
      where: { id: runRecord.id },
      data: {
        status: 'failed',
        error: err.message,
        durationMs
      }
    })
    throw err
  }
}
