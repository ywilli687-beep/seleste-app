import React, { useEffect, useState } from 'react'

interface PillarCardProps {
  pillars: { id: string; score: number; industryAvg: number }[]
}

const PILLAR_NAMES: Record<string, string> = {
  conversion: 'Conversion',
  trust: 'Trust',
  performance: 'Performance',
  discoverability: 'Discoverability',
  ux: 'User Experience',
  content: 'Content',
  data: 'Data & Tracking',
  technical: 'Technical',
  brand: 'Brand',
  scalability: 'Scalability'
}

export function PillarCard({ pillars }: PillarCardProps) {
  const [widths, setWidths] = useState<number[]>(pillars.map(() => 0))

  useEffect(() => {
    pillars.forEach((p, i) => {
      setTimeout(() => {
        setWidths(prev => {
          const next = [...prev]
          next[i] = p.score
          return next
        })
      }, i * 80 + 300)
    })
  }, [pillars])

  return (
    <div className="card-v2" style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <h3 className="text-h2">Pillar Breakdown</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {pillars.map((p, i) => {
          const w = widths[i]
          const color = w >= 80 ? 'var(--green)' : w >= 60 ? 'var(--blue)' : w >= 40 ? 'var(--amber)' : 'var(--coral)'
          
          return (
            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 500 }}>
                <span>{PILLAR_NAMES[p.id] || p.id}</span>
                <span>{p.score}</span>
              </div>
              <div style={{ position: 'relative', height: 8, background: 'var(--page-bg)', borderRadius: 4, overflow: 'hidden' }}>
                <div 
                  style={{ 
                    position: 'absolute', top: 0, left: 0, height: '100%', 
                    background: color, borderRadius: 4, width: `${w}%`,
                    transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} 
                />
                <div 
                  style={{ 
                    position: 'absolute', top: 0, bottom: 0, width: 2, 
                    background: 'rgba(0,0,0,0.3)', left: `${p.industryAvg}%`,
                    zIndex: 2
                  }}
                  title={`Industry Avg: ${p.industryAvg}`}
                />
              </div>
            </div>
          )
        })}
      </div>
      <a href="#pillars" className="section-link" style={{ marginTop: 'auto' }}>Full breakdown →</a>
    </div>
  )
}
