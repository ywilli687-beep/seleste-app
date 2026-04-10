import type { DashboardData } from '../../types/dashboard'
import type { AgentOutput, WeeklyActionRaw } from '../../types/feed'

interface Props {
  data: DashboardData
  agentOutputs: AgentOutput[]
  allWeeklyActions: WeeklyActionRaw[]
  lastCycleAt?: string | null
}

// ── Timeline event types ───────────────────────────────────────────────────

type EventIndicator = 'green' | 'amber' | 'red' | 'neutral'

interface TimelineEvent {
  id: string
  date: Date
  type: 'audit' | 'cycle' | 'action'
  label: string
  sub: string
  indicator: EventIndicator
  delta?: number | null
}

function buildTimeline(
  data: DashboardData,
  agentOutputs: AgentOutput[],
  allWeeklyActions: WeeklyActionRaw[],
  lastCycleAt?: string | null,
): TimelineEvent[] {
  const events: TimelineEvent[] = []

  // Audit events
  for (const audit of data.recentAudits ?? []) {
    const ind: EventIndicator =
      audit.overallScore >= 70 ? 'green' :
      audit.overallScore >= 50 ? 'amber' :
      'red'
    events.push({
      id: `audit-${audit.id}`,
      date: new Date(audit.createdAt),
      type: 'audit',
      label: `Audit — ${audit.grade} · ${audit.overallScore}/100`,
      sub: audit.inputUrl,
      indicator: ind,
      delta: audit.scoreDelta,
    })
  }

  // Agent cycle event
  if (lastCycleAt && agentOutputs.length > 0) {
    const doneCount  = agentOutputs.filter(o => o.status === 'done').length
    const failCount  = agentOutputs.filter(o => o.status === 'failed').length
    const doneNames  = agentOutputs.filter(o => o.status === 'done').map(o => o.agentName).join(', ')
    events.push({
      id: 'cycle-latest',
      date: new Date(lastCycleAt),
      type: 'cycle',
      label: `Agent cycle — ${doneCount} completed${failCount > 0 ? `, ${failCount} failed` : ''}`,
      sub: doneNames || 'No agents ran',
      indicator: failCount > 0 ? 'amber' : doneCount > 0 ? 'green' : 'neutral',
    })
  }

  // Approved action events
  for (const action of allWeeklyActions.filter(a => a.status === 'approved')) {
    events.push({
      id: `action-${action.id}`,
      date: new Date(action.createdAt ?? Date.now()),
      type: 'action',
      label: action.title,
      sub: `Approved · ${action.category} · +${action.estimatedLift} pts`,
      indicator: 'green',
    })
  }

  return events.sort((a, b) => b.date.getTime() - a.date.getTime())
}

// ── Score sparkline ────────────────────────────────────────────────────────

function ScoreSparkline({
  chartData,
  scoreHistory,
}: {
  chartData: { date: string; score: number }[]
  scoreHistory: number[]
}) {
  const scores = chartData.length > 1
    ? chartData.map(d => d.score)
    : scoreHistory.length > 1
    ? scoreHistory
    : null

  if (!scores || scores.length < 2) return null

  const W = 320, H = 56, PAD = 6
  const min = Math.max(0,   Math.min(...scores) - 8)
  const max = Math.min(100, Math.max(...scores) + 8)
  const range = max - min || 1

  const pts = scores.map((s, i) => {
    const x = PAD + (i / (scores.length - 1)) * (W - PAD * 2)
    const y = H - PAD - ((s - min) / range) * (H - PAD * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const latestX = PAD + (W - PAD * 2)
  const latestY = H - PAD - ((scores[scores.length - 1] - min) / range) * (H - PAD * 2)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 56, display: 'block' }}>
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--os-green)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--os-green)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <polygon
        points={`${pts[0].split(',')[0]},${H} ${pts.join(' ')} ${latestX},${H}`}
        fill="url(#spark-grad)"
      />
      {/* Line */}
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="var(--os-green)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Latest dot */}
      <circle cx={latestX.toFixed(1)} cy={latestY.toFixed(1)} r="3" fill="var(--os-green)" />
    </svg>
  )
}

// ── Event indicator icon ───────────────────────────────────────────────────

const TYPE_ICON: Record<TimelineEvent['type'], string> = {
  audit:  '⬛',
  cycle:  '◆',
  action: '✓',
}

