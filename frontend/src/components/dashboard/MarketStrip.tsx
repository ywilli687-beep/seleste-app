import React from 'react'

interface Props {
  verticalMedianScore: number
  bookingAdoptionRate: number
  topGap: string
  avgMonthlyImprovement: number
}

export function MarketStrip({ verticalMedianScore, bookingAdoptionRate, topGap, avgMonthlyImprovement }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <div className="card-v2" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="text-small text-body">Vertical Avg</span>
          <span style={{ color: 'var(--amber)', fontWeight: 600 }}>{verticalMedianScore}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Your Industry Baseline</div>
      </div>
      <div className="card-v2" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="text-small text-body">Booking Adoption</span>
          <span style={{ color: 'var(--blue)', fontWeight: 600 }}>{bookingAdoptionRate}%</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Of locals have booking</div>
      </div>
      <div className="card-v2" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="text-small text-body">Top Gap</span>
          <span style={{ color: 'var(--coral)', fontWeight: 600 }}>Critical</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={topGap}>{topGap}</div>
      </div>
      <div className="card-v2" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="text-small text-body">Velocity</span>
          <span style={{ color: 'var(--green2)', fontWeight: 600 }}>+{avgMonthlyImprovement}/mo</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Top performers velocity</div>
      </div>
    </div>
  )
}
