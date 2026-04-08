'use client'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import type { AuditResult } from '@/types/audit'
import { PILLARS } from '@/lib/constants'
import { WaitlistModal } from '@/components/ui/WaitlistModal'

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:        '#131314',
  surface:   '#1C1B1C',
  surfaceHi: '#2A2A2B',
  surfaceTop:'#353436',
  primary:   '#75FF9E',
  primaryCt: '#00E676',
  secondary: '#FFD799',
  tertiary:  '#FFDDDA',
  tertiaryC: '#FFB6B1',
  onSurface: '#E5E2E3',
  onMuted:   '#BACBB9',
  outline:   '#3B4A3D',
  error:     '#FFDDDA',
  errorDim:  'rgba(255,180,171,0.12)',
  warnDim:   'rgba(255,211,0,0.12)',
  primaryDim:'rgba(117,255,158,0.10)',
  ff:        "'Manrope', 'Inter', sans-serif",
  ffBody:    "'Inter', sans-serif",
}

const gradeColor = (s: number) =>
  s >= 75 ? T.primary : s >= 60 ? T.secondary : s >= 45 ? T.tertiaryC : '#FFDDDA'

// ── Growth ring (SVG, no canvas) ──────────────────────────────────────────────
function GrowthRing({ score }: { score: number }) {
  const r = 76, circ = 2 * Math.PI * r
  const ref = useRef<SVGCircleElement>(null)
  useEffect(() => {
    if (!ref.current) return
    ref.current.style.strokeDashoffset = String(circ * (1 - score / 100))
  }, [score, circ])
  const col = gradeColor(score)
  return (
    <div style={{ position: 'relative', width: 190, height: 190 }}>
      <svg width="190" height="190" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="95" cy="95" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        <circle
          ref={ref}
          cx="95" cy="95" r={r}
          fill="none"
          stroke={col}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={String(circ)}
          strokeDashoffset={String(circ)}
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)',
            filter: `drop-shadow(0 0 8px ${col}55)`,
          }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: T.ff, fontSize: '3.5rem', fontWeight: 800, color: col, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontFamily: T.ff, fontSize: 10, color: T.onMuted, letterSpacing: '0.2em', marginTop: 4 }}>
          / 100
        </span>
      </div>
    </div>
  )
}

// ── Horizontal pillar card ────────────────────────────────────────────────────
function PillarCard({ icon, name, score, weight, desc }: {
  icon: string; name: string; score: number; weight: number; desc: string
}) {
  const col = gradeColor(score)
  return (
    <div style={{
      flexShrink: 0, width: 240,
      background: T.surfaceHi, borderRadius: 24,
      padding: '20px', scrollSnapAlign: 'center',
      border: `1px solid rgba(59,74,61,0.15)`,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: `${col}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, marginBottom: 14,
      }}>{icon}</div>
      <div style={{ fontFamily: T.ff, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{name}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, height: 5, background: T.surfaceTop, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${score}%`, background: col, borderRadius: 99,
            boxShadow: `0 0 8px ${col}44`,
            transition: 'width 1.2s ease',
          }} />
        </div>
        <span style={{ fontFamily: T.ff, fontSize: 12, fontWeight: 700, color: col }}>{score}%</span>
      </div>
      <p style={{ fontSize: 12, color: T.onMuted, lineHeight: 1.6, margin: 0 }}>{desc}</p>
      <div style={{ marginTop: 8, fontSize: 10, color: T.onMuted, letterSpacing: '0.08em' }}>
        WEIGHT {Math.round(weight * 100)}%
      </div>
    </div>
  )
}

// ── Insight nugget ────────────────────────────────────────────────────────────
type NuggetType = 'leak' | 'opportunity' | 'win'

