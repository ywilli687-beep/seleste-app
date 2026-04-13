import { AgentContext, ScopedAgentContext, AgentContextRequirements, HistoricalSummary } from './types'
import { getAgentContextReqs } from './registry'

// Rough token estimator based on characters / 4
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

function assembleScopedFields(fullContext: AgentContext, reqs: AgentContextRequirements): ScopedAgentContext {
  const scoped: ScopedAgentContext = {
    business: {},
    audit: {},
    benchmarks: {},
    previousOutputs: {}
  }

  for (const field of reqs.fromBusiness) {
    scoped.business[field] = (fullContext as any)[field] || (fullContext.businessName && field === 'businessName' ? fullContext.businessName : null)
  }

  for (const field of reqs.fromLatestAudit) {
    scoped.audit[field] = (fullContext as any)[field]
  }

  if (reqs.fromBenchmarks) {
    for (const field of reqs.fromBenchmarks) {
      scoped.benchmarks[field] = (fullContext as any)[field]
    }
  }

  if (reqs.fromPreviousOutputs === 'all_current_cycle') {
    scoped.previousOutputs = { ...fullContext.previousOutputs }
  } else if (Array.isArray(reqs.fromPreviousOutputs)) {
    for (const field of reqs.fromPreviousOutputs) {
      if (fullContext.previousOutputs[field]) {
        scoped.previousOutputs[field] = fullContext.previousOutputs[field]
      }
    }
  }

  return scoped
}

function buildHistoricalContext(previousWeekOutputs: any[], weeks: number, fields: string[]): HistoricalSummary | null {
  // Mock historical summary construction. In real use, this fetches from AgentCycle
  return null
}

export function truncateContext(
  context: ScopedAgentContext,
  requirements: AgentContextRequirements,
  currentTokens: number
): ScopedAgentContext {
  // Truncation cascade
  // 1. Remove historical context beyond most recent 2 cycles
  // 2. Truncate competitorIntel to top 3 opportunities only
  // 3. Truncate issues list to top 5 only
  // 4. Summarize aiNarrative to first 2 sentences

  let modified = { ...context }
  let tokens = currentTokens

  if (tokens > requirements.maxContextTokens && modified.previousOutputs?.competitor_intel?.opportunities) {
    modified.previousOutputs.competitor_intel.opportunities = modified.previousOutputs.competitor_intel.opportunities.slice(0, 3)
    tokens = estimateTokens(JSON.stringify(modified))
  }

  if (tokens > requirements.maxContextTokens && modified.audit?.issues) {
    modified.audit.issues = modified.audit.issues.slice(0, 5)
    tokens = estimateTokens(JSON.stringify(modified))
  }

  if (tokens > requirements.maxContextTokens && modified.previousOutputs?.audit_agent?.aiNarrative) {
    const sentences = modified.previousOutputs.audit_agent.aiNarrative.split('. ')
    modified.previousOutputs.audit_agent.aiNarrative = sentences.slice(0, 2).join('. ') + '.'
    tokens = estimateTokens(JSON.stringify(modified))
  }

  return modified
}

export function buildScopedContext(
  fullContext: AgentContext,
  agentId: string,
  previousWeekOutputs: any[] = []
): { context: ScopedAgentContext; tokens: number; truncated: boolean } {
  const requirements = getAgentContextReqs(agentId)
  
  const scoped = assembleScopedFields(fullContext, requirements)

  if (requirements.fromPreviousWeeks) {
    scoped.historicalContext = buildHistoricalContext(
      previousWeekOutputs,
      requirements.fromPreviousWeeks,
      requirements.previousWeekFields ?? []
    )
  }

  const estimatedTokens = estimateTokens(JSON.stringify(scoped))

  if (estimatedTokens > requirements.maxContextTokens) {
    const truncatedContext = truncateContext(scoped, requirements, estimatedTokens)
    const finalTokens = estimateTokens(JSON.stringify(truncatedContext))
    return { context: truncatedContext, tokens: finalTokens, truncated: true }
  }

  return { context: scoped, tokens: estimatedTokens, truncated: false }
}
