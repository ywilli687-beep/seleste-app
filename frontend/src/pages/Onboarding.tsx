import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

// ── Audit stages shown during the progress step ───────────────────────────────
const STAGES = [
  'Fetching your website...',
  'Checking SSL & security...',
  'Extracting AI signals...',
  'Scoring 10 pillars...',
  'Calculating revenue leakage...',
  'Writing your report...',
]

const VERTICAL_OPTIONS = [
  { label: 'Auto Repair', value: 'AUTO_REPAIR' },
  { label: 'Dental', value: 'DENTAL' },
  { label: 'Restaurant', value: 'RESTAURANT' },
  { label: 'Legal', value: 'LEGAL' },
  { label: 'Real Estate', value: 'REAL_ESTATE' },
  { label: 'Plumbing / HVAC', value: 'PLUMBING' },
  { label: 'Salon / Spa', value: 'BEAUTY_SALON' },
  { label: 'Fitness', value: 'FITNESS' },
  { label: 'Pet Services', value: 'PET_SERVICES' },
  { label: 'Cleaning', value: 'CLEANING' },
  { label: 'Other', value: 'LOCAL_SERVICE' },
]

// ── Pillar display labels ─────────────────────────────────────────────────────
const PILLAR_LABELS: Record<string, string> = {
  conversion: 'Conversion',
  trust: 'Trust',
  performance: 'Performance',
  ux: 'Experience',
  discoverability: 'Discoverability',
  content: 'Content',
  data: 'Data & Tracking',
  technical: 'Technical',
  brand: 'Brand',
  scalability: 'Scalability',
}

type Step = 'url' | 'auditing' | 'reveal'

interface AuditResult {
  overallScore?: number
  overall_score?: number
  estimatedRevenueLeak?: { totalPct: number; estimatedMonthlyLoss?: number }
  estimated_revenue_leakage?: number
  pillarScores?: Record<string, number>
  scores?: Record<string, number>
  aiQuickWins?: string[]
  quick_wins?: string[]
  businessId?: string
}

// ── Design tokens (dark theme) ────────────────────────────────────────────────
const T = {
  bg:          '#0a0a0f',
  panel:       '#111118',
  panelHover:  '#161622',
  border:      'rgba(255,255,255,0.08)',
  border2:     'rgba(255,255,255,0.12)',
  ink:         '#f4f1ec',
  inkMuted:    '#8a857e',
  inkHint:     'rgba(138,133,126,0.6)',
  accent:      '#c8a96e',
  accentDim:   'rgba(200,169,110,0.12)',
  green:       '#10B981',
  greenDim:    'rgba(16,185,129,0.12)',
  amber:       '#F59E0B',
  amberDim:    'rgba(245,158,11,0.12)',
  coral:       '#EF4444',
  coralDim:    'rgba(239,68,68,0.12)',
  r:           '12px',
  rs:          '8px',
}

