import { useApproveTask } from '../../lib/hooks/useDashboard'
import { estimateRevenue, formatRevenueRange } from '../../lib/revenue'

interface StickyBannerProps { tasks: any[]; businessId: string; industry: string }

export function StickyBanner({ tasks, businessId, industry }: StickyBannerProps) {
  const approve = useApproveTask(businessId)
  const topTask = tasks.filter((t) => t.status === 'PENDING').sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))[0]
  if (!topTask) return null
  const est = estimateRevenue(topTask.pillar, topTask.estimatedImpact ?? 30, industry)

  return (
    <div className="sticky-banner">
      <div className="sticky-banner__left">
        <span className="sticky-banner__label">Top priority</span>
        <span className="sticky-banner__title">{topTask.title}</span>
        <span className="sticky-banner__impact">{formatRevenueRange(est)} opportunity</span>
      </div>
      <button
        className="btn btn--command btn--sm"
        onClick={() => approve.mutate(topTask.taskId)}
        disabled={approve.isPending}
      >
        {topTask.autoExecuteEligible
          ? (approve.isPending ? 'Fixing...'    : 'Auto-fix now')
          : (approve.isPending ? 'Approving...' : 'Approve fix')}
      </button>
    </div>
  )
}
