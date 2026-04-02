import MarketingLayout from '@/components/MarketingLayout'

const RELEASES = [
  { date: "Oct 28, 2026", version: "v1.2.0", title: "New high-speed audit engine", tasks: ["Launched single-pass AI analysis replacing sequential steps", "Reduced report generation time to under 15 seconds", "Improved accuracy of growth roadmap suggestions"] },
  { date: "Oct 15, 2026", version: "v1.1.0", title: "Waitlist and Community access", tasks: ["Added free waitlist for high-volume users", "New dashboard view for tracking historical scans", "Integrated support for restaurant and local retail layouts"] },
  { date: "Sep 30, 2026", version: "v1.0.5", title: "Infrastructure Hardening", tasks: ["Connected to Render backend for 99.9% uptime", "Implemented Vercel Edge proxying for CORS security", "Fixed 'failed to fetch' error in mobile browsers"] }
]

export default function Changelog() {
  const sectionStyle: React.CSSProperties = { padding: '120px 2rem', maxWidth: '800px', margin: '0 auto', boxSizing: 'border-box' }
  const releaseStyle: React.CSSProperties = { borderBottom: '1px solid var(--border)', paddingBottom: '4rem', marginBottom: '4rem' }
  const tagStyle: React.CSSProperties = { background: 'var(--accent)', color: '#000', fontSize: '12px', fontWeight: 800, padding: '4px 12px', borderRadius: '100px', display: 'inline-block', marginBottom: '1rem' }

  return (
    <MarketingLayout>
      <section style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <h1 className="text-h1" style={{ marginBottom: '1.5rem' }}>Changelog</h1>
          <p className="text-body" style={{ maxWidth: '640px', margin: '0 auto' }}>
            A rolling log of everything we've updated to help you grow your business faster.
          </p>
        </div>

        <div>
          {RELEASES.map((r, i) => (
            <div key={i} style={releaseStyle}>
              <div style={tagStyle}>{r.version}</div>
              <div style={{ color: 'var(--ink-muted)', fontSize: '13px', fontFamily: 'var(--ff-mono)', marginBottom: '0.75rem' }}>{r.date}</div>
              <h2 className="text-h2" style={{ marginBottom: '1.5rem' }}>{r.title}</h2>
              <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                {r.tasks.map((t, j) => (
                   <li key={j} style={{ color: 'var(--ink-muted)', marginBottom: '0.75rem', fontSize: '15px', lineHeight: 1.6 }}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  )
}
