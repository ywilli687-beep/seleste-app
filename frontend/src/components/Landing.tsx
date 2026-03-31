import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'

const PILLARS = [
  {e:'🔍',n:'Discoverability'},{e:'⚡',n:'Performance'},{e:'🎯',n:'Conversion'},
  {e:'🛡️',n:'Trust'},{e:'✨',n:'UX'},{e:'📝',n:'Content'},
  {e:'📊',n:'Data & Tracking'},{e:'⚙️',n:'Technical'},{e:'📈',n:'Scalability'},{e:'💎',n:'Brand'},
]

const TESTIMONIALS = [
  { name: 'Maria T.', role: 'Owner, Blooming Floral Co.', quote: 'I had no idea my site was losing customers. Seleste found 4 urgent issues in 60 seconds — I fixed two of them that afternoon.', score: '34 → 71' },
  { name: 'James R.', role: 'Owner, Ridge Roofing LLC', quote: 'My Google listing was killing me and I didn\'t even know. The quick-win suggestion alone was worth it.', score: '41 → 68' },
  { name: 'Sandra K.', role: 'Director, Keller Dental', quote: 'We went from page 4 to page 1 for our main keyword in 6 weeks following the roadmap.', score: '52 → 84' },
]

const HOW_IT_WORKS = [
  { n: '01', title: 'Enter your URL', body: 'Paste any business website URL. Seleste fetches the actual live page — no screenshots, no guessing.' },
  { n: '02', title: 'We extract 60+ data points', body: 'Our engine analyzes key areas like SEO, performance, conversion, trust, content, tracking, and 4 more categories.' },
  { n: '03', title: '47 criteria score your site', body: 'Every check is measured against proven growth rules to produce your 10 area scores and overall grade.' },
  { n: '04', title: 'Get your growth roadmap', body: 'Claude AI writes a specific growth narrative and ranks every fix by revenue impact — not generic advice.' },
]



// ... [pillars and testimonials remain same] ...

