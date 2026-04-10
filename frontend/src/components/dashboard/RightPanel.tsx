import { useState } from 'react'
import type { DashboardData } from '../../types/dashboard'
import type { AgentOutput, CycleState } from '../../types/feed'

interface Props {
  data: DashboardData
  agentOutputs?: AgentOutput[]
  cycleState?: CycleState
  lastCycleAt?: string | null
  onReaudit?: (payload: { url: string; businessName: string; location: string; vertical: string }) => void
}

// The 5 key pillars shown in the right panel (matches mockup)
const KEY_PILLARS = ['conversion', 'discoverability', 'trust', 'performance', 'content']

const PILLAR_SHORT: Record<string, string> = {
  conversion:      'Conversion',
  discoverability: 'SEO',
  trust:           'Reputation',
  performance:     'Speed',
  content:         'Content',
}

function pillarColor(score: number): string {
  if (score >= 75) return 'var(--os-green)'
  if (score >= 50) return 'var(--os-amber)'
  return 'var(--os-red)'
}

// Maps the 5 displayed agent slots to the agentId fragments returned by the backend
const AGENT_SLOTS = [
  { name: 'SEO',        match: ['seo'] },
  { name: 'CRO',        match: ['cro', 'conversion'] },
  { name: 'Content',    match: ['content'] },
  { name: 'Reputation', match: ['reputation'] },
  { name: 'Media',      match: ['media'] },
] as const

function deriveAgents(outputs: AgentOutput[]) {
  return AGENT_SLOTS.map(slot => {
    const run = outputs.find(o =>
      slot.match.some(m => o.agentId.toLowerCase().includes(m))
    )
    const status = run?.status ?? 'idle'
    const indicator =
      status === 'running' ? 'running' :
      status === 'done'    ? 'done'    :
      status === 'failed'  ? 'error'   :
      'idle'
    const label =
      status === 'running' ? 'Running…' :
      status === 'done'    ? 'Done'     :
      status === 'failed'  ? 'Failed'   :
      status === 'skipped' ? 'Skipped'  :
      'Idle'
    return { name: slot.name, status: label, indicator }
  })
}

function formatLastCycle(iso: string | null | undefined): string | null {
  if (!iso) return null
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

type AutopilotTier = 'hands-on' | 'co-pilot' | 'autopilot'

const TIER_DESC: Record<AutopilotTier, string> = {
  'hands-on': 'You review and approve every action before anything runs.',
  'co-pilot':  'Agents draft actions; you approve before they go live.',
  'autopilot': 'Agents execute low-risk actions automatically.',
}

export function RightPanel({ data, agentOutputs = [], cycleState = 'no_cycle', lastCycleAt }: Props) {
  const [tier, setTier] = useState<AutopilotTier>(() => {
    return (localStorage.getItem('seleste_autopilot_tier') as AutopilotTier) ?? 'co-pilot'
  })

  const handleTier = (t: AutopilotTier) => {
    setTier(t)
    localStorage.setItem('seleste_autopilot_tier', t)
  }

  const keyPillars = KEY_PILLARS
    .map(id => data.pillars?.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p)

  const delta = data.scoreDelta ?? 0
  const deltaColor = delta >= 0 ? 'var(--os-green)' : 'var(--os-red)'
  const deltaText = delta !== 0
    ? `${delta > 0 ? '↑' : '↓'} ${Math.abs(delta)} this month`
    : 'No change this month'

  const opportunity = data.revenueLeakMonthly
    ? `$${data.revenueLeakMonthly.toLocaleString()}`
    : data.leakagePct
    ? `${data.leakagePct}% gap`
    : '—'

  const agents = deriveAgents(agentOutputs)
  const lastCycleLabel = formatLastCycle(lastCycleAt)
  const cycleRunning = cycleState === 'cycle_running'

  return (
    <div className="os-right-panel">

      {/* Score */}
      <div className="os-rp-section">
        <div className="os-rp-title">Overall Score</div>
        <div className="os-score-big">{data.overallScore}</div>
        <div style={{ fontSize: 11, color: deltaColor, marginTop: 3, fontFamily: 'var(--ff-sans)' }}>
          {deltaText}
        </div>
      </div>

      {/* Pillars */}
      <div className="os-rp-section">
        <div className="os-rp-title">Pillars</div>
        {keyPillars.map(p => (
          <div key={p.id} className="os-pillar-row">
            <div className="os-pillar-name">{PILLAR_SHORT[p.id] || p.id}</div>
            <div className="os-pillar-bar-bg">
              <div
                className="os-pillar-fill"
                style={{ width: `${p.score}%`, background: pillarColor(p.score) }}
              />
            </div>
            <div className="os-pillar-score">{p.score}</div>
          </div>
        ))}
      </div>

      {/* Revenue */}
      <div className="os-rp-section">
        <div className="os-rp-title">Revenue</div>
        <div className="os-rp-rev-row">
          <span className="os-rp-rev-label">Recovered</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--os-green)', fontFamily: 'var(--ff-sans)' }}>
            $0
          </span>
        </div>
        <div className="os-rp-rev-row">
          <span className="os-rp-rev-label">Opportunity</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--os-text-prim)', fontFamily: 'var(--ff-sans)' }}>
            {opportunity}
          </span>
        </div>
        <div className="os-rp-rev-row">
          <span className="os-rp-rev-label">At risk</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--os-text-tert)', fontFamily: 'var(--ff-sans)' }}>
            —
          </span>
        </div>
      </div>

      {/* Agents */}
      <div className="os-rp-section" style={{ flex: 1, overflowY: 'auto', borderBottom: 'none' }}>
        <div className="os-rp-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Agents
          {cycleRunning && (
            <span className="os-ast-cycle-badge running">Running</span>
          )}
          {!cycleRunning && lastCycleLabel && (
            <span className="os-ast-cycle-badge">{lastCycleLabel}</span>
          )}
        </div>
        {agents.map(a => (
          <div key={a.name} className="os-agent-row">
            <div className={`os-ast-indicator ${a.indicator}`} />
            <div className="os-ast-name">{a.name}</div>
            <div className={`os-ast-status${a.indicator === 'done' ? ' done' : a.indicator === 'error' ? ' error' : ''}`}>
              {a.status}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '0.5px solid var(--os-border-prim)' }}>
          <button
            onClick={() => window.location.href = '/agents'}
            style={{
              width: '100%', padding: '6px 0', fontSize: 11,
              color: 'var(--os-text-sec)', background: 'transparent',
              border: '0.5px solid var(--os-border-sec)',
              borderRadius: 5, cursor: 'pointer', fontFamily: 'var(--ff-sans)',
            }}
          >
            + Run Agent
          </button>
        </div>

        {/* Autopilot tier selector */}
        <div className="os-autopilot-section">
          <div className="os-autopilot-title">Autopilot Mode</div>
          <div className="os-autopilot-tiers">
            {(['hands-on', 'co-pilot', 'autopilot'] as AutopilotTier[]).map(t => (
              <button
                key={t}
                className={`os-autopilot-tier${tier === t ? ' active' : ''}`}
                onClick={() => handleTier(t)}
              >
                {t === 'hands-on' ? 'Hands-On' : t === 'co-pilot' ? 'Co-Pilot' : 'Autopilot'}
              </button>
            ))}
          </div>
          <div className="os-autopilot-desc">{TIER_DESC[tier]}</div>
        </div>
      </div>
    </div>
  )
}
