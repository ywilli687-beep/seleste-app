'use client'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import type { AuditResult } from '@/types/audit'
import { PILLARS } from '@/lib/constants'
import { WaitlistModal } from '@/components/ui/WaitlistModal'

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:         '#131314',
  surface:    '#1C1B1C',
  surfaceHi:  '#2A2A2B',
  surfaceTop: '#353436',
  primary:    '#75FF9E',
  primaryCt:  '#00E676',
  secondary:  '#FFD799',
  tertiaryC:  '#FFB6B1',
  onSurface:  '#E5E2E3',
  onMuted:    '#BACBB9',
  outline:    '#3B4A3D',
  errorDim:   'rgba(255,180,171,0.12)',
  warnDim:    'rgba(255,211,0,0.12)',
  primaryDim: 'rgba(117,255,158,0.10)',
  ff:         "'Manrope', 'Inter', sans-serif",
  ffBody:     "'Inter', sans-serif",
}

const gradeColor = (s: number) =>
  s >= 75 ? T.primary : s >= 60 ? T.secondary : s >= 45 ? T.tertiaryC : '#FFDDDA'

// ── Plain-English explainers ──────────────────────────────────────────────────
const PILLAR_EXPLAINERS: Record<string, string> = {
  conversion:     'How well your site turns visitors into paying customers — calls, bookings, and form fills.',
  trust:          'How credible and trustworthy your business looks to someone who has never heard of you.',
  performance:    'How fast your site loads. Slow sites lose customers before they even see your offer.',
  ux:             'How easy it is for visitors to find what they need and take the next step.',
  discoverability:'How easily people can find you on Google, Maps, and other search tools.',
  content:        'How well your copy and messaging match what your customers are searching for.',
  data:           'Whether you have the tracking tools in place to know what\'s working and what isn\'t.',
  technical:      'The behind-the-scenes health of your site — security, structure, and how Google crawls it.',
  brand:          'How consistent and professional your brand appears across your site and online listings.',
  scalability:    'How ready your business is to handle more growth without things falling apart.',
}

const SIGNAL_EXPLAINERS: Record<string, string> = {
  hasCTA:            'A clear button that tells visitors what to do — "Book Now", "Call Us", "Get a Quote", etc.',
  hasBooking:        'An online booking tool so customers can schedule without needing to call.',
  hasSSL:            'The padlock in the browser bar that keeps your site secure. Google penalises sites without it.',
  isMobileOptimized: 'Most people search on their phones — this checks if your site works well on small screens.',
  hasGBP:            'Your Google Business Profile controls how you appear in local search and Google Maps.',
  hasReviews:        'Customer reviews or testimonials on your site build trust with new visitors.',
  hasPricing:        'Showing prices upfront reduces friction and helps customers decide faster.',
  hasContactForm:    'A form visitors can fill out to reach you without having to pick up the phone.',
  hasAnalytics:      'Tools like Google Analytics so you can see how many people visit and where they come from.',
  wordCount:         'More content helps Google understand what your business does. Aim for 300+ words.',
}

// ── Responsive hook ───────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return isMobile
}

// ── Inline tooltip ────────────────────────────────────────────────────────────
function InlineTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: 5 }}>
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        style={{
          width: 15, height: 15, borderRadius: '50%',
          background: T.surfaceTop, border: `1px solid ${T.outline}`,
          color: T.onMuted, fontSize: 9, fontFamily: T.ff,
          fontWeight: 700, cursor: 'default',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, lineHeight: 1, flexShrink: 0,
        }}
      >?</button>
      {show && (
        <div style={{
          position: 'absolute', bottom: '130%', left: '50%', transform: 'translateX(-50%)',
          background: T.surfaceTop, border: `1px solid ${T.outline}`,
          borderRadius: 10, padding: '8px 12px', width: 220,
          fontSize: 11, color: T.onMuted, lineHeight: 1.6,
          zIndex: 200, pointerEvents: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.55)',
          whiteSpace: 'normal' as const,
        }}>
          {text}
        </div>
      )}
    </span>
  )
}

