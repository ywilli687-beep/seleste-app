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

interface Props {
  data: DashboardData
}

export function DashboardShell({ data }: Props) {
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
          {data.quickWin && (
            <QuickWin {...data.quickWin} />
          )}

          <StatCards 
            score={data.overallScore} 
            delta={data.scoreDelta} 
            revenueLeak={data.revenueLeakMonthly}
            levelName={data.levelName}
            xpTotal={data.xpTotal}
            xpToNext={data.xpToNextLevel}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 4fr)', gap: 24 }}>
            <RoadmapCard 
              roadmap={data.roadmap} 
              roadmapDurationWeeks={data.roadmapDurationWeeks} 
              grade={data.grade} 
            />
            <PillarCard pillars={data.pillars} />
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
             <div style={{ marginTop: 24 }}>
               <CompetitorCard 
                 userScore={data.overallScore}
                 competitors={data.competitorScores}
                 gap={data.competitorGap}
                 isFirstAudit={isFirstAudit}
               />
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
