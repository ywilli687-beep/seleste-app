import { estimateRevenue, formatRevenueRange } from '../../lib/revenue'

interface ImpactTimelineProps { audits: any[]; industry: string }

const TRIGGER_LABEL: Record<string, string> = {
  MANUAL:  'Manual audit',
  CRAWLER: 'Weekly crawl',
}

export function ImpactTimeline({ audits, industry }: ImpactTimelineProps) {
  if (!audits || audits.length === 0) {
    return <div className="impact-timeline--empty">No audit history yet</div>
  }

  return (
    <div className="impact-timeline">
      {audits.map((audit, idx) => {
        const delta    = audit.scoreDelta
        const improved = delta !== null && delta !== undefined && delta > 0
        const declined = delta !== null && delta !== undefined && delta < 0
        const absDelta = Math.abs(delta ?? 0)
        const est      = absDelta > 0 ? estimateRevenue('seo', absDelta, industry, 0.6) : null

        return (
          <div key={audit.auditId} className="timeline-entry">
            <div className="timeline-entry__line">
              <div className={`timeline-entry__dot ${improved ? 'dot--up' : declined ? 'dot--down' : 'dot--flat'}`} />
              {idx < audits.length - 1 && <div className="timeline-entry__connector" />}
            </div>
            <div className="timeline-entry__content">
              <div className="timeline-entry__header">
                <span className="timeline-entry__score">{audit.overallScore}</span>
                {delta !== null && delta !== undefined && delta !== 0 && (
                  <span className={`timeline-entry__delta ${improved ? 'positive' : 'negative'}`}>
                    {improved ? '+' : ''}{delta} pts
                  </span>
                )}
                <span className="timeline-entry__trigger">{TRIGGER_LABEL[audit.triggerType] ?? audit.triggerType}</span>
                <span className="timeline-entry__date">
                  {new Date(audit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              {est && (
                <div className="timeline-entry__impact">
                  {improved
                    ? `Improvement worth est. ${formatRevenueRange(est)} additional revenue`
                    : `Decline — est. ${formatRevenueRange(est)} at risk monthly`}
                </div>
              )}
              {idx === audits.length - 1 && (
                <div className="timeline-entry__baseline">Baseline audit</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
