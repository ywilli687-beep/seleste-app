import { BusinessState, AgentType } from '@prisma/client'

export interface ActionCandidate {
  id:                  string
  agentType:           AgentType
  pillar:              string
  estimatedImpact:     number
  estimatedEffort:     number
  urgencySignal:       number
  learningSignal:      number
  learningConfidence:  number
  channelSynergy:      number
  moatScore:           number
}

export interface PrioritizedAction {
  id:        string
  priority:  number
  breakdown: WeightBreakdown
  rank:      number
}

export interface WeightBreakdown {
  impact:         number
  urgency:        number
  effortInverse:  number
  learningSignal: number
  channelSynergy: number
  moatScore:      number
}

interface WeightProfile {
  impact:         number
  urgency:        number
  effortInverse:  number
  learningSignal: number
  channelSynergy: number
  moatScore:      number
}

const WEIGHT_PROFILES: Record<BusinessState, WeightProfile> = {
  NO_FOUNDATION:     { impact: 0.60, urgency: 0.30, effortInverse: 0.10, learningSignal: 0.00, channelSynergy: 0.00, moatScore: 0.00 },
  CONVERSION_BROKEN: { impact: 0.50, urgency: 0.30, effortInverse: 0.20, learningSignal: 0.00, channelSynergy: 0.00, moatScore: 0.00 },
  LOW_VISIBILITY:    { impact: 0.40, urgency: 0.20, effortInverse: 0.20, learningSignal: 0.20, channelSynergy: 0.00, moatScore: 0.00 },
  SCALING:           { impact: 0.30, urgency: 0.10, effortInverse: 0.20, learningSignal: 0.30, channelSynergy: 0.10, moatScore: 0.00 },
  OPTIMIZING:        { impact: 0.20, urgency: 0.00, effortInverse: 0.10, learningSignal: 0.40, channelSynergy: 0.20, moatScore: 0.10 },
}

const LEARNING_CONFIDENCE_THRESHOLD = 0.6

export function scoreAction(
  candidate: ActionCandidate,
  state: BusinessState
): { score: number; breakdown: WeightBreakdown } {
  const profile = { ...WEIGHT_PROFILES[state] }

  if (candidate.learningConfidence < LEARNING_CONFIDENCE_THRESHOLD) {
    profile.impact += profile.learningSignal
    profile.learningSignal = 0
  }

  const effortInverse = ((5 - candidate.estimatedEffort) / 4) * 100
  const clamp = (v: number) => Math.min(100, Math.max(0, v))

  const factors = {
    impact:         clamp(candidate.estimatedImpact),
    urgency:        clamp(candidate.urgencySignal),
    effortInverse:  clamp(effortInverse),
    learningSignal: clamp(candidate.learningSignal),
    channelSynergy: clamp(candidate.channelSynergy),
    moatScore:      clamp(candidate.moatScore),
  }

  const score =
    factors.impact         * profile.impact         +
    factors.urgency        * profile.urgency        +
    factors.effortInverse  * profile.effortInverse  +
    factors.learningSignal * profile.learningSignal +
    factors.channelSynergy * profile.channelSynergy +
    factors.moatScore      * profile.moatScore

  const breakdown: WeightBreakdown = {
    impact:         Math.round(factors.impact         * profile.impact),
    urgency:        Math.round(factors.urgency        * profile.urgency),
    effortInverse:  Math.round(factors.effortInverse  * profile.effortInverse),
    learningSignal: Math.round(factors.learningSignal * profile.learningSignal),
    channelSynergy: Math.round(factors.channelSynergy * profile.channelSynergy),
    moatScore:      Math.round(factors.moatScore      * profile.moatScore),
  }

  return { score: Math.round(score), breakdown }
}

export function rankActions(
  candidates: ActionCandidate[],
  state: BusinessState
): PrioritizedAction[] {
  const scored = candidates.map((c) => {
    const { score, breakdown } = scoreAction(c, state)
    return { id: c.id, priority: score, breakdown, rank: 0 }
  })
  scored.sort((a, b) => b.priority - a.priority)
  return scored.map((a, i) => ({ ...a, rank: i + 1 }))
}

export function decideAutoExecute(
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH',
  state: BusinessState,
  learningConfidence: number,
  estimatedImpact: number
): { autoExecute: boolean; reason: string } {
  if (riskTier === 'HIGH') {
    return { autoExecute: false, reason: 'HIGH risk tier — always requires human approval' }
  }
  if (state === 'NO_FOUNDATION' || state === 'CONVERSION_BROKEN') {
    return { autoExecute: false, reason: `State ${state} — all actions require approval` }
  }
  if (learningConfidence < LEARNING_CONFIDENCE_THRESHOLD) {
    return { autoExecute: false, reason: `Learning confidence ${learningConfidence.toFixed(2)} below threshold` }
  }
  if (riskTier === 'LOW' && learningConfidence >= LEARNING_CONFIDENCE_THRESHOLD) {
    return { autoExecute: true, reason: `LOW risk, confidence ${learningConfidence.toFixed(2)} — eligible for auto-execution` }
  }
  return { autoExecute: false, reason: 'MEDIUM risk — requires human approval' }
}

export function computeUrgency(pillarScore: number): number {
  if (pillarScore <= 20) return 100
  if (pillarScore <= 35) return 85
  if (pillarScore <= 50) return 65
  if (pillarScore <= 65) return 40
  return 20
}

export function computeChannelSynergy(benefitedPillars: string[]): number {
  const count = benefitedPillars.length
  if (count >= 4) return 100
  if (count === 3) return 75
  if (count === 2) return 40
  return 0
}
