import React from 'react'
import { Tooltip } from './Tooltip'

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
          <Tooltip text="The average website score for businesses in your industry. If your score is higher, you're ahead of most competitors. If lower, there's room to catch up.">
            <span className="text-small text-body">Industry Average</span>
          </Tooltip>
          <span style={{ color: 'var(--amber)', fontWeight: 600 }}>{verticalMedianScore}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>Typical score in your field</div>
      </div>
      <div className="card-v2" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <Tooltip text="The percentage of businesses in your area that let customers book online. If this is high, customers expect it — not having it puts you at a disadvantage.">
            <span className="text-small text-body">Online Booking</span>
          </Tooltip>
          <span style={{ color: 'var(--blue)', fontWeight: 600 }}>{bookingAdoptionRate}%</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>of local businesses offer it</div>
      </div>
      <div className="card-v2" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <Tooltip text="The single most common missing feature across businesses like yours. Fixing this one thing tends to have the biggest impact.">
            <span className="text-small text-body">Biggest Gap</span>
          </Tooltip>
          <span style={{ color: 'var(--coral)', fontWeight: 600 }}>Missing</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={topGap}>{topGap}</div>
      </div>
      <div className="card-v2" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <Tooltip text="How many score points top-performing businesses in your industry typically gain each month. A useful benchmark for how fast improvement is possible.">
            <span className="text-small text-body">Top Improvers</span>
          </Tooltip>
          <span style={{ color: 'var(--green2)', fontWeight: 600 }}>+{avgMonthlyImprovement}/mo</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>avg. score gain per month</div>
      </div>
    </div>
  )
}
