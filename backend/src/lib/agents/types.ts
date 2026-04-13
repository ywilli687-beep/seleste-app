import { Business, AuditSnapshot, AgentCycle, WeeklyAction } from '@prisma/client'

// Core Context Object passed around during the cycle
export interface AgentContext {
  businessId: string
  businessName: string | null
  vertical: string
  locationCity: string | null
  monthlyRevenue: number | null
  
  // From Audit
  overallScore: number | null
  grade: string | null
  pillars: any | null
  issues: string[] | null
  revenueLeak: number | null

  // From Benchmarks
  medianScore: number | null
  topGaps: string[] | null

  // Outputs of previous agents in the chain
  previousOutputs: Record<string, any>
}

// Scoped Context given directly to an agent
export interface ScopedAgentContext {
  business: Record<string, any>
  audit: Record<string, any>
  benchmarks: Record<string, any>
  previousOutputs: Record<string, any>
  historicalContext?: HistoricalSummary | null
}

export interface HistoricalSummary {
  cycleCount: number
  scoreTrajectory: (number | null)[]
  completedActionsCount: number
  topRepeatedIssues: string[]
  recentOptimizationOutputs: {
    week: string | null
    adjustments: string[]
    drops: string[]
  }[]
}

export interface AgentContextRequirements {
  fromBusiness: string[]
  fromLatestAudit: string[]
  fromPreviousOutputs: string[] | 'all_current_cycle'
  fromBenchmarks?: string[]
  fromPreviousWeeks?: number    
  previousWeekFields?: string[] 
  maxContextTokens: number
}

export interface AgentRegistration {
  agentId: string
  currentVersion: string
  supportedVersions: string[]
  deprecatedVersions: string[]
  model: 'claude-sonnet-4-20250514' | 'claude-haiku-4-5-20251001'
  maxTokens: number
  tokenBudget: number       
  estimatedCostUsd: number  
}

// All agent outputs will implement this for dashboard rendering
export interface AgentOutputMeta {
  _meta: {
    confidence: 'high' | 'medium' | 'low'
    dataCompleteness: number   
    agentsUnavailable: string[] 
    warnings: string[]         
  }
}
