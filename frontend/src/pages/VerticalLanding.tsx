import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const VERTICAL_LABELS: Record<string, string> = {
  AUTO_REPAIR: 'Auto Repair Shops',
  CAR_WASH: 'Car Wash Businesses',
  RESTAURANT: 'Restaurants',
  HOME_SERVICES: 'Home Service Companies',
  LOCAL_SERVICE: 'Local Service Businesses',
  DENTAL: 'Dental Practices',
  LEGAL: 'Law Firms',
  REAL_ESTATE: 'Real Estate Agents',
  FITNESS: 'Gyms & Fitness Studios',
  BEAUTY_SALON: 'Salons & Med Spas',
  PLUMBING: 'Plumbers',
  HVAC: 'HVAC Companies',
  LANDSCAPING: 'Landscaping Companies',
  CLEANING: 'Cleaning Services',
  PET_SERVICES: 'Pet Service Businesses',
}

const VERTICAL_URL_SLUGS: Record<string, string> = {
  'auto-repair': 'AUTO_REPAIR',
  'car-wash': 'CAR_WASH',
  'restaurant': 'RESTAURANT',
  'home-services': 'HOME_SERVICES',
  'local-service': 'LOCAL_SERVICE',
  'dental': 'DENTAL',
  'legal': 'LEGAL',
  'real-estate': 'REAL_ESTATE',
  'fitness': 'FITNESS',
  'salon': 'BEAUTY_SALON',
  'plumbing': 'PLUMBING',
  'hvac': 'HVAC',
  'landscaping': 'LANDSCAPING',
  'cleaning': 'CLEANING',
  'pet-services': 'PET_SERVICES',
}

interface LandingPageData {
  h1: string
  subheadline: string
  whatWeCheck: string[]
  testimonial: { quote: string; name: string; city: string; result: string }
  faq: Array<{ q: string; a: string }>
  metaTitle: string
  metaDescription: string
  relatedVerticals: string[]
}

const T = {
  bg: '#0a0a0f', panel: '#111118', panelHover: '#161622',
  border: 'rgba(255,255,255,0.08)', border2: 'rgba(255,255,255,0.12)',
  ink: '#f4f1ec', inkMuted: '#8a857e', inkHint: 'rgba(138,133,126,0.55)',
  accent: '#c8a96e', accentDim: 'rgba(200,169,110,0.10)',
  green: '#10B981', greenDim: 'rgba(16,185,129,0.10)',
  r: '12px', rs: '8px',
}

