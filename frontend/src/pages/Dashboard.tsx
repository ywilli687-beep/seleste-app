import { useState, useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useGlobalDashboard,
  useBusinessState,
  useAuditHistory,
  useInbox,
  useAllAuditHistories,
} from '@/lib/hooks/useDashboard'
import { useTabTitle }           from '@/lib/hooks/useTabTitle'
import { PriorityActions }       from '@/components/dashboard/PriorityActions'
import { ExecutionQueue }        from '@/components/dashboard/ExecutionQueue'
import { ImpactTimeline }        from '@/components/dashboard/ImpactTimeline'
import { BusinessCard }          from '@/components/dashboard/BusinessCard'
import { OnboardingCard }        from '@/components/dashboard/OnboardingCard'
import { AskSeleste }            from '@/components/dashboard/AskSeleste'
import { CreateBusinessModal }   from '@/components/dashboard/CreateBusinessModal'
import { TeamSettings }          from '@/components/dashboard/TeamSettings'
import { estimateRevenue }       from '@/lib/revenue'

type Tab = 'today' | 'inbox' | 'growth' | 'assets' | 'team' | 'command'

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function greet(name?: string) {
  const h = new Date().getHours()
  const t = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
  return `Good ${t}${name ? `, ${name}` : ''}.`
}
function dateStr() {
  const d = new Date()
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}
function shortDate() {
  const d = new Date()
  return `${MONTHS[d.getMonth()].slice(0,3)} ${d.getDate()}`
}

const AGENT_KEYS = ['SEO','CRO','Content','Reputation','Media'] as const
const AGENT_TYPE_MAP: Record<string, string> = {
  SEO: 'SEO', CRO: 'CRO', Content: 'CONTENT', Reputation: 'REPUTATION', Media: 'MEDIA_BUYER'
}

