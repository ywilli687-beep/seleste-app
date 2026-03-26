import { db } from '../db'
import { AGENT_REGISTRY } from '../agents/registry'

export function estimateCost(promptTokens: number, outputTokens: number, model: string): number {
  if (model === 'claude-sonnet-4-20250514') {
    return (promptTokens * 0.003 / 1000) + (outputTokens * 0.015 / 1000)
  } else if (model === 'claude-haiku-4-5-20251001') {
    return (promptTokens * 0.00025 / 1000) + (outputTokens * 0.00125 / 1000)
  }
  return 0
}

interface CostAlert {
  agentId: string
  businessId: string
  expectedCost: number
  actualCost: number
  promptTokens: number | null
  outputTokens: number | null
}

export async function logCostAlert(alert: CostAlert) {
  console.warn(`[AGENT COST ALERT] ${alert.agentId} exceeded budget. Expected: $${alert.expectedCost.toFixed(4)}, Actual: $${alert.actualCost.toFixed(4)}`)
  // You would typically dispatch to Slack or Sentry here
}

export async function checkAndLogCost(businessId: string, agentId: string, promptTokens: number, outputTokens: number, modelUsed: string) {
  const actualCost = estimateCost(promptTokens, outputTokens, modelUsed)
  const registration = AGENT_REGISTRY[agentId]
  
  if (registration && actualCost > registration.estimatedCostUsd * 2) {
    await logCostAlert({
      agentId,
      businessId,
      expectedCost: registration.estimatedCostUsd,
      actualCost,
      promptTokens,
      outputTokens
    })
  }

  return actualCost
}