function InsightNugget({ type, title, body }: {
  type: NuggetType; title: string; body: string
}) {
  const cfg = {
    leak:        { bg: T.errorDim,   fg: '#FFDDDA', label: 'Critical Leak',  icon: '🔴' },
    opportunity: { bg: T.warnDim,    fg: T.secondary, label: 'Opportunity',  icon: '🟡' },
    win:         { bg: T.primaryDim, fg: T.primary,   label: 'Win',          icon: '🟢' },
  }[type]

  return (
    <div style={{
      background: T.surface, borderRadius: 24,
      padding: '16px', display: 'flex', gap: 14, alignItems: 'flex-start',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 16, flexShrink: 0,
        background: cfg.bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 22,
      }}>{cfg.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{
            background: cfg.bg, color: cfg.fg,
            fontSize: 9, fontFamily: T.ffBody, fontWeight: 700,
            letterSpacing: '0.12em', padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase',
          }}>{cfg.label}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: T.ff, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: T.onMuted, lineHeight: 1.5 }}>{body}</div>
      </div>
      <span style={{ color: T.onMuted, fontSize: 18, alignSelf: 'center', flexShrink: 0 }}>›</span>
    </div>
  )
}

// ── Site signal row ───────────────────────────────────────────────────────────
function SignalRow({ label, value }: { label: string; value: boolean | string | number }) {
  const isPass = value === true || (typeof value === 'number' && value >= 300)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      paddingBottom: 14, marginBottom: 14,
    }}>
      <span style={{ fontSize: 13, color: T.onSurface }}>{label}</span>
      {typeof value === 'number'
        ? <span style={{ fontFamily: T.ffBody, fontSize: 13, fontWeight: 600, color: isPass ? T.primary : T.tertiaryC }}>{value}</span>
        : <span style={{ fontSize: 16 }}>{isPass ? '✓' : '✗'}</span>
      }
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ResultsView({
  result, onNewAudit,
}: {
  result: AuditResult
  onNewAudit: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)
  const { getToken } = useAuth()

  const {
    pillarScores, overallScore, recommendations,
    aiTopIssues, signals, roadmap, revenueLeak, input,
  } = result

  const biz = input.businessName || input.url.replace(/https?:\/\//, '').split('/')[0]
  const shareUrl = result.auditId ? `${window.location.origin}/results/${result.auditId}` : null

  const sorted = [...PILLARS].sort((a, b) => (pillarScores[b.id] ?? 0) - (pillarScores[a.id] ?? 0))

  const handleShare = () => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Build insight nuggets from top issues + recommendations
  const leaks = recommendations.revenue_leaks.slice(0, 2).map(r => ({
    type: 'leak' as NuggetType, title: r.title, body: r.desc,
  }))
  const wins = recommendations.quick_wins.slice(0, 2).map(r => ({
    type: 'opportunity' as NuggetType, title: r.title, body: r.desc,
  }))
  const winPillars = sorted.slice(0, 1).map(p => ({
    type: 'win' as NuggetType,
    title: `${p.name} is a strength`,
    body: `Score ${pillarScores[p.id] ?? 0}/100 — outperforming most similar businesses in this area.`,
  }))
  const nuggets = [...leaks, ...wins, ...winPillars].slice(0, 5)

  // Pillar descriptions from quick wins / impact
  const getPillarDesc = (id: string) => {
    const all = [...recommendations.quick_wins, ...recommendations.high_impact, ...recommendations.revenue_leaks]
    return all.find(r => r.pillar === id)?.desc || 'See recommendations below.'
  }

  const col = gradeColor(overallScore)

  return (
    <div style={{
      background: T.bg, minHeight: '100vh',
      color: T.onSurface, fontFamily: T.ffBody,
      paddingBottom: 100,
    }}>

      {/* ── Top bar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', height: 60,
        background: 'rgba(19,19,20,0.92)', backdropFilter: 'blur(20px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onNewAudit} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: T.primary, fontSize: 20, padding: 0, lineHeight: 1,
          }}>←</button>
          <span style={{ fontFamily: T.ff, fontSize: 10, fontWeight: 700, color: T.primary, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Audit Results
          </span>
        </div>
        <button
          onClick={handleShare}
          style={{
            fontFamily: T.ff, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: T.primary,
            background: T.surface, padding: '8px 16px', borderRadius: 12,
            border: 'none', cursor: 'pointer',
          }}
        >
          {copied ? '✓ Copied' : 'Share'}
        </button>
      </header>

      <main style={{ paddingTop: 78, maxWidth: 480, margin: '0 auto' }}>

        {/* ── Hero score ── */}
        <section style={{ padding: '24px 24px 8px' }}>
          <div style={{
            background: T.surface, borderRadius: 32, padding: '28px 24px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Ambient glow */}
            <div style={{
              position: 'absolute', top: -48, right: -48,
              width: 140, height: 140,
              background: `${col}18`, borderRadius: '50%', filter: 'blur(40px)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative' }}>
              <div>
                <p style={{ fontFamily: T.ff, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.onMuted, marginBottom: 4 }}>
                  Growth Score
                </p>
                <div style={{ fontFamily: T.ff, fontSize: '4rem', fontWeight: 800, color: col, lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  {overallScore}
                  <span style={{ fontSize: '1.5rem', color: `${T.onMuted}66` }}>%</span>
                </div>
                <p style={{ fontSize: 13, color: T.onMuted, marginTop: 6 }}>{biz}</p>
                <p style={{ fontSize: 11, color: `${T.onMuted}88`, marginTop: 2 }}>{input.vertical.replace('_', ' ').toLowerCase()} · {input.location}</p>
              </div>

              {/* Mini ring */}
              <GrowthRing score={overallScore} />
            </div>

            {/* Revenue leak callout */}
            {revenueLeak.totalPct > 0 && (
              <div style={{
                marginTop: 20, padding: '12px 16px',
                background: T.errorDim, borderRadius: 16,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
                <div>
                  <span style={{ fontFamily: T.ff, fontSize: 13, fontWeight: 700, color: T.tertiaryC }}>
                    {Math.max(revenueLeak.totalPct, 15)}% revenue leak detected
                  </span>
                  <p style={{ fontSize: 11, color: T.onMuted, margin: '2px 0 0' }}>
                    Daily growth opportunities being lost
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Pillar score cards (horizontal scroll) ── */}
        <section style={{ marginBottom: 8 }}>
          <div style={{ padding: '20px 24px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ fontFamily: T.ff, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.onMuted, margin: 0 }}>
              Performance by Area
            </h4>
          </div>
          <div style={{
            display: 'flex', overflowX: 'auto', gap: 12,
            padding: '0 24px 8px', scrollSnapType: 'x mandatory',
            msOverflowStyle: 'none', scrollbarWidth: 'none',
          } as React.CSSProperties}>
            {PILLARS.map(p => (
              <PillarCard
                key={p.id}
                icon={p.icon}
                name={p.name}
                score={pillarScores[p.id] ?? 0}
                weight={p.weight}
                desc={getPillarDesc(p.id)}
              />
            ))}
          </div>
        </section>

        {/* ── Insight nuggets ── */}
        {nuggets.length > 0 && (
          <section style={{ padding: '12px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h4 style={{ fontFamily: T.ff, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.onMuted, margin: 0 }}>
                Top Insights
              </h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {nuggets.map((n, i) => (
                <InsightNugget key={i} type={n.type} title={n.title} body={n.body} />
              ))}
            </div>
          </section>
        )}

        {/* ── What we found on your site ── */}
        <section style={{ padding: '12px 24px' }}>
          <h4 style={{ fontFamily: T.ff, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.onMuted, marginBottom: 16 }}>
            What We Found On Your Site
          </h4>
          <div style={{ background: T.surface, borderRadius: 24, padding: '20px' }}>
            <SignalRow label="Main action button (CTA)"    value={signals.hasCTA} />
            <SignalRow label="Online booking"              value={signals.hasBooking} />
            <SignalRow label="Secure connection (HTTPS)"   value={signals.hasSSL} />
            <SignalRow label="Mobile optimised"            value={signals.isMobileOptimized} />
            <SignalRow label="Google Business linked"      value={signals.hasGBP} />
            <SignalRow label="Reviews or testimonials"     value={signals.hasReviews} />
            <SignalRow label="Prices or packages"          value={signals.hasPricing} />
            <SignalRow label="Contact form"                value={signals.hasContactForm} />
            <SignalRow label="Website analytics"           value={signals.hasAnalytics} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: T.onSurface }}>Word count</span>
              <span style={{
                fontFamily: T.ffBody, fontSize: 13, fontWeight: 600,
                color: signals.wordCount >= 300 ? T.primary : T.tertiaryC,
              }}>{signals.wordCount}</span>
            </div>
          </div>
        </section>

        {/* ── 30-day sprint ── */}
        {roadmap?.['30']?.length > 0 && (
          <section style={{ padding: '12px 24px' }}>
            <h4 style={{ fontFamily: T.ff, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.onMuted, marginBottom: 14 }}>
              30-Day Sprint
            </h4>
            <div style={{ background: T.surface, borderRadius: 24, padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {roadmap['30'].slice(0, 4).map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                    background: T.primaryDim, color: T.primary,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: T.ff, fontSize: 11, fontWeight: 700,
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: T.onMuted, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── CTAs ── */}
        <section style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              width: '100%',
              background: `linear-gradient(135deg, ${T.primary}, ${T.primaryCt})`,
              color: '#003918', fontFamily: T.ff, fontWeight: 800,
              fontSize: 15, padding: '18px', borderRadius: 16,
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: `0 8px 32px ${T.primary}30`,
            }}
          >
            View Detailed Roadmap →
          </button>
          <button
            onClick={handleShare}
            style={{
              width: '100%',
              background: T.surfaceHi, color: T.onSurface,
              fontFamily: T.ff, fontWeight: 700, fontSize: 15,
              padding: '16px', borderRadius: 16,
              border: `1px solid rgba(59,74,61,0.15)`, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {copied ? '✓ Link Copied!' : '↑ Share Report'}
          </button>
          <button
            onClick={onNewAudit}
            style={{
              width: '100%',
              background: 'transparent', color: T.onMuted,
              fontFamily: T.ff, fontWeight: 600, fontSize: 13,
              padding: '12px', borderRadius: 16,
              border: 'none', cursor: 'pointer',
            }}
          >
            ← Run Another Audit
          </button>
        </section>

      </main>

      {/* ── Bottom nav ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '12px 16px 20px',
        background: 'rgba(19,19,20,0.85)', backdropFilter: 'blur(20px)',
        borderTop: `1px solid rgba(59,74,61,0.15)`,
        boxShadow: '0px -24px 48px rgba(0,0,0,0.4)',
        borderRadius: '24px 24px 0 0',
      }}>
        {[
          { icon: '⊞', label: 'Dashboard', href: '/dashboard' },
          { icon: '◎', label: 'Audit',     href: null, active: true },
          { icon: '↗', label: 'Roadmap',   href: '/dashboard' },
          { icon: '↑', label: 'Export',    href: null, action: handleShare },
        ].map(tab => (
          <button
            key={tab.label}
            onClick={() => {
              if (tab.href) window.location.href = tab.href
              else if (tab.action) tab.action()
            }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '4px 12px',
              color: tab.active ? T.primary : T.onMuted,
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: tab.active ? T.primaryDim : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, transition: 'background 0.2s',
            }}>{tab.icon}</div>
            <span style={{ fontFamily: T.ffBody, fontSize: 10, fontWeight: 600 }}>{tab.label}</span>
          </button>
        ))}
      </nav>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        source="results_cta_bar"
        score={overallScore}
        vertical={input.vertical}
      />
    </div>
  )
}
