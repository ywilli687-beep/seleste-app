import { Tooltip } from './Tooltip'

interface ScoreBreakdownProps {
  pillars: { id: string; score: number; industryAvg: number }[]
}

const PILLAR_LABELS: Record<string, string> = {
  conversion: 'Getting Customers to Act',
  trust: 'Trust & Credibility',
  performance: 'Page Speed',
  discoverability: 'Found on Google',
  ux: 'Ease of Use',
  content: 'Your Writing & Messaging',
  data: 'Tracking & Analytics',
  technical: 'Technical Health',
  brand: 'Brand Consistency',
  scalability: 'Room to Grow'
}

const PILLAR_DESCRIPTIONS: Record<string, string> = {
  conversion: 'How well your site turns visitors into leads or customers — things like clear buttons, contact forms, and calls to action.',
  trust: 'How trustworthy your site looks to a first-time visitor — reviews, testimonials, security badges, and professional design.',
  performance: 'How fast your pages load. Slow pages lose visitors. Google also ranks faster sites higher.',
  discoverability: 'How easy it is for people to find you on Google when searching for your services nearby.',
  ux: 'How easy your site is to navigate, especially on a phone. Can visitors quickly find what they need?',
  content: 'How clear and helpful your text is. Does it explain what you do, who you help, and why someone should choose you?',
  data: 'Whether you have tools set up to understand how visitors use your site (e.g. Google Analytics, Facebook Pixel).',
  technical: 'Behind-the-scenes stuff that affects performance and Google ranking — like SSL certificates and mobile-friendliness.',
  brand: 'Whether your logo, colours, and overall look feel consistent and professional across the site.',
  scalability: 'Whether your site is set up to handle growth — like booking systems, integrations, and automation.'
}

export function ScoreBreakdown({ pillars }: ScoreBreakdownProps) {
  return (
    <div className="card-v2">
      <h3 className="text-small" style={{ marginBottom: 24 }}>Score Breakdown by Area</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        {pillars.map((p) => (
          <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tooltip text={PILLAR_DESCRIPTIONS[p.id] || ''}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{PILLAR_LABELS[p.id] || p.id}</span>
              </Tooltip>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{p.score}</span>
            </div>
            <div style={{ position: 'relative', height: 8, background: 'var(--page-bg)', borderRadius: 4, overflow: 'hidden' }}>
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
              Others in your industry avg: {Math.round(p.industryAvg)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
