import React from 'react'

interface Props {
  userScore: number
  competitors: number[]
  gap: number | null
  isFirstAudit: boolean
}

export function CompetitorCard({ userScore, competitors, gap, isFirstAudit }: Props) {
  if (isFirstAudit || competitors.length === 0) {
    return (
      <div className="card-v2" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h3 className="text-h2" style={{ marginBottom: 24 }}>Local Competition</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120, marginBottom: 24, opacity: 0.5 }}>
           {[...Array(10)].map((_,i) => <div key={i} className="skeleton-v2" style={{ flex: 1, height: Math.random() * 80 + 20 }} />)}
        </div>
        <span className="text-body text-small">Scanning your local market...<br/>Competitor data is being computed in the background.<br/>Check back in a few minutes.</span>
      </div>
    )
  }

  const allBars = [...competitors.map(s => ({ score: s, isUser: false })), { score: userScore, isUser: true }]
  allBars.sort((a,b) => b.score - a.score)

  const rank = allBars.findIndex(b => b.isUser) + 1
  const topGapColor = gap !== null && gap > 0 ? 'var(--green)' : 'var(--coral)'
  const topGapLabel = gap !== null && gap > 0 ? `You lead by ${gap} pts` : `${Math.abs(gap || 0)} pts ahead`

  return (
    <div className="card-v2" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 0 0 0' }}>
      <h3 className="text-h2" style={{ padding: '0 24px', marginBottom: 24 }}>Local Competition</h3>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, padding: '0 24px', marginBottom: 24 }}>
        {allBars.slice(0, 10).map((b, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 4 }}>
            <span className="mono" style={{ fontSize: 9, color: b.isUser ? 'var(--ink)' : 'var(--ink-muted)' }}>{b.score}</span>
            <div style={{ 
              width: '100%', 
              height: Math.max(b.score * 0.9, 4), 
              background: b.isUser ? 'var(--green2)' : 'var(--border2)',
              borderRadius: '4px 4px 0 0'
            }} />
            {b.isUser && <span style={{ fontSize: 9, fontWeight: 700, marginTop: 2 }}>YOU</span>}
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid var(--border)' }}>
          <span className="text-body" style={{ fontSize: 13 }}>Your rank</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--amber)' }}>#{rank} of {allBars.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px' }}>
          <span className="text-body" style={{ fontSize: 13 }}>Leading competitor</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: topGapColor }}>{topGapLabel}</span>
        </div>
      </div>
    </div>
  )
}
