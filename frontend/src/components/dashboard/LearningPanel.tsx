interface LearningPanelProps { learning: any }

export function LearningPanel({ learning }: LearningPanelProps) {
  if (!learning) return null

  return (
    <div className="learning-panel">
      {learning.coldStart && (
        <div className="learning-panel__cold-start">{learning.coldStartMessage}</div>
      )}
      <div className="learning-panel__stats">
        <div className="learning-stat">
          <div className="learning-stat__value">{learning.signals?.total ?? 0}</div>
          <div className="learning-stat__label">Patterns learned</div>
        </div>
        <div className="learning-stat">
          <div className="learning-stat__value">{learning.outcomes?.successRate ?? 0}%</div>
          <div className="learning-stat__label">Success rate</div>
        </div>
        <div className="learning-stat">
          <div className="learning-stat__value">{learning.signals?.highConfidence ?? 0}</div>
          <div className="learning-stat__label">High confidence</div>
        </div>
      </div>
      {learning.recentPatterns?.length > 0 && (
        <div className="learning-panel__patterns">
          <div className="learning-panel__patterns-title">Top performing actions</div>
          {learning.recentPatterns.slice(0, 3).map((p: any, i: number) => (
            <div key={i} className="learning-pattern">
              <span className="learning-pattern__type">{p.actionType.replace(/_/g, ' ').toLowerCase()}</span>
              <span className="learning-pattern__rate">{p.successRate}% success</span>
              <span className="learning-pattern__delta">+{p.avgDelta} avg delta</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
