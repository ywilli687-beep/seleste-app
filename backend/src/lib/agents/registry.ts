import { AgentRegistration, AgentContextRequirements } from './types'

export const AGENT_REGISTRY: Record<string, AgentRegistration> = {
  intake_agent: {
    agentId: 'intake_agent', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-haiku-4-5-20251001', maxTokens: 400, tokenBudget: 400, estimatedCostUsd: 0.0003
  },
  audit_agent: {
    agentId: 'audit_agent', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-haiku-4-5-20251001', maxTokens: 0, tokenBudget: 0, estimatedCostUsd: 0.00
  },
  vertical_intel: {
    agentId: 'vertical_intel', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-sonnet-4-20250514', maxTokens: 800, tokenBudget: 800, estimatedCostUsd: 0.008
  },
  competitor_intel: {
    agentId: 'competitor_intel', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-sonnet-4-20250514', maxTokens: 600, tokenBudget: 600, estimatedCostUsd: 0.006
  },
  offer_positioning: {
    agentId: 'offer_positioning', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-sonnet-4-20250514', maxTokens: 1200, tokenBudget: 1200, estimatedCostUsd: 0.014
  },
  growth_architect: {
    agentId: 'growth_architect', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-sonnet-4-20250514', maxTokens: 3000, tokenBudget: 2500, estimatedCostUsd: 0.022
  },
  paid_media_strategist: {
    agentId: 'paid_media_strategist', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-sonnet-4-20250514', maxTokens: 1000, tokenBudget: 1000, estimatedCostUsd: 0.010
  },
  creative_strategist: {
    agentId: 'creative_strategist', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-sonnet-4-20250514', maxTokens: 1500, tokenBudget: 1500, estimatedCostUsd: 0.012
  },
  cro_agent: {
    agentId: 'cro_agent', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-sonnet-4-20250514', maxTokens: 800, tokenBudget: 800, estimatedCostUsd: 0.008
  },
  analytics_agent: {
    agentId: 'analytics_agent', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-haiku-4-5-20251001', maxTokens: 400, tokenBudget: 400, estimatedCostUsd: 0.0003
  },
  local_seo_agent: {
    agentId: 'local_seo_agent', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-haiku-4-5-20251001', maxTokens: 500, tokenBudget: 500, estimatedCostUsd: 0.0004
  },
  media_analyst: {
    agentId: 'media_analyst', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-sonnet-4-20250514', maxTokens: 1000, tokenBudget: 1000, estimatedCostUsd: 0.012
  },
  reputation_agent: {
    agentId: 'reputation_agent', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-haiku-4-5-20251001', maxTokens: 400, tokenBudget: 400, estimatedCostUsd: 0.0003
  },
  lead_capture_agent: {
    agentId: 'lead_capture_agent', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-haiku-4-5-20251001', maxTokens: 400, tokenBudget: 400, estimatedCostUsd: 0.0003
  },
  optimization_agent: {
    agentId: 'optimization_agent', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-sonnet-4-20250514', maxTokens: 2000, tokenBudget: 1500, estimatedCostUsd: 0.022
  },
  reporting_agent: {
    agentId: 'reporting_agent', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-sonnet-4-20250514', maxTokens: 3000, tokenBudget: 2000, estimatedCostUsd: 0.028
  },
  onboarding_agent: {
    agentId: 'onboarding_agent', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-haiku-4-5-20251001', maxTokens: 300, tokenBudget: 300, estimatedCostUsd: 0.0002
  },
  data_intelligence: {
    agentId: 'data_intelligence', currentVersion: '1.0.0',
    supportedVersions: ['1.0.0'], deprecatedVersions: [],
    model: 'claude-haiku-4-5-20251001', maxTokens: 0, tokenBudget: 0, estimatedCostUsd: 0.00
  }
}

export const AGENT_CONTEXT_REQUIREMENTS: Record<string, AgentContextRequirements> = {
  intake_agent: {
    fromBusiness: ['businessName', 'vertical', 'locationCity', 'monthlyRevenue'],
    fromLatestAudit: [],
    fromPreviousOutputs: [],
    maxContextTokens: 800,
  },
  growth_architect: {
    fromBusiness: ['businessName', 'vertical', 'locationCity', 'monthlyRevenue'],
    fromLatestAudit: ['overallScore', 'grade', 'pillars', 'issues'],
    fromPreviousOutputs: ['intake_agent', 'audit_agent', 'vertical_intel', 'competitor_intel', 'offer_positioning'],
    fromBenchmarks: ['medianScore', 'topGaps'],
    maxContextTokens: 6000,
  },
  optimization_agent: {
    fromBusiness: ['businessName', 'vertical'],
    fromLatestAudit: ['overallScore', 'grade'],
    fromPreviousOutputs: ['media_analyst', 'reputation_agent', 'lead_capture_agent'],
    fromPreviousWeeks: 4,  
    previousWeekFields: ['optimization_agent'],  
    maxContextTokens: 5000,
  },
  reporting_agent: {
    fromBusiness: ['businessName', 'vertical', 'locationCity'],
    fromLatestAudit: ['overallScore', 'grade', 'revenueLeak'],
    fromPreviousOutputs: 'all_current_cycle',
    maxContextTokens: 8000,
  },
  // Default fallback for any others
  default: {
    fromBusiness: ['businessName', 'vertical'],
    fromLatestAudit: ['overallScore', 'grade'],
    fromPreviousOutputs: 'all_current_cycle',
    maxContextTokens: 4000,
  }
}

export const getAgentContextReqs = (id: string) => AGENT_CONTEXT_REQUIREMENTS[id] || AGENT_CONTEXT_REQUIREMENTS['default']
