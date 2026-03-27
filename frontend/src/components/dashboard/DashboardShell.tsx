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
  const isFirstAudit = data.totalAudits === 1
  const isStale = data.daysSinceAudit > 30

  const handleAuditNavigation = () => {
    window.location.href = '/' // Quick way back to index for audit
  }

  return (
    <div className="grid-shell">
      <div className="sidebar">
        <div style={{ marginBottom: 40, fontWeight: 700, fontSize: 20, color: 'var(--accent)' }}>Seleste <span style={{ color: 'rgba(244,241,236,0.55)', fontSize: '.65rem', fontFamily: 'var(--ff-mono)', marginLeft: 8 }}>V2</span></div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: 'var(--green2)', fontWeight: 600, cursor: 'pointer' }}>Command Center</div>
          <div style={{ color: 'rgba(244,241,236,0.55)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }} onClick={() => window.location.href = '/history'}>Audit History</div>
          <div style={{ color: 'rgba(244,241,236,0.55)', cursor: 'pointer', fontSize: 14, fontWeight: 500 }} onClick={handleAuditNavigation}>Run New Audit</div>
        </nav>
      </div>
      
      <div className="main-content">
        <NotificationStack />
        
        <header style={{ padding: '40px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 className="text-h1" style={{ fontSize: 28, marginBottom: 8 }}>
              {data.businessName ? `${data.businessName} Command Center` : 'Growth Command Center'}
            </h1>
            <p className="text-body" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>Welcome back. Here is your growth intelligence overview.</span>
              <span style={{ fontSize: 11, background: 'var(--bg3)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 99, color: 'var(--text3)', fontFamily: 'var(--ff-mono)' }}>
                MY BUSINESSES: {data.myBusinessesCount}
              </span>
            </p>
          </div>
          {isStale && (
            <div className="chip chip-amber" style={{ padding: '8px 16px', fontSize: 13, cursor: 'pointer' }} onClick={handleAuditNavigation}>
              Data is {data.daysSinceAudit} days old. Run a new audit.
            </div>
          )}
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {children ? (
            children
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ padding: 32, background: 'var(--bg2)', borderRadius: 'var(--r)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                    <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Score</div>
                    <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1, color: 'var(--text1)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline', gap: 12 }}>
                      {data.overallScore}
                      <span style={{ fontSize: 24, fontWeight: 500, color: 'var(--text3)' }}>/100</span>
                    </div>
                    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ padding: '4px 10px', background: 'var(--bg1)', borderRadius: 20, fontSize: 12, fontWeight: 600, color: 'var(--accent)', border: '1px solid var(--border)' }}>
                        Grade {data.grade}
                      </div>
                      {data.scoreDelta !== null && (
                        <div style={{ fontSize: 13, color: data.scoreDelta >= 0 ? 'var(--accent)' : '#ff5a5f', fontWeight: 600 }}>
                          {data.scoreDelta >= 0 ? '↑' : '↓'} {Math.abs(data.scoreDelta)} pts
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                   <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text3)', textTransform: 'uppercase' }}>Performance Trajectory</h3>
                   <TrendChart data={data.chartData} />
                </div>
              </div>

              <ScoreBreakdown pillars={data.pillars} />

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 4fr)', gap: 24 }}>
                <RoadmapCard 
                  roadmap={data.roadmap} 
                  roadmapDurationWeeks={data.roadmapDurationWeeks} 
                  grade={data.grade} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {data.quickWin && (
                    <QuickWin {...data.quickWin} />
                  )}
                  <div style={{ padding: 24, background: 'var(--bg2)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: 'var(--text1)' }}>Audit History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {data.recentAudits.map((audit) => (
                        <div 
                          key={audit.id} 
                          onClick={() => window.location.href = `/report/${audit.id}`}
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            padding: '12px 14px', 
                            background: 'var(--bg3)', 
                            borderRadius: 'var(--rs)', 
                            cursor: 'pointer',
                            border: '1px solid transparent',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600 }}>{audit.version}</div>
                              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date(audit.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>{audit.overallScore}</div>
                            <div style={{ fontSize: 10, color: 'var(--text3)' }}>pts</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24 }}>
                <StreakCard 
                  streakHistory={data.streakHistory}
                  streakDays={data.streakDays}
                  streakPtsThisMonth={data.streakPtsThisMonth}
                  totalAudits={data.totalAudits}
                />
                <AchievementsCard 
                  achievements={data.achievements}
                  newlyEarnedIds={data.newlyEarnedAchievementIds}
                />
              </div>

              <div>
                <h2 className="text-h2" style={{ marginBottom: 16, marginTop: 16 }}>Market Intelligence</h2>
                <MarketStrip 
                  verticalMedianScore={data.verticalMedianScore}
                  bookingAdoptionRate={data.bookingAdoptionRate}
                  topGap={data.topGap}
                  avgMonthlyImprovement={data.avgMonthlyImprovement}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
                  <CompetitorCard 
                    userScore={data.overallScore}
                    competitors={data.competitorScores}
                    gap={data.competitorGap}
                    isFirstAudit={isFirstAudit}
                  />
                  <div style={{ padding: 24, background: 'var(--bg2)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue Opportunity</h3>
                    <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent)' }}>
                      ${data.revenueLeakMonthly?.toLocaleString() || '0'}
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text3)', marginLeft: 8 }}>lost per month</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 12, lineHeight: 1.5 }}>
                      This represents the estimated revenue bleeding from conversion gaps, trust deficits, and technical friction identified in your latest audit.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
