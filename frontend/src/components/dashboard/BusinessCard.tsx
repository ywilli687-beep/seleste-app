const STATE_LABELS: Record<string, { label: string; color: string }> = {
  NO_FOUNDATION:     { label: 'No foundation',     color: 'var(--color-danger)' },
  CONVERSION_BROKEN: { label: 'Conversion broken', color: 'var(--color-warning)' },
  LOW_VISIBILITY:    { label: 'Low visibility',    color: 'var(--color-warning)' },
  SCALING:           { label: 'Scaling',            color: 'var(--color-info)' },
  OPTIMIZING:        { label: 'Optimizing',         color: 'var(--color-success)' },
}

interface BusinessCardProps {
  business: any
  onSelect: (id: string) => void
  selected: boolean
}

export function BusinessCard({ business, onSelect, selected }: BusinessCardProps) {
  const stateInfo = STATE_LABELS[business.state] ?? { label: business.state, color: 'var(--text-secondary)' }
  const delta     = business.scoreDelta

  return (
    <div
      className={`business-card ${selected ? 'business-card--selected' : ''}`}
      onClick={() => onSelect(business.businessId)}
    >
      <div className="business-card__header">
        <div className="business-card__name">{business.name}</div>
        <div className="business-card__score">{business.overallScore}</div>
      </div>
      <div className="business-card__meta">
        <span className="business-card__state" style={{ color: stateInfo.color }}>
          {stateInfo.label}
        </span>
        {delta !== null && delta !== undefined && (
          <span className={`business-card__delta ${delta >= 0 ? 'positive' : 'negative'}`}>
            {delta >= 0 ? '+' : ''}{delta}
          </span>
        )}
      </div>
      {business.pendingActions > 0 && (
        <div className="business-card__inbox">
          {business.pendingActions} action{business.pendingActions !== 1 ? 's' : ''} pending
        </div>
      )}
    </div>
  )
}
