// ─────────────────────────────────────────────────────────────────────────────
// Seleste Agentic System — Structured Failure Paths
//
// All functions are safe by contract: they log, return typed values, and
// never throw. Callers do not need try/catch around these functions.
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ──────────────────────────────────────────────────────────────────────

interface FailureContext {
  operation: string
  layer: string
  businessId?: string
  auditId?: string
  agentType?: string
  error: unknown
  meta?: Record<string, unknown>
}

// ── logFailure ─────────────────────────────────────────────────────────────────
// Emits a structured JSON error line. Never throws.
// In production, this feeds into Render log drains / Datadog / Logtail.

export function logFailure(ctx: FailureContext): void {
  const message = ctx.error instanceof Error ? ctx.error.message : String(ctx.error)
  const stack   = ctx.error instanceof Error ? ctx.error.stack  : undefined
  console.error(
    JSON.stringify({
      severity:   'ERROR',
      layer:      ctx.layer,
      operation:  ctx.operation,
      businessId: ctx.businessId  ?? null,
      auditId:    ctx.auditId     ?? null,
      agentType:  ctx.agentType   ?? null,
      error:      message,
      stack:      stack           ?? null,
      meta:       ctx.meta        ?? null,
      ts:         new Date().toISOString(),
    }),
  )
}

// ── safeFireWebhook ────────────────────────────────────────────────────────────
// POSTs JSON to a webhook URL (e.g. n8n). Never throws.
// Returns true on 2xx, false on any error or non-2xx response.
// Hard 10-second timeout — n8n must acknowledge within this window.

export async function safeFireWebhook(url: string, payload: unknown): Promise<boolean> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
      signal:  controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      logFailure({
        layer:     'agent_orchestration',
        operation: 'safeFireWebhook',
        error:     `Webhook returned ${res.status} ${res.statusText}`,
        meta:      { url, status: res.status },
      })
      return false
    }

    return true
  } catch (err: unknown) {
    clearTimeout(timeout)
    const isAbort = err instanceof Error && err.name === 'AbortError'
    logFailure({
      layer:     'agent_orchestration',
      operation: 'safeFireWebhook',
      error:     isAbort ? 'Webhook call timed out after 10s' : err,
      meta:      { url },
    })
    return false
  }
}

// ── auditFailureResponse ───────────────────────────────────────────────────────
// Produces the standard error envelope returned to the client when an audit fails.
// Optionally carries a partial auditId if the audit got far enough to save a snapshot.

export function auditFailureResponse(
  error: unknown,
  partial?: { auditId?: string; overallScore?: number },
): { success: false; error: string; auditId?: string; partial?: true } {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : 'Audit failed. Please try again.'

  return {
    success: false,
    error:   message,
    ...(partial?.auditId      ? { auditId: partial.auditId } : {}),
    ...(partial?.overallScore != null ? { partial: true as const } : {}),
  }
}

// ── agentOutputRejected ────────────────────────────────────────────────────────
// Logs a validation rejection from the agent orchestration layer.
// Called when an agent callback payload fails schema or guard checks.
// Does not throw — the cycle continues with remaining agents.

export function agentOutputRejected(
  agentType: string,
  cycleId: string,
  reasons: string[],
): void {
  logFailure({
    layer:     'agent_orchestration',
    operation: 'agentOutputRejected',
    agentType,
    error:     `Agent output rejected for cycle "${cycleId}"`,
    meta:      { cycleId, reasons },
  })
}

// ── executionFailed ────────────────────────────────────────────────────────────
// Logs a failed execution attempt.
// No auto-retry — retries are a deliberate product decision, not an infrastructure one.

export function executionFailed(actionId: string, reason: string): void {
  logFailure({
    layer:     'execution',
    operation: 'executionFailed',
    error:     reason,
    meta: {
      actionId,
      note: 'No auto-retry scheduled. Manual re-approval or operator intervention required.',
    },
  })
}
