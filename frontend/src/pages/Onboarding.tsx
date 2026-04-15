import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPost } from '../lib/api'

type Step = 'name' | 'industry' | 'website' | 'auditing' | 'reveal'

const INDUSTRIES = [
  { value: 'AUTO_REPAIR',   label: 'Auto Repair',    icon: '🔧' },
  { value: 'DENTAL',        label: 'Dental',          icon: '🦷' },
  { value: 'RESTAURANT',    label: 'Restaurant',      icon: '🍽️' },
  { value: 'PLUMBING',      label: 'Plumbing',        icon: '🚿' },
  { value: 'HVAC',          label: 'HVAC',            icon: '❄️' },
  { value: 'LAW_FIRM',      label: 'Law Firm',        icon: '⚖️' },
  { value: 'REAL_ESTATE',   label: 'Real Estate',     icon: '🏠' },
  { value: 'MEDICAL',       label: 'Medical',         icon: '🏥' },
  { value: 'VETERINARY',    label: 'Veterinary',      icon: '🐾' },
  { value: 'SALON_SPA',     label: 'Salon & Spa',     icon: '✂️' },
  { value: 'GYM_FITNESS',   label: 'Gym & Fitness',   icon: '💪' },
  { value: 'ACCOUNTING',    label: 'Accounting',      icon: '📊' },
  { value: 'INSURANCE',     label: 'Insurance',       icon: '🛡️' },
  { value: 'ROOFING',       label: 'Roofing',         icon: '🏗️' },
  { value: 'LANDSCAPING',   label: 'Landscaping',     icon: '🌿' },
  { value: 'OTHER',         label: 'Other',           icon: '🏢' },
]

const AUDIT_STAGES = [
  { label: 'Fetching your website',          duration: 3000 },
  { label: 'Analysing technical foundation', duration: 4000 },
  { label: 'Scoring SEO signals',            duration: 4000 },
  { label: 'Evaluating conversion rate',     duration: 3000 },
  { label: 'Checking reputation signals',    duration: 3000 },
  { label: 'Generating your action plan',    duration: 5000 },
]

const SCORE_NARRATIVES: Record<string, { headline: string; sub: string; color: string }> = {
  NO_FOUNDATION:     { headline: 'Your website needs urgent attention', sub: 'Critical issues are preventing customers from finding and contacting you.', color: '#ef4444' },
  CONVERSION_BROKEN: { headline: 'Visitors arrive — but don\'t convert', sub: 'Traffic exists but your site is losing leads at the point of contact.', color: '#f59e0b' },
  LOW_VISIBILITY:    { headline: 'Your site converts but nobody finds it', sub: 'Strong foundation hidden by low search visibility and local presence.', color: '#f59e0b' },
  SCALING:           { headline: 'Solid foundation — ready to grow', sub: 'Your site performs well. Now it\'s time to accelerate across all channels.', color: '#3b82f6' },
  OPTIMIZING:        { headline: 'You\'re ahead of 80% of competitors', sub: 'Marginal gains and compounding advantages are the focus now.', color: '#10b981' },
}

const FALLBACK_NARRATIVE = { headline: 'Your audit is ready', sub: 'We\'ve scored your site across 10 growth pillars and built your action plan.', color: '#3b82f6' }

