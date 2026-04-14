import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuditFlow } from '@/lib/hooks/useAuditFlow'
import LoadingScreen from '@/components/LoadingScreen'
import ResultsView from '@/components/ResultsView'
import { BusinessCard }   from '@/components/dashboard/BusinessCard'
import { ApprovalInbox }  from '@/components/dashboard/ApprovalInbox'
import { AuditHistory }   from '@/components/dashboard/AuditHistory'
import { LearningPanel }  from '@/components/dashboard/LearningPanel'
import {
  useGlobalDashboard,
  useBusinessState,
  useAuditHistory,
  useInbox,
  useLearningDashboard,
} from '@/lib/hooks/useDashboard'

// ── Inline stat cards (avoids overwriting existing StatCards component) ──────

function GlobalStats({ dashboard }: { dashboard: any }) {
  const businesses = dashboard?.businesses ?? []
  const summary    = dashboard?.globalSummary ?? {}
  return (
    <div className="stat-cards-grid">
      <div className="stat-card">
        <div className="stat-label">Businesses</div>
        <div className="stat-value">{businesses.length}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Pending actions</div>
        <div className="stat-value stat-value--amber">{summary.totalPendingActions ?? 0}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Avg score</div>
        <div className="stat-value">{summary.avgScore ?? '—'}</div>
      </div>
      {summary.topMover && (
        <div className="stat-card stat-card--highlight">
          <div className="stat-label">Top mover this week</div>
          <div className="stat-value stat-value--green">+{summary.topMover.scoreDelta}</div>
          <div className="stat-sub">{summary.topMover.name}</div>
        </div>
      )}
    </div>
  )
}

// ── Inline business state panel ───────────────────────────────────────────────

