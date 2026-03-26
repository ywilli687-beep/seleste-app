const PILLARS = [
  {e:'🔍',n:'Discoverability'},{e:'⚡',n:'Performance'},{e:'🎯',n:'Conversion'},
  {e:'🛡️',n:'Trust'},{e:'✨',n:'UX'},{e:'📝',n:'Content'},
  {e:'📊',n:'Data & Tracking'},{e:'⚙️',n:'Technical'},{e:'📈',n:'Scalability'},{e:'💎',n:'Brand'},
]

export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 60, background: 'rgba(10,10,15,.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', color: 'var(--accent)' }}>Seleste <span style={{ color: 'var(--text3)', fontSize: '.65rem', fontFamily: 'var(--ff-mono)', marginLeft: 8 }}>AUDIT ENGINE V2</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="/history" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', fontFamily: 'var(--ff-sans)' }}>My Audits</a>
          <a href="/dashboard" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', fontFamily: 'var(--ff-sans)' }}>Intelligence</a>
          <button onClick={onStart} style={{ background: 'var(--accent)', border: 'none', color: '#0a0a0f', padding: '8px 20px', borderRadius: 'var(--rs)', cursor: 'pointer', fontFamily: 'var(--ff-sans)', fontSize: 13, fontWeight: 600 }}>Run Audit</button>
        </div>
      </nav>

      {/* ── SPLIT HERO ── */}
      <section style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        gap: '4rem',
        maxWidth: 1180,
        margin: '0 auto',
        padding: '120px 2rem 80px',
        width: '100%',
      }}>
        {/* Left: Copy */}
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
            <button onClick={onStart} style={{ background: 'var(--accent)', color: '#0a0a0f', border: 'none', padding: '14px 28px', borderRadius: 'var(--rs)', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--ff-sans)', letterSpacing: '.01em' }}>
              Get Your Free Audit →
            </button>
            <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', padding: '14px 28px', borderRadius: 'var(--rs)', border: '1px solid var(--border2)', color: 'var(--text2)', textDecoration: 'none', fontSize: 14, fontFamily: 'var(--ff-sans)', fontWeight: 500 }}>
              Explore Dashboard →
            </a>
          </div>
        </div>

        {/* Right: Browser mockup */}
        <div style={{ position: 'relative' }}>
          {/* Glow behind mockup */}
          <div style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(ellipse at center, rgba(200,169,110,.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          {/* Browser chrome */}
          <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)' }}>
            {/* Title bar */}
            <div style={{ background: '#1c1c1e', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
              <div style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--ff-mono)' }}>seleste-app.vercel.app</div>
            </div>
            {/* Screenshot */}
            <img
              src="/report-mockup.png"
              alt="Seleste audit report showing score ring, quick wins, and priority issues"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', padding: '2rem 2rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
        {[{ n: '60+', l: 'Signals Captured' }, { n: '47+', l: 'Deterministic Rules' }, { n: '10', l: 'Pillar Scores' }, { n: '∞', l: 'Compounds Over Time' }].map(s => (
          <div key={s.l} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--ff-display)', fontSize: '2.2rem', color: 'var(--accent)' }}>{s.n}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--ff-mono)', textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── PILLARS GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 1, borderTop: '1px solid var(--border)', background: 'var(--border)' }}>
        {PILLARS.map(p => (
          <div key={p.n} style={{ background: 'var(--bg)', padding: '1.25rem 1rem', textAlign: 'center', fontSize: 11, color: 'var(--text3)' }}>
            <span style={{ fontSize: '1.4rem', display: 'block', marginBottom: 6 }}>{p.e}</span>{p.n}
          </div>
        ))}
      </div>

    </div>
  )
}
