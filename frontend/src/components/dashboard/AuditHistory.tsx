interface AuditHistoryProps {
  audits: any[]
}

export function AuditHistory({ audits }: AuditHistoryProps) {
  if (!audits || audits.length === 0) {
    return <div className="audit-history--empty">No audits yet</div>
  }

  return (
    <div className="audit-history">
      {audits.map((audit: any) => {
        const delta = audit.scoreDelta
        return (
          <div key={audit.auditId} className="audit-history__item">
            <div className="audit-history__score">{audit.overallScore}</div>
            <div className="audit-history__bar">
              <div
                className="audit-history__fill"
                style={{ width: `${audit.overallScore}%` }}
              />
            </div>
            <div className="audit-history__meta">
              <span className="audit-history__date">
                {new Date(audit.createdAt).toLocaleDateString()}
              </span>
              <span className="audit-history__trigger">{audit.triggerType}</span>
              {delta !== null && delta !== undefined && (
                <span className={`audit-history__delta ${delta >= 0 ? 'positive' : 'negative'}`}>
                  {delta >= 0 ? '+' : ''}{delta}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