function indicatorColor(ind: EventIndicator): string {
  if (ind === 'green')   return 'var(--os-green)'
  if (ind === 'amber')   return 'var(--os-amber)'
  if (ind === 'red')     return 'var(--os-red)'
  return 'var(--os-border-sec)'
}

// ── Main component ─────────────────────────────────────────────────────────

export function GrowthTimeline({ data, agentOutputs, allWeeklyActions, lastCycleAt }: Props) {
  const events = buildTimeline(data, agentOutputs, allWeeklyActions, lastCycleAt)
  const hasChart = (data.chartData?.length ?? 0) > 1 || (data.scoreHistory?.length ?? 0) > 1

  const currentScore = data.overallScore
  const oldestScore = data.chartData?.length > 1
    ? data.chartData[0].score
    : data.scoreHistory?.length > 1
    ? data.scoreHistory[0]
    : null

  return (
    <div style={{ paddingBottom: 24 }}>

      {/* Score trend card */}
      <div className="os-gt-trend-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div className="os-gt-section-title">Score trend</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--os-text-prim)', fontFamily: 'var(--ff-sans)', lineHeight: 1.2, marginTop: 4 }}>
              {currentScore}
              <span style={{ fontSize: 12, color: 'var(--os-text-tert)', fontWeight: 400, marginLeft: 4 }}>/100</span>
            </div>
          </div>
          {oldestScore !== null && (
            <div style={{
              fontSize: 11, fontFamily: 'var(--ff-sans)', fontWeight: 500,
              color: currentScore >= oldestScore ? 'var(--os-green)' : 'var(--os-red)',
              background: currentScore >= oldestScore ? 'var(--os-green-dim)' : 'var(--os-red-dim)',
              padding: '3px 8px', borderRadius: 4, marginTop: 4,
            }}>
              {currentScore >= oldestScore ? '+' : ''}{currentScore - oldestScore} pts
            </div>
          )}
        </div>

        {hasChart ? (
          <>
            <ScoreSparkline chartData={data.chartData ?? []} scoreHistory={data.scoreHistory ?? []} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--os-text-tert)', fontFamily: 'var(--ff-sans)' }}>
                {data.chartData?.[0]?.date
                  ? new Date(data.chartData[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'Earlier'}
              </span>
              <span style={{ fontSize: 10, color: 'var(--os-text-tert)', fontFamily: 'var(--ff-sans)' }}>Today</span>
            </div>
          </>
        ) : (
          <div style={{ fontSize: 11, color: 'var(--os-text-tert)', fontFamily: 'var(--ff-sans)', marginTop: 8 }}>
            Run more audits to build your trend line.
          </div>
        )}
      </div>

      {/* Timeline */}
      <div style={{ padding: '16px 16px 0', marginBottom: 8 }}>
        <div className="os-gt-section-title">Event history</div>
      </div>

      {events.length === 0 ? (
        <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--os-text-tert)', fontSize: 12, fontFamily: 'var(--ff-sans)', lineHeight: 1.7 }}>
          No events yet.<br />Run an audit to start your timeline.
        </div>
      ) : (
        <div className="os-gt-timeline">
          {events.map((e, i) => (
            <div key={e.id} className="os-gt-event">
              {/* Spine */}
              <div className="os-gt-event-spine">
                <div
                  className="os-gt-event-dot"
                  style={{ background: indicatorColor(e.indicator) }}
                  title={TYPE_ICON[e.type]}
                />
                {i < events.length - 1 && <div className="os-gt-event-line" />}
              </div>
              {/* Body */}
              <div className="os-gt-event-body">
                <div className="os-gt-event-date">
                  {e.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  <span style={{ marginLeft: 6, opacity: 0.6 }}>{TYPE_ICON[e.type]}</span>
                </div>
                <div className="os-gt-event-label">{e.label}</div>
                <div className="os-gt-event-sub">{e.sub}</div>
                {e.delta != null && e.delta !== 0 && (
                  <div style={{
                    fontSize: 10, fontFamily: 'var(--ff-sans)', marginTop: 3, fontWeight: 500,
                    color: e.delta > 0 ? 'var(--os-green)' : 'var(--os-red)',
                  }}>
                    {e.delta > 0 ? `↑ +${e.delta} pts` : `↓ ${e.delta} pts`}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
