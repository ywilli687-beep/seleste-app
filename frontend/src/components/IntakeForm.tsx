'use client'
import { useState, useEffect } from 'react'
import type { AuditRequest, Vertical } from '@/types/audit'

const VERTICALS: { value: Vertical; label: string }[] = [
  { value: 'AUTO_REPAIR',    label: 'Auto Repair' },
  { value: 'CAR_WASH',       label: 'Car Wash' },
  { value: 'RESTAURANT',     label: 'Restaurant' },
  { value: 'HOME_SERVICES',  label: 'Home Services' },
  { value: 'DENTAL',         label: 'Dental' },
  { value: 'LEGAL',          label: 'Legal' },
  { value: 'REAL_ESTATE',    label: 'Real Estate' },
  { value: 'FITNESS',        label: 'Fitness' },
  { value: 'BEAUTY_SALON',   label: 'Beauty / Salon' },
  { value: 'PLUMBING',       label: 'Plumbing' },
  { value: 'HVAC',           label: 'HVAC' },
  { value: 'LANDSCAPING',    label: 'Landscaping' },
  { value: 'CLEANING',       label: 'Cleaning' },
  { value: 'PET_SERVICES',   label: 'Pet Services' },
  { value: 'LOCAL_SERVICE',  label: 'Local Service / Other' },
]

const inp: React.CSSProperties = {
  background: 'var(--bg3)', border: '1px solid var(--border2)',
  color: 'var(--text)', padding: '12px 16px', borderRadius: 'var(--rs)',
  fontFamily: 'var(--ff-sans)', fontSize: 14, width: '100%', outline: 'none',
}

