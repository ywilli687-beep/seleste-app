import React from 'react'
import { Tooltip } from './Tooltip'

interface Props {
  streakHistory: (0 | 1 | 2)[]
  streakDays: number
  streakPtsThisMonth: number
  totalAudits: number
}

export function StreakCard({ streakHistory, streakDays, streakPtsThisMonth, totalAudits }: Props) {
  return (
    <div className="card-v2" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Tooltip text="Tracks how consistently you're checking and improving your website. Each coloured square is a day you were active. Brighter green means more activity that day.">
        <h3 className="text-h2" style={{ marginBottom: 16 }}>Your Activity</h3>
      </Tooltip>

      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-h1" style={{ color: streakDays > 0 ? 'var(--green2)' : 'var(--ink)' }}>{streakDays}</span>
          <Tooltip text="How many days in a row you've logged in or run an audit. Keeping a streak helps you improve your score faster.">
            <span className="text-small text-body">Day Streak</span>
          </Tooltip>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-h1">{streakPtsThisMonth > 0 ? `+${streakPtsThisMonth}` : '–'}</span>
          <Tooltip text="Points you've earned this month by running audits and making improvements. Points help you level up and unlock more detailed insights.">
            <span className="text-small text-body">Points This Month</span>
          </Tooltip>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-h1">{totalAudits}</span>
          <Tooltip text="The total number of times you've run a website audit. Each audit gives you an up-to-date score and fresh recommendations.">
            <span className="text-small text-body">Audits Run</span>
          </Tooltip>
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
            <div key={i} title={i === 27 ? 'Today' : `${27 - i} days ago`} style={{
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
