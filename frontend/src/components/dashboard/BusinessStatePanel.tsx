interface BusinessStatePanelProps { businessState: any }

export function BusinessStatePanel({ businessState }: BusinessStatePanelProps) {
  if (!businessState) return (
    <div className="score-breakdown">
      <div style={{ fontSize: 13, color: 'var(--ink-muted)', fontFamily: 'var(--ff-sans)' }}>
        Run an audit to populate business state.
      </div>
    </div>
  )
  const permissions  = businessState.agentPermissions ?? {}
  const machineState = businessState.state ?? 'NO_FOUNDATION'
  return (
    <div className="score-breakdown">
      <div className="score-breakdown__header">
        <div className="score-breakdown__overall">{businessState.overallScore ?? '—'}</div>
        <div className="score-breakdown__state">{machineState.replace(/_/g, ' ').toLowerCase()}</div>
      </div>
      {businessState.nextStateRequirements && (
        <div className="score-breakdown__next">{businessState.nextStateRequirements}</div>
      )}
      {Object.keys(permissions).length > 0 && (
        <div className="score-breakdown__agents">
          {Object.entries(permissions).map(([agent, perm]: [string, any]) => (
            <div key={agent} className={`agent-pill ${perm.allowed ? 'agent-pill--allowed' : 'agent-pill--blocked'}`}>
              <span className="agent-pill__dot" /><span>{agent}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
