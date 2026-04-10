import React, { useState, useMemo } from 'react'
import type { DashboardData } from '../../types/dashboard'
import { NotificationStack } from './NotificationStack'
import { RightPanel } from './RightPanel'
import { RoadmapCard } from './RoadmapCard'
import { ScoreBreakdown } from './ScoreBreakdown'

// ── Types ──────────────────────────────────────────────────────────────────

interface Props {
  data: DashboardData
  userName?: string
  children?: React.ReactNode
  onReaudit?: (payload: { url: string; businessName: string; location: string; vertical: string }) => void
}

type TabId = 'today' | 'inbox' | 'growth' | 'assets'
type FeedCardType = 'urgent' | 'action' | 'opportunity' | 'info'

interface FeedItem {
  id: string
  type: FeedCardType
  title: string
  body: string
  impact?: string
  time: string
  actions?: { label: string; primary?: boolean; onClick?: () => void }[]
  detail?: {
    agentName: string
    agentInitials: string
    agentColor: string
    agentTextColor: string
    why: string
    metrics: { label: string; value: string; green?: boolean }[]
    pipeline: { label: string; status: 'done' | 'active' | 'pending' }[]
  }
}

// ── Pillar labels & descriptions ───────────────────────────────────────────

const PILLAR_SHORT: Record<string, string> = {
  conversion: 'Conversion',
  discoverability: 'SEO',
  trust: 'Reputation',
  performance: 'Speed',
  content: 'Content',
  ux: 'User Exp.',
  data: 'Tracking',
  technical: 'Technical',
  brand: 'Brand',
  scalability: 'Scalability',
}

const PILLAR_DESC: Record<string, string> = {
  conversion: 'How well your site turns visitors into customers — buttons, forms, and calls to action.',
  trust: 'How trustworthy your site looks — reviews, testimonials, and professional design.',
  performance: 'How fast your pages load. Slow pages lose visitors and hurt Google ranking.',
  discoverability: 'How easy it is for people to find you on Google when searching nearby.',
  ux: 'How easy your site is to navigate, especially on a phone.',
  content: 'How clear your text is — does it explain what you do and why someone should choose you?',
  data: 'Whether you have tools set up to understand how visitors use your site.',
  technical: 'Behind-the-scenes health — SSL, mobile-friendliness, and structured data.',
  brand: 'Whether your logo and overall look feel consistent and professional.',
  scalability: 'Whether your site is set up to handle growth.',
}

// ── Badge config ───────────────────────────────────────────────────────────

const BADGE: Record<FeedCardType, { text: string; cls: string }> = {
  urgent:      { text: '⚡ Competitor',    cls: 'urgent' },
  action:      { text: '✓ Action Needed', cls: 'action' },
  opportunity: { text: '↑ Opportunity',   cls: 'opp' },
  info:        { text: '● Update',        cls: 'info' },
}

// ── Derive feed cards from real dashboard data ─────────────────────────────

