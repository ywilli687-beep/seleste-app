import React, { useState } from 'react'
import { triggerNotification } from './NotificationStack'

interface Action {
  phase: number
  feature: string
  impact: string
  difficulty: string
}

export function RoadmapCard({ roadmap }: { 
  roadmap: Action[]
  roadmapDurationWeeks: string
  grade: string
}) {
  const [clicked, setClicked] = useState<Set<number>>(new Set())

  const handleClick = (phase: number, feature: string) => {
    setClicked(prev => new Set(prev).add(phase))
    triggerNotification({
      type: 'roadmapItemClicked',
      title: feature,
      body: 'Opening implementation guide...',
      duration: 3000
    })
  }

  return (
    <div className="card-v2" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ paddingBottom: 24 }}>
        <h3 className="text-h2">Your Action Plan</h3>
      </div>
      
      {roadmap.length === 0 ? (
        <div style={{ color: 'var(--ink-muted)', fontSize: 13 }}>
          Analyzing your results to build a custom roadmap...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {roadmap.map((a) => {
            const isClicked = clicked.has(a.phase)
            return (
              <a 
                key={a.phase}
                href={`#action-${a.phase}`}
                onClick={() => handleClick(a.phase, a.feature)}
                style={{ 
                  display: 'flex', alignItems: 'center', padding: '16px 0', 
                  borderTop: '1px solid var(--border)', textDecoration: 'none', color: 'var(--ink)',
                  transition: 'background 0.2s',
                  background: isClicked ? 'var(--panel-hover)' : 'transparent',
                }}
              >
                <div style={{ 
                  width: 32, height: 32, borderRadius: '50%', background: 'var(--page-bg)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontSize: 12, fontWeight: 700, marginRight: 16, color: 'var(--ink)'
                }}>
                  {a.phase}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{a.feature}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{a.difficulty} · {a.impact}</span>
                </div>
                <span style={{ color: 'var(--border2)', fontSize: 18 }}>→</span>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