export default function Onboarding() {
  const [step,          setStep]         = useState<Step>('name')
  const [businessName,  setBusinessName] = useState('')
  const [industry,      setIndustry]     = useState('')
  const [website,       setWebsite]      = useState('')
  const [auditResult,   setAuditResult]  = useState<any>(null)
  const [auditStage,    setAuditStage]   = useState(0)
  const [error,         setError]        = useState('')
  const { getToken }  = useAuth()
  const navigate      = useNavigate()
  const queryClient   = useQueryClient()

  // Progress through audit stages while real audit runs
  useEffect(() => {
    if (step !== 'auditing') return
    let total = 0
    const timers: ReturnType<typeof setTimeout>[] = []
    AUDIT_STAGES.forEach((stage, i) => {
      const t = setTimeout(() => setAuditStage(i), total)
      timers.push(t)
      total += stage.duration
    })
    return () => timers.forEach(clearTimeout)
  }, [step])

  const runAudit = useMutation({
    mutationFn: async () => {
      let url = website.trim()
      if (!url) throw new Error('Enter your website URL')
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url
      try { new URL(url) } catch { throw new Error('That doesn\'t look like a valid URL') }
      const token = await getToken()
      return apiPost<any>('/api/audit', token!, {
        url,
        businessName: businessName.trim() || undefined,
        vertical:     industry || 'OTHER',
        location:     'United States',
      })
    },
    onSuccess: (data) => {
      const audit = data?.result ?? data
      setAuditResult(audit)
      setStep('reveal')
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (err: any) => {
      setError(err.message || 'Something went wrong. Please try again.')
      setStep('website')
    },
  })

  function handleStartAudit() {
    if (!website.trim()) { setError('Enter your website URL'); return }
    setError('')
    setStep('auditing')
    runAudit.mutate()
  }

  const stageProgress = ((auditStage + 1) / AUDIT_STAGES.length) * 100
  const narrative     = SCORE_NARRATIVES[auditResult?.state ?? ''] ?? FALLBACK_NARRATIVE

  const STEPS: Step[] = ['name', 'industry', 'website']
  const stepIndex = STEPS.indexOf(step as any)

  return (
    <div className="onboarding-page">

      {/* Step indicator */}
      {step !== 'auditing' && step !== 'reveal' && (
        <div className="onboarding-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`onboarding-step-dot ${step === s ? 'active' : stepIndex > i ? 'done' : ''}`} />
          ))}
        </div>
      )}

      {/* ── STEP 1: Name ── */}
      {step === 'name' && (
        <div className="onboarding-card onboarding-card--centered">
          <div className="onboarding-eyebrow">Welcome to Seleste</div>
          <h1 className="onboarding-heading">What's your business called?</h1>
          <p className="onboarding-desc">We'll use this to personalise your command center.</p>
          <input
            className="onboarding-field"
            type="text"
            placeholder="e.g. Waldorf Ford, Smith's Plumbing..."
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && businessName.trim() && setStep('industry')}
            autoFocus
          />
          <button
            className="onboarding-cta"
            onClick={() => setStep('industry')}
            disabled={!businessName.trim()}
          >
            Continue →
          </button>
        </div>
      )}

      {/* ── STEP 2: Industry ── */}
      {step === 'industry' && (
        <div className="onboarding-card onboarding-card--wide">
          <div className="onboarding-eyebrow">Step 2 of 3</div>
          <h1 className="onboarding-heading">What type of business is {businessName}?</h1>
          <p className="onboarding-desc">We benchmark you against competitors in your vertical.</p>
          <div className="industry-grid">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.value}
                className={`industry-tile ${industry === ind.value ? 'industry-tile--selected' : ''}`}
                onClick={() => { setIndustry(ind.value); setTimeout(() => setStep('website'), 200) }}
              >
                <span className="industry-tile__icon">{ind.icon}</span>
                <span className="industry-tile__label">{ind.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 3: Website ── */}
      {step === 'website' && (
        <div className="onboarding-card onboarding-card--centered">
          <div className="onboarding-eyebrow">Step 3 of 3</div>
          <h1 className="onboarding-heading">Where's {businessName}'s website?</h1>
          <p className="onboarding-desc">
            Seleste will audit it across 10 pillars — SEO, conversion, reputation, speed and more —
            then build your personalised action plan.
          </p>
          <input
            className="onboarding-field"
            type="url"
            placeholder="https://yourbusiness.com"
            value={website}
            onChange={(e) => { setWebsite(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleStartAudit()}
            autoFocus
          />
          {error && <div className="onboarding-error">{error}</div>}
          <button className="onboarding-cta" onClick={handleStartAudit} disabled={!website.trim()}>
            Analyse my website →
          </button>
          <div className="onboarding-trust">
            Takes ~30 seconds · Free · No card required
          </div>
        </div>
      )}

      {/* ── STEP 4: Auditing ── */}
      {step === 'auditing' && (
        <div className="onboarding-card onboarding-card--centered onboarding-card--auditing">
          <div className="audit-spinner">
            <div className="audit-spinner__ring" />
            <div className="audit-spinner__score">
              {auditStage + 1}/{AUDIT_STAGES.length}
            </div>
          </div>
          <h1 className="onboarding-heading">Analysing {businessName || 'your site'}</h1>
          <div className="audit-stage-label">{AUDIT_STAGES[auditStage]?.label}...</div>
          <div className="audit-progress">
            <div className="audit-progress__bar" style={{ width: `${stageProgress}%` }} />
          </div>
          <div className="audit-stages-list">
            {AUDIT_STAGES.map((stage, i) => (
              <div key={i} className={`audit-stage ${i < auditStage ? 'done' : i === auditStage ? 'active' : ''}`}>
                <span className="audit-stage__icon">{i < auditStage ? '✓' : i === auditStage ? '⟳' : '○'}</span>
                <span className="audit-stage__label">{stage.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 5: Reveal ── */}
      {step === 'reveal' && auditResult && (
        <div className="onboarding-card onboarding-card--centered onboarding-card--reveal">
          <div className="reveal-score-ring">
            <svg viewBox="0 0 120 120" width="120" height="120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke={narrative.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${((auditResult.overallScore ?? 0) / 100) * 314} 314`}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dasharray 1.2s ease' }}
              />
              <text x="60" y="68" textAnchor="middle" fontSize="28" fontWeight="700" fill="currentColor">
                {auditResult.overallScore ?? 0}
              </text>
            </svg>
          </div>
          <h1 className="onboarding-heading" style={{ color: narrative.color }}>
            {narrative.headline}
          </h1>
          <p className="onboarding-desc">{narrative.sub}</p>

          {/* Quick wins */}
          {(auditResult.recommendations?.quick_wins?.length > 0 || auditResult.quickWins?.length > 0) && (
            <div className="reveal-quick-wins">
              <div className="reveal-quick-wins__title">Your top opportunities</div>
              {(auditResult.recommendations?.quick_wins ?? auditResult.quickWins ?? []).slice(0, 3).map((win: any, i: number) => (
                <div key={i} className="reveal-win">
                  <span className="reveal-win__num">{i + 1}</span>
                  <span className="reveal-win__text">{typeof win === 'string' ? win : win.title}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pillar scores preview */}
          {auditResult.pillarScores && (
            <div className="reveal-pillars">
              {Object.entries(auditResult.pillarScores as Record<string, number>)
                .slice(0, 4)
                .map(([key, score]) => {
                  const color = score >= 65 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
                  return (
                    <div key={key} className="reveal-pillar">
                      <div className="reveal-pillar__label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                      <div className="reveal-pillar__bar">
                        <div className="reveal-pillar__fill" style={{ width: `${score}%`, background: color }} />
                      </div>
                      <div className="reveal-pillar__score" style={{ color }}>{score}</div>
                    </div>
                  )
                })}
            </div>
          )}

          <button className="onboarding-cta" onClick={() => navigate('/dashboard')}>
            Open my command center →
          </button>
          <div className="onboarding-trust">
            Your inbox has been populated with AI-generated actions
          </div>
        </div>
      )}
    </div>
  )
}
