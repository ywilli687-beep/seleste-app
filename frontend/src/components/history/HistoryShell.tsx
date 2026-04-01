'use client'
import { useState } from 'react'
import { UserButton } from '@clerk/clerk-react'

export type AuditSnap = { id: string; createdAt: string; overallScore: number; grade: 'A'|'B'|'C'|'D'; scoreDelta: number | null }
export type BusinessRow = {
  domain: string; businessId: string; businessName: string | null
  vertical: string; city: string | null; state: string | null
  latestScore: number; latestGrade: 'A'|'B'|'C'|'D'
  latestLeakage: number; lastAuditedAt: string
  auditCount: number; history: AuditSnap[]
}

const gradeColor = (g: string) => g === 'A' ? 'var(--green)' : g === 'B' ? 'var(--accent)' : g === 'C' ? 'var(--amber)' : 'var(--red)'
const scoreColor = (s: number) => s >= 75 ? 'var(--green)' : s >= 60 ? 'var(--accent)' : s >= 45 ? 'var(--amber)' : 'var(--red)'

function Sparkline({ history }: { history: AuditSnap[] }) {
  if (history.length < 2) return <span style={{ fontSize: 11, color: 'var(--text3)' }}>—</span>
  const scores = [...history].reverse().map(h => h.overallScore)
  const min = Math.min(...scores) - 5
  const max = Math.max(...scores) + 5
  const W = 80, H = 28
  const pts = scores.map((s, i) => {
    const x = (i / (scores.length - 1)) * (W - 4) + 2
    const y = (H - 4) - ((s - min) / (max - min)) * (H - 8) + 4
    return `${x},${y}`
  }).join(' ')
  const last = scores[scores.length - 1]
  const first = scores[0]
  const color = last >= first ? 'var(--green)' : 'var(--red)'
  return (
    <svg width={W} height={H} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

export default function HistoryShell({ 
  businesses, 
  onReaudit 
}: { 
  businesses: BusinessRow[],
  onReaudit?: (payload: { url: string, businessName: string, location: string, vertical: string }) => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = businesses.filter(b =>
    !search || b.domain.includes(search) ||
    (b.businessName ?? '').toLowerCase().includes(search.toLowerCase()) ||
    b.vertical.toLowerCase().includes(search)
  )

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 60, background: 'rgba(10,10,15,.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div onClick={() => window.location.href = '/'} style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', color: 'var(--accent)', cursor: 'pointer' }}>
            Seleste <span style={{ color: 'rgba(244,241,236,0.55)', fontSize: '.65rem', fontFamily: 'var(--ff-mono)', marginLeft: 8 }}>AUDIT ENGINE V2</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {['/history', '/dashboard'].map(href => (
              <a key={href} href={href} style={{ fontSize: 14, color: href === '/history' ? 'var(--text)' : 'rgba(244,241,236,0.55)', textDecoration: 'none', fontFamily: 'var(--ff-sans)', fontWeight: 500 }}>
                {href === '/history' ? 'History' : 'Intelligence'}
              </a>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ background: 'var(--accent)', color: '#0a0a0f', border: 'none', padding: '7px 18px', borderRadius: 'var(--rs)', fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--ff-sans)' }}>
            + New Audit
          </a>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.4rem' }}>My Audit History</div>
            <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '2rem', marginBottom: '.3rem' }}>
              {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'} audited
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>
              Re-audit any business to track improvement over time.
            </p>
          </div>
          <input
            type="text"
            placeholder="Search by domain or vertical…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', padding: '10px 14px', borderRadius: 'var(--rs)', fontFamily: 'var(--ff-sans)', fontSize: 13, width: 280, outline: 'none' }}
          />
        </div>

        {filtered.length === 0 ? (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '3rem', textAlign: 'center' }}>
            {businesses.length === 0 ? (
              <>
                <div style={{ fontSize: '1.2rem', fontFamily: 'var(--ff-display)', marginBottom: '.5rem' }}>No audits yet</div>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Run your first audit to start tracking businesses.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem', textAlign: 'left' }}>
                  {[
                    { name: 'Joe\'s Auto Repair', url: 'joesautorepair.com', v: 'AUTO_REPAIR' },
                    { name: 'The Daily Grind', url: 'dailygrindcoffee.com', v: 'RESTAURANT' },
                    { name: 'Main St Dental', url: 'mainstdental.com', v: 'DENTAL' }
                  ].map(s => (
                    <a key={s.url} href={`/?url=${s.url}&name=${encodeURIComponent(s.name)}&v=${s.v}`} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--rs)', textDecoration: 'none', transition: 'border-color .2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--ff-mono)', marginTop: 2 }}>{s.url}</div>
                      <div style={{ fontSize: 10, color: 'var(--accent)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>Try example →</div>
                    </a>
                  ))}
                </div>

                <a href="/" style={{ background: 'var(--accent)', color: '#0a0a0f', padding: '12px 28px', borderRadius: 'var(--rs)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>Run custom audit →</a>
              </>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text2)' }}>No results for "{search}"</p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px 70px 80px 90px 130px', gap: '1rem', padding: '6px 1.25rem', fontSize: 10, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              <span>Business</span><span>Industry</span><span>Score</span>
              <span>Grade</span><span>Leak</span><span>Trend</span><span>Action</span>
            </div>

            {filtered.map(biz => (
              <div key={biz.domain}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px 70px 80px 90px 130px', gap: '1rem', padding: '1rem 1.25rem', background: 'var(--bg2)', border: `1px solid ${expanded === biz.domain ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--r)', alignItems: 'center', cursor: 'pointer', transition: 'border-color .2s' }}
                  onClick={() => setExpanded(expanded === biz.domain ? null : biz.domain)}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{biz.businessName || biz.domain}</div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', marginTop: 2 }}>
                      {biz.domain}{biz.city && ` · ${biz.city}${biz.state ? ', ' + biz.state : ''}`}
                      {biz.auditCount > 1 && <span style={{ marginLeft: 8, color: 'var(--accent)' }}>{biz.auditCount} audits</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{biz.vertical.replace(/_/g, ' ').toLowerCase()}</div>
                  <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.4rem', color: scoreColor(biz.latestScore) }}>{biz.latestScore}</div>
                  <div><span style={{ padding: '2px 9px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--ff-mono)', background: `${gradeColor(biz.latestGrade)}18`, color: gradeColor(biz.latestGrade) }}>{biz.latestGrade}</span></div>
                  <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 12, color: biz.latestLeakage > 30 ? 'var(--red)' : biz.latestLeakage > 15 ? 'var(--amber)' : 'var(--green)' }}>{biz.latestLeakage}%</div>
                  <div><Sparkline history={biz.history} /></div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onReaudit) {
                          onReaudit({
                            url: 'https://' + biz.domain,
                            businessName: biz.businessName || '',
                            location: [biz.city, biz.state].filter(Boolean).join(', '),
                            vertical: biz.vertical
                          })
                        } else {
                          // Fallback
                          const u = encodeURIComponent('https://' + biz.domain)
                          const n = encodeURIComponent(biz.businessName || '')
                          const l = encodeURIComponent([biz.city, biz.state].filter(Boolean).join(', '))
                          const v = biz.vertical
                          window.location.href = `/?reaudit=1&url=${u}&name=${n}&location=${l}&vertical=${v}`
                        }
                      }}
                      style={{ fontSize: 11, padding: '5px 10px', background: 'var(--accent)', color: '#0a0a0f', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}
                    >
                      Re-audit
                    </button>
                    <a
                      href={`https://${biz.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ fontSize: 11, padding: '5px 10px', background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text2)', borderRadius: 6, textDecoration: 'none' }}
                    >
                      ↗
                    </a>
                  </div>
                </div>

                {/* Expanded: full audit timeline */}
                {expanded === biz.domain && biz.history.length > 0 && (
                  <div style={{ margin: '4px 0 0', background: 'var(--bg3)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 var(--r) var(--r)', padding: '1rem 1.25rem' }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.75rem' }}>Audit timeline</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {biz.history.map((snap, i) => (
                        <div key={snap.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: 13, padding: '6px 0', borderBottom: i < biz.history.length - 1 ? '1px solid var(--border)' : 'none' }}>
                          <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text3)', width: 120 }}>
                            {new Date(snap.createdAt).toLocaleDateString()}
                          </span>
                          <span style={{ fontFamily: 'var(--ff-display)', fontSize: '1.1rem', color: scoreColor(snap.overallScore), width: 50 }}>
                            {snap.overallScore}
                          </span>
                          <span style={{ padding: '1px 8px', borderRadius: 4, fontSize: 11, fontFamily: 'var(--ff-mono)', background: `${gradeColor(snap.grade)}18`, color: gradeColor(snap.grade), width: 32, textAlign: 'center' }}>
                            {snap.grade}
                          </span>
                          {snap.scoreDelta !== null && (
                            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: snap.scoreDelta >= 0 ? 'var(--green)' : 'var(--red)', width: 60 }}>
                              {snap.scoreDelta >= 0 ? '▲' : '▼'} {Math.abs(snap.scoreDelta)} pts
                            </span>
                          )}
                          <a
                            href={`/report/${snap.id}`}
                            style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', marginLeft: 'auto' }}
                          >
                            View report →
                          </a>
                          {i === 0 && <span style={{ fontSize: 10, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', marginLeft: 10, background: 'var(--bg2)', padding: '2px 6px', borderRadius: 4 }}>latest</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
