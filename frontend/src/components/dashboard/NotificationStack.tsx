import React, { useEffect, useState } from 'react'
import { NotifEvent, subscribeToNotifications } from '@/lib/notifications'

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

    return subscribeToNotifications(handler)
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
