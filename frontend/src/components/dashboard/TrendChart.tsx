import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface TrendChartProps {
  data: { date: string; score: number }[]
}

export function TrendChart({ data }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 13, background: 'var(--bg2)', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
        No historical data yet. Run your first audit to start tracking trends.
      </div>
    )
  }

  // If only one data point, we need at least two for a line, or we just show a dot
  const chartData = data.length === 1 ? [...data, { ...data[0], date: 'Now' }] : data

  return (
    <div className="card-v2" style={{ height: 300, padding: '24px 16px 8px 0px' }}>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text3)', fontSize: 11 }} 
            dy={10}
          />
          <YAxis 
            domain={[0, 100]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text3)', fontSize: 11 }} 
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', color: 'var(--text1)' }}
            itemStyle={{ color: 'var(--accent)' }}
            cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="var(--accent)" 
            strokeWidth={3} 
            dot={{ fill: 'var(--accent)', stroke: 'var(--bg2)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
