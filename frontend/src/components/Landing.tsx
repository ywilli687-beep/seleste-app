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
  { n: '02', title: 'We extract 60+ signals', body: 'Our engine extracts structured data across SEO, performance, conversion, trust, content, tracking, and 4 more pillars.' },
  { n: '03', title: '47 rules score your site', body: 'Every signal is measured against deterministic rules to produce your 10 pillar scores and overall grade.' },
  { n: '04', title: 'Get your growth roadmap', body: 'Claude AI writes a specific growth narrative and ranks every fix by revenue impact — not generic advice.' },
]

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 60, background: 'rgba(10,10,15,.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', color: 'var(--accent)' }}>Seleste <span style={{ color: 'var(--text3)', fontSize: '.65rem', fontFamily: 'var(--ff-mono)', marginLeft: 8 }}>AUDIT ENGINE V2</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/pricing" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>Pricing</a>
          <a href="/faq" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>FAQ</a>
          <a href="/changelog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>Changelog</a>
          <a href="/sign-in" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>Sign In</a>
          <button onClick={onStart} style={{ background: 'var(--accent)', border: 'none', color: '#0a0a0f', padding: '8px 20px', borderRadius: 'var(--rs)', cursor: 'pointer', fontFamily: 'var(--ff-sans)', fontSize: 13, fontWeight: 600 }}>Run Audit</button>
        </div>
      </nav>

      {/* ── SPLIT HERO ── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: '4rem',
        maxWidth: 1180,
        margin: '0 auto',
        padding: '120px 2rem 80px',
        width: '100%',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--adim)', border: '1px solid rgba(200,169,110,.22)', padding: '5px 14px', borderRadius: 99, marginBottom: '1.75rem', fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--accent)', letterSpacing: '.07em', textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, background: 'var(--green)', borderRadius: '50%', animation: 'blink 2s infinite', display: 'inline-block' }} />
            Built for local business owners
          </div>
          <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2.4rem,5vw,4rem)', lineHeight: 1.08, marginBottom: '1.25rem', fontWeight: 700 }}>
            More customers.<br />
            <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Less guessing.</em>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text2)', maxWidth: 440, marginBottom: '2.5rem', lineHeight: 1.75 }}>
            Seleste looks at your business online, gives you a clear score, and shows you exactly what's stopping people from finding and contacting you — then helps you fix it.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={onStart} style={{ background: 'var(--accent)', color: '#0a0a0f', border: 'none', padding: '14px 28px', borderRadius: 'var(--rs)', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--ff-sans)' }}>
              Get Your Free Audit →
            </button>
            <a href="/pricing" style={{ display: 'flex', alignItems: 'center', padding: '14px 28px', borderRadius: 'var(--rs)', border: '1px solid var(--border2)', color: 'var(--text2)', textDecoration: 'none', fontSize: 14, fontFamily: 'var(--ff-sans)', fontWeight: 500 }}>
              See Pricing →
            </a>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(ellipse at center, rgba(200,169,110,.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ background: '#1c1c1e', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
              <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--ff-mono)' }}>seleste-app.vercel.app</div>
            </div>
            <img src="/report-mockup.png" alt="Seleste audit report showing score, quick wins and issues" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', padding: '2rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
        {[{ n: '60+', l: 'Signals Captured' }, { n: '47+', l: 'Deterministic Rules' }, { n: '10', l: 'Pillar Scores' }, { n: '∞', l: 'Compounds Over Time' }].map(s => (
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
        <button onClick={onStart} style={{ background: 'var(--accent)', color: '#0a0a0f', border: 'none', padding: '16px 36px', borderRadius: 'var(--rs)', cursor: 'pointer', fontSize: 15, fontWeight: 700, fontFamily: 'var(--ff-sans)' }}>
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
