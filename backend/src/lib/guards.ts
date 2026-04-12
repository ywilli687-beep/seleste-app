// ─────────────────────────────────────────────────────────────────────────────
// Seleste Agentic System — Layer Guards
//
// Four guard functions enforce layer boundary contracts at runtime.
// Every guard throws LayerViolationError on violation — never returns a partial.
// Caught by the global handler in index.ts and returned as 400 LAYER_VIOLATION.
// ─────────────────────────────────────────────────────────────────────────────

import { isSafeUrl } from '@/lib/validation'
import type { IntakePayload } from '@/lib/layers'

// ── LayerViolationError ────────────────────────────────────────────────────────

export class LayerViolationError extends Error {
  readonly layer: string
  readonly violation: string

  constructor(layer: string, violation: string) {
    super(violation)
    this.name = 'LayerViolationError'
    this.layer = layer
    this.violation = violation
    // Maintains proper prototype chain in transpiled ES5
    Object.setPrototypeOf(this, LayerViolationError.prototype)
  }
}

// ── Guard 1: Intake Layer ──────────────────────────────────────────────────────
// Validates the payload at the Layer 1 → Layer 2 boundary.
// Blocks SSRF attempts. Throws before any network call is made.

export function assertIntakeLayer(payload: Partial<IntakePayload>): void {
  if (!payload.url || typeof payload.url !== 'string' || !payload.url.trim()) {
    throw new LayerViolationError('intake', 'url is required and must be a non-empty string')
  }

  if (!isSafeUrl(payload.url)) {
    throw new LayerViolationError(
      'intake',
      `url failed SSRF safety check: "${payload.url}" resolves to a private or blocked address`,
    )
  }

  if (!payload.industry || typeof payload.industry !== 'string') {
    throw new LayerViolationError('intake', 'industry (vertical) is required and must be a string')
  }

  if (
    payload.businessName !== undefined &&
    payload.businessName !== null &&
    (typeof payload.businessName !== 'string' || payload.businessName.length > 120)
  ) {
    throw new LayerViolationError(
      'intake',
      'businessName must be a string no longer than 120 characters',
    )
  }
}

// ── Guard 2: Agent Orchestration Layer ────────────────────────────────────────
// Enforces state machine constraints before any n8n webhook is dispatched.
// The allowedAgents list is produced by evaluateState() in Phase 3.

export function assertAgentAllowed(agentType: string, allowedAgents: string[]): void {
  if (!agentType || typeof agentType !== 'string') {
    throw new LayerViolationError(
      'agent_orchestration',
      'agentType must be a non-empty string',
    )
  }

  if (!Array.isArray(allowedAgents) || allowedAgents.length === 0) {
    throw new LayerViolationError(
      'agent_orchestration',
      'allowedAgents list is empty — no agents are permitted in the current business state',
    )
  }

  if (!allowedAgents.includes(agentType)) {
    throw new LayerViolationError(
      'agent_orchestration',
      `agent "${agentType}" is not permitted by the current state machine. Allowed: [${allowedAgents.join(', ')}]`,
    )
  }
}

// ── Guard 3: Execution Layer ──────────────────────────────────────────────────
// Blocks execution of any action that is not in APPROVED status.
// Prevents agents from self-executing without operator sign-off.

const EXECUTION_READY_STATUSES = new Set(['approved'])

export function assertExecutionReady(status: string, actionId: string): void {
  if (!status || typeof status !== 'string') {
    throw new LayerViolationError(
      'execution',
      `actionId "${actionId}" has no valid status — cannot execute`,
    )
  }

  if (!EXECUTION_READY_STATUSES.has(status.toLowerCase())) {
    throw new LayerViolationError(
      'execution',
      `actionId "${actionId}" has status "${status}" — only APPROVED actions may be executed`,
    )
  }
}

// ── Guard 4: Learning Layer ───────────────────────────────────────────────────
// Prevents the learning layer from performing snapshot write operations.
// Audit snapshots are immutable and may only be created by the audit engine (Layer 2).

const BLOCKED_LEARNING_OPERATIONS = new Set([
  'saveAuditSnapshot',
  'createAuditSnapshot',
  'writeSnapshot',
  'overwriteSnapshot',
  'deleteSnapshot',
  'truncateSnapshots',
])

export function assertLearningLayer(operation: string): void {
  if (!operation || typeof operation !== 'string') {
    throw new LayerViolationError('learning', 'operation name is required')
  }

  if (BLOCKED_LEARNING_OPERATIONS.has(operation)) {
    throw new LayerViolationError(
      'learning',
      `operation "${operation}" is not permitted in the learning layer — snapshots are immutable and may only be written by the audit engine (Layer 2)`,
    )
  }
}
