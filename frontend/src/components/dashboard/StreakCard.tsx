import React from 'react'

interface Props {
  streakHistory: (0 | 1 | 2)[]
  streakDays: number
  streakPtsThisMonth: number
  totalAudits: number
}

export function StreakCard({ streakHistory, streakDays, streakPtsThisMonth, totalAudits }: Props) {
  return (
    <div className="card-v2" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 className="text-h2" style={{ marginBottom: 16 }}>Activity Streak</h3>
      
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-h1" style={{ color: streakDays > 0 ? 'var(--green2)' : 'var(--ink)' }}>{streakDays}</span>
          <span className="text-small text-body">Day Streak</span>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-h1">{streakPtsThisMonth > 0 ? `+${streakPtsThisMonth}` : '–'}</span>
          <span className="text-small text-body">Pts This Month</span>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-h1">{totalAudits}</span>
          <span className="text-small text-body">Total Audits</span>
        </div>
      </div>

      <div style={{ 
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, 
        flex: 1, alignContent: 'end'
      }}>
        {streakHistory.map((val, i) => {
          let bg = 'var(--page-bg)'
          let border = '1px solid var(--border)'
          let boxShadow = 'none'

          if (val === 1) {
            bg = 'var(--green2)'
            border = 'none'
          } else if (val === 2) {
            bg = 'var(--green)'
            border = 'none'
            boxShadow = '0 0 8px var(--green)'
          }

          return (
            <div key={i} title={i === 27 ? 'Today' : `Day -${27 - i}`} style={{ 
              aspectRatio: '1/1', borderRadius: 4, background: bg, border, boxShadow,
              transition: 'transform 0.2s',
              transform: (i === 27 && val > 0) ? 'scale(1.05)' : 'none'
            }} />
          )
        })}
      </div>
    </div>
  )
}
