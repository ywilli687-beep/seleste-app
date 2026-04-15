export interface RevenueEstimate {
  leadsPerMonth:   { low: number; high: number }
  revenuePerMonth: { low: number; high: number }
  assumptions:     string[]
  confidence:      number
  methodology:     string
}

const AVG_ORDER_VALUES: Record<string, number> = {
  AUTO_REPAIR: 380, DENTAL: 450, RESTAURANT: 42, PLUMBING: 320,
  HVAC: 580, LAW_FIRM: 1200, REAL_ESTATE: 4500, MEDICAL: 280,
  VETERINARY: 160, SALON_SPA: 85, GYM_FITNESS: 65, ACCOUNTING: 950,
  INSURANCE: 720, ROOFING: 8500, LANDSCAPING: 420, OTHER: 250,
}

const PILLAR_CTR_IMPROVEMENT: Record<string, number> = {
  seo: 0.04, conversion: 0.02, reputation: 0.015, content: 0.01,
  local: 0.025, trust: 0.01, performance: 0.008, mobile: 0.01,
  accessibility: 0.005, technical: 0.008,
}

const BASELINE_MONTHLY_SEARCHES = 800
const CONVERSION_RATE           = 0.035
const REALISM_DISCOUNT          = 0.6
const CONFIDENCE_DISCOUNT       = 0.75

export function estimateRevenue(
  pillar: string, impactDelta: number, industry: string, confidence = 0.7
): RevenueEstimate {
  const aov          = AVG_ORDER_VALUES[industry] ?? 250
  const ctrGain      = (PILLAR_CTR_IMPROVEMENT[pillar] ?? 0.01) * (impactDelta / 20)
  const weeklySearch = BASELINE_MONTHLY_SEARCHES / 4
  const rawTraffic   = weeklySearch * ctrGain
  const adjTraffic   = rawTraffic * REALISM_DISCOUNT
  const weeklyLeads  = adjTraffic * CONVERSION_RATE
  const monthlyLeads = weeklyLeads * 4
  const rawRevenue   = monthlyLeads * aov
  const finalRev     = rawRevenue * CONFIDENCE_DISCOUNT * confidence
  return {
    leadsPerMonth:   { low: Math.max(0, Math.round(monthlyLeads * 0.7)), high: Math.round(monthlyLeads * 1.3) },
    revenuePerMonth: { low: Math.max(0, Math.round(finalRev * 0.8)),     high: Math.round(finalRev * 1.2) },
    assumptions: [
      `~${BASELINE_MONTHLY_SEARCHES} monthly local searches estimated`,
      `Conservative ${(ctrGain * 100).toFixed(1)}% CTR improvement`,
      `${(CONVERSION_RATE * 100).toFixed(1)}% visitor-to-lead conversion`,
      `$${aov} avg order value for ${industry.replace(/_/g, ' ').toLowerCase()}`,
      `60% realism discount applied`,
      `${Math.round(confidence * 100)}% confidence weighting`,
    ],
    confidence,
    methodology: 'CTR benchmark × conversion rate × avg order value, conservative lower-bound',
  }
}

export function formatRevenue(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`
}

export function formatRevenueRange(est: RevenueEstimate): string {
  return `${formatRevenue(est.revenuePerMonth.low)}–${formatRevenue(est.revenuePerMonth.high)}/mo`
}

export function formatLeadsRange(est: RevenueEstimate): string {
  return `${est.leadsPerMonth.low}–${est.leadsPerMonth.high} leads/mo`
}
