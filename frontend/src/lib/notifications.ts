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
  const notif = { ...event, id: Math.random().toString(36).substring(2, 11) }
  listeners.forEach(l => l(notif))
}

export const subscribeToNotifications = (handler: NotifListener) => {
  listeners.add(handler)
  return () => {
    listeners.delete(handler)
  }
}
