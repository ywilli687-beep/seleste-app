import type { FeedItem, FeedCardType } from '../../types/feed'

const BADGE: Record<FeedCardType, { text: string; cls: string }> = {
  urgent:      { text: '⚡ Competitor',    cls: 'urgent' },
  action:      { text: '✓ Action Needed', cls: 'action' },
  opportunity: { text: '↑ Opportunity',   cls: 'opp'    },
  info:        { text: '● Update',        cls: 'info'   },
}

interface Props {
  card: FeedItem
  selected?: boolean
  onClick: () => void
}

export function FeedCard({ card, selected, onClick }: Props) {
  const b = BADGE[card.type]

  return (
    <div
      className={`os-fcard ${card.type}${selected ? ' selected' : ''}`}
      onClick={onClick}
    >
      <div className="os-fc-header">
        <span className={`os-fc-badge ${b.cls}`}>{b.text}</span>
        <span className="os-fc-time">{card.time}</span>
      </div>

      <div className="os-fc-title">{card.title}</div>
      {card.body && <div className="os-fc-body">{card.body}</div>}
      {card.impact && <div className="os-fc-impact">{card.impact}</div>}

      {card.actions && card.actions.length > 0 && (
        <div className="os-fc-actions">
          {card.actions.map((a, i) => (
            <button
              key={i}
              className={`os-fc-btn${a.primary ? ' primary' : ''}`}
              onClick={e => { e.stopPropagation(); a.onClick?.() }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
