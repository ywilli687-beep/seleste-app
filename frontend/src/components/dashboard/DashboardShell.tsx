import React, { useState, useMemo } from 'react'
import type { DashboardData } from '../../types/dashboard'
import type { FeedItem, WeeklyActionRaw } from '../../types/feed'
import { weeklyActionToFeedItem, getAgentDot, buildPipeline } from '../../types/feed'
import { FeedCard } from './FeedCard'
import { NotificationStack } from './NotificationStack'
import { RightPanel } from './RightPanel'
import { RoadmapCard } from './RoadmapCard'
import { ScoreBreakdown } from './ScoreBreakdown'

// ── Props ──────────────────────────────────────────────────────────────────

interface Props {
  data: DashboardData
  userName?: string
  weeklyActions?: WeeklyActionRaw[]
  children?: React.ReactNode
  onReaudit?: (payload: { url: string; businessName: string; location: string; vertical: string }) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

type TabId = 'today' | 'inbox' | 'growth' | 'assets'

// ── Pillar descriptions (for detail fallback) ──────────────────────────────

const PILLAR_DESC: Record<string, string> = {
  conversion:      'How well your site turns visitors into customers — buttons, forms, and calls to action.',
  trust:           'How trustworthy your site looks — reviews, testimonials, and professional design.',
  performance:     'How fast your pages load. Slow pages lose visitors and hurt Google ranking.',
  discoverability: 'How easy it is for people to find you on Google when searching nearby.',
  ux:              'How easy your site is to navigate, especially on a phone.',
  content:         'How clear your text is — does it explain what you do and why someone should choose you?',
  data:            'Whether you have tools to understand how visitors use your site.',
  technical:       'Behind-the-scenes health — SSL, mobile-friendliness, structured data.',
  brand:           'Whether your logo and overall look feel consistent and professional.',
  scalability:     'Whether your site is set up to handle growth.',
}

const PILLAR_SHORT: Record<string, string> = {
  conversion: 'Getting Customers to Act', discoverability: 'Found on Google',
  trust: 'Trust & Credibility', performance: 'Page Speed', content: 'Writing & Messaging',
  ux: 'Ease of Use', data: 'Tracking & Analytics', technical: 'Technical Health',
  brand: 'Brand Consistency', scalability: 'Room to Grow',
}

// ── Derive dashboard-native feed items from DashboardData ──────────────────

function buildDashboardFeedItems(
  data: DashboardData,
  onReaudit: Props['onReaudit'],
): FeedItem[] {
  const items: FeedItem[] = []

  // Competitor gap alert
  if (data.competitorGap !== null && data.competitorGap !== undefined && data.competitorGap < 0) {
    const gap = Math.abs(data.competitorGap)
    items.push({
      id: 'competitor-gap',
      type: 'urgent',
      title: `A local competitor is ${gap} pts ahead of you`,
      body: `Your score of ${data.overallScore} puts you behind the local leader. Closing this gap is the highest-ROI move right now.`,
      impact: `↓ revenue risk if unaddressed`,
      time: 'Now',
      actions: [
        { label: 'See Competitor Report', primary: true },
        { label: 'Dismiss' },
      ],
      detail: {
        agentName: 'Intelligence Agent',
        agentInitials: 'IA',
        agentColor: '#FCEAEA',
        agentTextColor: '#991B1B',
        why: `Your website currently scores ${data.overallScore}/100. The top local competitor is ${gap} points ahead. In local search, higher-scoring businesses capture more clicks, calls, and bookings. Catching up with targeted fixes can recover that traffic before they build further momentum.`,
        metrics: [
          { label: 'Points behind', value: `${gap} pts` },
          { label: 'Your score',    value: `${data.overallScore}/100` },
          { label: 'Risk',          value: 'High' },
        ],
        pipeline: buildPipeline('growth'),
      },
    })
  }

  // Quick win → approval card
  if (data.quickWin) {
    const dot = getAgentDot('growth')
    items.push({
      id: 'quick-win',
      type: 'action',
      title: data.quickWin.action,
      body: data.quickWin.implementation,
      impact: `+${data.quickWin.estimatePts} pts estimated`,
      time: 'Ready',
      actions: [{ label: 'Review & Approve', primary: true }],
      detail: {
        agentName: dot.name,
        agentInitials: dot.initials,
        agentColor: dot.bg,
        agentTextColor: dot.text,
        why: data.quickWin.implementation,
        metrics: [
          { label: 'Score impact', value: `+${data.quickWin.estimatePts} pts`, green: true },
          { label: 'Difficulty',   value: data.quickWin.difficulty },
          { label: 'Risk',         value: 'Low' },
        ],
        pipeline: buildPipeline('growth'),
      },
    })
  }

  // Revenue leak → opportunity
  if (data.leakagePct && data.leakagePct > 15) {
    const convScore = data.pillars?.find(p => p.id === 'conversion')?.score ?? '?'
    const trustScore = data.pillars?.find(p => p.id === 'trust')?.score ?? '?'
    const dot = getAgentDot('conversion')
    items.push({
      id: 'revenue-leak',
      type: 'opportunity',
      title: `${data.leakagePct}% of visitors may not be converting`,
      body: `Conversion (${convScore}/100) and trust (${trustScore}/100) are your biggest revenue gaps.`,
      impact: data.revenueLeakMonthly
        ? `~$${data.revenueLeakMonthly.toLocaleString()}/mo potential`
        : `${data.leakagePct}% conversion gap`,
      time: 'Now',
      actions: [{ label: 'Launch CRO Agent', primary: true }],
      detail: {
        agentName: dot.name,
        agentInitials: dot.initials,
        agentColor: dot.bg,
        agentTextColor: dot.text,
        why: `Your site is losing roughly ${data.leakagePct}% of potential revenue to conversion gaps. The biggest contributors are conversion (${convScore}/100) and trust (${trustScore}/100). Improving these two areas delivers the highest revenue impact per hour of work.`,
        metrics: [
          { label: 'Potential gain', value: data.revenueLeakMonthly ? `$${data.revenueLeakMonthly.toLocaleString()}/mo` : `${data.leakagePct}% gap`, green: true },
          { label: 'Effort', value: 'Medium' },
          { label: 'Risk',   value: 'Low' },
        ],
        pipeline: buildPipeline('conversion'),
      },
    })
  }

  // Worst pillar → opportunity
  const sorted = [...(data.pillars ?? [])].sort((a, b) => a.score - b.score)
  const worst = sorted.find(p => p.score < 50)
  if (worst) {
    const dot = getAgentDot(worst.id)
    items.push({
      id: `pillar-${worst.id}`,
      type: 'opportunity',
      title: `${PILLAR_SHORT[worst.id] || worst.id} scores ${worst.score}/100 — industry avg ${Math.round(worst.industryAvg)}`,
      body: PILLAR_DESC[worst.id] || '',
      time: 'Now',
      actions: [{ label: 'See Recommendations', primary: true }],
      detail: {
        agentName: dot.name,
        agentInitials: dot.initials,
        agentColor: dot.bg,
        agentTextColor: dot.text,
        why: `${PILLAR_SHORT[worst.id] || worst.id} is your lowest-scoring area at ${worst.score}/100, compared to an industry average of ${Math.round(worst.industryAvg)}. ${PILLAR_DESC[worst.id] || ''}`,
        metrics: [
          { label: 'Your score',     value: `${worst.score}/100` },
          { label: 'Industry avg',   value: `${Math.round(worst.industryAvg)}/100` },
          { label: 'Gap',            value: `${Math.round(worst.industryAvg) - worst.score} pts` },
        ],
        pipeline: buildPipeline(worst.id),
      },
    })
  }

  // Score delta → info
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
          label: 'Re-audit now',
          primary: true,
          onClick: () => onReaudit && latest && onReaudit({
            url: latest.inputUrl,
            businessName: data.businessName || '',
            location: [data.city, data.state].filter(Boolean).join(', '),
            vertical: data.vertical,
          }),
        },
        { label: 'View Audit' },
      ],
    })
  } else if (latest?.scoreDelta && latest.scoreDelta > 0) {
    items.push({
      id: 'score-up',
      type: 'info',
      title: `Score improved ${latest.scoreDelta} pts — keep going`,
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
  Today:    () => <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Command:  () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>,
  Inbox:    () => <svg viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>,
  Growth:   () => <svg viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Assets:   () => <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Intel:    () => <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
  Team:     () => <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
}

// ── Main component ─────────────────────────────────────────────────────────

export function DashboardShell({ data, userName, weeklyActions = [], children, onReaudit, onApprove, onReject }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('today')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set())
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set())

  // Dashboard-native feed items (from audit data)
  const dashboardFeedItems = useMemo(
    () => buildDashboardFeedItems(data, onReaudit),
    [data, onReaudit],
  )

  // Agent proposal feed items (from weeklyActions)
  const agentFeedItems = useMemo(
    () => weeklyActions
      .filter(a => !approvedIds.has(a.id) && !rejectedIds.has(a.id))
      .map(a => weeklyActionToFeedItem(
        a,
        (id) => {
          setApprovedIds(prev => new Set(prev).add(id))
          onApprove?.(id)
        },
        (id) => {
          setRejectedIds(prev => new Set(prev).add(id))
          onReject?.(id)
        },
      )),
    [weeklyActions, approvedIds, rejectedIds, onApprove, onReject],
  )

  // Combined feed: agent proposals first (they need action), then dashboard items
  const allFeedItems: FeedItem[] = useMemo(
    () => [...agentFeedItems, ...dashboardFeedItems],
    [agentFeedItems, dashboardFeedItems],
  )

  const selectedCard = allFeedItems.find(c => c.id === selectedId) ?? null
  const pendingCount = agentFeedItems.length
  const inboxCount = (data.roadmap?.length ?? 0) + pendingCount

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
    { id: 'inbox',  label: `Inbox${inboxCount > 0 ? ` (${inboxCount})` : ''}` },
    { id: 'growth', label: 'Growth' },
    { id: 'assets', label: 'Assets' },
  ]

  return (
    <div className="os-shell">
      <NotificationStack />

      {/* ── 52px icon sidebar ── */}
      <nav className="os-sidebar">
        <div className="os-logo" title="Seleste">S</div>

        {([
          { id: 'today',  Icon: I.Today,   label: 'Today',        tab: true,  badge: false },
          { id: 'inbox',  Icon: I.Inbox,   label: 'Inbox',        tab: true,  badge: pendingCount > 0 },
          { id: 'growth', Icon: I.Growth,  label: 'Growth',       tab: true,  badge: false },
          { id: 'assets', Icon: I.Assets,  label: 'Assets',       tab: true,  badge: false },
          { id: 'intel',  Icon: I.Intel,   label: 'Intelligence', tab: false, badge: false },
          { id: 'command',Icon: I.Command, label: 'Command',      tab: false, badge: false },
        ] as const).map(({ id, Icon, label, badge, tab }) => (
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
        <div className="os-nav-item" title="Team"    onClick={() => {}}><I.Team /></div>
        <div className="os-nav-item" title="Settings" onClick={() => {}}><I.Settings /></div>
      </nav>

      {/* ── Main ── */}
      <div className="os-main">

        {/* Top bar */}
        <div className="os-topbar">
          <div className="os-topbar-greeting">
            <strong>{greeting()}, {userName || data.businessName || 'there'}.</strong>
            &nbsp;&nbsp;{todayLabel()}
          </div>
          {pendingRevenue && (
            <div className="os-revenue-pill">{pendingRevenue}</div>
          )}
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

          {/* ── TODAY tab ── */}
          {activeTab === 'today' && (
            <>
              <FeedColumn
                items={allFeedItems}
                selectedId={selectedId}
                onSelect={id => setSelectedId(selectedId === id ? null : id)}
              />
              <DetailColumn
                selected={selectedCard}
                data={data}
                children={children}
                onClose={() => setSelectedId(null)}
                onApprove={onApprove ? (id) => {
                  setApprovedIds(prev => new Set(prev).add(id))
                  onApprove(id)
                  setSelectedId(null)
                } : undefined}
                onReject={onReject ? (id) => {
                  setRejectedIds(prev => new Set(prev).add(id))
                  onReject(id)
                  setSelectedId(null)
                } : undefined}
              />
            </>
          )}

          {/* ── INBOX tab ── */}
          {activeTab === 'inbox' && (
            <>
              {/* Agent proposals in feed column */}
              <FeedColumn
                items={agentFeedItems.length > 0 ? agentFeedItems : dashboardFeedItems}
                selectedId={selectedId}
                onSelect={id => setSelectedId(selectedId === id ? null : id)}
                header={agentFeedItems.length > 0
                  ? `${agentFeedItems.length} pending approval`
                  : 'No pending proposals'}
              />
              <DetailColumn
                selected={selectedCard}
                data={data}
                onClose={() => setSelectedId(null)}
                onApprove={onApprove ? (id) => {
                  setApprovedIds(prev => new Set(prev).add(id))
                  onApprove(id)
                  setSelectedId(null)
                } : undefined}
                onReject={onReject ? (id) => {
                  setRejectedIds(prev => new Set(prev).add(id))
                  onReject(id)
                  setSelectedId(null)
                } : undefined}
                fallback={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <RoadmapCard
                      roadmap={data.roadmap ?? []}
                      roadmapDurationWeeks={data.roadmapDurationWeeks ?? '2-3'}
                      grade={data.grade ?? 'D'}
                    />
                  </div>
                }
              />
            </>
          )}

          {/* ── GROWTH / ASSETS stubs ── */}
          {(activeTab === 'growth' || activeTab === 'assets') && (
            <div className="os-detail-col" style={{ flex: 1 }}>
              <div className="os-col-header">
                <span className="os-col-title">
                  {activeTab === 'growth' ? 'Growth Timeline' : 'Asset Manager'}
                </span>
                <span className="os-col-meta">Coming in Phase 5</span>
              </div>
              <div className="os-detail-scroll">
                <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 16 }}>
                    {activeTab === 'growth' ? '📈' : '🖥️'}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--os-text-sec)', marginBottom: 8, fontFamily: 'var(--ff-sans)' }}>
                    {activeTab === 'growth' ? 'Growth Timeline' : 'Asset Manager'}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--os-text-tert)', lineHeight: 1.6, fontFamily: 'var(--ff-sans)', maxWidth: 320, margin: '0 auto' }}>
                    {activeTab === 'growth'
                      ? 'Shows audit history, agent actions, and metric changes over time — with cause-and-effect linking.'
                      : 'Manage your website, Google Business Profile, ads, SEO, and local listings from one place.'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right panel — always visible */}
          <RightPanel data={data} onReaudit={onReaudit} />
        </div>
      </div>
    </div>
  )
}

