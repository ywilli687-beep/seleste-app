import { useApproveTask } from '../../lib/hooks/useDashboard'
import { estimateRevenue, formatRevenueRange, formatLeadsRange } from '../../lib/revenue'

const PILLAR_PROBLEM: Record<string, string> = {
  seo:           'Customers searching for you cannot find you',
  conversion:    'Visitors arrive but leave without contacting you',
  reputation:    'Low review count is costing you trust and clicks',
  content:       'Thin content signals low authority to Google',
  local:         'Local search visibility is below competitors',
  trust:         'Site lacks credibility signals that convert visitors',
  mobile:        'Mobile experience is driving visitors away',
  technical:     'Technical issues are suppressing search rankings',
  performance:   'Slow load times are increasing bounce rate',
  accessibility: 'Accessibility gaps are limiting your audience',
}

const AGENT_COLOR: Record<string, string> = {
  SEO: '#3b82f6', CRO: '#8b5cf6', REPUTATION: '#f59e0b', CONTENT: '#10b981', MEDIA_BUYER: '#ef4444',
}

interface PriorityActionsProps { tasks: any[]; businessId: string; industry: string }

export function PriorityActions({ tasks, businessId, industry }: PriorityActionsProps) {
  const approve = useApproveTask(businessId)
  const dedupedTasks = tasks.filter((task, index, self) =>
    index === self.findIndex((t) => t.title === task.title && t.agentType === task.agentType)
  )
  const top3    = dedupedTasks.filter((t) => t.status === 'PENDING').sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)).slice(0, 3)
  if (top3.length === 0) return null

  return (
    <div className="priority-actions">
      <div className="priority-actions__header">
        <span className="priority-actions__eyebrow">Priority actions</span>
        <span className="priority-actions__sub">Sorted by impact × effort — conservative estimates</span>
      </div>
      <div className="priority-actions__list">
        {top3.map((task, idx) => {
          const est     = estimateRevenue(task.pillar, task.estimatedImpact ?? 30, industry)
          const problem = PILLAR_PROBLEM[task.pillar] ?? 'This issue is limiting business growth'
          const color   = AGENT_COLOR[task.agentType] ?? '#6b7280'
          return (
            <div key={task.taskId} className="priority-card">
              <div className="priority-card__rank">#{idx + 1}</div>
              <div className="priority-card__body">
                <div className="priority-card__header">
                  <span className="priority-card__agent" style={{ background: color + '20', color }}>{task.agentType}</span>
                  <span className="priority-card__pillar">{task.pillar}</span>
                  <span className="priority-card__risk">{task.riskTier}</span>
                </div>
                <div className="priority-card__title">{task.title}</div>
                <div className="priority-card__problem">{problem}</div>
                <div className="priority-card__impact">
                  <div className="impact-block">
                    <div className="impact-block__value">{formatRevenueRange(est)}</div>
                    <div className="impact-block__label">est. revenue</div>
                  </div>
                  <div className="impact-block">
                    <div className="impact-block__value">{formatLeadsRange(est)}</div>
                    <div className="impact-block__label">est. leads</div>
                  </div>
                  <div className="impact-block">
                    <div className="impact-block__value">{Math.round(est.confidence * 100)}%</div>
                    <div className="impact-block__label">confidence</div>
                  </div>
                </div>
                <div className="priority-card__assumptions">
                  Based on {est.assumptions[0].toLowerCase()} · conservative lower-bound
                </div>
              </div>
              <div className="priority-card__cta">
                <button
                  className="btn btn--command"
                  onClick={() => approve.mutate(task.taskId)}
                  disabled={approve.isPending}
                >
                  {task.autoExecuteEligible ? 'Auto-fix' : 'Approve fix'}
                </button>
                <div className="priority-card__effort">Effort {task.estimatedEffort}/5</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