export default function Dashboard() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const { getToken }  = useAuth()
  const queryClient   = useQueryClient()
  const [tab, setTab]                     = useState<Tab>('today')
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | undefined>()
  const [showCreateModal, setShowCreateModal]        = useState(false)

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
      } catch (e) { console.error('[Claim Error]', e) }
    }
    claim()
  }, [isUserLoaded, user, getToken, queryClient])

  const { data: dashboard, isLoading, error: queryError } = useGlobalDashboard()
  const businesses  = dashboard?.businesses ?? []
  const effectiveId = selectedBusinessId ?? businesses[0]?.businessId

  const { data: bizState }     = useBusinessState(effectiveId)
  const { data: auditHistRaw } = useAuditHistory(effectiveId)
  const { data: inboxRaw }     = useInbox(effectiveId)

  const { data: sparklines }   = useAllAuditHistories(businesses.map((b: any) => b.businessId))

  const tasks   = (inboxRaw as any)?.tasks ?? []
  const audits  = (auditHistRaw as any)?.audits ?? []
  const pending = tasks.filter((t: any) => t.status === 'PENDING')

  useTabTitle(pending.length)

  const selectedBiz    = businesses.find((b: any) => b.businessId === effectiveId) ?? businesses[0]
  const industry       = selectedBiz?.industry ?? 'OTHER'
  const overallScore   = selectedBiz?.overallScore ?? 0
  const scoreDelta     = selectedBiz?.scoreDelta ?? null
  const crawlerEnrolled = (bizState as any)?.crawlerEnrolled ?? false

  // Revenue estimates from pending tasks
  const totalOpportunity = pending.reduce((sum: number, t: any) => {
    const est = estimateRevenue(t.pillar ?? 'seo', t.estimatedImpact ?? 20, industry)
    return sum + (est?.revenuePerMonth?.low ?? 0)
  }, 0)

  // Pillar scores from bizState
  const pillars = (bizState as any)?.pillars ?? {}

  if (!isUserLoaded || isLoading) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', color:'var(--ink-muted)', fontFamily:'var(--ff-sans)', fontSize:13 }}>
        Loading…
      </div>
    )
  }

  if (queryError) {
    const msg = queryError instanceof Error ? queryError.message : String(queryError)
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem', padding:'2rem', textAlign:'center', background:'var(--bg)', color:'var(--ink)' }}>
        <div style={{ fontSize:'2rem' }}>📡</div>
        <div style={{ fontFamily:'var(--ff-sans)', fontSize:16, fontWeight:500 }}>Dashboard offline</div>
        <p style={{ color:'var(--ink-muted)', maxWidth:480, lineHeight:1.6, fontSize:13 }}>
          {msg.includes('Unexpected token') ? 'The API returned an invalid response.' : msg}
        </p>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => window.location.reload()} style={{ background:'var(--ink)', color:'var(--bg)', border:'none', padding:'8px 20px', borderRadius:6, cursor:'pointer', fontSize:13 }}>Retry</button>
          <button onClick={() => (window.location.href='/')} style={{ color:'var(--ink-muted)', background:'none', border:'none', cursor:'pointer', fontSize:13 }}>Home</button>
        </div>
      </div>
    )
  }

  if (businesses.length === 0) {
    return (
      <div className="os-shell">
        <OsSidebar tab={tab} setTab={setTab} initial={user?.firstName?.[0] ?? undefined} />
        <div className="os-main os-main--center"><OnboardingCard /></div>
        {showCreateModal && <CreateBusinessModal onClose={() => setShowCreateModal(false)} />}
      </div>
    )
  }

  const TAB_LABELS: Record<Tab, string> = {
    today: 'Today', inbox: 'Inbox', growth: 'Growth',
    assets: 'Assets', team: 'Team', command: '✦ Command',
  }

  return (
    <div className="os-shell">
      {showCreateModal && <CreateBusinessModal onClose={() => setShowCreateModal(false)} />}

      {/* Sidebar */}
      <OsSidebar tab={tab} setTab={setTab} initial={user?.firstName?.[0] ?? undefined} />

      {/* Main */}
      <div className="os-main">
        {/* Header */}
        <div className="os-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Business switcher */}
            <div className="biz-switcher">
              <select
                className="biz-switcher__select"
                value={effectiveId ?? ''}
                onChange={(e) => setSelectedBusinessId(e.target.value)}
              >
                {businesses.map((b: any) => (
                  <option key={b.businessId} value={b.businessId}>{b.name}</option>
                ))}
              </select>
              <span className="biz-switcher__chevron">▾</span>
            </div>
            <button
              className="os-btn os-btn--ghost os-btn--sm"
              onClick={() => setShowCreateModal(true)}
              title="Add business"
            >+</button>
          </div>
          <div className="os-header__actions">
            <button className="os-btn os-btn--ghost" onClick={() => (window.location.href = '/')}>New Audit</button>
            <button className="os-btn os-btn--primary" onClick={() => setTab('inbox')}>+ Run Agent</button>
          </div>
        </div>

        {/* Greeting sub-row */}
        <div style={{ padding: '6px 24px 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{greet(user?.firstName ?? undefined)}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-muted)', paddingBottom: 8 }}>{dateStr()}</div>
        </div>

        {/* Tabs */}
        <div className="os-tabs">
          {(Object.keys(TAB_LABELS) as Tab[]).map(t => (
            <button key={t} className={`os-tab ${tab === t ? 'os-tab--active' : ''}`} onClick={() => setTab(t)}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="os-content">
          {tab === 'today' && (
            <div className="os-feed">
              <div className="os-feed__bar">
                <span className="os-feed__heading">Feed</span>
                <span className="os-feed__meta">{pending.length} items · {shortDate()}</span>
                {pending.length > 0 && (
                  <button className="os-btn os-btn--ghost os-btn--sm" onClick={() => setTab('inbox')}>Get Started</button>
                )}
              </div>
              {pending.length === 0 ? (
                <div className="os-feed__empty">
                  <div className="os-feed__empty-icon">🚀</div>
                  <div className="os-feed__empty-title">Run your first audit</div>
                  <div className="os-feed__empty-desc">Unlock your score, growth roadmap, and revenue intelligence by scanning your website.</div>
                  <button className="os-btn os-btn--primary" onClick={() => (window.location.href = '/')}>Start First Scan →</button>
                </div>
              ) : (
                <div className="os-feed__items">
                  {pending.slice(0, 8).map((t: any) => (
                    <div key={t.id} className="os-feed__item">
                      <span className="os-feed__item-pillar">{t.pillar}</span>
                      <span className="os-feed__item-title">{t.title}</span>
                      <span className={`os-feed__item-risk os-feed__item-risk--${(t.riskTier ?? 'LOW').toLowerCase()}`}>{t.riskTier ?? 'LOW'}</span>
                    </div>
                  ))}
                  <button className="os-btn os-btn--ghost os-btn--sm" style={{ marginTop: 8 }} onClick={() => setTab('inbox')}>View all →</button>
                </div>
              )}
            </div>
          )}

          {tab === 'inbox' && (
            <div>
              <PriorityActions tasks={tasks} businessId={effectiveId ?? ''} industry={industry} />
              <div style={{ marginTop: 12 }}>
                <ExecutionQueue tasks={tasks} summary={dashboard?.globalSummary} businessId={effectiveId ?? ''} industry={industry} />
              </div>
            </div>
          )}

          {tab === 'growth' && (
            <ImpactTimeline audits={audits} industry={industry} />
          )}

          {tab === 'assets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {businesses.map((b: any) => (
                <BusinessCard
                  key={b.businessId}
                  business={b}
                  sparklineScores={sparklines?.[b.businessId] ?? []}
                  selected={b.businessId === effectiveId}
                  onSelect={(id: string) => setSelectedBusinessId(id)}
                />
              ))}
            </div>
          )}

          {tab === 'team' && effectiveId && (
            <TeamSettings businessId={effectiveId} />
          )}

          {tab === 'command' && (
            <div className="os-command">
              <AskSeleste businessId={effectiveId} />
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <aside className="os-right">
        {/* Score */}
        <div className="os-right__section">
          <div className="os-right__label">OVERALL SCORE</div>
          <div className="os-right__score">{overallScore}</div>
          <div className="os-right__delta">
            {scoreDelta === null || scoreDelta === 0
              ? 'No change this month'
              : scoreDelta > 0
                ? `+${scoreDelta} pts this month`
                : `${scoreDelta} pts this month`}
          </div>
        </div>

        {/* Pillars */}
        <div className="os-right__section">
          <div className="os-right__label">PILLARS</div>
          {Object.entries(pillars).length > 0 ? (
            Object.entries(pillars).slice(0, 5).map(([name, score]: any) => (
              <div key={name} className="os-right__pillar-row">
                <span className="os-right__pillar-name">{name.replace(/Score$/,'').replace(/([A-Z])/g,' $1').trim()}</span>
                <span className="os-right__pillar-val">{score}</span>
              </div>
            ))
          ) : (
            <div className="os-right__muted">Run an audit to see pillar scores</div>
          )}
        </div>

        {/* Revenue */}
        <div className="os-right__section">
          <div className="os-right__label">REVENUE</div>
          <div className="os-right__rev-row">
            <span className="os-right__rev-key">Recovered</span>
            <span className="os-right__rev-val os-right__rev-val--green">$0</span>
          </div>
          <div className="os-right__rev-row">
            <span className="os-right__rev-key">Opportunity</span>
            <span className="os-right__rev-val os-right__rev-val--amber">{totalOpportunity > 0 ? `$${totalOpportunity.toLocaleString()}` : 'At risk'}</span>
          </div>
        </div>

        {/* Agents */}
        <div className="os-right__section">
          <div className="os-right__label">AGENTS</div>
          {AGENT_KEYS.map(name => {
            const type    = AGENT_TYPE_MAP[name]
            const agTasks = tasks.filter((t: any) => t.agentType === type)
            const hasExecuting = agTasks.some((t: any) => t.status === 'EXECUTING')
            const hasPending   = agTasks.some((t: any) => t.status === 'PENDING')
            const hasDone      = agTasks.some((t: any) => t.status === 'COMPLETED')
            const color = hasExecuting ? 'var(--purple)' : hasPending ? 'var(--amber)' : hasDone ? 'var(--green)' : 'var(--ink-muted)'
            return (
              <div key={name} className="os-right__agent-row">
                <span className="os-right__agent-dot" style={{ background: color }} />
                <span className="os-right__agent-name">{name}</span>
              </div>
            )
          })}
        </div>

        {/* Autopilot */}
        <div className="os-right__section">
          <div className="os-right__label">AUTOPILOT MODE</div>
          <div className="os-autopilot">
            <button className={`os-autopilot__btn ${!crawlerEnrolled ? 'os-autopilot__btn--active' : ''}`}>Hands-On</button>
            <button className={`os-autopilot__btn ${crawlerEnrolled ? 'os-autopilot__btn--active' : ''}`}>Co-Pilot</button>
            <button className="os-autopilot__btn">Auto</button>
          </div>
          <div className="os-right__muted" style={{ marginTop: 6 }}>
            {crawlerEnrolled ? 'Agents draft actions, you approve.' : 'You control all actions manually.'}
          </div>
        </div>

        {/* Team quick-access */}
        <div className="os-right__section">
          <div className="os-right__label">TEAM</div>
          <button
            className="os-btn os-btn--ghost os-btn--sm"
            style={{ width: '100%', textAlign: 'left' }}
            onClick={() => setTab('team')}
          >
            Manage team →
          </button>
        </div>
      </aside>
    </div>
  )
}

