import React from 'react'
import { ScoreRing } from './ScoreRing'
import { Tooltip } from './Tooltip'

interface Props {
  score: number
  delta: number | null
  revenueLeak: number | null
  leakagePct: number | null
  levelName: string
  xpTotal: number
  xpRequired: number
  xpToNext: number
}

export function StatCards({ score, revenueLeak, leakagePct, levelName, xpTotal, xpRequired, xpToNext }: Props) {
  const nextTarget = xpTotal + xpToNext
  const progress = Math.max(5, Math.min(100, ((xpTotal - xpRequired) / (nextTarget - xpRequired)) * 100))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <div className="card-v2" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '24px' }}>
        <ScoreRing score={score} size={80} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-h1" style={{ fontSize: 28, lineHeight: 1 }}>{score}</span>
          <span className="text-small" style={{ color: 'var(--ink-muted)', marginTop: 4 }}>out of 100</span>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <Tooltip text="Your overall website health score. It combines 10 areas like speed, trust, and how easy it is for customers to contact or book you. Higher is better.">
            <span className="text-h2" style={{ display: 'block', fontSize: 13 }}>Website Score</span>
          </Tooltip>
          <span className="text-body" style={{ fontSize: 11, color: 'var(--ink-muted)' }}>Stable performance</span>
        </div>
      </div>

      <div className="card-v2" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Tooltip text="An estimate of how much potential revenue your website may not be capturing. This is based on gaps in things like your booking setup, trust signals, and page speed.">
          <span className="text-small" style={{ marginBottom: 16, display: 'block' }}>Potential Revenue Lost</span>
        </Tooltip>
        {revenueLeak != null && revenueLeak > 0 ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="text-h1" style={{ fontSize: 32 }}>${revenueLeak.toLocaleString()}</span>
            <span className="text-body">/ month</span>
          </div>
        ) : leakagePct != null && leakagePct > 0 ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="text-h1" style={{ fontSize: 32 }}>{leakagePct}%</span>
            <span className="text-body">of visitors not converting</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="text-h1" style={{ fontSize: 32 }}>$0</span>
            <span className="text-body">/ month</span>
          </div>
        )}
      </div>

      <div className="card-v2" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <Tooltip text="As you run audits and fix issues on your site, you earn points (XP). Reaching higher levels unlocks more detailed insights and recommendations.">
            <span className="text-small">Your Level</span>
          </Tooltip>
          <span className="chip" style={{ background: '#F3E8FF', color: '#7E22CE' }}>{levelName}</span>
        </div>
        <span className="text-h2" style={{ fontSize: 13 }}>{xpToNext} points to next level</span>
        <div style={{ height: 6, background: 'var(--page-bg)', borderRadius: 3, marginTop: 16, overflow: 'hidden', position: 'relative' }}>
           <div style={{
             position: 'absolute', top: 0, left: 0, height: '100%',
             background: 'var(--purple)', borderRadius: 3,
             width: `${progress}%`,
             transition: 'width 0.6s ease-out'
           }} />
        </div>
        <p style={{ fontSize: 10, color: 'var(--ink-muted)', marginTop: 12, lineHeight: 1.4 }}>
          Earn points by running audits, improving your scores, and completing recommended fixes.
        </p>
      </div>
    </div>
  )
}