export default function IntakeForm({
  onSubmit, onBack, error,
}: {
  onSubmit: (r: AuditRequest) => void
  onBack: () => void
  error?: string | null
}) {
  const [url, setUrl]       = useState('')
  const [name, setName]     = useState('')
  const [loc, setLoc]       = useState('')
  const [vert, setVert]     = useState<Vertical | ''>('')
  const [rev, setRev]       = useState('')

  // Pre-fill URL if coming from history page re-audit link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reaudit = params.get('reaudit')
    if (reaudit) setUrl(reaudit)
  }, [])
  const [localError, setLocalError] = useState<string | null>(null)
  const [adv, setAdv]             = useState(false)
  const valid = url.trim() && loc.trim() && vert

  const submit = () => {
    setLocalError(null)
    if (!valid) return
    
    let u = url.trim()
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u
    
    try {
      new URL(u)
      if (!u.includes('.')) throw new Error()
    } catch {
      setLocalError('Please enter a valid website URL.')
      return
    }

    onSubmit({
      url: u,
      businessName: name.trim() || undefined,
      location: loc.trim(),
      vertical: vert as Vertical,
      monthlyRevenue: rev ? parseInt(rev) : undefined,
    })
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80 }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 60, background: 'rgba(10,10,15,.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div onClick={onBack} style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', color: 'var(--accent)', cursor: 'pointer' }}>
          Seleste <span style={{ color: 'var(--text3)', fontSize: '.65rem', fontFamily: 'var(--ff-mono)', marginLeft: 8 }}>AUDIT ENGINE V2</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="/dashboard" style={{ color: 'var(--text2)', fontSize: 13, textDecoration: 'none', fontFamily: 'var(--ff-sans)' }}>Intelligence →</a>
          <button onClick={onBack} style={{ background: 'none', border: '1px solid var(--border2)', color: 'var(--text2)', padding: '6px 16px', borderRadius: 'var(--rs)', cursor: 'pointer', fontFamily: 'var(--ff-sans)', fontSize: 13 }}>← Home</button>
        </div>
      </nav>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '2rem 2rem 4rem' }}>
        <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Real-Time Website Audit
        </div>
        <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2.3rem', lineHeight: 1.15, marginBottom: '.75rem' }}>
          Your growth system, scored.
        </h2>
        <p style={{ color: 'var(--text2)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          We fetch the actual page, extract {'>'}50 signals, run 47+ deterministic rules, benchmark against your vertical, and generate AI insights — all stored as structured data.
        </p>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <Fld label="Website URL" req>
            <input
              type="url" value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="https://yourbusiness.com"
              style={inp}
            />
          </Fld>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Fld label="Business Name" hint="optional">
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Apex Auto Repair" style={inp} />
            </Fld>
            <Fld label="Location" req>
              <input type="text" value={loc} onChange={e => setLoc(e.target.value)} placeholder="City, State" style={inp} />
            </Fld>
          </div>

          <Fld label="Business Vertical" req>
            <select value={vert} onChange={e => setVert(e.target.value as Vertical)} style={inp}>
              <option value="">Select your industry...</option>
              {VERTICALS.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
          </Fld>

          <div style={{ height: 1, background: 'var(--border)' }} />

          <button onClick={() => setAdv(v => !v)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontFamily: 'var(--ff-sans)', fontSize: 13, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{adv ? '▼' : '▶'}</span> Advanced options
          </button>

          {adv && (
            <Fld label="Monthly Revenue" hint="powers the leakage dollar estimate">
              <select value={rev} onChange={e => setRev(e.target.value)} style={inp}>
                <option value="">Not specified</option>
                <option value="10000">Under $10k/mo</option>
                <option value="25000">$10k–$25k/mo</option>
                <option value="50000">$25k–$50k/mo</option>
                <option value="100000">$50k–$100k/mo</option>
                <option value="250000">$100k+/mo</option>
              </select>
            </Fld>
          )}

          {(error || localError) && (
            <div style={{ background: 'var(--rdim)', border: '1px solid rgba(248,113,113,.2)', borderRadius: 'var(--rs)', padding: '1rem', fontSize: 13, color: 'var(--red)', display: 'flex', gap: 10 }}>
              <span style={{ flexShrink: 0 }}>⚠</span>
              <span>{localError || error}</span>
            </div>
          )}

          <div style={{ height: 1, background: 'var(--border)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={submit}
              disabled={!valid}
              style={{
                background: valid ? 'var(--accent)' : 'rgba(200,169,110,.25)',
                color: '#0a0a0f', border: 'none', padding: '14px 32px',
                borderRadius: 'var(--rs)', cursor: valid ? 'pointer' : 'not-allowed',
                fontSize: 14, fontWeight: 600, fontFamily: 'var(--ff-sans)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <span>Analyze Website</span><span>→</span>
            </button>
            <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>
              Fetches real page · AI analysis<br />All data saved · ~15–20s
            </p>
          </div>

        </div>

        {/* What gets captured */}
        <div style={{ marginTop: '2rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1.5rem' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '1rem' }}>What gets captured and stored</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.75rem' }}>
            {[
              ['50+ signals', 'Every boolean structured'],
              ['10 pillar scores', 'Full audit trail'],
              ['Rules fired', 'Cap & penalty trace'],
              ['Revenue leakage', '% and dollar estimate'],
              ['AI narrative', 'Specific, stored forever'],
              ['Score history', 'Tracks improvement over time'],
              ['Vertical percentile', 'Where you rank vs. peers'],
              ['Market segment', 'Powers aggregate intel'],
              ['Business profile', 'Enriched on each audit'],
            ].map(([label, sub]) => (
              <div key={label} style={{ padding: '.75rem', background: 'var(--bg3)', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2, color: 'var(--accent)' }}>{label}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Fld({ label, req, hint, children }: { label: string; req?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>
        {label}{req && <span style={{ color: 'var(--accent)', marginLeft: 4 }}>*</span>}
        {hint && <span style={{ color: 'var(--text3)', fontWeight: 400 }}> ({hint})</span>}
      </label>
      {children}
    </div>
  )
}
