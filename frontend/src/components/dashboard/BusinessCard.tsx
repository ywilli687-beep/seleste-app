import { Sparkline } from './Sparkline'

const STATE_LABELS: Record<string, { label: string; color: string }> = {
  NO_FOUNDATION:     { label: 'No foundation',     color: 'var(--color-danger, #ef4444)' },
  CONVERSION_BROKEN: { label: 'Conversion broken', color: 'var(--color-warning, #f59e0b)' },
  LOW_VISIBILITY:    { label: 'Low visibility',    color: 'var(--color-warning, #f59e0b)' },
  SCALING:           { label: 'Scaling',            color: 'var(--color-info, #3b82f6)' },
  OPTIMIZING:        { label: 'Optimizing',         color: 'var(--color-success, #10b981)' },
}

interface BusinessCardProps {
  business:         any
  onSelect:         (id: string) => void
  selected:         boolean
  sparklineScores?: number[]
}

export function BusinessCard({ business, onSelect, selected, sparklineScores }: BusinessCardProps) {
  const stateInfo = STATE_LABELS[business.state] ?? { label: business.state ?? 'Unknown', color: '#6b7280' }
  const delta     = business.scoreDelta

  return (
    <div className={`business-card ${selected ? 'business-card--selected' : ''}`} onClick={() => onSelect(business.businessId)}>
      <div className="business-card__header">
        <div className="business-card__name">{business.name}</div>
        <div className="business-card__score">{business.overallScore}</div>
      </div>
      <div className="business-card__meta">
        <span className="business-card__state" style={{ color: stateInfo.color }}>{stateInfo.label}</span>
        {delta !== null && delta !== undefined && (
          <span className={`business-card__delta ${delta >= 0 ? 'positive' : 'negative'}`}>{delta >= 0 ? '+' : ''}{delta}</span>
        )}
      </div>
      {sparklineScores && sparklineScores.length >= 2 && (
        <div className="business-card__sparkline"><Sparkline scores={sparklineScores} /></div>
      )}
      {business.pendingActions > 0 && (
        <div className="business-card__inbox">{business.pendingActions} action{business.pendingActions !== 1 ? 's' : ''} pending</div>
      )}
    </div>
  )
}
