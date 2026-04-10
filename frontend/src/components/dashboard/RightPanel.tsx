import React from 'react'
import type { DashboardData } from '../../types/dashboard'

interface Props {
  data: DashboardData
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

export function RightPanel({ data }: Props) {
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

  // Agent statuses are stubs in Phase 1 — Phase 4 will wire real agent state
  const agents = [
    { name: 'SEO',        status: 'Idle',   indicator: 'idle' },
    { name: 'CRO',        status: 'Idle',   indicator: 'idle' },
    { name: 'Content',    status: 'Idle',   indicator: 'idle' },
    { name: 'Reputation', status: 'Idle',   indicator: 'idle' },
    { name: 'Media',      status: 'Idle',   indicator: 'idle' },
  ]

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
        <div className="os-rp-title">Agents</div>
        {agents.map(a => (
          <div key={a.name} className="os-agent-row">
            <div className={`os-ast-indicator ${a.indicator}`} />
            <div className="os-ast-name">{a.name}</div>
            <div className="os-ast-status">{a.status}</div>
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
      </div>
    </div>
  )
}
