import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { useApproveTask, useRejectTask } from '../../lib/hooks/useDashboard'
import { estimateRevenue, formatRevenueRange } from '../../lib/revenue'
import { apiPost } from '../../lib/api'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:    { label: 'Ready',   color: '#f59e0b', bg: 'rgba(245,158,11,0.15)'  },
  APPROVED:   { label: 'Queued', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)'  },
  EXECUTING:  { label: 'Running',color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)'  },
  COMPLETED:  { label: 'Done',   color: '#10b981', bg: 'rgba(16,185,129,0.15)'  },
  FAILED:     { label: 'Failed', color: '#ef4444', bg: 'rgba(239,68,68,0.15)'   },
  SUPERSEDED: { label: 'Stale',  color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
}

interface ExecutionQueueProps { tasks: any[]; summary: any; businessId: string; industry: string }

export function ExecutionQueue({ tasks, summary, businessId, industry }: ExecutionQueueProps) {
  const approve      = useApproveTask(businessId)
  const reject       = useRejectTask(businessId)
  const { getToken } = useAuth()
  const queryClient  = useQueryClient()

  const dedupedTasks = tasks.filter((task, index, self) =>
    index === self.findIndex((t) => t.title === task.title && t.agentType === task.agentType)
  )
  const pendingTasks = dedupedTasks.filter((t) => t.status === 'PENDING')
  const totalRevLow  = pendingTasks.reduce((s, t) => s + estimateRevenue(t.pillar, t.estimatedImpact ?? 20, industry).revenuePerMonth.low,  0)
  const totalRevHigh = pendingTasks.reduce((s, t) => s + estimateRevenue(t.pillar, t.estimatedImpact ?? 20, industry).revenuePerMonth.high, 0)

  const runAll = useMutation({
    mutationFn: async () => {
      const token = await getToken()
      await Promise.allSettled(pendingTasks.map((t) => apiPost(`/api/tasks/${t.taskId}/approve`, token!)))
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inbox', businessId] }),
  })

  return (
    <div className="exec-queue">
      <div className="exec-queue__header">
        <div className="exec-queue__title">Execution queue</div>
        <div className="exec-queue__pipeline">
          {Object.entries(summary ?? {}).map(([status, count]: [string, any]) =>
            count > 0 ? (
              <div
                key={status}
                className="pipeline-pill"
                style={{
                  background: STATUS_CONFIG[status.toUpperCase()]?.bg ?? 'rgba(107,114,128,0.15)',
                  color:      STATUS_CONFIG[status.toUpperCase()]?.color ?? '#6b7280',
                }}
              >
                {count} {STATUS_CONFIG[status.toUpperCase()]?.label ?? status}
              </div>
            ) : null
          )}
        </div>
      </div>

      {pendingTasks.length > 0 && (
        <div className="exec-queue__opportunity">
          <div className="opportunity-text">
            <span className="opportunity-amount">${totalRevLow.toLocaleString()}–${totalRevHigh.toLocaleString()}/mo</span>
            <span className="opportunity-label"> est. opportunity across {pendingTasks.length} pending actions</span>
          </div>
          <button className="btn btn--command btn--sm" onClick={() => runAll.mutate()} disabled={runAll.isPending}>
            {runAll.isPending ? 'Approving...' : `Approve all ${pendingTasks.length} fixes`}
          </button>
        </div>
      )}

      <div className="exec-queue__list">
        {dedupedTasks.length === 0 && (
          <div className="exec-queue__empty">Queue clear — run an audit to generate actions</div>
        )}
        {dedupedTasks.map((task) => {
          const cfg = STATUS_CONFIG[task.status] ?? STATUS_CONFIG['PENDING']
          const est = estimateRevenue(task.pillar, task.estimatedImpact ?? 20, industry)
          return (
            <div key={task.taskId} className="queue-item">
              <div className="queue-item__status" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</div>
              <div className="queue-item__body">
                <div className="queue-item__title">{task.title}</div>
                <div className="queue-item__meta">
                  <span>{task.agentType}</span>
                  <span>{task.pillar}</span>
                  <span>+{task.estimatedImpact ?? '?'} pts</span>
                  <span className="queue-item__revenue">{formatRevenueRange(est)}</span>
                </div>
              </div>
              {task.status === 'PENDING' && (
                <div className="queue-item__actions">
                  <button className="btn btn--primary btn--sm" onClick={() => approve.mutate(task.taskId)} disabled={approve.isPending}>Approve</button>
                  <button className="btn btn--ghost btn--sm"   onClick={() => reject.mutate({ taskId: task.taskId })} disabled={reject.isPending}>Skip</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
