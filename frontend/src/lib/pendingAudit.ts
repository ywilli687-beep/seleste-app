/**
 * Pending audit intent — persists user's pre-auth audit request across
 * the sign-up / sign-in redirect cycle and auto-executes after auth.
 *
 * Uses sessionStorage so intent is tab-scoped and automatically cleared
 * when the tab closes. Works across OAuth redirects because the browser
 * keeps sessionStorage alive during same-tab navigations.
 */

const STORAGE_KEY = 'seleste_pending_audit'
const TTL_MS      = 10 * 60 * 1000 // 10 minutes

export interface PendingAuditIntent {
  url:            string
  businessName?:  string
  location:       string
  vertical:       string
  monthlyRevenue?: number
  timestamp:      string   // ISO — used for TTL check
  idempotencyKey: string   // UUID — prevents double execution
}

/** Save intent before redirecting to auth. */
export function savePendingAudit(
  data: Omit<PendingAuditIntent, 'timestamp' | 'idempotencyKey'>
): void {
  const intent: PendingAuditIntent = {
    ...data,
    timestamp:      new Date().toISOString(),
    idempotencyKey: crypto.randomUUID(),
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(intent))
  } catch {
    // sessionStorage unavailable (e.g. private browsing with storage blocked) — fail silently
  }
}

/**
 * Load intent after auth. Returns null if:
 * - Nothing stored
 * - Intent is older than TTL_MS
 * - Data is malformed
 */
export function loadPendingAudit(): PendingAuditIntent | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const intent = JSON.parse(raw) as PendingAuditIntent

    // Validate required fields
    if (!intent.url || !intent.location || !intent.vertical || !intent.timestamp || !intent.idempotencyKey) {
      clearPendingAudit()
      return null
    }

    // TTL check
    const age = Date.now() - new Date(intent.timestamp).getTime()
    if (age > TTL_MS) {
      clearPendingAudit()
      return null
    }

    return intent
  } catch {
    clearPendingAudit()
    return null
  }
}

/** Remove intent — call this immediately before executing to prevent double-runs. */
export function clearPendingAudit(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
