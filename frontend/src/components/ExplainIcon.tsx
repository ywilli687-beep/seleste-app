import React from 'react'

interface ExplainIconProps {
  onClick: (e: React.MouseEvent) => void
  loading: boolean
  loaded: boolean
}

export default function ExplainIcon({ onClick, loading, loaded }: ExplainIconProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick(e)
      }}
      className="explain-anchor no-print"
      style={{
        width: 16, height: 16, borderRadius: '50%',
        background: 'none', border: '1px solid rgba(255,255,255,0.2)',
        color: loaded ? 'var(--green)' : 'var(--text2)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--ff-mono)', fontSize: 9, cursor: 'pointer',
        padding: 0, marginLeft: 6, opacity: 0.8, flexShrink: 0,
        position: 'relative', top: -1,
        transition: 'all 0.2s',
      }}
      onMouseOver={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'}
      onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
      title="Explain this Insight"
    >
      {loading ? (
        <span style={{ fontSize: 9 }}>...</span>
      ) : loaded ? (
        '✓'
      ) : (
        '?'
      )}
    </button>
  )
}
