import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGlobalDashboard,
  useBusinessState,
  useAuditHistory,
  useInbox,
  useLearningDashboard,
  useAllAuditHistories,
} from '@/lib/hooks/useDashboard'
import { useTabTitle }       from '@/lib/hooks/useTabTitle'
import { StatCards }         from '@/components/dashboard/StatCards'
import { BusinessCard }      from '@/components/dashboard/BusinessCard'
import { BusinessStatePanel } from '@/components/dashboard/BusinessStatePanel'
import { AutopilotToggle }   from '@/components/dashboard/AutopilotToggle'
import { StickyBanner }      from '@/components/dashboard/StickyBanner'
import { PriorityActions }   from '@/components/dashboard/PriorityActions'
import { ExecutionQueue }    from '@/components/dashboard/ExecutionQueue'
import { AgentPanel }        from '@/components/dashboard/AgentPanel'
import { ImpactTimeline }    from '@/components/dashboard/ImpactTimeline'
import { LearningPanel }     from '@/components/dashboard/LearningPanel'
import { OnboardingCard }    from '@/components/dashboard/OnboardingCard'
import { AskSeleste }        from '@/components/dashboard/AskSeleste'

export default function Dashboard() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { getToken }   = useAuth()
  const queryClient    = useQueryClient()
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | undefined>()

  // Claim anonymous audits on login
  useEffect(() => {
    if (!isUserLoaded || !user) return
    const lastAnonId = localStorage.getItem('last_anonymous_audit')
    if (!lastAnonId) return
    const claim = async () => {
      try {
        const token = await getToken()
        await fetch('/api/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ auditId: lastAnonId, userId: user.id }),
        })
        localStorage.removeItem('last_anonymous_audit')
        queryClient.invalidateQueries({ queryKey: ['dashboard', user.id] })
      } catch (e) {
        console.error('[Claim Error]', e)
      }
    }
    claim()
  }, [isUserLoaded, user, getToken, queryClient])

  const { data: dashboard, isLoading, error: queryError } = useGlobalDashboard()

  const businesses  = dashboard?.businesses ?? []
  const effectiveId = selectedBusinessId ?? businesses[0]?.businessId

  const { data: bizState }   = useBusinessState(effectiveId)
  const { data: auditHistRaw } = useAuditHistory(effectiveId)
  const { data: inboxRaw }   = useInbox(effectiveId)
const { data: learning }   = useLearningDashboard()
  const { data: sparklines } = useAllAuditHistories(businesses.map((b: any) => b.businessId))

  const tasks   = (inboxRaw as any)?.tasks ?? []
  const audits  = (auditHistRaw as any)?.audits ?? []
  const pending = tasks.filter((t: any) => t.status === 'PENDING')

  useTabTitle(pending.length)

  const selectedBiz = businesses.find((b: any) => b.businessId === effectiveId) ?? businesses[0]
  const industry    = selectedBiz?.industry ?? 'OTHER'

  // Loading
  if (!isUserLoaded || isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--ink-muted)', fontFamily: 'var(--ff-sans)', fontSize: 13 }}>
        Loading…
      </div>
    )
  }

  // Error
  if (queryError) {
    const msg = queryError instanceof Error ? queryError.message : String(queryError)
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center', background: 'var(--bg)', color: 'var(--ink)' }}>
        <div style={{ fontSize: '2rem' }}>📡</div>
        <div style={{ fontFamily: 'var(--ff-sans)', fontSize: 16, fontWeight: 500 }}>Dashboard offline</div>
        <p style={{ color: 'var(--ink-muted)', maxWidth: 480, lineHeight: 1.6, fontSize: 13 }}>
          {msg.includes('Unexpected token') ? 'The API returned an invalid response.' : msg}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.location.reload()} style={{ background: 'var(--ink)', color: 'var(--bg)', border: 'none', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Retry</button>
          <button onClick={() => (window.location.href = '/')} style={{ color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Return Home</button>
        </div>
      </div>
    )
  }

  // Onboarding — no audits yet
  if (businesses.length === 0) {
    return (
      <div className="cc-onboarding">
        <OnboardingCard />
      </div>
    )
  }

  return (
    <div className="cc-root">
      {/* Top bar */}
      <header className="cc-topbar">
        <div className="cc-topbar__brand">
          <span className="cc-topbar__logo">Seleste</span>
          <span className="cc-topbar__tag">Command Center</span>
        </div>
        <div className="cc-topbar__biz-list">
          {businesses.map((b: any) => (
            <button
              key={b.businessId}
              className={`cc-biz-tab ${b.businessId === effectiveId ? 'cc-biz-tab--active' : ''}`}
              onClick={() => setSelectedBusinessId(b.businessId)}
            >
              {b.name}
            </button>
          ))}
        </div>
        <div className="cc-topbar__right">
          <span className="cc-topbar__user">{user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress}</span>
        </div>
      </header>

      {/* Sticky banner — top pending task */}
      <StickyBanner tasks={tasks} businessId={effectiveId ?? ''} industry={industry} />

      <main className="cc-main">
        {/* Stat row */}
        <StatCards dashboard={dashboard} />

        {/* Priority actions */}
        <PriorityActions
          tasks={tasks}
          businessId={effectiveId ?? ''}
          industry={industry}
        />

        {/* Two-column content area */}
        <div className="cc-columns">
          {/* Left column */}
          <div className="cc-col cc-col--left">
            {businesses.map((b: any) => (
              <BusinessCard
                key={b.businessId}
                business={b}
                sparklineScores={sparklines?.[b.businessId] ?? []}
                selected={b.businessId === effectiveId}
                onSelect={(id: string) => setSelectedBusinessId(id)}
              />
            ))}
            <ExecutionQueue
              tasks={tasks}
              summary={dashboard?.globalSummary}
              businessId={effectiveId ?? ''}
              industry={industry}
            />
          </div>

          {/* Right column */}
          <div className="cc-col cc-col--right">
            <BusinessStatePanel businessState={bizState} />
            <AutopilotToggle
              businessId={effectiveId ?? ''}
              crawlerEnrolled={(bizState as any)?.crawlerEnrolled ?? false}
              nextCrawlAt={(bizState as any)?.nextCrawlAt ?? null}
            />
            <AgentPanel tasks={tasks} bizState={bizState} industry={industry} />
            <ImpactTimeline audits={audits} industry={industry} />
            <LearningPanel learning={learning} />
          </div>
        </div>
      </main>

      {/* Floating chat */}
      <AskSeleste businessId={effectiveId} />
    </div>
  )
}
