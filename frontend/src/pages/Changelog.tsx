const ENTRIES = [
  {
    date: 'March 26, 2026',
    tag: 'NEW',
    tagColor: 'var(--green)',
    title: 'Agent Command Center',
    body: 'Launched the autonomous multi-agent orchestration layer. 17 specialized AI agents now run weekly cycles to surface growth opportunities, competitor threats, and roadmap actions — all without you lifting a finger.',
  },
  {
    date: 'March 25, 2026',
    tag: 'IMPROVED',
    tagColor: 'var(--accent)',
    title: 'Dashboard V2 — Gamification & Market Intel',
    body: 'Complete dashboard rebuild with XP system, achievement badges, competitive rank among local businesses, 28-day activity streak calendar, and live road-map progress tracking.',
  },
  {
    date: 'March 24, 2026',
    tag: 'NEW',
    tagColor: 'var(--green)',
    title: 'AI Explainers on Every Metric',
    body: 'Tap the "?" icon next to any score or signal to get a 3-sentence AI explanation of exactly why you received that score and what it means for your business.',
  },
  {
    date: 'March 20, 2026',
    tag: 'IMPROVED',
    tagColor: 'var(--accent)',
    title: 'Audit Engine V2 — Data Architecture',
    body: 'Added AuditQuality scoring, BusinessCompetitor mapping, AuditEvent timeline, and OutcomeReport tracking. The audit is now a living data profile that compounds with every scan.',
  },
  {
    date: 'March 15, 2026',
    tag: 'NEW',
    tagColor: 'var(--green)',
    title: 'Saved Report View',
    body: 'Every audit is now permanently saved and accessible from your History page. Share a direct report link with your team or clients.',
  },
  {
    date: 'March 10, 2026',
    tag: 'FIXED',
    tagColor: 'var(--red)',
    title: 'Scoring stability improvements',
    body: 'Fixed edge cases in SSL detection, CMS fingerprinting, and Google Business Profile signal extraction that were causing inconsistent scores on certain hosting platforms.',
  },
  {
    date: 'March 1, 2026',
    tag: 'NEW',
    tagColor: 'var(--green)',
    title: 'Seleste V1 Launch',
    body: 'First public release. 47 scoring rules, 60+ extracted signals, 10-pillar breakdown, AI growth narrative, and full history tracking.',
  },
]

export default function Changelog() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: '6rem' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 60, background: 'rgba(10,10,15,.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <a href="/" style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', color: 'var(--accent)', textDecoration: 'none' }}>Seleste</a>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '120px 2rem 0' }}>
        <div style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--adim)', border: '1px solid rgba(200,169,110,.22)', padding: '5px 14px', borderRadius: 99, marginBottom: '1rem', fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '.07em' }}>
            <span style={{ width: 6, height: 6, background: 'var(--green)', borderRadius: '50%', animation: 'blink 2s infinite', display: 'inline-block' }} />
            Product Updates
          </div>
          <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>What's new in <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Seleste</em></h1>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: 'var(--border)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingLeft: '2rem' }}>
            {ENTRIES.map((e, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {/* Dot */}
                <div style={{ position: 'absolute', left: -31, top: 4, width: 10, height: 10, borderRadius: '50%', background: e.tagColor, boxShadow: `0 0 8px ${e.tagColor}` }} />

                <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>{e.date}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--ff-mono)', fontWeight: 700, color: e.tagColor, border: `1px solid ${e.tagColor}`, padding: '2px 8px', borderRadius: 99, letterSpacing: '.08em' }}>{e.tag}</span>
                  <h2 style={{ fontFamily: 'var(--ff-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>{e.title}</h2>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, margin: 0 }}>{e.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
