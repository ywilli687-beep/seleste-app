'use client'
import { useEffect, useRef, useState } from 'react'
import type { AuditResult } from '@/types/audit'
import { PILLARS } from '@/lib/constants'
import { WaitlistModal } from '@/components/ui/WaitlistModal'

// ── Colour palette ────────────────────────────────────────────────────────────
const C = {
  bg:       '#111111',
  card:     '#1c1c1c',
  cardBdr:  '#2a2a2a',
  yellow:   '#F5C418',
  yellowDim:'rgba(245,196,24,0.12)',
  green:    '#22c55e',
  greenDim: 'rgba(34,197,94,0.12)',
  red:      '#ef4444',
  muted:    '#888',
  text:     '#ffffff',
  textSoft: '#cccccc',
  locked:   '#555',
}

// ── Quest ring ────────────────────────────────────────────────────────────────
function QuestRing({ pct }: { pct: number }) {
  const ref = useRef<SVGCircleElement>(null)
  const r = 90, circ = 2 * Math.PI * r

  useEffect(() => {
    if (!ref.current) return
    ref.current.style.strokeDashoffset = String(circ * (1 - pct / 100))
  }, [pct, circ])

  return (
    <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto' }}>
      <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="110" cy="110" r={r} fill="none" stroke="#2a2a2a" strokeWidth="14" />
        <circle
          ref={ref}
          cx="110" cy="110" r={r}
          fill="none"
          stroke={C.yellow}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={String(circ)}
          strokeDashoffset={String(circ)}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontFamily: 'var(--ff-display)', fontSize: '3.2rem', fontWeight: 800, color: C.yellow, lineHeight: 1 }}>
          {pct}%
        </div>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: '0.12em', marginTop: 4 }}>COMPLETE</div>
      </div>
    </div>
  )
}