export default function VerticalLanding() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<LandingPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const vertical = slug ? VERTICAL_URL_SLUGS[slug] : null
  const verticalLabel = vertical ? VERTICAL_LABELS[vertical] : null
  const apiBase = import.meta.env.VITE_API_URL || ''

  useEffect(() => {
    if (!vertical) { setError('Unknown vertical'); setLoading(false); return }

    fetch(`${apiBase}/api/vertical-pages/${vertical}`)
      .then(r => r.json())
      .then(res => {
        if (!res.success) throw new Error(res.error || 'Failed to load page')
        setData(res.data)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [vertical, apiBase])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.inkMuted, fontFamily: 'var(--ff-sans)' }}>
      Loading...
    </div>
  )

  if (error || !data) return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center', fontFamily: 'var(--ff-sans)' }}>
      <p style={{ color: T.inkMuted }}>{error || 'Page not found.'}</p>
      <button onClick={() => navigate('/')} style={{ background: T.accent, color: '#000', border: 'none', borderRadius: '100px', padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}>← Home</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.ink, fontFamily: 'var(--ff-sans)' }}>

      {/* Nav */}
      <nav style={{ padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 0, background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link to="/" style={{ fontFamily: 'var(--ff-display)', fontSize: 18, fontWeight: 700, color: T.ink, textDecoration: 'none', letterSpacing: '-0.02em' }}>Seleste</Link>
        <button onClick={() => navigate('/')} style={{ background: T.accent, color: '#000', border: 'none', borderRadius: '100px', padding: '8px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          Get my free audit →
        </button>
      </nav>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(2rem, 6vw, 5rem) 1.5rem' }}>

        {/* Hero */}
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: T.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
            Free website audit for {verticalLabel}
          </div>
          <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.15, margin: '0 0 20px', color: T.ink, letterSpacing: '-0.03em' }}>
            {data.h1}
          </h1>
          <p style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: T.inkMuted, lineHeight: 1.65, maxWidth: 560, margin: '0 auto 32px' }}>
            {data.subheadline}
          </p>
          <button
            onClick={() => navigate('/')}
            style={{ background: T.accent, color: '#000', border: 'none', borderRadius: '100px', padding: '14px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer', letterSpacing: '0.01em' }}
          >
            See my score — it's free →
          </button>
          <p style={{ fontSize: 12, color: T.inkHint, marginTop: 10 }}>No signup. No credit card. Results in 60 seconds.</p>
        </div>

        {/* What we check */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: T.inkHint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
            What we check for {verticalLabel}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.whatWeCheck.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: T.panel, border: `1px solid ${T.border}`, borderRadius: T.r, padding: '16px 20px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.accentDim, border: `1px solid ${T.accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 700, color: T.accent }}>
                  {i + 1}
                </div>
                <p style={{ margin: 0, fontSize: 15, color: T.ink, lineHeight: 1.55 }}>{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 10 pillars strip */}
        <section style={{ marginBottom: '4rem', background: T.panel, border: `1px solid ${T.border}`, borderRadius: T.r, padding: '24px 28px' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: T.inkHint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Scored across 10 pillars
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['Conversion', 'Trust', 'Performance', 'UX', 'Discoverability', 'Content', 'Data & Tracking', 'Technical', 'Brand', 'Scalability'].map(p => (
              <span key={p} style={{ fontSize: 12, color: T.inkMuted, background: T.panelHover, border: `1px solid ${T.border}`, borderRadius: 100, padding: '4px 12px' }}>{p}</span>
            ))}
          </div>
          <p style={{ margin: '16px 0 0', fontSize: 13, color: T.inkMuted, lineHeight: 1.6 }}>
            Each pillar is scored 0–100. Your overall score is a weighted average. We estimate how much annual revenue each gap is costing you.
          </p>
        </section>

        {/* Testimonial */}
        <section style={{ marginBottom: '4rem' }}>
          <blockquote style={{ margin: 0, background: T.accentDim, border: `1px solid ${T.accent}33`, borderRadius: T.r, padding: '28px 32px' }}>
            <p style={{ margin: '0 0 16px', fontSize: 17, lineHeight: 1.65, color: T.ink, fontStyle: 'italic' }}>
              "{data.testimonial.quote}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#000', flexShrink: 0 }}>
                {data.testimonial.name[0]}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{data.testimonial.name}, {data.testimonial.city}</div>
                <div style={{ fontSize: 12, color: T.accent }}>{data.testimonial.result}</div>
              </div>
            </div>
          </blockquote>
        </section>

        {/* CTA mid-page */}
        <section style={{ marginBottom: '4rem', textAlign: 'center', padding: '40px 24px', background: T.panel, border: `1px solid ${T.border}`, borderRadius: T.r }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, margin: '0 0 12px', color: T.ink, letterSpacing: '-0.02em' }}>
            Find out what your site is losing
          </h2>
          <p style={{ fontSize: 15, color: T.inkMuted, margin: '0 0 24px', lineHeight: 1.6 }}>
            Enter your URL and get a score in under 60 seconds. No account needed.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{ background: T.accent, color: '#000', border: 'none', borderRadius: '100px', padding: '14px 32px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
          >
            Run my free audit →
          </button>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: T.inkHint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
            Common questions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {data.faq.map((item, i) => (
              <div key={i} style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: T.rs, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', background: 'none', border: 'none', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ fontSize: 14, fontWeight: 500, color: T.ink, lineHeight: 1.45 }}>{item.q}</span>
                  <span style={{ fontSize: 18, color: T.inkMuted, flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 18px', fontSize: 14, color: T.inkMuted, lineHeight: 1.65 }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related verticals */}
        {data.relatedVerticals.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: T.inkHint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Also available for
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {data.relatedVerticals.map((label, i) => {
                const relSlug = Object.entries(VERTICAL_LABELS).find(([, v]) => v === label)?.[0]
                const urlSlug = relSlug ? Object.entries(VERTICAL_URL_SLUGS).find(([, v]) => v === relSlug)?.[0] : null
                return urlSlug ? (
                  <Link key={i} to={`/for/${urlSlug}`} style={{ fontSize: 13, color: T.accent, background: T.accentDim, border: `1px solid ${T.accent}33`, borderRadius: 100, padding: '6px 16px', textDecoration: 'none', transition: 'opacity 0.15s' }}>
                    {label} →
                  </Link>
                ) : null
              })}
            </div>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: '2rem', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 13, color: T.inkHint }}>
          © 2026 Seleste · <Link to="/privacy" style={{ color: T.inkHint, textDecoration: 'none' }}>Privacy</Link> · <Link to="/terms" style={{ color: T.inkHint, textDecoration: 'none' }}>Terms</Link>
        </p>
      </footer>
    </div>
  )
}
