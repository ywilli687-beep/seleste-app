interface SparklineProps { scores: number[]; width?: number; height?: number }

export function Sparkline({ scores, width = 80, height = 28 }: SparklineProps) {
  if (!scores || scores.length < 2) return null
  const min    = Math.min(...scores)
  const max    = Math.max(...scores)
  const range  = max - min || 1
  const stepX  = width / (scores.length - 1)
  const points = scores.map((s, i) => `${i * stepX},${height - ((s - min) / range) * height}`).join(' ')
  const last   = scores[scores.length - 1]
  const prev   = scores[scores.length - 2]
  const color  = last > prev ? '#10b981' : last < prev ? '#ef4444' : '#6b7280'
  const lx     = (scores.length - 1) * stepX
  const ly     = height - ((last - min) / range) * height
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="2.5" fill={color} />
    </svg>
  )
}