function BusinessStatePanel({ bizState }: { bizState: any }) {
  if (!bizState) return null
  const permissions = bizState.agentPermissions ?? {}
  return (
    <div className="score-breakdown">
      <div className="score-breakdown__header">
        <div className="score-breakdown__overall">{bizState.overallScore ?? '—'}</div>
        <div className="score-breakdown__state">{bizState.state?.replace(/_/g, ' ').toLowerCase()}</div>
      </div>
      <div className="score-breakdown__next">{bizState.nextStateRequirements}</div>
      <div className="score-breakdown__agents">
        {Object.entries(permissions).map(([agent, perm]: [string, any]) => (
          <div key={agent} className={`agent-pill ${perm.allowed ? 'agent-pill--allowed' : 'agent-pill--blocked'}`}>
            <span className="agent-pill__dot" />
            <span>{agent}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { getToken } = useAuth()
  const queryClient  = useQueryClient()

  const { view, result, stage, hardPreview, reset } = useAuditFlow()

  const [selectedBusinessId, setSelectedBusinessId] = useState<string | undefined>()

  // Claim anonymous audits on login
  useEffect(() => {
    if (!isUserLoaded || !user) return
    const lastAnonId = localStorage.getItem('last_anonymous_audit')
    if (!lastAnonId) return
    ;(async () => {
      try {
        const token = await getToken()
        await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/claim`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body:    JSON.stringify({ auditId: lastAnonId, userId: user.id }),
        })
        localStorage.removeItem('last_anonymous_audit')
        queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      } catch (e) {
        console.error('[Claim Error]', e)
      }
    })()
  }, [isUserLoaded, user, getToken, queryClient])

  // Phase 8 data hooks
  const { data: dashboard,  isLoading: dashLoading,  error: dashError } = useGlobalDashboard()
  const { data: bizState,   isLoading: stateLoading }                   = useBusinessState(selectedBusinessId)
  const { data: auditHist }                                              = useAuditHistory(selectedBusinessId)
  const { data: inboxData,  isLoading: inboxLoading }                   = useInbox(selectedBusinessId)
  const { data: learning }                                               = useLearningDashboard()

  const businesses = (dashboard as any)?.businesses ?? []

  // Auto-select first business when data arrives
  useEffect(() => {
    if (!selectedBusinessId && businesses.length > 0) {
      setSelectedBusinessId(businesses[0].businessId)
    }
  }, [businesses, selectedBusinessId])

  // Guard: missing API URL in production
  const isProd   = import.meta.env.PROD
  const API_URL  = import.meta.env.VITE_API_URL || ''
  if (isProd && !API_URL) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', padding: '2rem', textAlign: 'center', background: 'var(--os-bg-tert)', color: 'var(--os-text-prim)' }}>
        <div style={{ fontFamily: 'var(--ff-sans)', fontSize: 18, fontWeight: 500 }}>Configuration Required</div>
        <p style={{ color: 'var(--os-text-sec)', maxWidth: 500, lineHeight: 1.6, fontSize: 14 }}>
          The <code style={{ background: 'var(--os-bg-sec)', padding: '2px 6px', borderRadius: 4 }}>VITE_API_URL</code> environment variable is missing.
        </p>
      </div>
    )
  }

  // Audit flow overlays (loading & results intercept the full page)
  if (view === 'loading') return <LoadingScreen stage={stage} hard={hardPreview} />
  if (view === 'results' && result) return <ResultsView result={result} onNewAudit={reset} />

  if (!isUserLoaded || dashLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading intelligence dashboard...</p>
      </div>
    )
  }

  if (dashError) {
    const msg = dashError instanceof Error ? dashError.message : String(dashError)
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center', background: 'var(--os-bg-tert)', color: 'var(--os-text-prim)' }}>
        <div style={{ fontFamily: 'var(--ff-sans)', fontSize: 16, fontWeight: 500 }}>Dashboard offline</div>
        <p style={{ color: 'var(--os-text-sec)', maxWidth: 480, lineHeight: 1.6, fontSize: 13 }}>{msg}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.location.reload()} style={{ background: 'var(--os-text-prim)', color: 'var(--os-bg-tert)', border: 'none', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Retry</button>
          <button onClick={() => window.location.href = '/'} style={{ color: 'var(--os-text-sec)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Return Home</button>
        </div>
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚀</div>
        <div style={{ fontFamily: 'var(--ff-sans)', fontSize: 16, fontWeight: 500, color: 'var(--os-text-prim)', marginBottom: 10 }}>Run your first audit</div>
        <p style={{ color: 'var(--os-text-sec)', maxWidth: 400, margin: '0 auto 28px', lineHeight: 1.6, fontSize: 13, fontFamily: 'var(--ff-sans)' }}>
          Unlock your score, growth roadmap, and revenue intelligence by scanning your website.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          style={{ background: 'var(--os-text-prim)', color: 'var(--os-bg-tert)', padding: '10px 28px', borderRadius: 7, border: 'none', fontWeight: 500, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--ff-sans)' }}
        >
          Start First Scan →
        </button>
      </div>
    )
  }

  return (
    <div className="dashboard-shell">

      {/* Top bar */}
      <div className="dashboard-topbar">
        <div className="dashboard-topbar__left">
          <h1 className="dashboard-title">Seleste</h1>
        </div>
        <div className="dashboard-topbar__right">
          {(inboxData as any)?.summary?.pending > 0 && (
            <div className="inbox-badge">
              {(inboxData as any).summary.pending} action{(inboxData as any).summary.pending !== 1 ? 's' : ''} pending
            </div>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="dashboard-section" style={{ padding: '0 24px' }}>
        <GlobalStats dashboard={dashboard} />
      </div>

      <div className="dashboard-main">

        {/* Left column: business list + inbox */}
        <div className="dashboard-left">

          <div className="dashboard-section">
            <div className="section-title">Businesses</div>
            <div className="business-list">
              {businesses.map((b: any) => (
                <BusinessCard
                  key={b.businessId}
                  business={b}
                  onSelect={setSelectedBusinessId}
                  selected={b.businessId === selectedBusinessId}
                />
              ))}
            </div>
          </div>

          {selectedBusinessId && (
            <div className="dashboard-section">
              <div className="section-title">Approval inbox</div>
              {inboxLoading ? (
                <div className="loading-text">Loading actions...</div>
              ) : (
                <ApprovalInbox
                  businessId={selectedBusinessId}
                  tasks={(inboxData as any)?.tasks ?? []}
                  summary={(inboxData as any)?.summary}
                />
              )}
            </div>
          )}
        </div>

        {/* Right column: state + history + learning */}
        <div className="dashboard-right">

          {selectedBusinessId && (
            <div className="dashboard-section">
              <div className="section-title">Business state</div>
              {stateLoading ? (
                <div className="loading-text">Loading state...</div>
              ) : (
                <BusinessStatePanel bizState={bizState} />
              )}
            </div>
          )}

          {selectedBusinessId && (auditHist as any)?.audits?.length > 0 && (
            <div className="dashboard-section">
              <div className="section-title">Score history</div>
              <AuditHistory audits={(auditHist as any).audits} />
            </div>
          )}

          <div className="dashboard-section">
            <div className="section-title">Learning system</div>
            <LearningPanel learning={learning} />
          </div>

        </div>
      </div>
    </div>
  )
}