// ── Growth ring ───────────────────────────────────────────────────────────────
function GrowthRing({ score, size = 190 }: { score: number; size?: number }) {
  const r = size * 0.4, circ = 2 * Math.PI * r
  const ref = useRef<SVGCircleElement>(null)
  useEffect(() => {
    if (!ref.current) return
    ref.current.style.strokeDashoffset = String(circ * (1 - score / 100))
  }, [score, circ])
  const col = gradeColor(score)
  const sw = size * 0.065
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
        <circle
          ref={ref}
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={String(circ)} strokeDashoffset={String(circ)}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 8px ${col}55)` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: T.ff, fontSize: size * 0.185, fontWeight: 800, color: col, lineHeight: 1 }}>{score}</span>
        <span style={{ fontFamily: T.ff, fontSize: size * 0.058, color: T.onMuted, letterSpacing: '0.18em', marginTop: 4 }}>/100</span>
      </div>
    </div>
  )
}

// ── Pillar bar (used in both layouts) ─────────────────────────────────────────
function PillarBar({ icon, name, score, desc }: { icon: string; name: string; score: number; desc?: string }) {
  const col = gradeColor(score)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: T.onSurface, display: 'flex', alignItems: 'center', gap: 6 }}>
          {icon} {name}{desc && <InlineTooltip text={desc} />}
        </span>
        <span style={{ fontFamily: T.ff, fontSize: 13, fontWeight: 700, color: col }}>{score}/100</span>
      </div>
      <div style={{ height: 5, background: T.surfaceTop, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${score}%`, background: col, borderRadius: 99,
          boxShadow: `0 0 6px ${col}44`, transition: 'width 1.2s ease',
        }} />
      </div>
    </div>
  )
}

