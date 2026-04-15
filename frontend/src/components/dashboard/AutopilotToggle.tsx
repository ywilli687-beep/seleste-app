import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { apiPost } from '../../lib/api'

interface AutopilotToggleProps {
  businessId:      string
  crawlerEnrolled: boolean
  nextCrawlAt:     string | null
  intervalDays?:   number
}

export function AutopilotToggle({ businessId, crawlerEnrolled, nextCrawlAt, intervalDays = 7 }: AutopilotToggleProps) {
  const { getToken } = useAuth()
  const queryClient  = useQueryClient()

  const enroll = useMutation({
    mutationFn: async () => { const token = await getToken(); return apiPost(`/api/business/${businessId}/enroll-crawler`, token!, { intervalDays }) },
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['business-state', businessId] }),
  })

  const unenroll = useMutation({
    mutationFn: async () => {
      const token = await getToken()
      const res   = await fetch(`${import.meta.env.VITE_API_URL ?? ''}/api/business/${businessId}/enroll-crawler`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to unenroll')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['business-state', businessId] }),
  })

  const isPending = enroll.isPending || unenroll.isPending
  const nextDate  = nextCrawlAt ? new Date(nextCrawlAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null

  return (
    <div className="autopilot-toggle">
      <div className="autopilot-toggle__header">
        <div className="autopilot-toggle__left">
          <div className="autopilot-toggle__title">Autopilot</div>
          <div className="autopilot-toggle__sub">
            {crawlerEnrolled ? `Weekly crawl active${nextDate ? ` · next ${nextDate}` : ''}` : 'Manual audits only'}
          </div>
        </div>
        <button
          className={`autopilot-btn ${crawlerEnrolled ? 'autopilot-btn--on' : 'autopilot-btn--off'}`}
          onClick={() => crawlerEnrolled ? unenroll.mutate() : enroll.mutate()}
          disabled={isPending}
        >
          {isPending ? '...' : crawlerEnrolled ? 'On' : 'Off'}
        </button>
      </div>
      {crawlerEnrolled && (
        <div className="autopilot-toggle__detail">Seleste re-audits weekly and auto-populates your inbox.</div>
      )}
    </div>
  )
}