function OsSidebar({ tab, setTab, initial }: { tab: Tab; setTab: (t: Tab) => void; initial?: string }) {
  return (
    <nav className="os-sidebar">
      <div className="os-sidebar__top">
        <button className={`os-nav-btn ${tab === 'today' ? 'os-nav-btn--active' : ''}`} onClick={() => setTab('today')} title="Feed">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor"/></svg>
        </button>
        <button className={`os-nav-btn ${tab === 'inbox' ? 'os-nav-btn--active' : ''}`} onClick={() => setTab('inbox')} title="Inbox">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="2" rx="1" fill="currentColor"/><rect x="1" y="7" width="14" height="2" rx="1" fill="currentColor"/><rect x="1" y="11" width="8" height="2" rx="1" fill="currentColor"/></svg>
        </button>
        <button className={`os-nav-btn ${tab === 'growth' ? 'os-nav-btn--active' : ''}`} onClick={() => setTab('growth')} title="Growth">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polyline points="1,12 5,7 8,9 12,4 15,6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button className={`os-nav-btn ${tab === 'assets' ? 'os-nav-btn--active' : ''}`} onClick={() => setTab('assets')} title="Businesses">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="4" rx="1" fill="currentColor" opacity=".4"/><rect x="1" y="6" width="14" height="4" rx="1" fill="currentColor" opacity=".7"/><rect x="1" y="11" width="14" height="4" rx="1" fill="currentColor"/></svg>
        </button>
        <button className={`os-nav-btn ${tab === 'team' ? 'os-nav-btn--active' : ''}`} onClick={() => setTab('team')} title="Team">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1 13c0-2.2 2.2-4 5-4s5 1.8 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.2" opacity=".6"/><path d="M14 12.5c0-1.5-1-2.5-2-2.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".6"/></svg>
        </button>
        <button className={`os-nav-btn ${tab === 'command' ? 'os-nav-btn--active' : ''}`} onClick={() => setTab('command')} title="Command">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M5.5 8h5M8 5.5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div className="os-sidebar__bottom">
        <div className="os-nav-avatar">{initial ?? '?'}</div>
      </div>
    </nav>
  )
}