// ── Feed column ────────────────────────────────────────────────────────────

function FeedColumn({
  items,
  selectedId,
  onSelect,
  header,
}: {
  items: FeedItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  header?: string
}) {
  return (
    <div className="os-feed-col">
      <div className="os-col-header">
        <span className="os-col-title">Feed</span>
        <span className="os-col-meta">
          {header ?? `${items.length} items · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
        </span>
      </div>
      <div className="os-feed-scroll">
        {items.length === 0 ? (
          <div style={{ padding: '40px 12px', textAlign: 'center', color: 'var(--os-text-tert)', fontSize: 12, lineHeight: 1.7, fontFamily: 'var(--ff-sans)' }}>
            No items yet.<br />Run an audit to generate insights.
          </div>
        ) : (
          items.map(card => (
            <FeedCard
              key={card.id}
              card={card}
              selected={selectedId === card.id}
              onClick={() => onSelect(card.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ── Detail column ──────────────────────────────────────────────────────────

function DetailColumn({
  selected,
  data,
  children,
  fallback,
  onClose,
  onApprove,
  onReject,
}: {
  selected: FeedItem | null
  data: DashboardData
  children?: React.ReactNode
  fallback?: React.ReactNode
  onClose: () => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}) {
  if (selected?.detail) {
    return (
      <div className="os-detail-col">
        <div className="os-col-header">
          <span className="os-col-title">Action Detail</span>
          <span className="os-col-meta">{selected.detail.agentName}</span>
        </div>
        <div className="os-detail-scroll">
          <ActionDetailCard
            card={selected}
            onClose={onClose}
            onApprove={onApprove}
            onReject={onReject}
          />
        </div>
      </div>
    )
  }

  if (selected) {
    return (
      <div className="os-detail-col">
        <div className="os-col-header">
          <span className="os-col-title">Detail</span>
          <span className="os-col-meta">{selected.title.slice(0, 40)}…</span>
        </div>
        <div className="os-detail-scroll">
          <div className="os-action-card">
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--os-text-prim)', marginBottom: 12, lineHeight: 1.45, fontFamily: 'var(--ff-sans)' }}>
                {selected.title}
              </div>
              <div className="os-ac-why">
                <div className="os-ac-why-label">Context</div>
                {selected.body}
              </div>
              {selected.impact && (
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--os-green)', fontFamily: 'var(--ff-sans)', marginTop: 8 }}>
                  {selected.impact}
                </div>
              )}
            </div>
          </div>
          <ScoreBreakdown pillars={data.pillars ?? []} />
        </div>
      </div>
    )
  }

  // No card selected — show fallback or default content
  const defaultContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <RoadmapCard
        roadmap={data.roadmap ?? []}
        roadmapDurationWeeks={data.roadmapDurationWeeks ?? '2-3'}
        grade={data.grade ?? 'D'}
      />
      <ScoreBreakdown pillars={data.pillars ?? []} />
    </div>
  )

  return (
    <div className="os-detail-col">
      <div className="os-col-header">
        <span className="os-col-title">
          {children ? 'Get Started' : 'Overview'}
        </span>
        <span className="os-col-meta">{data.businessName}</span>
      </div>
      <div className="os-detail-scroll">
        {children ?? fallback ?? defaultContent}
      </div>
    </div>
  )
}

// ── Action detail card ─────────────────────────────────────────────────────

function ActionDetailCard({
  card,
  onClose,
  onApprove,
  onReject,
}: {
  card: FeedItem
  onClose: () => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}) {
  const d = card.detail!
  const weeklyActionId = d.weeklyActionId

  const handleApprove = () => {
    if (weeklyActionId && onApprove) onApprove(weeklyActionId)
    else onClose()
  }

  const handleReject = () => {
    if (weeklyActionId && onReject) onReject(weeklyActionId)
    else onClose()
  }

  return (
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
          <div style={{ background: 'var(--os-green-dim)', borderRadius: 6, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--os-text-tert)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4, fontFamily: 'var(--ff-sans)' }}>
              Estimated impact
            </div>
            <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--os-green)', fontFamily: 'var(--ff-sans)' }}>
              {card.impact}
            </div>
          </div>
        )}
      </div>

      <div className="os-ac-footer">
        <div className="os-ac-footer-meta">
          {weeklyActionId
            ? 'Approving queues this action for execution'
            : 'Select an action from the feed to approve'}
        </div>
        <button className="os-preview-btn" onClick={onClose}>Close</button>
        {weeklyActionId && (
          <>
            <button className="os-reject-btn" onClick={handleReject}>Reject</button>
            <button className="os-approve-btn" onClick={handleApprove}>Approve →</button>
          </>
        )}
      </div>
    </div>
  )
}
