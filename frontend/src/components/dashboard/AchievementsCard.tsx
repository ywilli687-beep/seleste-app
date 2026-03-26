import React, { useEffect, useState } from 'react'
import { triggerNotification } from './NotificationStack'

interface Achievement {
  id: string
  name: string
  earned: boolean
  earnedAt?: string
  lockedLabel: string
  chipColor: string
}

interface Props {
  achievements: Achievement[]
  newlyEarnedIds: string[]
}

export function AchievementsCard({ achievements, newlyEarnedIds }: Props) {
  const [pulsingIds, setPulsingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const set = new Set<string>()
    newlyEarnedIds.forEach((id, idx) => {
      if (!localStorage.getItem(`seleste_ach_${id}`)) {
        set.add(id)
        localStorage.setItem(`seleste_ach_${id}`, '1')
        
        // Trigger notification staggered by 600ms
        const ach = achievements.find(a => a.id === id)
        if (ach) {
          setTimeout(() => {
            triggerNotification({
              type: 'achievementEarned',
              title: 'Achievement unlocked',
              body: ach.name,
              duration: 8000
            })
          }, 800 + idx * 600)
        }
      }
    })
    setPulsingIds(set)
  }, [newlyEarnedIds, achievements])

  const earnedCount = achievements.filter(a => a.earned).length
  const allEarned = earnedCount === achievements.length
  const display = achievements.slice(0, 8)

  return (
    <div className="card-v2" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 className="text-h2" style={{ marginBottom: 16 }}>Achievements</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24, flex: 1, alignContent: 'start' }}>
        {display.map(a => {
          const isPulse = pulsingIds.has(a.id)
          
          if (!a.earned) {
            return (
              <div key={a.id} title={a.lockedLabel} style={{ 
                opacity: 0.4, filter: 'grayscale(1)', border: '1px dashed var(--border2)',
                borderRadius: 8, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', fontSize: 11, fontWeight: 600, padding: 8
              }}>
                ?
              </div>
            )
          }

          return (
            <div key={a.id} title={`Earned: ${a.earnedAt ? new Date(a.earnedAt).toLocaleDateString() : 'Yes'}`} style={{ 
              background: `var(--panel-hover)`, border: `1px solid var(--border)`,
              borderRadius: 8, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', fontSize: 11, fontWeight: 600, padding: 4,
              boxShadow: isPulse ? '0 0 12px var(--green)' : 'none',
              animation: isPulse ? 'skeleton-pulse 2s infinite' : 'none'
            }}>
              <span className={`chip ${a.chipColor}`} style={{ fontSize: 10, whiteSpace: 'nowrap' }}>{a.name}</span>
            </div>
          )
        })}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 'auto' }}>
        {allEarned ? (
           <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--amber)' }}>🏆 All achievements unlocked. You're a Seleste Champion.</span>
        ) : (
           <span className="section-link">{earnedCount} of {achievements.length} earned</span>
        )}
      </div>
    </div>
  )
}
