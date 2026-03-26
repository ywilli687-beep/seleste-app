import { useNavigate } from 'react-router-dom'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    sub: 'forever',
    desc: 'Perfect for getting your first score and understanding where you stand.',
    features: [
      '1 business audit per month',
      'Overall score + grade',
      'Top 3 issues flagged',
      '10-pillar breakdown',
      'Email report summary',
    ],
    cta: 'Get Started Free',
    href: '/sign-up',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$49',
    sub: 'per month',
    desc: 'For business owners serious about fixing their digital presence.',
    features: [
      'Unlimited audits',
      'Full AI narrative report',
      'Competitor benchmarking',
      '90-day growth roadmap',
      'Weekly re-audit + alerts',
      'PDF export',
      'Priority support',
    ],
    cta: 'Start Growing',
    href: '/sign-up',
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$299',
    sub: 'per month',
    desc: 'For agencies managing multiple clients with white-label reporting.',
    features: [
      'Everything in Growth',
      'Up to 25 businesses',
      'White-label PDF reports',
      'Team member access',
      'Client dashboard sharing',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    href: 'mailto:hello@seleste.app',
    highlight: false,
  },
]

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '6rem' }}>
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 60, background: 'rgba(10,10,15,.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--ff-display)', fontSize: '1.25rem', color: 'var(--accent)' }}>Seleste</button>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="/" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>Home</a>
          <a href="/sign-in" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>Sign In</a>
          <a href="/sign-up" style={{ background: 'var(--accent)', color: '#0a0a0f', padding: '8px 20px', borderRadius: 'var(--rs)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Get Started</a>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 2rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--adim)', border: '1px solid rgba(200,169,110,.22)', padding: '5px 14px', borderRadius: 99, marginBottom: '1.5rem', fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.07em' }}>
            Simple Pricing
          </div>
          <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '1rem' }}>
            Invest in decisions,<br /><em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>not guesswork.</em>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text2)', maxWidth: 480, margin: '0 auto' }}>
            No hidden fees. Cancel anytime. Every plan includes real-data audits — not just generic tips.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
          {plans.map(p => (
            <div key={p.name} style={{
              background: p.highlight ? 'var(--adim)' : 'var(--bg2)',
              border: `1px solid ${p.highlight ? 'rgba(200,169,110,.4)' : 'var(--border)'}`,
              borderRadius: 'var(--r)',
              padding: '2rem',
              position: 'relative',
              boxShadow: p.highlight ? '0 0 40px rgba(200,169,110,.08)' : 'none',
            }}>
              {p.highlight && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#0a0a0f', fontSize: 11, fontWeight: 700, padding: '3px 14px', borderRadius: 99, whiteSpace: 'nowrap', fontFamily: 'var(--ff-mono)', letterSpacing: '.05em' }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--ff-mono)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.5rem' }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: '.5rem' }}>
                <span style={{ fontFamily: 'var(--ff-display)', fontSize: '2.8rem', color: p.highlight ? 'var(--accent)' : 'var(--text)' }}>{p.price}</span>
                <span style={{ fontSize: 13, color: 'var(--text3)' }}>/{p.sub}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: 13, color: 'var(--text)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--green)', flexShrink: 0, marginTop: 1 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href={p.href} style={{
                display: 'block', textAlign: 'center', padding: '12px', borderRadius: 'var(--rs)',
                background: p.highlight ? 'var(--accent)' : 'transparent',
                border: `1px solid ${p.highlight ? 'transparent' : 'var(--border2)'}`,
                color: p.highlight ? '#0a0a0f' : 'var(--text2)',
                textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: 'var(--ff-sans)',
              }}>
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        {/* FAQ strip */}
        <div style={{ marginTop: '5rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Questions & Answers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: 800, margin: '0 auto' }}>
            {[
              { q: 'What does "real-data audit" mean?', a: 'We actually fetch your website, extract 60+ signals, and score it against 47 deterministic rules. Not guesses — real measurements.' },
              { q: 'Can I cancel anytime?', a: 'Yes. Cancel from your settings page at any time with no penalties. Your data is yours.' },
              { q: 'What\'s a "pillar"?', a: 'We score 10 areas: Discoverability, Performance, Conversion, Trust, UX, Content, Data, Technical, Scalability, and Brand.' },
              { q: 'Do you offer refunds?', a: 'Yes. If you\'re not satisfied in the first 14 days, we\'ll refund you — no questions asked.' },
            ].map(f => (
              <div key={f.q}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{f.q}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
