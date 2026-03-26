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

export function StatCards({ score, delta, revenueLeak, levelName, xpTotal, xpToNext }: Props) {
  // Approximate XP progress % just for visuals
  let progressPct = 0
  const totalInLevel = xpToNext // roughly... if xpToNext is remaining
  // Actually xpToNext is Remaining XP.
  // We can't know the exact floor of the level without the full level table. 
  // But let's just use a dummy fill animation for visual flair
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: 16 }}>
      <div className="card-v2" style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '24px 32px' }}>
        <ScoreRing score={score} size={100} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-h2" style={{ marginBottom: 4 }}>Overall Health</span>
          <span className="text-body" style={{ fontSize: 13 }}>
            {delta && delta > 0 ? (
              <span style={{ color: 'var(--green2)', fontWeight: 500 }}>+{delta} pts this month</span>
            ) : delta && delta < 0 ? (
               <span style={{ color: 'var(--coral)', fontWeight: 500 }}>{delta} pts this month</span>
            ) : (
               <span>Stable performance</span>
            )}
          </span>
        </div>
      </div>

      <div className="card-v2" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span className="text-small text-body" style={{ marginBottom: 8 }}>Estimated Leakage</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span className="text-h1" style={{ fontSize: 32 }}>${revenueLeak?.toLocaleString() || '0'}</span>
          <span className="text-body">/ month</span>
        </div>
      </div>

      <div className="card-v2" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="text-small text-body">Current Level</span>
          <span className="chip chip-purple">{levelName}</span>
        </div>
        <span className="text-h2" style={{ fontSize: 20 }}>{xpToNext} XP to next level</span>
        <div style={{ height: 4, background: 'var(--page-bg)', borderRadius: 2, marginTop: 12, overflow: 'hidden', position: 'relative' }}>
           <div style={{ 
             position: 'absolute', top: 0, left: 0, height: '100%', 
             background: 'var(--purple)', borderRadius: 2,
             width: '60%', // placeholder fill
             animation: 'fadeUp 1s ease-out'
           }} />
        </div>
      </div>
    </div>
  )
}