// ── Horizontal pillar card (mobile swipe) ─────────────────────────────────────
function PillarCard({ icon, name, score, desc }: { icon: string; name: string; score: number; desc: string }) {
  const col = gradeColor(score)
  return (
    <div style={{ flexShrink: 0, width: 220, background: T.surfaceHi, borderRadius: 24, padding: '18px', scrollSnapAlign: 'center' }}>
      <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${col}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 12 }}>
        {icon}
      </div>
      <div style={{ fontFamily: T.ff, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{name}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, height: 4, background: T.surfaceTop, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${score}%`, background: col, borderRadius: 99, boxShadow: `0 0 6px ${col}44`, transition: 'width 1.2s ease' }} />
        </div>
        <span style={{ fontFamily: T.ff, fontSize: 11, fontWeight: 700, color: col }}>{score}%</span>
      </div>
      <p style={{ fontSize: 11, color: T.onMuted, lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  )
}

// ── Insight nugget ────────────────────────────────────────────────────────────
type NuggetType = 'leak' | 'opportunity' | 'win'
const nuggetCfg = {
  leak:        { bg: 'rgba(255,180,171,0.12)', fg: '#FFDDDA', label: 'Critical Leak',  icon: '🔴' },
  opportunity: { bg: 'rgba(255,211,0,0.12)',   fg: '#FFD799', label: 'Opportunity',    icon: '🟡' },
  win:         { bg: 'rgba(117,255,158,0.10)', fg: '#75FF9E', label: 'Win',            icon: '🟢' },
}

function InsightNugget({ type, title, body }: { type: NuggetType; title: string; body: string }) {
  const cfg = nuggetCfg[type]
  return (
    <div style={{ background: T.surface, borderRadius: 20, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 42, height: 42, borderRadius: 14, flexShrink: 0, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
        {cfg.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ background: cfg.bg, color: cfg.fg, fontSize: 9, fontFamily: T.ffBody, fontWeight: 700, letterSpacing: '0.12em', padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase' as const }}>
          {cfg.label}
        </span>
        <div style={{ fontSize: 13, fontWeight: 600, fontFamily: T.ff, margin: '5px 0 3px' }}>{title}</div>
        <div style={{ fontSize: 12, color: T.onMuted, lineHeight: 1.5 }}>{body}</div>
      </div>
      <span style={{ color: T.onMuted, fontSize: 18, alignSelf: 'center', flexShrink: 0 }}>›</span>
    </div>
  )
}

// ── Signal row ────────────────────────────────────────────────────────────────
function SignalRow({ label, value, last, explain }: { label: string; value: boolean | number; last?: boolean; explain?: string }) {
  const isPass = value === true || (typeof value === 'number' && value >= 300)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: last ? 0 : 12, marginBottom: last ? 0 : 12, borderBottom: last ? 'none' : `1px solid ${T.surfaceTop}` }}>
      <span style={{ fontSize: 13, color: T.onSurface, display: 'flex', alignItems: 'center' }}>{label}{explain && <InlineTooltip text={explain} />}</span>
      {typeof value === 'number'
        ? <span style={{ fontFamily: T.ffBody, fontSize: 13, fontWeight: 600, color: isPass ? T.primary : T.tertiaryC }}>{value}</span>
        : <span style={{ fontSize: 15, color: isPass ? T.primary : T.tertiaryC }}>{isPass ? '✓' : '✗'}</span>}
    </div>
  )
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 style={{ fontFamily: T.ff, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: T.onMuted, margin: '0 0 14px' }}>
      {children}
    </h4>
  )
}

// ── Top bar ───────────────────────────────────────────────────────────────────
function TopBar({ biz, onNewAudit, onShare, copied }: { biz: string; onNewAudit: () => void; onShare: () => void; copied: boolean }) {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: 60,
      background: 'rgba(19,19,20,0.92)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(59,74,61,0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={onNewAudit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.primary, fontSize: 18, padding: 0 }}>←</button>
        <span style={{ fontFamily: T.ff, fontSize: 10, fontWeight: 700, color: T.primary, letterSpacing: '0.18em', textTransform: 'uppercase' as const }}>
          Audit Results
        </span>
        <span style={{ fontSize: 12, color: T.onMuted, display: 'none' }} className="desktop-biz">{biz}</span>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => window.location.href = '/dashboard'} style={{ fontFamily: T.ff, fontSize: 11, fontWeight: 700, color: T.onMuted, background: T.surfaceHi, padding: '7px 16px', borderRadius: 10, border: 'none', cursor: 'pointer' }}>
          Dashboard →
        </button>
        <button onClick={onShare} style={{ fontFamily: T.ff, fontSize: 11, fontWeight: 700, color: T.primary, background: T.primaryDim, padding: '7px 16px', borderRadius: 10, border: `1px solid ${T.primary}33`, cursor: 'pointer' }}>
          {copied ? '✓ Copied' : 'Share'}
        </button>
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════
function MobileLayout({
  result, onNewAudit, onShare, copied, nuggets, getPillarDesc,
}: {
  result: AuditResult; onNewAudit: () => void; onShare: () => void
  copied: boolean; nuggets: { type: NuggetType; title: string; body: string }[]
  getPillarDesc: (id: string) => string
}) {
  const { pillarScores, overallScore, signals, roadmap, revenueLeak, input } = result
  const biz = input.businessName || input.url.replace(/https?:\/\//, '').split('/')[0]
  const col = gradeColor(overallScore)

  return (
    <div style={{ paddingBottom: 100 }}>
      <main style={{ paddingTop: 72, maxWidth: 480, margin: '0 auto' }}>

        {/* Hero */}
        <section style={{ padding: '16px 16px 8px' }}>
          <div style={{ background: T.surface, borderRadius: 28, padding: '24px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -48, right: -48, width: 130, height: 130, background: `${col}18`, borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <div>
                <p style={{ fontFamily: T.ff, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: T.onMuted, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>Growth Score<InlineTooltip text="Your overall digital health score out of 100 — based on 10 areas of your online presence." /></p>
                <div style={{ fontFamily: T.ff, fontSize: '3.5rem', fontWeight: 800, color: col, lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  {overallScore}<span style={{ fontSize: '1.2rem', color: `${T.onMuted}66` }}>%</span>
                </div>
                <p style={{ fontSize: 13, color: T.onMuted, marginTop: 6 }}>{biz}</p>
                <p style={{ fontSize: 11, color: `${T.onMuted}88`, marginTop: 2 }}>{input.vertical.replace('_', ' ').toLowerCase()}</p>
              </div>
              <GrowthRing score={overallScore} size={160} />
            </div>
            {revenueLeak.totalPct > 0 && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: T.errorDim, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <div>
                  <span style={{ fontFamily: T.ff, fontSize: 13, fontWeight: 700, color: T.tertiaryC, display: 'flex', alignItems: 'center', gap: 4 }}>{Math.max(revenueLeak.totalPct, 15)}% revenue leak detected<InlineTooltip text="An estimate of the revenue you're missing due to gaps in your online presence — based on industry benchmarks for your business type." /></span>
                  <p style={{ fontSize: 11, color: T.onMuted, margin: '2px 0 0' }}>Daily growth opportunities being lost</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Pillar cards — horizontal scroll */}
        <section style={{ marginBottom: 4 }}>
          <div style={{ padding: '18px 16px 10px' }}><SectionLabel>Performance by Area</SectionLabel></div>
          <div style={{ display: 'flex', overflowX: 'auto', gap: 10, padding: '0 16px 8px', scrollSnapType: 'x mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none' } as React.CSSProperties}>
            {PILLARS.map(p => (
              <PillarCard key={p.id} icon={p.icon} name={p.name} score={pillarScores[p.id] ?? 0} desc={getPillarDesc(p.id)} />
            ))}
          </div>
        </section>

        {/* Insights */}
        {nuggets.length > 0 && (
          <section style={{ padding: '8px 16px' }}>
            <SectionLabel>Top Insights</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {nuggets.map((n, i) => <InsightNugget key={i} type={n.type} title={n.title} body={n.body} />)}
            </div>
          </section>
        )}

        {/* Site signals */}
        <section style={{ padding: '12px 16px' }}>
          <SectionLabel>What We Found On Your Site</SectionLabel>
          <div style={{ background: T.surface, borderRadius: 22, padding: '18px' }}>
            <SignalRow label="Main action button (CTA)"  value={signals.hasCTA}            explain={SIGNAL_EXPLAINERS.hasCTA} />
            <SignalRow label="Online booking"             value={signals.hasBooking}         explain={SIGNAL_EXPLAINERS.hasBooking} />
            <SignalRow label="Secure connection (HTTPS)"  value={signals.hasSSL}             explain={SIGNAL_EXPLAINERS.hasSSL} />
            <SignalRow label="Mobile optimised"           value={signals.isMobileOptimized}  explain={SIGNAL_EXPLAINERS.isMobileOptimized} />
            <SignalRow label="Google Business linked"     value={signals.hasGBP}             explain={SIGNAL_EXPLAINERS.hasGBP} />
            <SignalRow label="Reviews or testimonials"    value={signals.hasReviews}         explain={SIGNAL_EXPLAINERS.hasReviews} />
            <SignalRow label="Prices or packages"         value={signals.hasPricing}         explain={SIGNAL_EXPLAINERS.hasPricing} />
            <SignalRow label="Contact form"               value={signals.hasContactForm}     explain={SIGNAL_EXPLAINERS.hasContactForm} />
            <SignalRow label="Website analytics"          value={signals.hasAnalytics}       explain={SIGNAL_EXPLAINERS.hasAnalytics} />
            <SignalRow label="Word count"                 value={signals.wordCount}          explain={SIGNAL_EXPLAINERS.wordCount} last />
          </div>
        </section>

        {/* 30-day sprint */}
        {roadmap?.['30']?.length > 0 && (
          <section style={{ padding: '12px 16px' }}>
            <SectionLabel>30-Day Sprint</SectionLabel>
            <div style={{ background: T.surface, borderRadius: 22, padding: '18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {roadmap['30'].slice(0, 4).map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, background: T.primaryDim, color: T.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.ff, fontSize: 11, fontWeight: 700 }}>{i + 1}</div>
                  <span style={{ fontSize: 13, color: T.onMuted, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTAs */}
        <section style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => window.location.href = '/dashboard'} style={{ width: '100%', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryCt})`, color: '#003918', fontFamily: T.ff, fontWeight: 800, fontSize: 15, padding: '16px', borderRadius: 16, border: 'none', cursor: 'pointer', boxShadow: `0 8px 32px ${T.primary}30` }}>
            View Detailed Roadmap →
          </button>
          <button onClick={onShare} style={{ width: '100%', background: T.surfaceHi, color: T.onSurface, fontFamily: T.ff, fontWeight: 700, fontSize: 14, padding: '14px', borderRadius: 16, border: '1px solid rgba(59,74,61,0.15)', cursor: 'pointer' }}>
            {copied ? '✓ Link Copied!' : '↑ Share Report'}
          </button>
          <button onClick={onNewAudit} style={{ width: '100%', background: 'transparent', color: T.onMuted, fontFamily: T.ff, fontWeight: 600, fontSize: 13, padding: '10px', borderRadius: 16, border: 'none', cursor: 'pointer' }}>
            ← Run Another Audit
          </button>
        </section>
      </main>

      {/* Bottom nav */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 16px 18px', background: 'rgba(19,19,20,0.88)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(59,74,61,0.15)', borderRadius: '22px 22px 0 0', boxShadow: '0 -24px 48px rgba(0,0,0,0.4)' }}>
        {[
          { icon: '⊞', label: 'Dashboard', action: () => { window.location.href = '/dashboard' } },
          { icon: '◎', label: 'Audit',     action: () => {},                                         active: true },
          { icon: '↗', label: 'Roadmap',   action: () => { window.location.href = '/dashboard' } },
          { icon: '↑', label: 'Share',     action: onShare },
        ].map(tab => (
          <button key={tab.label} onClick={tab.action} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 10px', color: tab.active ? T.primary : T.onMuted }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: tab.active ? T.primaryDim : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{tab.icon}</div>
            <span style={{ fontFamily: T.ffBody, fontSize: 10, fontWeight: 600 }}>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════
function DesktopLayout({
  result, onNewAudit, onShare, copied, nuggets,
}: {
  result: AuditResult; onNewAudit: () => void; onShare: () => void
  copied: boolean; nuggets: { type: NuggetType; title: string; body: string }[]
}) {
  const { pillarScores, overallScore, signals, roadmap, revenueLeak, input, recommendations } = result
  const biz = input.businessName || input.url.replace(/https?:\/\//, '').split('/')[0]
  const col = gradeColor(overallScore)
  const sorted = [...PILLARS].sort((a, b) => (pillarScores[b.id] ?? 0) - (pillarScores[a.id] ?? 0))

  return (
    <div style={{ paddingBottom: 60 }}>
      <main style={{ paddingTop: 76, maxWidth: 1200, margin: '0 auto', padding: '76px 40px 60px' }}>

        {/* Two-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 28, alignItems: 'start' }}>

          {/* ── LEFT SIDEBAR ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Score card */}
            <div style={{ background: T.surface, borderRadius: 28, padding: '32px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -60, right: -60, width: 160, height: 160, background: `${col}15`, borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
              <p style={{ fontFamily: T.ff, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: T.onMuted, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>Growth Score<InlineTooltip text="Your overall digital health score out of 100 — based on 10 areas of your online presence." /></p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <GrowthRing score={overallScore} size={200} />
              </div>
              <div style={{ fontFamily: T.ff, fontSize: 22, fontWeight: 800, color: T.onSurface }}>{biz}</div>
              <div style={{ fontSize: 12, color: T.onMuted, marginTop: 4 }}>{input.vertical.replace('_', ' ').toLowerCase()} · {input.location}</div>
              {revenueLeak.totalPct > 0 && (
                <div style={{ marginTop: 18, padding: '10px 14px', background: T.errorDim, borderRadius: 14, textAlign: 'left' }}>
                  <span style={{ fontFamily: T.ff, fontSize: 13, fontWeight: 700, color: T.tertiaryC, display: 'flex', alignItems: 'center', gap: 4 }}>⚠️ {Math.max(revenueLeak.totalPct, 15)}% revenue leak<InlineTooltip text="An estimate of the revenue you're missing due to gaps in your online presence — based on industry benchmarks for your business type." /></span>
                  <p style={{ fontSize: 11, color: T.onMuted, margin: '3px 0 0' }}>Daily growth opportunities lost</p>
                </div>
              )}
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => window.location.href = '/dashboard'} style={{ width: '100%', background: `linear-gradient(135deg, ${T.primary}, ${T.primaryCt})`, color: '#003918', fontFamily: T.ff, fontWeight: 800, fontSize: 14, padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer', boxShadow: `0 6px 24px ${T.primary}28` }}>
                  View Roadmap →
                </button>
                <button onClick={onShare} style={{ width: '100%', background: T.surfaceHi, color: T.onSurface, fontFamily: T.ff, fontWeight: 700, fontSize: 13, padding: '12px', borderRadius: 14, border: '1px solid rgba(59,74,61,0.15)', cursor: 'pointer' }}>
                  {copied ? '✓ Copied!' : '↑ Share Report'}
                </button>
                <button onClick={onNewAudit} style={{ width: '100%', background: 'transparent', color: T.onMuted, fontFamily: T.ff, fontWeight: 600, fontSize: 12, padding: '10px', borderRadius: 14, border: 'none', cursor: 'pointer' }}>
                  ← New Audit
                </button>
              </div>
            </div>

            {/* Site signals */}
            <div style={{ background: T.surface, borderRadius: 24, padding: '22px' }}>
              <SectionLabel>What We Found</SectionLabel>
              <SignalRow label="CTA / action button"       value={signals.hasCTA}            explain={SIGNAL_EXPLAINERS.hasCTA} />
              <SignalRow label="Online booking"            value={signals.hasBooking}         explain={SIGNAL_EXPLAINERS.hasBooking} />
              <SignalRow label="HTTPS secure"              value={signals.hasSSL}             explain={SIGNAL_EXPLAINERS.hasSSL} />
              <SignalRow label="Mobile optimised"          value={signals.isMobileOptimized}  explain={SIGNAL_EXPLAINERS.isMobileOptimized} />
              <SignalRow label="Google Business"           value={signals.hasGBP}             explain={SIGNAL_EXPLAINERS.hasGBP} />
              <SignalRow label="Reviews"                   value={signals.hasReviews}         explain={SIGNAL_EXPLAINERS.hasReviews} />
              <SignalRow label="Pricing visible"           value={signals.hasPricing}         explain={SIGNAL_EXPLAINERS.hasPricing} />
              <SignalRow label="Contact form"              value={signals.hasContactForm}     explain={SIGNAL_EXPLAINERS.hasContactForm} />
              <SignalRow label="Analytics"                 value={signals.hasAnalytics}       explain={SIGNAL_EXPLAINERS.hasAnalytics} />
              <SignalRow label="Word count"                value={signals.wordCount}          explain={SIGNAL_EXPLAINERS.wordCount} last />
            </div>
          </div>

          {/* ── RIGHT MAIN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Pillar breakdown — vertical bars on desktop */}
            <div style={{ background: T.surface, borderRadius: 28, padding: '28px' }}>
              <SectionLabel>Performance by Area</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {sorted.map(p => (
                  <PillarBar key={p.id} icon={p.icon} name={p.name} score={pillarScores[p.id] ?? 0} desc={PILLAR_EXPLAINERS[p.id]} />
                ))}
              </div>
            </div>

            {/* Insights — 2-col grid on desktop */}
            {nuggets.length > 0 && (
              <div style={{ background: T.surface, borderRadius: 28, padding: '28px' }}>
                <SectionLabel>Top Insights</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {nuggets.map((n, i) => <InsightNugget key={i} type={n.type} title={n.title} body={n.body} />)}
                </div>
              </div>
            )}

            {/* 30/60/90 roadmap — 3 columns on desktop */}
            {roadmap?.['30']?.length > 0 && (
              <div style={{ background: T.surface, borderRadius: 28, padding: '28px' }}>
                <SectionLabel>Growth Roadmap</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {(['30', '60', '90'] as const).map((ph, idx) => {
                    const phCol = idx === 0 ? T.primary : idx === 1 ? T.secondary : T.tertiaryC
                    return (
                      <div key={ph} style={{ background: T.surfaceHi, borderRadius: 18, padding: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${phCol}18`, color: phCol, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T.ff, fontSize: 10, fontWeight: 800 }}>{ph}d</div>
                          <span style={{ fontFamily: T.ff, fontSize: 13, fontWeight: 700, color: phCol }}>{ph}-Day Sprint</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {roadmap[ph].slice(0, 4).map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                              <span style={{ color: phCol, flexShrink: 0, fontSize: 12, marginTop: 2 }}>→</span>
                              <span style={{ fontSize: 12, color: T.onMuted, lineHeight: 1.5 }}>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quick wins */}
            {recommendations.quick_wins.length > 0 && (
              <div style={{ background: T.surface, borderRadius: 28, padding: '28px' }}>
                <SectionLabel>Quick Wins</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {recommendations.quick_wins.slice(0, 4).map((rec, i) => (
                    <div key={i} style={{ background: T.surfaceHi, borderRadius: 16, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: T.primaryDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{rec.icon}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: T.ff, marginBottom: 3 }}>{rec.title}</div>
                        <div style={{ fontSize: 12, color: T.onMuted, lineHeight: 1.5 }}>{rec.desc}</div>
                        <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: T.errorDim, color: T.tertiaryC, fontFamily: T.ffBody, fontWeight: 700 }}>Impact: {rec.impact}</span>
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: T.primaryDim, color: T.primary, fontFamily: T.ffBody, fontWeight: 700 }}>Effort: {rec.effort}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function ResultsView({
  result, onNewAudit,
}: {
  result: AuditResult
  onNewAudit: () => void
}) {
  const isMobile = useIsMobile()
  const { getToken } = useAuth()
  const [copied, setCopied] = useState(false)
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  const { pillarScores, overallScore, recommendations, input } = result
  const biz = input.businessName || input.url.replace(/https?:\/\//, '').split('/')[0]

  const handleShare = async () => {
    // If we already have the link, just copy it again
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return
    }

    if (!result.auditId) return

    try {
      const token = await getToken()
      const apiBase = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${apiBase}/api/report/${result.auditId}/share`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Share failed')
      const data = await res.json()
      const url: string = data.share_url
      setShareUrl(url)
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Silent fail — don't break the UI
    }
  }

  const getPillarDesc = (id: string) => {
    const all = [...recommendations.quick_wins, ...recommendations.high_impact, ...recommendations.revenue_leaks]
    return all.find(r => r.pillar === id)?.desc || 'See recommendations below.'
  }

  const sorted = [...PILLARS].sort((a, b) => (pillarScores[b.id] ?? 0) - (pillarScores[a.id] ?? 0))

  const nuggets = [
    ...recommendations.revenue_leaks.slice(0, 2).map(r => ({ type: 'leak' as NuggetType, title: r.title, body: r.desc })),
    ...recommendations.quick_wins.slice(0, 2).map(r => ({ type: 'opportunity' as NuggetType, title: r.title, body: r.desc })),
    ...sorted.slice(0, 1).map(p => ({ type: 'win' as NuggetType, title: `${p.name} is a strength`, body: `Score ${pillarScores[p.id] ?? 0}/100 — outperforming most similar businesses in this area.` })),
  ].slice(0, 6)

  const baseProps = { result, onNewAudit, onShare: handleShare, copied, nuggets }

  return (
    <div style={{ background: T.bg, minHeight: '100vh', color: T.onSurface, fontFamily: T.ffBody }}>
      <TopBar biz={biz} onNewAudit={onNewAudit} onShare={handleShare} copied={copied} />
      {isMobile
        ? <MobileLayout {...baseProps} getPillarDesc={getPillarDesc} />
        : <DesktopLayout {...baseProps} />
      }
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