// ── Badge card ────────────────────────────────────────────────────────────────
function AchievementBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.cardBdr}`,
      borderRadius: 14, padding: '16px 14px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      minWidth: 90, flexShrink: 0,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: C.greenDim, border: `1px solid ${C.green}33`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22,
      }}>{icon}</div>
      <div style={{ fontSize: 11, color: C.textSoft, textAlign: 'center', fontWeight: 600, lineHeight: 1.3 }}>{label}</div>
    </div>
  )
}

// ── Mission card ──────────────────────────────────────────────────────────────
type MissionStatus = 'achieved' | 'active' | 'locked'

function MissionCard({
  num, title, desc, status, unlockHint, onContinue, score,
}: {
  num: number; title: string; desc: string; status: MissionStatus
  unlockHint?: string; onContinue?: () => void; score?: number
}) {
  const isAchieved = status === 'achieved'
  const isActive   = status === 'active'
  const isLocked   = status === 'locked'

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${isActive ? C.yellow + '44' : C.cardBdr}`,
      borderRadius: 16, padding: '18px 20px',
      opacity: isLocked ? 0.6 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        {/* Icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: isAchieved ? C.greenDim : isActive ? C.yellowDim : '#2a2a2a',
          border: `1px solid ${isAchieved ? C.green + '44' : isActive ? C.yellow + '44' : '#333'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>
          {isAchieved ? '✅' : isActive ? '🎯' : '🔒'}
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: isLocked ? C.muted : C.text }}>
              Mission {num}: {title}
            </div>
            {isActive && (
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                background: C.yellow, color: '#111', borderRadius: 6,
                padding: '2px 8px',
              }}>IN PROGRESS</span>
            )}
            {isAchieved && (
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                background: C.greenDim, color: C.green, borderRadius: 6,
                padding: '2px 8px', border: `1px solid ${C.green}44`,
              }}>✓ ACHIEVED</span>
            )}
            {isLocked && (
              <span style={{ fontSize: 11, color: C.locked, fontWeight: 600 }}>LOCKED</span>
            )}
          </div>

          <div style={{ fontSize: 13, color: isLocked ? C.locked : C.muted, lineHeight: 1.5 }}>
            {isLocked && unlockHint ? unlockHint : desc}
          </div>

          {/* Score bar for active */}
          {isActive && score !== undefined && (
            <div style={{ marginTop: 12 }}>
              <div style={{ height: 5, background: '#2a2a2a', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${score}%`, background: C.yellow, borderRadius: 99, transition: 'width 1.2s ease' }} />
              </div>
            </div>
          )}

          {isAchieved && (
            <div style={{ marginTop: 10, fontSize: 12, color: C.green, fontWeight: 600 }}>
              Claim Your Win
            </div>
          )}
        </div>
      </div>

      {isActive && (
        <button
          onClick={onContinue}
          style={{
            marginTop: 16, width: '100%',
            background: C.yellow, color: '#111',
            border: 'none', borderRadius: 12,
            padding: '14px', fontSize: 15, fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Continue Mission
        </button>
      )}
    </div>
  )
}

// ── Bottom nav ────────────────────────────────────────────────────────────────
function BottomNav({ active, onNewAudit, shareUrl }: { active: string; onNewAudit: () => void; shareUrl: string | null }) {
  const tabs = [
    { id: 'missions', icon: '🎯', label: 'Missions' },
    { id: 'share',    icon: '🔗', label: 'Share' },
    { id: 'new',      icon: '＋', label: 'New Audit' },
    { id: 'profile',  icon: '👤', label: 'Profile' },
  ]

  const handleTab = (id: string) => {
    if (id === 'new') { onNewAudit(); return }
    if (id === 'share' && shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      return
    }
    if (id === 'profile') { window.location.href = '/dashboard' }
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#1a1a1a', borderTop: '1px solid #2a2a2a',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '10px 0 16px', zIndex: 1000,
    }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => handleTab(t.id)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '4px 16px',
          }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: t.id === active ? C.yellowDim : 'transparent',
            border: t.id === active ? `1px solid ${C.yellow}44` : '1px solid transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>{t.icon}</div>
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: t.id === active ? C.yellow : C.muted,
          }}>{t.label}</span>
        </button>
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ResultsView({
  result,
  onNewAudit,
}: {
  result: AuditResult
  onNewAudit: () => void
}) {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const {
    pillarScores: areaScores, overallScore,
    recommendations, signals: growthMarkers,
    input, roadmap,
  } = result

  const biz = input.businessName || input.url.replace(/https?:\/\//, '').split('/')[0]
  const shareUrl = result.auditId ? `${window.location.origin}/results/${result.auditId}` : null

  // Sort pillars: best first
  const sorted = [...PILLARS].sort((a, b) => (areaScores[b.id] ?? 0) - (areaScores[a.id] ?? 0))

  // Achievements: pillars scoring ≥ 65
  const achieved = sorted.filter(p => (areaScores[p.id] ?? 0) >= 65)

  // Missions: pillars below 65, worst last
  const needsWork = sorted.filter(p => (areaScores[p.id] ?? 0) < 65).reverse()

  // Active mission = worst pillar
  const activeMission = needsWork[0] ?? null
  const lockedMissions = needsWork.slice(1)

  // Level system
  const level = Math.floor(overallScore / 10) + 1
  const missionsToMax = needsWork.length

  // Get a useful description from recommendations
  const getDesc = (pillarId: string) => {
    const recs = [
      ...recommendations.quick_wins,
      ...recommendations.high_impact,
      ...recommendations.revenue_leaks,
    ].filter(r => r.pillar === pillarId)
    return recs[0]?.desc || `Improve your ${pillarId} score to unlock growth.`
  }

  const handleCopyShare = () => {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: 'var(--ff-sans)', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 20px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 20 }}>📊</div>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.yellow }}>Quest Progress</span>
        </div>
        <div style={{ fontSize: 20 }}>🏆</div>
      </div>

      {/* Ring + Title */}
      <div style={{ textAlign: 'center', padding: '28px 20px 16px' }}>
        <QuestRing pct={overallScore} />

        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '20px 0 6px', color: C.text }}>
          {biz}
        </h1>
        <p style={{ fontSize: 15, color: C.muted, margin: 0 }}>
          {missionsToMax > 0
            ? `${missionsToMax} More Mission${missionsToMax !== 1 ? 's' : ''} to 100.`
            : 'All missions complete! 🎉'}
        </p>
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 8 }}>
          <span style={{ background: C.yellowDim, border: `1px solid ${C.yellow}44`, color: C.yellow, fontSize: 11, fontWeight: 700, borderRadius: 99, padding: '3px 12px' }}>
            Level {level}
          </span>
          <span style={{ background: '#1c1c1c', border: '1px solid #2a2a2a', color: C.muted, fontSize: 11, borderRadius: 99, padding: '3px 12px' }}>
            {input.vertical.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Recent Achievements */}
      {achieved.length > 0 && (
        <div style={{ padding: '0 20px 8px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', marginBottom: 12 }}>
            RECENT ACHIEVEMENTS
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {achieved.map(p => (
              <AchievementBadge key={p.id} icon={p.icon} label={p.name} />
            ))}
            {growthMarkers.isMobileOptimized && (
              <AchievementBadge icon="📱" label="Mobile Master" />
            )}
            {growthMarkers.hasSSL && (
              <AchievementBadge icon="🔒" label="SSL Secured" />
            )}
          </div>
        </div>
      )}

      {/* Missions */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', marginBottom: 4 }}>
          ACTIVE MISSIONS
        </div>

        {/* Active mission */}
        {activeMission && (
          <MissionCard
            num={1}
            title={`Boost ${activeMission.name}`}
            desc={getDesc(activeMission.id)}
            status="active"
            score={areaScores[activeMission.id] ?? 0}
            onContinue={() => {
              const el = document.getElementById('mission-detail')
              el?.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        )}

        {/* Locked missions */}
        {lockedMissions.slice(0, 2).map((p, i) => (
          <MissionCard
            key={p.id}
            num={i + 2}
            title={`Level Up ${p.name}`}
            desc={getDesc(p.id)}
            status="locked"
            unlockHint={`Unlock by completing Mission ${i + 1}.`}
          />
        ))}

        {/* Achieved missions */}
        {achieved.slice(0, 2).map((p, i) => (
          <MissionCard
            key={p.id}
            num={lockedMissions.length + i + 2}
            title={`${p.name} Excellence`}
            desc={`Score: ${areaScores[p.id]}/100 — well above the benchmark.`}
            status="achieved"
          />
        ))}

        {/* Start next mission CTA */}
        {needsWork.length > 0 && (
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              marginTop: 4,
              width: '100%',
              background: C.yellow, color: '#111',
              border: 'none', borderRadius: 14,
              padding: '16px', fontSize: 16, fontWeight: 800,
              cursor: 'pointer', letterSpacing: '0.02em',
            }}
          >
            START NEXT MISSION →
          </button>
        )}

        {/* Share */}
        {shareUrl && (
          <button
            onClick={handleCopyShare}
            style={{
              width: '100%',
              background: 'transparent', color: copied ? C.green : C.muted,
              border: `1px solid ${copied ? C.green : '#2a2a2a'}`, borderRadius: 14,
              padding: '14px', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Link Copied!' : '🔗 Share Your Results'}
          </button>
        )}
      </div>

      {/* Mission detail — top issues */}
      {activeMission && recommendations.quick_wins.length > 0 && (
        <div id="mission-detail" style={{ padding: '0 20px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', marginBottom: 12 }}>
            QUICK WINS — START HERE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recommendations.quick_wins.slice(0, 3).map((rec, i) => (
              <div key={i} style={{
                background: C.card, border: `1px solid ${C.cardBdr}`,
                borderRadius: 14, padding: '16px',
                display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: C.yellowDim, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 18,
                }}>{rec.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{rec.title}</div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{rec.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roadmap preview */}
      {roadmap?.['30']?.length > 0 && (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', marginBottom: 12 }}>
            30-DAY SPRINT
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.cardBdr}`, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {roadmap['30'].slice(0, 3).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: C.yellow, flexShrink: 0, fontSize: 14 }}>→</span>
                <span style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <BottomNav active="missions" onNewAudit={onNewAudit} shareUrl={shareUrl} />

      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
        source="results_cta_bar"
        score={overallScore}
        vertical={input.vertical}
      />
    </div>
  )
}