export default function Landing({ onStart }: { onStart: () => void }) {
  const { isSignedIn } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10,10,15,.97)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        height: '56px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <a href="/" style={{ fontFamily: 'var(--ff-display)', color: 'var(--text)', fontSize: '20px', textDecoration: 'none', flexShrink: 0 }}>
          Seleste
        </a>

        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="/pricing" style={{ color: 'rgba(244,241,236,0.82)', fontFamily: 'var(--ff-sans)', fontSize: '14px', textDecoration: 'none' }}>Pricing</a>
          <a href="/faq" style={{ color: 'rgba(244,241,236,0.82)', fontFamily: 'var(--ff-sans)', fontSize: '14px', textDecoration: 'none' }}>FAQ</a>
          {!isSignedIn && (
            <a href="/sign-in" style={{ color: 'rgba(244,241,236,0.82)', fontFamily: 'var(--ff-sans)', fontSize: '14px', textDecoration: 'none' }}>Sign in</a>
          )}
          {isSignedIn && (
            <a href="/dashboard" style={{ color: 'rgba(244,241,236,0.82)', fontFamily: 'var(--ff-sans)', fontSize: '14px', textDecoration: 'none' }}>Dashboard</a>
          )}
          <button onClick={onStart} style={{ background: 'var(--accent)', color: '#0a0a0f', fontFamily: 'var(--ff-sans)', fontSize: '14px', fontWeight: 600, textDecoration: 'none', padding: '8px 18px', borderRadius: '6px', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer' }}>
            Run Audit
          </button>
        </div>

        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen((o: boolean) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'none', flexDirection: 'column', justifyContent: 'center', gap: '5px', width: '40px', height: '40px' }}
        >
          <span style={{ display: 'block', width: '20px', height: '1.5px', background: 'rgba(244,241,236,0.82)', transition: 'transform .2s', transform: menuOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none' }}/>
          <span style={{ display: 'block', width: '20px', height: '1.5px', background: 'rgba(244,241,236,0.82)', transition: 'opacity .15s', opacity: menuOpen ? 0 : 1 }}/>
          <span style={{ display: 'block', width: '20px', height: '1.5px', background: 'rgba(244,241,236,0.82)', transition: 'transform .2s', transform: menuOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none' }}/>
        </button>
      </nav>

      {menuOpen && (
        <div style={{ position: 'fixed', top: '56px', left: 0, right: 0, background: 'rgba(10,10,15,.98)', borderBottom: '1px solid var(--border)', zIndex: 99, display: 'flex', flexDirection: 'column' }}>
          {[
            { label: 'Pricing', href: '/pricing' },
            { label: 'FAQ', href: '/faq' },
            ...(!isSignedIn ? [{ label: 'Sign in', href: '/sign-in' }] : []),
            ...(isSignedIn ? [{ label: 'Dashboard', href: '/dashboard' }] : []),
          ].map(item => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{ color: 'rgba(244,241,236,0.82)', fontFamily: 'var(--ff-sans)', fontSize: '16px', textDecoration: 'none', padding: '16px 1.25rem', borderBottom: '1px solid var(--border)', minHeight: '52px', display: 'flex', alignItems: 'center' }}>
              {item.label}
            </a>
          ))}
          <button onClick={() => { setMenuOpen(false); onStart(); }} style={{ background: 'var(--accent)', color: '#0a0a0f', fontFamily: 'var(--ff-sans)', fontSize: '16px', fontWeight: 600, textDecoration: 'none', padding: '16px 1.25rem', minHeight: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
            Run free audit
          </button>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="hero-section" style={{ padding: '120px 2rem 56px', textAlign: 'center', maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--adim)', border: '1px solid rgba(200,169,110,.22)', padding: '5px 14px', borderRadius: 99, marginBottom: '2rem', fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--accent)', letterSpacing: '.07em', textTransform: 'uppercase' }}>
          <span style={{ width: 6, height: 6, background: 'var(--green)', borderRadius: '50%', animation: 'blink 2s infinite', display: 'inline-block' }} />
          LIVE · REAL WEBSITE ANALYSIS
        </div>
        
        <h1 className="hero-headline" style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(26px, 7.5vw, 52px)', lineHeight: 1.05, maxWidth: 840, marginBottom: '1.5rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          Find out why your website isn't bringing in customers.
        </h1>

        <p className="hero-sub" style={{ fontSize: 'clamp(14px, 4vw, 17px)', color: 'var(--text2)', maxWidth: 640, marginBottom: '2rem', lineHeight: 1.6, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          Get a free, instant analysis of your business website. See exactly what's costing you customers — and how to fix it in 90 days.
        </p>

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {[
            '47 checks across 10 areas',
            'Results in under 60 seconds',
            'Free — no credit card needed'
          ].map(point => (
            <div key={point} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text2)', fontFamily: 'var(--ff-sans)' }}>
              <span style={{ color: 'var(--accent)', fontSize: 14 }}>✓</span> {point}
            </div>
          ))}
        </div>

        <button onClick={onStart} className="primary-button">
          Check My Website Free →
        </button>

        {/* 2B: Social Proof Strip (Industries) */}
        <div style={{ marginTop: '3.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', maxWidth: 800 }}>
          {[
            'Restaurant', 'Auto Repair', 'Dental', 'Home Services', 
            'Fitness', 'Legal', 'Real Estate', 'Beauty Salon'
          ].map(industry => (
            <div key={industry} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 99, padding: '6px 14px', fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--ff-sans)' }}>
              {industry}
            </div>
          ))}
          <div style={{ fontSize: 12, color: 'var(--text3)', display: 'flex', alignItems: 'center', marginLeft: 8 }}>& more</div>
        </div>

        <div style={{ position: 'relative', marginTop: '5rem', width: '100%', maxWidth: 1000 }}>
          <div style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(ellipse at center, rgba(200,169,110,.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ background: '#1c1c1e', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
              <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--ff-mono)' }}>seleste-app.vercel.app</div>
            </div>
            <img src="/report-mockup.png" alt="Seleste audit report" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* 2C: Features Preview Section */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
              What your free audit includes
            </h2>
            <p style={{ color: 'var(--text3)', fontSize: '1.1rem' }}>Zero fluff. Just actionable growth intelligence.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginBottom: '5rem' }}>
            {/* Score Ring */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--adim)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>🎯</div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text)' }}>Your Website Score</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                A weighted letter grade from A to F with a full breakdown across 10 mission-critical growth pillars.
              </p>
            </div>

            {/* Checklist */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--adim)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>📋</div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text)' }}>47 Specific Checks</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                We check everything from page speed and mobile UX to Google Business profiles and revenue-draining friction.
              </p>
            </div>

            {/* Roadmap */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--adim)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>🗺️</div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--text)' }}>90-Day Action Plan</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                A prioritized roadmap ranked by revenue impact, showing you exactly what to fix this month to see real ROI.
              </p>
            </div>
          </div>

          {/* Blurred Sample Card */}
          <div style={{ position: 'relative', marginTop: '4rem', padding: '2rem', border: '1px solid var(--border)', borderRadius: 16, background: 'var(--bg)', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(6px)', opacity: 0.4, pointerEvents: 'none', userSelect: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                 <div style={{ fontSize: '3.5rem', fontFamily: 'var(--ff-display)', color: 'var(--amber)' }}>62</div>
                 <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--accent)' }}>Grade B — Above Average</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>Audited Oct 24, 2024</div>
                 </div>
              </div>
              <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 99, marginBottom: 20 }} />
              <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 99, marginBottom: 20, width: '80%' }} />
              <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 99, width: '60%' }} />
            </div>
            
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button 
                onClick={onStart}
                className="primary-button"
                style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.4)', padding: '14px 28px' }}
              >
                See your real score →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', padding: '1.75rem 2rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', flexWrap: 'wrap' }}>
        {[
          { n: '60+', l: 'Things We Check' },
          { n: '47+', l: 'Scoring Rules' },
          { n: '3', l: 'Reports Per Audit' },
          { n: '∞', l: 'Gets Smarter Over Time' }
        ].map(s => (
          <div key={s.l} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--ff-display)', fontSize: '2.2rem', color: 'var(--accent)' }}>{s.n}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--ff-mono)', textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 2rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '1rem' }}>How It Works</div>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>From URL to roadmap<br /><em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>in under 90 seconds.</em></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem' }}>
          {HOW_IT_WORKS.map(s => (
            <div key={s.n} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1.75rem' }}>
              <div style={{ fontFamily: 'var(--ff-display)', fontSize: '2rem', color: 'rgba(200,169,110,.25)', marginBottom: '1rem' }}>{s.n}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: '.5rem', fontFamily: 'var(--ff-sans)' }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '1rem' }}>What Owners Say</div>
            <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>Real scores. Real results.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>{t.role}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: 'var(--green)', background: 'rgba(0,200,100,.08)', padding: '4px 10px', borderRadius: 99, border: '1px solid rgba(0,200,100,.2)' }}>{t.score}</div>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2rem,5vw,3.2rem)', marginBottom: '1.25rem' }}>
          Find out what's costing you<br /><em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>customers right now.</em>
        </h2>
        <p style={{ color: 'var(--text2)', fontSize: '1rem', marginBottom: '2.5rem' }}>Free. No credit card. Results in 90 seconds.</p>
        <button onClick={onStart} className="primary-button">
          Audit Your Website — It's Free →
        </button>
      </section>

      {/* ── PILLARS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 1, borderTop: '1px solid var(--border)', background: 'var(--border)' }}>
        {PILLARS.map(p => (
          <div key={p.n} style={{ background: 'var(--bg)', padding: '1.25rem 1rem', textAlign: 'center', fontSize: 11, color: 'var(--text3)' }}>
            <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: 6 }}>{p.e}</span>{p.n}
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.2rem', color: 'var(--accent)', marginBottom: '.75rem' }}>Seleste</div>
            <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.7, maxWidth: 220 }}>AI-powered digital audit and intelligence platform for local business owners.</p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '1rem' }}>Product</div>
            {[{ l: 'Run Audit', h: '#', onClick: true }, { l: 'Pricing', h: '/pricing' }, { l: 'Changelog', h: '/changelog' }, { l: 'FAQ', h: '/faq' }].map(l => (
              l.onClick
                ? <div key={l.l} onClick={onStart} style={{ display: 'block', fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 8, cursor: 'pointer' }}>{l.l}</div>
                : <a key={l.l} href={l.h} style={{ display: 'block', fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 8 }}>{l.l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '1rem' }}>Account</div>
            {[{ l: 'Sign Up', h: '/sign-up' }, { l: 'Sign In', h: '/sign-in' }, { l: 'Dashboard', h: '/dashboard' }, { l: 'My Audits', h: '/history' }].map(l => (
              <a key={l.l} href={l.h} style={{ display: 'block', fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 8 }}>{l.l}</a>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '1rem' }}>Legal</div>
            {[{ l: 'Privacy Policy', h: '/privacy' }, { l: 'Terms of Service', h: '/terms' }, { l: 'Contact', h: 'mailto:hello@seleste.app' }].map(l => (
              <a key={l.l} href={l.h} style={{ display: 'block', fontSize: 13, color: 'var(--text2)', textDecoration: 'none', marginBottom: 8 }}>{l.l}</a>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '2rem auto 0', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>© 2026 Seleste. All rights reserved.</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>Made for Main Street</div>
        </div>
      </footer>

    </div>
  )
}