export default function Onboarding() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('url')
  const [url, setUrl] = useState('')
  const [vertical, setVertical] = useState('')
  const [stageIndex, setStageIndex] = useState(0)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const apiBase = import.meta.env.VITE_API_URL || ''

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  async function startAudit() {
    const trimmed = url.trim()
    if (!trimmed) { setError('Enter your website URL to continue.'); return }

    // Normalise — add https:// if missing
    const fullUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`

    try { new URL(fullUrl) } catch {
      setError('That doesn\'t look like a valid URL. Try: https://yourbusiness.com')
      return
    }

    setError('')
    setStep('auditing')
    setStageIndex(0)

    // Animate stages while real call runs
    let i = 0
    intervalRef.current = setInterval(() => {
      i++
      if (i < STAGES.length - 1) setStageIndex(i)
      else if (intervalRef.current) clearInterval(intervalRef.current)
    }, 3500)

    try {
      const token = await user?.getToken()
      const res = await fetch(`${apiBase}/api/audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          url: fullUrl,
          vertical: vertical || 'LOCAL_SERVICE',
          location: 'United States',
        }),
      })

      if (intervalRef.current) clearInterval(intervalRef.current)
      setStageIndex(STAGES.length - 1)

      const text = await res.text()
      let data: any
      try { data = JSON.parse(text) } catch {
        throw new Error('Your backend returned an unexpected response. Check that it\'s running.')
      }

      if (!res.ok) {
        if (res.status === 429) throw new Error('You\'ve run several audits recently. Wait a few minutes and try again.')
        throw new Error(data?.error || `Audit failed (${res.status})`)
      }

      // Support both response shapes: { result: AuditResult } and flat AuditResult
      const audit: AuditResult = data?.result ?? data
      await new Promise(r => setTimeout(r, 600))
      setResult(audit)
      setStep('reveal')
    } catch (e: unknown) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setStep('url')
    }
  }

  // Normalise score fields from either response shape
  const score = Math.round(result?.overallScore ?? result?.overall_score ?? 0)
  const pillarScores: Record<string, number> = result?.pillarScores ?? result?.scores ?? {}
  const quickWins: string[] = result?.aiQuickWins ?? result?.quick_wins ?? []

  const monthlyLoss = result?.estimatedRevenueLeak?.estimatedMonthlyLoss
  const annualLoss = result?.estimated_revenue_leakage ?? (monthlyLoss != null ? monthlyLoss * 12 : null)

  const scoreColor = score >= 70 ? T.green : score >= 45 ? T.amber : T.coral
  const scoreDim   = score >= 70 ? T.greenDim : score >= 45 ? T.amberDim : T.coralDim
  const scoreLabel = score >= 70 ? 'Good foundation' : score >= 45 ? 'Room to grow' : 'Needs attention'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: T.bg,
    }}>
      <div style={{
        width: '100%',
        maxWidth: 520,
        background: T.panel,
        border: `0.5px solid ${T.border2}`,
        borderRadius: T.r,
        padding: 'clamp(1.5rem, 5vw, 2.5rem)',
      }}>

        {/* ── Step: URL entry ─────────────────────────────────────────────── */}
        {step === 'url' && (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                fontSize: 11,
                fontWeight: 500,
                color: T.accent,
                marginBottom: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                Free audit — takes 30–60 seconds
              </div>
              <h1 style={{
                fontSize: 'clamp(20px, 4vw, 26px)',
                fontWeight: 500,
                margin: '0 0 10px',
                color: T.ink,
                lineHeight: 1.3,
                fontFamily: 'var(--ff-sans)',
              }}>
                See what your website is costing you
              </h1>
              <p style={{ fontSize: 14, color: T.inkMuted, margin: 0, lineHeight: 1.65 }}>
                We score your site across 10 pillars and estimate how much revenue
                your current digital presence leaves behind every year.
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: T.inkMuted,
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Your website
              </label>
              <input
                type="url"
                placeholder="https://yourbusiness.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && startAudit()}
                autoFocus
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: T.panelHover,
                  border: `1px solid ${T.border2}`,
                  borderRadius: T.rs,
                  color: T.ink,
                  fontSize: 14,
                  padding: '10px 12px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 500,
                color: T.inkMuted,
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Industry <span style={{ color: T.inkHint, fontWeight: 400, textTransform: 'none' }}>(improves benchmarks)</span>
              </label>
              <select
                value={vertical}
                onChange={e => setVertical(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: T.panelHover,
                  border: `1px solid ${T.border2}`,
                  borderRadius: T.rs,
                  color: vertical ? T.ink : T.inkMuted,
                  fontSize: 14,
                  padding: '10px 12px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                }}
              >
                <option value="">Select your industry...</option>
                {VERTICAL_OPTIONS.map(v => (
                  <option key={v.value} value={v.value} style={{ background: T.panelHover, color: T.ink }}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                background: T.coralDim,
                color: T.coral,
                borderRadius: T.rs,
                fontSize: 13,
                marginBottom: '1rem',
                lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}

            <button
              onClick={startAudit}
              style={{
                width: '100%',
                background: T.accent,
                color: '#000',
                border: 'none',
                borderRadius: '100px',
                fontWeight: 700,
                fontSize: 14,
                padding: '12px 0',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.01em',
              }}
            >
              See my score →
            </button>

            <p style={{
              fontSize: 12,
              color: T.inkHint,
              textAlign: 'center',
              marginTop: 12,
              marginBottom: 0,
              lineHeight: 1.5,
            }}>
              No credit card. No signup required to see your score.
            </p>
          </>
        )}

        {/* ── Step: Auditing (animated progress) ────────────────────────── */}
        {step === 'auditing' && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <style>{`
              @keyframes sel-spin { to { transform: rotate(360deg); } }
              @keyframes sel-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
            `}</style>

            {/* Spinner ring */}
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              border: `2px solid ${T.border2}`,
              borderTopColor: T.accent,
              margin: '0 auto 1.75rem',
              animation: 'sel-spin 0.9s linear infinite',
            }} />

            <h2 style={{
              fontSize: 18,
              fontWeight: 500,
              margin: '0 0 8px',
              color: T.ink,
              fontFamily: 'inherit',
            }}>
              Analyzing your site
            </h2>
            <p style={{
              fontSize: 14,
              color: T.inkMuted,
              margin: '0 0 2.25rem',
              minHeight: 22,
              animation: 'sel-pulse 3.5s ease-in-out infinite',
            }}>
              {STAGES[stageIndex]}
            </p>

            {/* Progress dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
              {STAGES.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === stageIndex ? 24 : 6,
                    height: 6,
                    borderRadius: 3,
                    background:
                      i < stageIndex ? T.inkMuted
                      : i === stageIndex ? T.accent
                      : T.border2,
                    transition: 'all 0.4s ease',
                  }}
                />
              ))}
            </div>

            <p style={{
              fontSize: 12,
              color: T.inkHint,
              marginTop: '1.75rem',
              marginBottom: 0,
            }}>
              Checking 60+ signals across your digital presence...
            </p>
          </div>
        )}

        {/* ── Step: Reveal ──────────────────────────────────────────────── */}
        {step === 'reveal' && result && (
          <>
            {/* Score hero */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: scoreDim,
                borderRadius: 14,
                padding: '20px 40px',
                marginBottom: '1rem',
                border: `1px solid ${scoreColor}22`,
              }}>
                <div style={{
                  fontSize: 'clamp(48px, 10vw, 64px)',
                  fontWeight: 500,
                  lineHeight: 1,
                  color: scoreColor,
                  fontFamily: 'inherit',
                }}>
                  {score}
                </div>
                <div style={{ fontSize: 13, color: scoreColor, marginTop: 6, opacity: 0.85 }}>
                  {scoreLabel}
                </div>
              </div>

              <h2 style={{
                fontSize: 17,
                fontWeight: 500,
                margin: '0 0 8px',
                color: T.ink,
                fontFamily: 'inherit',
              }}>
                Your digital presence score
              </h2>

              {annualLoss != null && annualLoss > 0 && (
                <p style={{ fontSize: 14, color: T.inkMuted, margin: 0 }}>
                  Estimated annual revenue leakage:{' '}
                  <strong style={{ color: T.coral }}>
                    ${Math.round(annualLoss).toLocaleString()}/yr
                  </strong>
                </p>
              )}
            </div>

            {/* Pillar bars */}
            {Object.keys(pillarScores).length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: T.inkHint,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 10,
                }}>
                  Pillar breakdown
                </div>
                {Object.entries(pillarScores).slice(0, 6).map(([key, val]) => {
                  const barColor = val >= 70 ? T.green : val >= 45 ? T.amber : T.coral
                  return (
                    <div key={key} style={{
                      display: 'grid',
                      gridTemplateColumns: '110px 1fr 28px',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 8,
                    }}>
                      <div style={{ fontSize: 12, color: T.inkMuted }}>
                        {PILLAR_LABELS[key] ?? key.replace(/_/g, ' ')}
                      </div>
                      <div style={{
                        height: 5,
                        background: T.border,
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.max(0, Math.min(100, val))}%`,
                          borderRadius: 3,
                          background: barColor,
                          transition: 'width 0.8s ease',
                        }} />
                      </div>
                      <div style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: barColor,
                        textAlign: 'right',
                      }}>
                        {Math.round(val)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Quick wins teaser */}
            {quickWins.length > 0 && (
              <div style={{
                background: T.panelHover,
                borderRadius: T.rs,
                border: `1px solid ${T.border}`,
                padding: '14px 16px',
                marginBottom: '1.5rem',
              }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: T.inkHint,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 10,
                }}>
                  Where to start
                </div>
                {quickWins.slice(0, 2).map((win, i) => (
                  <div key={i} style={{
                    fontSize: 13,
                    color: T.inkMuted,
                    lineHeight: 1.55,
                    marginBottom: i < quickWins.slice(0, 2).length - 1 ? 8 : 0,
                    paddingLeft: 12,
                    borderLeft: `2px solid ${T.accent}44`,
                  }}>
                    {win}
                  </div>
                ))}
                {quickWins.length > 2 && (
                  <div style={{ fontSize: 12, color: T.inkHint, marginTop: 8 }}>
                    + {quickWins.length - 2} more in your full report
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => navigate('/dashboard')}
              style={{
                width: '100%',
                background: T.accent,
                color: '#000',
                border: 'none',
                borderRadius: '100px',
                fontWeight: 700,
                fontSize: 14,
                padding: '12px 0',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.01em',
              }}
            >
              View my full report and action plan →
            </button>
          </>
        )}
      </div>
    </div>
  )
}
