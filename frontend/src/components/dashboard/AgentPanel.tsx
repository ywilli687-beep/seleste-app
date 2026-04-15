import { estimateRevenue, formatRevenueRange } from '../../lib/revenue'

const AGENTS = ['SEO', 'CRO', 'REPUTATION', 'CONTENT', 'MEDIA_BUYER'] as const
type AgentType = typeof AGENTS[number]

const AGENT_DESC: Record<AgentType, string> = {
  SEO:         'Search visibility & rankings',
  CRO:         'Conversion rate & booking flow',
  REPUTATION:  'Reviews, GMB & trust signals',
  CONTENT:     'Copy, FAQs & service pages',
  MEDIA_BUYER: 'Paid search & social campaigns',
}

interface AgentPanelProps { tasks: any[]; bizState: any; industry: string }

export function AgentPanel({ tasks, bizState, industry }: AgentPanelProps) {
  const permissions = bizState?.agentPermissions ?? {}

  return (
    <div className="agent-panel">
      <div className="agent-panel__title">Agent status</div>
      <div className="agent-panel__list">
        {AGENTS.map((agent) => {
          const perm      = permissions[agent]
          const aTask     = tasks.filter((t) => t.agentType === agent)
          const pending   = aTask.filter((t) => t.status === 'PENDING').length
          const completed = aTask.filter((t) => t.status === 'COMPLETED').length
          const executing = aTask.filter((t) => t.status === 'EXECUTING').length
          const blocked   = perm && !perm.allowed
          let status = 'idle', color = '#6b7280'
          if (blocked)        { status = 'blocked';       color = '#ef4444' }
          else if (executing) { status = 'running';       color = '#8b5cf6' }
          else if (pending)   { status = 'action ready';  color = '#f59e0b' }
          else if (completed) { status = 'monitoring';    color = '#10b981' }
          const topTask = aTask.find((t) => t.status === 'PENDING')
          const est     = topTask ? estimateRevenue(topTask.pillar, topTask.estimatedImpact ?? 20, industry) : null

          return (
            <div key={agent} className={`agent-item ${blocked ? 'agent-item--blocked' : ''}`}>
              <div className="agent-item__header">
                <div className="agent-item__name">{agent.replace('_', ' ')}</div>
                <div className="agent-item__status" style={{ color }}>
                  <span className="agent-item__dot" style={{ background: color }} />
                  {status}
                </div>
              </div>
              <div className="agent-item__desc">{AGENT_DESC[agent]}</div>
              {blocked && <div className="agent-item__blocked-reason">{perm?.reason}</div>}
              {topTask && est && !blocked && (
                <div className="agent-item__finding">
                  <span className="agent-item__finding-text">{topTask.title}</span>
                  <span className="agent-item__finding-impact">{formatRevenueRange(est)}</span>
                </div>
              )}
              {completed > 0 && (
                <div className="agent-item__completed">{completed} action{completed !== 1 ? 's' : ''} completed</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
