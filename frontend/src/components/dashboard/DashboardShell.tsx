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
        <div className="logo-container">
          <span className="logo-text">Seleste</span>
          <span className="logo-version">V2.1</span>
        </div>
        
        <nav className="nav-group">
          <div className="nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Command Center
          </div>
          
          <div className="nav-item" onClick={() => window.location.href = '/dashboard/agents'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            AI Specialists
          </div>

          <div className="nav-item" onClick={() => window.location.href = '/history'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            Audit History
          </div>
          
          <div className="nav-item" onClick={handleAuditNavigation}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
            </svg>
            Run New Audit
          </div>
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