function buildFeedCards(data: DashboardData, onReaudit?: Props['onReaudit']): FeedItem[] {
  const items: FeedItem[] = []

  // 1. Quick win → action card
  if (data.quickWin) {
    items.push({
      id: 'quick-win',
      type: 'action',
      title: data.quickWin.action,
      body: data.quickWin.implementation,
      impact: `+${data.quickWin.estimatePts} pts`,
      time: 'Today',
      actions: [{ label: 'Review & Approve', primary: true }],
      detail: {
        agentName: 'Growth Agent',
        agentInitials: 'GA',
        agentColor: '#EEEDFE',
        agentTextColor: '#534AB7',
        why: data.quickWin.implementation,
        metrics: [
          { label: 'Score impact', value: `+${data.quickWin.estimatePts} pts`, green: true },
          { label: 'Difficulty',   value: data.quickWin.difficulty },
          { label: 'Risk',         value: 'Low' },
        ],
        pipeline: [
          { label: 'Analyse', status: 'done' },
          { label: 'Plan',    status: 'done' },
          { label: 'Execute', status: 'active' },
          { label: 'Verify',  status: 'pending' },
        ],
      },
    })
  }

  // 2. Revenue leak → opportunity
  if (data.leakagePct && data.leakagePct > 15) {
    const convScore = data.pillars?.find(p => p.id === 'conversion')?.score ?? '?'
    const trustScore = data.pillars?.find(p => p.id === 'trust')?.score ?? '?'
    items.push({
      id: 'revenue-leak',
      type: 'opportunity',
      title: `${data.leakagePct}% of visitors may not be converting`,
      body: 'Your conversion and trust scores are pulling down revenue capture.',
      impact: data.revenueLeakMonthly
        ? `~$${data.revenueLeakMonthly.toLocaleString()}/mo potential`
        : `${data.leakagePct}% conversion gap`,
      time: 'Now',
      actions: [{ label: 'View Revenue Report', primary: true }],
      detail: {
        agentName: 'CRO Agent',
        agentInitials: 'CR',
        agentColor: '#E1F5EE',
        agentTextColor: '#0F6E56',
        why: `Your site is losing roughly ${data.leakagePct}% of its potential revenue to conversion gaps. The biggest contributors are your conversion score (${convScore}/100) and trust score (${trustScore}/100). Improving these two areas would have the highest revenue impact.`,
        metrics: [
          { label: 'Potential gain', value: data.revenueLeakMonthly ? `$${data.revenueLeakMonthly.toLocaleString()}/mo` : `${data.leakagePct}% gap`, green: true },
          { label: 'Effort', value: 'Medium' },
          { label: 'Risk',   value: 'Low' },
        ],
        pipeline: [
          { label: 'Diagnose',   status: 'done' },
          { label: 'Prioritise', status: 'active' },
          { label: 'Fix',        status: 'pending' },
          { label: 'Monitor',    status: 'pending' },
        ],
      },
    })
  }

  // 3. Worst pillar → opportunity
  const sorted = [...(data.pillars ?? [])].sort((a, b) => a.score - b.score)
  const worst = sorted.find(p => p.score < 50)
  if (worst) {
    items.push({
      id: `pillar-${worst.id}`,
      type: 'opportunity',
      title: `${PILLAR_SHORT[worst.id] || worst.id} is ${worst.score}/100 — industry avg ${Math.round(worst.industryAvg)}`,
      body: PILLAR_DESC[worst.id] || '',
      time: 'Now',
      actions: [{ label: 'See Recommendations', primary: true }],
    })
  }

  // 4. Score drop → info
  const latest = data.recentAudits?.[0]
  if (latest?.scoreDelta && latest.scoreDelta < -2) {
    items.push({
      id: 'score-drop',
      type: 'info',
      title: `Score dropped ${Math.abs(latest.scoreDelta)} pts since last audit`,
      body: 'Detected via re-audit. Check your score breakdown for what changed.',
      time: new Date(latest.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      actions: [
        {
          label: 'Re-audit',
          primary: true,
          onClick: () => {
            if (onReaudit && latest) {
              onReaudit({ url: latest.inputUrl, businessName: data.businessName || '', location: '', vertical: data.vertical })
            }
          },
        },
        { label: 'View Audit' },
      ],
    })
  } else if (latest?.scoreDelta && latest.scoreDelta > 0) {
    items.push({
      id: 'score-up',
      type: 'info',
      title: `Score improved ${latest.scoreDelta} pts — good progress`,
      body: 'Keep working through your fix list to maintain momentum.',
      time: new Date(latest.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    })
  }

  return items
}

// ── Helpers ────────────────────────────────────────────────────────────────

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function todayLabel(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

// ── SVG Icons ──────────────────────────────────────────────────────────────

const I = {
  Today: () => <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Command: () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>,
  Inbox: () => <svg viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>,
  Growth: () => <svg viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Assets: () => <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Intel: () => <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
  Team: () => <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
}

// ── Main component ─────────────────────────────────────────────────────────

export function DashboardShell({ data, userName, children, onReaudit }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('today')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const feedCards = useMemo(() => buildFeedCards(data, onReaudit), [data, onReaudit])
  const selectedCard = feedCards.find(c => c.id === selectedId) ?? null
  const inboxCount = data.roadmap?.length ?? 0

  const pendingRevenue = data.revenueLeakMonthly
    ? `$${data.revenueLeakMonthly.toLocaleString()} in pending actions`
    : data.leakagePct
    ? `${data.leakagePct}% conversion opportunity`
    : null

  const handleNewAudit = () => {
    const latest = data.recentAudits?.[0]
    if (latest && onReaudit) {
      onReaudit({ url: latest.inputUrl, businessName: data.businessName || '', location: [data.city, data.state].filter(Boolean).join(', '), vertical: data.vertical })
    } else {
      window.location.href = '/'
    }
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'today',  label: 'Today' },
    { id: 'inbox',  label: `Inbox (${inboxCount})` },
    { id: 'growth', label: 'Growth' },
    { id: 'assets', label: 'Assets' },
  ]

  const mainNavItems = [
    { id: 'today',   Icon: I.Today,   label: 'Today',        tab: true },
    { id: 'inbox',   Icon: I.Inbox,   label: 'Inbox',        tab: true, badge: inboxCount > 0 },
    { id: 'growth',  Icon: I.Growth,  label: 'Growth',       tab: true },
    { id: 'assets',  Icon: I.Assets,  label: 'Assets',       tab: true },
    { id: 'intel',   Icon: I.Intel,   label: 'Intelligence', tab: false },
    { id: 'command', Icon: I.Command, label: 'Command',      tab: false },
  ]

  return (
    <div className="os-shell">
      <NotificationStack />

      {/* ── 52px Icon Sidebar ── */}
      <nav className="os-sidebar">
        <div className="os-logo" title="Seleste">S</div>

        {mainNavItems.map(({ id, Icon, label, badge, tab }) => (
          <div
            key={id}
            className={`os-nav-item${activeTab === id ? ' active' : ''}`}
            title={label}
            onClick={() => tab && setActiveTab(id as TabId)}
          >
            <Icon />
            {badge && <span className="os-nav-badge" />}
          </div>
        ))}

        <div className="os-nav-spacer" />
        <div className="os-nav-sep" />
        <div className="os-nav-item" title="Team"><I.Team /></div>
        <div className="os-nav-item" title="Settings"><I.Settings /></div>
      </nav>

      {/* ── Main ── */}
      <div className="os-main">

        {/* Top bar */}
        <div className="os-topbar">
          <div className="os-topbar-greeting">
            <strong>{greeting()}, {userName || data.businessName || 'there'}.</strong>
            &nbsp;&nbsp;{todayLabel()}
          </div>
          {pendingRevenue && <div className="os-revenue-pill">{pendingRevenue}</div>}
          <div className="os-topbar-actions">
            <button className="os-tb-btn" onClick={handleNewAudit}>New Audit</button>
            <button className="os-tb-btn primary" onClick={() => window.location.href = '/agents'}>
              + Run Agent
            </button>
          </div>
        </div>

        {/* Tab row */}
        <div className="os-tab-row">
          {tabs.map(t => (
            <div
              key={t.id}
              className={`os-tab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </div>
          ))}
        </div>

        {/* Content row */}
        <div className="os-content-row">

          {/* ── TODAY TAB ── */}
          {activeTab === 'today' && (
            <>
              {/* Feed column */}
              <div className="os-feed-col">
                <div className="os-col-header">
                  <span className="os-col-title">Feed</span>
                  <span className="os-col-meta">
                    {feedCards.length} items · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="os-feed-scroll">
                  {feedCards.length === 0 && (
                    <div style={{ padding: '40px 12px', textAlign: 'center', color: 'var(--os-text-tert)', fontSize: 13, lineHeight: 1.6 }}>
                      No items yet.<br />Run an audit to generate insights.
                    </div>
                  )}
                  {feedCards.map(card => {
                    const b = BADGE[card.type]
                    return (
                      <div
                        key={card.id}
                        className={`os-fcard ${card.type}${selectedId === card.id ? ' selected' : ''}`}
                        onClick={() => setSelectedId(selectedId === card.id ? null : card.id)}
                      >
                        <div className="os-fc-header">
                          <span className={`os-fc-badge ${b.cls}`}>{b.text}</span>
                          <span className="os-fc-time">{card.time}</span>
                        </div>
                        <div className="os-fc-title">{card.title}</div>
                        {card.body && <div className="os-fc-body">{card.body}</div>}
                        {card.impact && <div className="os-fc-impact">{card.impact}</div>}
                        {card.actions && card.actions.length > 0 && (
                          <div className="os-fc-actions">
                            {card.actions.map((a, i) => (
                              <button
                                key={i}
                                className={`os-fc-btn${a.primary ? ' primary' : ''}`}
                                onClick={e => { e.stopPropagation(); a.onClick?.() }}
                              >
                                {a.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Detail column */}
              <div className="os-detail-col">
                {selectedCard?.detail ? (
                  <>
                    <div className="os-col-header">
                      <span className="os-col-title">Action Detail</span>
                      <span className="os-col-meta">{selectedCard.detail.agentName}</span>
                    </div>
                    <div className="os-detail-scroll">
                      <ActionDetail card={selectedCard} onClose={() => setSelectedId(null)} />
                    </div>
                  </>
                ) : selectedCard ? (
                  <>
                    <div className="os-col-header">
                      <span className="os-col-title">Detail</span>
                      <span className="os-col-meta">{BADGE[selectedCard.type].text}</span>
                    </div>
                    <div className="os-detail-scroll">
                      <div className="os-action-card" style={{ marginBottom: 12 }}>
                        <div style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--os-text-prim)', marginBottom: 10, lineHeight: 1.45, fontFamily: 'var(--ff-sans)' }}>
                            {selectedCard.title}
                          </div>
                          <div className="os-ac-why">
                            <div className="os-ac-why-label">Context</div>
                            {selectedCard.body}
                          </div>
                        </div>
                      </div>
                      <ScoreBreakdown pillars={data.pillars ?? []} />
                    </div>
                  </>
                ) : children ? (
                  <>
                    <div className="os-col-header">
                      <span className="os-col-title">Get Started</span>
                      <span className="os-col-meta">{data.businessName}</span>
                    </div>
                    <div className="os-detail-scroll">{children}</div>
                  </>
                ) : (
                  <>
                    <div className="os-col-header">
                      <span className="os-col-title">Overview</span>
                      <span className="os-col-meta">{data.businessName}</span>
                    </div>
                    <div className="os-detail-scroll">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <RoadmapCard
                          roadmap={data.roadmap ?? []}
                          roadmapDurationWeeks={data.roadmapDurationWeeks ?? '2-3'}
                          grade={data.grade ?? 'D'}
                        />
                        <ScoreBreakdown pillars={data.pillars ?? []} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* ── INBOX TAB ── */}
          {activeTab === 'inbox' && (
            <div className="os-detail-col" style={{ flex: 1 }}>
              <div className="os-col-header">
                <span className="os-col-title">Your Fix List</span>
                <span className="os-col-meta">{inboxCount} items</span>
              </div>
              <div className="os-detail-scroll">
                <RoadmapCard
                  roadmap={data.roadmap ?? []}
                  roadmapDurationWeeks={data.roadmapDurationWeeks ?? '2-3'}
                  grade={data.grade ?? 'D'}
                />
              </div>
            </div>
          )}

          {/* ── GROWTH / ASSETS STUB ── */}
          {(activeTab === 'growth' || activeTab === 'assets') && (
            <div className="os-detail-col" style={{ flex: 1 }}>
              <div className="os-col-header">
                <span className="os-col-title">{activeTab === 'growth' ? 'Growth Timeline' : 'Asset Manager'}</span>
                <span className="os-col-meta">Coming soon</span>
              </div>
              <div className="os-detail-scroll">
                <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{activeTab === 'growth' ? '📈' : '🖥️'}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--os-text-sec)', marginBottom: 8, fontFamily: 'var(--ff-sans)' }}>
                    {activeTab === 'growth' ? 'Growth Timeline' : 'Asset Manager'}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--os-text-tert)', lineHeight: 1.6, fontFamily: 'var(--ff-sans)', maxWidth: 320, margin: '0 auto' }}>
                    {activeTab === 'growth'
                      ? 'Tracks audit history, agent actions, and metric changes over time — with cause-and-effect linking.'
                      : 'Manage your website, Google Business Profile, ads, SEO, and local listings from one place.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Right panel — always visible ── */}
          <RightPanel data={data} onReaudit={onReaudit} />
        </div>
      </div>
    </div>
  )
}

// ── Action Detail sub-component ────────────────────────────────────────────

function ActionDetail({ card, onClose }: { card: FeedItem; onClose: () => void }) {
  const d = card.detail!
  return (
    <div>
      <div className="os-action-card">
        <div className="os-ac-header">
          <div className="os-agent-dot" style={{ background: d.agentColor, color: d.agentTextColor }}>
            {d.agentInitials}
          </div>
          <div>
            <div className="os-ac-agent-name">{d.agentName}</div>
            <div className="os-ac-agent-meta">Generated · {card.time}</div>
          </div>
        </div>

        <div className="os-ac-body">
          <div className="os-ac-action-title">{card.title}</div>

          <div className="os-ac-why">
            <div className="os-ac-why-label">Why this matters</div>
            {d.why}
          </div>

          <div className="os-metrics-row">
            {d.metrics.map((m, i) => (
              <div key={i} className="os-metric-box">
                <div className={`os-metric-val${m.green ? ' green' : ''}`}>{m.value}</div>
                <div className="os-metric-label">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="os-pipeline-section">
            <div className="os-pipeline-title">Execution plan</div>
            <div className="os-pipeline-steps">
              {d.pipeline.map((step, i) => (
                <div key={i} className="os-pipe-step">
                  <div className={`os-pipe-dot ${step.status}`}>
                    {step.status === 'done' ? '✓' : i + 1}
                  </div>
                  <div className={`os-pipe-label${step.status === 'active' ? ' active' : ''}`}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {card.impact && (
            <div style={{ background: 'var(--os-green-dim)', borderRadius: 6, padding: '10px 12px', marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--os-text-tert)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4, fontFamily: 'var(--ff-sans)' }}>Estimated impact</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--os-green)', fontFamily: 'var(--ff-sans)' }}>{card.impact}</div>
            </div>
          )}
        </div>

        <div className="os-ac-footer">
          <div className="os-ac-footer-meta">Approving launches next phase automatically</div>
          <button className="os-preview-btn" onClick={onClose}>Close</button>
          <button className="os-reject-btn">Reject</button>
          <button className="os-approve-btn">Approve →</button>
        </div>
      </div>
    </div>
  )
}
