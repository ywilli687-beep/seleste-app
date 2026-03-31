import React from 'react'
import { ScoreRing } from './ScoreRing'

interface Props {
  score: number
  delta: number | null
  revenueLeak: number | null
  levelName: string
  xpTotal: number
  xpToNext: number
}

export function StatCards({ score, revenueLeak, levelName, xpToNext }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
      <div className="card-v2" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '24px' }}>
        <ScoreRing score={score} size={80} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-h1" style={{ fontSize: 28, lineHeight: 1 }}>{score}</span>
          <span className="text-small" style={{ color: 'var(--ink-muted)', marginTop: 4 }}>Score</span>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
           <span className="text-h2" style={{ display: 'block', fontSize: 13 }}>Overall Health</span>
           <span className="text-body" style={{ fontSize: 11 }}>Stable performance</span>
        </div>
      </div>

      <div className="card-v2" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span className="text-small" style={{ marginBottom: 16 }}>Estimated Leakage</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span className="text-h1" style={{ fontSize: 32 }}>${revenueLeak?.toLocaleString() || '0'}</span>
          <span className="text-body">/ month</span>
        </div>
      </div>

      <div className="card-v2" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="text-small">Current Level</span>
          <span className="chip" style={{ background: '#F3E8FF', color: '#7E22CE' }}>{levelName}</span>
        </div>
        <span className="text-h2" style={{ fontSize: 18 }}>{xpToNext} XP to next level</span>
        <div style={{ height: 6, background: 'var(--page-bg)', borderRadius: 3, marginTop: 16, overflow: 'hidden', position: 'relative' }}>
           <div style={{ 
             position: 'absolute', top: 0, left: 0, height: '100%', 
             background: 'var(--purple)', borderRadius: 3,
             width: '60%',
           }} />
        </div>
      </div>
    </div>
  )
}
