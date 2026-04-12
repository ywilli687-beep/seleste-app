// ─────────────────────────────────────────────────────────────────────────────
// Seleste Agentic System — Layer Boundary Contracts
//
// This file defines what each system layer hands to the next.
// No implementation logic lives here — pure type definitions only.
//
// Layer 1: Intake         → validates + cleans external input
// Layer 2: Audit Engine   → deterministic scoring pipeline
// Layer 3: Agent Orchestration → n8n dispatch + callback handling
// Layer 4: Execution      → applies approved agent actions
// Layer 5: Learning       → stores outcomes, updates benchmarks
// ─────────────────────────────────────────────────────────────────────────────

// ── Layer 1 → Layer 2: Intake → Audit Engine ──────────────────────────────────
// Validated, SSRF-checked payload handed from the intake layer to the audit pipeline.

export interface IntakePayload {
  url: string
  businessName?: string
  location: string
  industry: string              // maps to Vertical enum
  monthlyRevenue?: number
  triggeredBy: 'MANUAL' | 'SCHEDULED' | 'API' | 'BULK_IMPORT'
  userId?: string | null
  ip: string                    // sourced from request, used for rate-limiting + audit trail
}

// ── Layer 2 → Layer 3: Audit Engine → Agent Orchestration ────────────────────
// Re-exported for layer clarity. Agents receive the full AuditResult.

export type { AuditResult } from '@/types/audit'

// ── Layer 3 → Layer 4: Agent Orchestration → Execution ───────────────────────
// Structured action proposal produced by an agent after a completed cycle.

export type AgentActionType =
  | 'CONTENT_UPDATE'
  | 'REVIEW_RESPONSE'
  | 'SEO_OPTIMIZATION'
  | 'CRO_CHANGE'
  | 'PERFORMANCE_FIX'
  | 'SCHEMA_INJECTION'
  | 'GBP_UPDATE'
  | 'OUTREACH'

export interface AgentAction {
  actionId: string
  agentType: string
  actionType: AgentActionType
  targetUrl: string
  businessId: string
  payload: Record<string, unknown>
  estimatedLiftPts: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  requiresApproval: boolean
  createdAt: string
}

// Payload the n8n callback endpoint receives after a cycle run completes.
export interface AgentCallbackPayload {
  cycleId: string
  businessId: string
  agentType: string
  status: 'done' | 'failed' | 'skipped'
  actions: AgentAction[]
  confidenceScore: number       // 0–1
  tokensUsed: number
  completedAt: string
  error?: string
}

// ── Layer 4 → Layer 5: Execution → Learning ───────────────────────────────────
// Verified execution outcome written to the learning layer after an action runs.

export type ExecutionStatus = 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'ROLLED_BACK'

export interface OutcomeRecord {
  actionId: string
  businessId: string
  agentType: string
  actionType: AgentActionType
  executedAt: string
  status: ExecutionStatus
  scoreBefore: number
  scoreAfter: number | null     // null until a re-audit confirms the impact
  revenueDeltaEstimate: number | null
  evidence: string[]            // URLs, screenshots, API confirmations
  retryCount: number
  errorDetail?: string
}
