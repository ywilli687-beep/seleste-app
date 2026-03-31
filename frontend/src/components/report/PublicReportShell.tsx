import type { Vertical, Grade } from '@/types/audit'

export interface PublicReportProps {
  report: {
    business: {
      domain: string
      name: string | null
      city: string | null
      vertical: Vertical
      slug: string | null
      latestOverallScore: number | null
      latestGrade: Grade | null
      latestConversionScore: number | null
      latestTrustScore: number | null
      latestPerformanceScore: number | null
      latestUxScore: number | null
      latestDiscoverScore: number | null
      latestContentScore: number | null
      latestDataScore: number | null
      latestTechnicalScore: number | null
      latestBrandScore: number | null
      latestScalabilityScore: number | null
    }
    snapshot: {
      createdAt: string
      totalScore: number
      grade: Grade
      revenueLeakage: number | null
      topIssues: Array<{
        title: string
        description: string
        impact: number
        pillar: string
      }>
      pillarScores: Record<string, number | null>
    }
  }
}

const VERTICAL_LABELS: Record<string, string> = {
  RESTAURANT: 'Restaurant',
  AUTO_REPAIR: 'Auto repair',
  DENTAL: 'Dental',
  FITNESS: 'Gym / fitness',
  BEAUTY_SALON: 'Beauty salon',
  CLEANING: 'Cleaning service',
  LANDSCAPING: 'Landscaping',
  PLUMBING: 'Plumbing',
  HVAC: 'HVAC',
  HOME_SERVICES: 'Home services',
  LEGAL: 'Legal',
  REAL_ESTATE: 'Real estate',
  PET_SERVICES: 'Pet services',
  CAR_WASH: 'Car wash',
  LOCAL_SERVICE: 'Local business',
}

const GRADE_LABELS: Record<string, string> = {
  A: 'Strong performer',
  B: 'Above average',
  C: 'Needs improvement',
  D: 'At risk',
  F: 'Critical issues',
}

const PILLAR_LABELS: Record<string, string> = {
  conversion:      'Turning visitors into customers',
  trust:           'Building visitor trust',
  performance:     'Page speed & reliability',
  ux:              'Ease of use',
  discoverability: 'Getting found online',
  content:         'Content quality',
  data:            'Tracking & insights',
  technical:       'Technical health',
  brand:           'Brand clarity',
  scalability:     'Growth readiness',
}

