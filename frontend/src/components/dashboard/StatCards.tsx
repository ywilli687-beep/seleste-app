interface StatCardsProps { dashboard: any }

export function StatCards({ dashboard }: StatCardsProps) {
  const businesses = dashboard?.businesses ?? []
  const summary    = dashboard?.globalSummary ?? {}
  return (
    <div className="stat-cards-grid">
      <div className="stat-card">
        <div className="stat-label">Businesses</div>
        <div className="stat-value">{businesses.length}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Pending actions</div>
        <div className="stat-value stat-value--amber">{summary.totalPendingActions ?? 0}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Avg score</div>
        <div className="stat-value">{summary.avgScore ?? '—'}</div>
      </div>
      {summary.topMover && (
        <div className="stat-card stat-card--highlight">
          <div className="stat-label">Top mover</div>
          <div className="stat-value stat-value--green">+{summary.topMover.scoreDelta}</div>
          <div className="stat-sub">{summary.topMover.name}</div>
        </div>
      )}
    </div>
  )
}
