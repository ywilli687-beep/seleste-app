import { useState } from 'react'

const FAQS = [
  { q: 'What exactly does Seleste analyze?', a: 'Seleste fetches your actual live website, extracts 60+ structured signals across SEO, performance, conversion, trust, UX, content, tracking, technical quality, scalability, and brand — then scores each against 47 deterministic rules.' },
  { q: 'How long does an audit take?', a: 'Most audits complete in 45–90 seconds. Complex sites with lots of content may take up to 2 minutes. You can watch the progress in real-time on the loading screen.' },
  { q: 'Is my business data private?', a: 'Yes. We only analyze publicly accessible pages. Your results and business data are private to your account and never shared or sold.' },
  { q: 'Can I audit a competitor\'s website?', a: 'Our terms require you to only audit businesses you own or have explicit permission to analyze. However, the dashboard includes competitive benchmarking against anonymized businesses in your vertical.' },
  { q: 'What is the "Revenue Leak" figure?', a: 'Revenue Leak is our estimate of monthly revenue potentially lost due to digital gaps. It\'s calculated from your pillar scores combined with your industry\'s average customer value and conversion rates.' },
  { q: 'What does the grade mean?', a: 'Grades follow the same A–F scale you know. A (80–100): excellent digital presence. B (65–79): competitive. C (50–64): fair. D (35–49): needs work. F (<35): urgent attention required.' },
  { q: 'How often should I re-audit?', a: 'Monthly at minimum. We recommend re-auditing after any major website change. The Growth plan includes automatic weekly re-audits with alerts when your score changes significantly.' },
  { q: 'Can I export my report?', a: 'Yes — use the Print/PDF button in the top-right of your audit report. This generates a formatted PDF you can share with your team or clients.' },
  { q: 'I\'m an agency. Can I manage multiple clients?', a: 'The Agency plan supports up to 25 businesses from a single account, with white-label PDF reports and client-facing dashboard sharing.' },
  { q: 'What if I disagree with my score?', a: 'Our scoring is deterministic and rule-based, so you can see exactly why each score was given. If you believe a signal was incorrectly detected, contact support@seleste.app and we\'ll review it.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '6rem' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 60, background: 'rgba(10,10,15,.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <a href="/" style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', color: 'var(--accent)', textDecoration: 'none' }}>Seleste</a>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="/pricing" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>Pricing</a>
          <a href="/sign-up" style={{ background: 'var(--accent)', color: '#0a0a0f', padding: '8px 20px', borderRadius: 'var(--rs)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Get Started</a>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '120px 2rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>Frequently Asked <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Questions</em></h1>
          <p style={{ color: 'var(--text2)', fontSize: '1rem' }}>Can't find an answer? Email us at <a href="mailto:support@seleste.app" style={{ color: 'var(--accent)' }}>support@seleste.app</a></p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{ background: 'var(--bg2)', borderRadius: i === 0 ? 'var(--r) var(--r) 0 0' : i === FAQS.length - 1 ? '0 0 var(--r) var(--r)' : 0, border: '1px solid var(--border)', marginTop: i === 0 ? 0 : -1 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', textAlign: 'left' }}
              >
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--ff-sans)' }}>{faq.q}</span>
                <span style={{ color: 'var(--accent)', flexShrink: 0, fontSize: 18, transition: 'transform .2s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: '0 1.5rem 1.25rem', fontSize: 14, color: 'var(--text2)', lineHeight: 1.75 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
