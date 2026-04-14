import { useApproveTask, useRejectTask } from '../../lib/hooks/useDashboard'

const RISK_COLORS: Record<string, string> = {
  LOW:    'var(--color-success)',
  MEDIUM: 'var(--color-warning)',
  HIGH:   'var(--color-danger)',
}

const AGENT_ICONS: Record<string, string> = {
  SEO:         'SEO',
  CRO:         'CRO',
  REPUTATION:  'REP',
  CONTENT:     'CON',
  MEDIA_BUYER: 'ADS',
}

interface ApprovalInboxProps {
  businessId: string
  tasks:      any[]
  summary:    any
}

export function ApprovalInbox({ businessId, tasks, summary }: ApprovalInboxProps) {
  const approve = useApproveTask(businessId)
  const reject  = useRejectTask(businessId)

  if (tasks.length === 0) {
    return (
      <div className="inbox-empty">
        <div className="inbox-empty__icon">✓</div>
        <div className="inbox-empty__text">Inbox clear — run an audit to generate new actions</div>
      </div>
    )
  }

  return (
    <div className="inbox">
      <div className="inbox__summary">
        <span>{summary?.pending ?? 0} pending</span>
        <span>{summary?.approved ?? 0} approved</span>
        <span>{summary?.completed ?? 0} completed</span>
      </div>
      <div className="inbox__list">
        {tasks.map((task: any) => (
          <div key={task.taskId} className="inbox-item">
            <div className="inbox-item__header">
              <span className="inbox-item__agent">{AGENT_ICONS[task.agentType] ?? task.agentType}</span>
              <span className="inbox-item__title">{task.title}</span>
              <span className="inbox-item__risk" style={{ color: RISK_COLORS[task.riskTier] }}>
                {task.riskTier}
              </span>
            </div>
            <div className="inbox-item__description">{task.description}</div>
            <div className="inbox-item__meta">
              <span>Impact: +{task.estimatedImpact ?? '?'}</span>
              <span>Effort: {task.estimatedEffort ?? '?'}/5</span>
              <span>Pillar: {task.pillar}</span>
              {task.autoExecuteEligible && (
                <span className="inbox-item__auto">auto-eligible</span>
              )}
            </div>
            {task.status === 'PENDING' && (
              <div className="inbox-item__actions">
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => approve.mutate(task.taskId)}
                  disabled={approve.isPending}
                >
                  {approve.isPending ? 'Approving...' : 'Approve'}
                </button>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => reject.mutate({ taskId: task.taskId })}
                  disabled={reject.isPending}
                >
                  Reject
                </button>
              </div>
            )}
            {task.status === 'APPROVED' && (
              <div className="inbox-item__status inbox-item__status--approved">
                Approved — queued for execution
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
