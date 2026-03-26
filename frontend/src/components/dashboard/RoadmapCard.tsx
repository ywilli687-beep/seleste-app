import React, { useState } from 'react'
import { triggerNotification } from './NotificationStack'

interface Action {
  phase: number
  feature: string
  impact: string
  difficulty: string
}

export function RoadmapCard({ roadmap, roadmapDurationWeeks, grade }: { 
  roadmap: Action[]
  roadmapDurationWeeks: string
  grade: string
}) {
  const [clicked, setClicked] = useState<Set<number>>(new Set())

  const getNextGrade = (curr: string) => {
    if (curr === 'D') return 'C'
    if (curr === 'C') return 'B'
    if (curr === 'B') return 'A'
    return 'A+'
  }
  const nextGrade = getNextGrade(grade)

  const handleClick = (phase: number, feature: string) => {
    setClicked(prev => new Set(prev).add(phase))
    triggerNotification({
      type: 'roadmapItemClicked',
      title: feature,
      body: 'Select to view implementation details.',
      duration: 4000
    })
  }

  return (
    <div className="card-v2" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '24px 24px 16px' }}>
        <h3 className="text-h2">Your Action Plan</h3>
      </div>
      
      {roadmap.length === 0 ? (
        <div style={{ padding: '0 24px', color: 'var(--ink-muted)', fontSize: 13, flex: 1 }}>
          Roadmap is being generated — check back shortly.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {roadmap.map((a) => {
            const isClicked = clicked.has(a.phase)
            return (
              <a 
                key={a.phase}
                href={`#action-${a.phase}`}
                onClick={() => handleClick(a.phase, a.feature)}
                style={{ 
                  display: 'flex', alignItems: 'center', padding: '12px 24px', 
                  borderTop: '1px solid var(--border)', textDecoration: 'none', color: 'var(--ink)',
                  transition: 'background 0.15s, transform 0.15s',
                  background: isClicked ? 'var(--panel-hover)' : 'transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ 
                  width: 24, height: 24, borderRadius: '50%', background: 'var(--page-bg)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: 11, fontWeight: 600, marginRight: 12, color: 'var(--ink-muted)'
                }}>
                  {a.phase}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{a.feature}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{a.difficulty} · {a.impact}</span>
                </div>
                <span style={{ color: 'var(--border2)' }}>→</span>
              </a>
            )
          })}
        </div>
      )}

      {nextGrade && roadmap.length > 0 && (
        <div style={{ 
          background: 'var(--dark)', color: 'white', padding: '16px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 'auto'
        }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Path to Grade {nextGrade}</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>~{roadmapDurationWeeks} weeks</span>
        </div>
      )}
    </div>
  )
}
