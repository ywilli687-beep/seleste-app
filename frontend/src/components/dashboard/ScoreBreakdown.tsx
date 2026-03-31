

interface ScoreBreakdownProps {
  pillars: { id: string; score: number; industryAvg: number }[]
}

const PILLAR_LABELS: Record<string, string> = {
  conversion: 'Conversion',
  trust: 'Trust & Credibility',
  performance: 'Performance',
  discoverability: 'Discoverability',
  ux: 'User Experience',
  content: 'Content Quality',
  data: 'Data Intelligence',
  technical: 'Technical Health',
  brand: 'Brand Identity',
  scalability: 'Scalability'
}

export function ScoreBreakdown({ pillars }: ScoreBreakdownProps) {
  return (
    <div className="card-v2">
      <h3 className="text-small" style={{ marginBottom: 24 }}>Growth Pillar Breakdown</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        {pillars.map((p) => (
          <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{PILLAR_LABELS[p.id] || p.id}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{p.score}</span>
            </div>
            
            {/* The Bar */}
            <div style={{ position: 'relative', height: 8, background: 'var(--page-bg)', borderRadius: 4, overflow: 'hidden' }}>
              {/* Pillar Score */}
              <div 
                style={{ 
                  position: 'absolute', 
                  left: 0, top: 0, height: '100%', 
                  width: `${p.score}%`, 
                  background: p.score >= 75 ? 'var(--green)' : p.score >= 45 ? 'var(--amber)' : 'var(--coral)',
                  borderRadius: 4,
                  transition: 'width 1s ease-out'
                }} 
              />
            </div>
            <div style={{ fontSize: 10, color: 'var(--ink-muted)', textAlign: 'right', marginTop: 2 }}>
              Industry Avg: {Math.round(p.industryAvg)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
