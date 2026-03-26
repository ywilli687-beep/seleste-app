import React, { useEffect, useState } from 'react'

export type NotifType = 'newAuditStarted' | 'quickWinClicked' | 'roadmapItemClicked' | 'achievementEarned' | 'gradeUpgraded' | 'streakMilestone'

export interface NotifEvent {
  id: string
  type: NotifType
  title: string
  body: string
  duration: number
}

// Global emitter so any component can trigger notifications
type NotifListener = (event: NotifEvent) => void
const listeners = new Set<NotifListener>()

export const triggerNotification = (event: Omit<NotifEvent, 'id'>) => {
  const notif = { ...event, id: Math.random().toString(36).substr(2, 9) }
  listeners.forEach(l => l(notif))
}

export function NotificationStack() {
  const [notifs, setNotifs] = useState<NotifEvent[]>([])

  useEffect(() => {
    const handler = (notif: NotifEvent) => {
      setNotifs(prev => {
        const next = [...prev, notif]
        if (next.length > 3) return next.slice(next.length - 3) // Max 3 visible
        return next
      })

      setTimeout(() => {
        setNotifs(prev => prev.filter(n => n.id !== notif.id))
      }, notif.duration)
    }

    listeners.add(handler)
    return () => { listeners.delete(handler) }
  }, [])

  return (
    <div className="notif-stack" style={{ position: 'fixed', top: 70, right: 24, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      {notifs.map(n => (
        <div key={n.id} className="notif" onClick={() => setNotifs(p => p.filter(x => x.id !== n.id))} 
             style={{ 
               pointerEvents: 'all', width: 300, background: 'var(--dark)', 
               borderLeft: '3px solid var(--green2)', borderRadius: 10, padding: '12px 16px', 
               boxShadow: '0 8px 32px rgba(0,0,0,0.3)', animation: 'fadeUp 0.3s ease',
               color: 'white', display: 'flex', flexDirection: 'column', cursor: 'pointer'
             }}>
          <span style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{n.title}</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{n.body}</span>
        </div>
      ))}
    </div>
  )
}
