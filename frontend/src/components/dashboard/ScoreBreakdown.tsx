import { PillarScores } from '@/types/audit'

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
    <div style={{ padding: 24, background: 'var(--bg2)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: 'var(--text1)' }}>Growth Pillar Breakdown</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {pillars.map((p) => (
          <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)' }}>{PILLAR_LABELS[p.id] || p.id}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: p.score >= 80 ? 'var(--accent)' : 'var(--text1)' }}>{p.score}</span>
            </div>
            
            {/* The Bar */}
            <div style={{ position: 'relative', height: 6, background: 'var(--bg1)', borderRadius: 3, overflow: 'visible' }}>
              {/* Pillar Score */}
              <div 
                style={{ 
                  position: 'absolute', left: 0, top: 0, height: '100%', 
                  width: `${p.score}%`, background: 'var(--accent)', borderRadius: 3,
                  transition: 'width 1s ease-out'
                }} 
              />
              
              {/* Industry Benchmark Marker */}
              <div 
                style={{ 
                  position: 'absolute', 
                  left: `${p.industryAvg}%`, 
                  top: -4, width: 2, height: 14, 
                  background: 'var(--text3)', 
                  opacity: 0.5,
                  zIndex: 2
                }} 
              />
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', textAlign: 'right', marginTop: 2 }}>
              Industry Avg: {Math.round(p.industryAvg)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
