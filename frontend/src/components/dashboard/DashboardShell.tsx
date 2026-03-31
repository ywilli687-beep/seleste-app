import React from 'react'
import type { DashboardData } from '../../types/dashboard'
import { StatCards } from './StatCards'
import { QuickWin } from './QuickWin'
import { PillarCard } from './PillarCard'
import { RoadmapCard } from './RoadmapCard'
import { StreakCard } from './StreakCard'
import { AchievementsCard } from './AchievementsCard'
import { CompetitorCard } from './CompetitorCard'
import { MarketStrip } from './MarketStrip'
import { NotificationStack } from './NotificationStack'
import { TrendChart } from './TrendChart'
import { ScoreBreakdown } from './ScoreBreakdown'

interface Props {
  data: DashboardData
  children?: React.ReactNode
}

export function DashboardShell({ data, children }: Props) {
  const isFirstAudit = data?.totalAudits === 1
  const isStale = (data?.daysSinceAudit ?? 0) > 30

  const handleAuditNavigation = () => {
    window.location.href = '/' // Quick way back to index for audit
  }

  return (
    <div className="grid-shell">
      <div className="sidebar">
        <div style={{ marginBottom: 48, fontWeight: 700, fontSize: 22, color: 'var(--accent)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
          Seleste <span style={{ padding: '2px 6px', background: 'var(--adim)', color: 'var(--accent2)', fontSize: '10px', borderRadius: 4, fontFamily: 'var(--ff-mono)', letterSpacing: '0.05em' }}>V2.1</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ padding: '12px 16px', background: 'var(--adim)', color: 'var(--accent)', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Command Center</div>
          <div style={{ padding: '12px 16px', color: 'var(--text3)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }} onClick={() => window.location.href = '/history'}>Audit History</div>
          <div style={{ padding: '12px 16px', color: 'var(--text3)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }} onClick={handleAuditNavigation}>Run New Audit</div>
        </nav>
      </div>
      
      <div className="main-content">
        <NotificationStack />
        
        <header style={{ padding: '40px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 className="text-h1" style={{ fontSize: 28, marginBottom: 8, letterSpacing: '-0.02em' }}>
              {data?.businessName ? `${data.businessName} Command Center` : 'Growth Command Center'}
            </h1>
            <p className="text-body" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>Welcome back. Here is your growth intelligence overview.</span>
              <span style={{ fontSize: 11, background: 'var(--border)', padding: '2px 8px', borderRadius: 6, color: 'var(--ink)', fontWeight: 600 }}>
                MY BUSINESSES: {data?.myBusinessesCount ?? 0}
              </span>
            </p>
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {children ? (
            children
          ) : (
            <>
              {/* Top: Quick Win */}
              {data?.quickWin && (
                <QuickWin {...data.quickWin} />
              )}

              {/* Middle: Stats */}
              <StatCards 
                score={data?.overallScore ?? 0}
                delta={data?.scoreDelta}
                revenueLeak={data?.revenueLeakMonthly}
                levelName={data?.levelName ?? 'Visibility Builder'}
                xpTotal={data?.xpTotal ?? 0}
                xpToNext={data?.xpToNextLevel ?? 0}
              />

              {/* Bottom: Roadmap & Breakdown & History */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <RoadmapCard 
                    roadmap={data?.roadmap ?? []} 
                    roadmapDurationWeeks={data?.roadmapDurationWeeks ?? '2-3'} 
                    grade={data?.grade ?? 'D'} 
                  />
                  
                  {/* Audit History Card */}
                  <div className="card-v2">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <h3 className="text-h2">Recent Reports</h3>
                      <span className="text-small" style={{ cursor: 'pointer', color: 'var(--blue)' }} onClick={() => window.location.href = '/history'}>View All</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {data?.recentAudits?.length === 0 ? (
                        <div className="text-body" style={{ color: 'var(--ink-muted)' }}>No reports found. Run your first audit to see history.</div>
                      ) : (
                        data?.recentAudits?.map((audit) => (
                          <div 
                            key={audit.id} 
                            onClick={() => window.location.href = `/report/${audit.id}`}
                            style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center', 
                              padding: '12px 14px', 
                              background: 'var(--page-bg)', 
                              borderRadius: 'var(--rs)', 
                              cursor: 'pointer',
                              border: '1px solid var(--border)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--ink-muted)')}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>{audit.version}</div>
                                <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{new Date(audit.createdAt).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>{audit.overallScore}</div>
                                <div style={{ fontSize: 10, color: 'var(--ink-muted)' }}>pts</div>
                              </div>
                              <span style={{ color: '#000', fontWeight: 600, fontSize: 13 }}>View →</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <ScoreBreakdown pillars={data?.pillars ?? []} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