export default function PublicReportShell({ report }: PublicReportProps) {
  const { business, snapshot } = report

  const scoreColor = snapshot.totalScore >= 75 ? 'var(--green)' : snapshot.totalScore >= 60 ? 'var(--amber)' : 'var(--red)'
  const domain = business.domain.replace(/^https?:\/\//, '').replace(/^www\./, '')

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>

      {/* Nav */}
      <nav style={{ background: 'rgba(10,10,15,.97)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', height: '56px', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ fontFamily: 'var(--ff-display)', color: 'var(--text)', fontSize: '20px', textDecoration: 'none' }}>Seleste</a>
        <a href="/?ref=report" style={{ background: 'var(--accent)', color: '#0a0a0f', fontFamily: 'var(--ff-sans)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', padding: '8px 16px', borderRadius: '6px' }}>
          Get your free audit →
        </a>
      </nav>

      {/* Hero score */}
      <div style={{ textAlign: 'center', padding: 'clamp(2rem, 8vw, 4rem) 1rem 2rem', maxWidth: '680px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--text3)', letterSpacing: '.1em', margin: '0 0 1rem' }}>SELESTE AUDIT REPORT</p>
        <div style={{ fontSize: 'clamp(72px, 20vw, 120px)', fontFamily: 'var(--ff-display)', color: scoreColor, lineHeight: 1 }}>{snapshot.totalScore}</div>
        <div style={{ fontSize: '20px', color: 'var(--accent)', fontFamily: 'var(--ff-sans)', margin: '8px 0 4px' }}>{snapshot.grade} — {GRADE_LABELS[snapshot.grade]}</div>
        <p style={{ color: 'var(--text3)', fontSize: '13px', fontFamily: 'var(--ff-sans)', margin: 0 }}>
          {business.name ?? domain} · {business.city ?? ''} · {VERTICAL_LABELS[business.vertical] ?? business.vertical}
        </p>
      </div>

      {/* Revenue leakage */}
      {snapshot.revenueLeakage && snapshot.revenueLeakage > 0 && (
        <div style={{ maxWidth: '680px', margin: '0 auto 2rem', padding: '0 1rem' }}>
          <div style={{ background: 'var(--bg2)', borderLeft: '3px solid var(--red)', borderRadius: '0 8px 8px 0', padding: '1rem 1.25rem' }}>
            <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '15px', color: 'var(--text)', margin: 0 }}>
              This website may be losing an estimated <strong style={{ color: 'var(--red)' }}>${snapshot.revenueLeakage.toLocaleString()}/month</strong> in potential revenue.
            </p>
          </div>
        </div>
      )}

      {/* Top 3 issues — shown in full, no gate */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 1rem 2rem' }}>
        <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '11px', color: 'var(--text3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>What we found</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {snapshot.topIssues.map((issue, i) => (
            <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' }}>
                <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '14px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>{issue.title}</p>
                <span style={{ fontFamily: 'var(--ff-sans)', fontSize: '11px', color: 'var(--accent)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {PILLAR_LABELS[issue.pillar] ?? issue.pillar}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '13px', color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>{issue.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gate — blurred pillar scores */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 1rem 2rem', position: 'relative' }}>
        <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '11px', color: 'var(--text3)', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Full analysis — 47 checks across 10 areas</p>
        <div style={{ filter: 'blur(4px)', opacity: 0.5, pointerEvents: 'none', userSelect: 'none' }}>
          {Object.entries(snapshot.pillarScores).map(([key, score]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'var(--ff-sans)', fontSize: '13px', color: 'var(--text2)', width: '200px', flexShrink: 0 }}>{PILLAR_LABELS[key] ?? key}</span>
              <div style={{ flex: 1, background: 'var(--bg3)', borderRadius: '4px', height: '6px' }}>
                <div style={{ width: `${score ?? 0}%`, background: 'var(--accent)', height: '100%', borderRadius: '4px' }}/>
              </div>
              <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '13px', color: 'var(--text)', width: '32px', textAlign: 'right' }}>{score ?? '--'}</span>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 2 }}>
          <a href="/?ref=report-gate" style={{ display: 'inline-block', background: 'var(--accent)', color: '#0a0a0f', fontFamily: 'var(--ff-sans)', fontSize: '14px', fontWeight: 600, textDecoration: 'none', padding: '12px 24px', borderRadius: '8px' }}>
            Audit your own website — it's free
          </a>
          <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '12px', color: 'var(--text3)', marginTop: '8px' }}>Create a free account to see your full breakdown</p>
        </div>
      </div>

      {/* Competitor CTA */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 1rem 3rem' }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}>
          <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: '0 0 4px' }}>How does your competitor score?</p>
          <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '13px', color: 'var(--text3)', margin: '0 0 1rem' }}>Enter their website URL to run a free audit.</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              type="url"
              placeholder="https://competitor.com"
              id="competitor-url"
              style={{ flex: '1 1 200px', minWidth: 0, fontSize: '16px', padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontFamily: 'var(--ff-sans)', boxSizing: 'border-box' }}
            />
            <button
              onClick={() => {
                const url = (document.getElementById('competitor-url') as HTMLInputElement)?.value
                if (url) window.location.href = `/?url=${encodeURIComponent(url)}&ref=competitor`
              }}
              style={{ flex: '1 1 140px', padding: '10px 18px', background: 'var(--accent)', color: '#0a0a0f', border: 'none', borderRadius: '8px', fontFamily: 'var(--ff-sans)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', boxSizing: 'border-box' }}
            >
              Check their score →
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--ff-sans)', fontSize: '12px', color: 'var(--text3)', margin: 0 }}>
          Website audit by <a href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Seleste</a>
        </p>
      </div>

    </div>
  )
}
