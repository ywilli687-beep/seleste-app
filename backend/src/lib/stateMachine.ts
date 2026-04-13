import { BusinessState, AgentType } from '@prisma/client'

export interface PillarScores {
  overall:       number
  conversion:    number
  seo:           number
  reputation:    number
  content:       number
  technical:     number
  mobile:        number
  trust:         number
  local:         number
  accessibility: number
  performance:   number
}

export interface StateEvaluation {
  state:          BusinessState
  previousState:  BusinessState | null
  transitioned:   boolean
  blockedAgents:  AgentType[]
  allowedAgents:  AgentType[]
  rationale:      string
}

export interface TransitionResult {
  newState:      BusinessState
  previousState: BusinessState
  transitioned:  boolean
  reason:        string
}

const STATE_ORDER: BusinessState[] = [
  'NO_FOUNDATION',
  'CONVERSION_BROKEN',
  'LOW_VISIBILITY',
  'SCALING',
  'OPTIMIZING',
]

interface AgentConstraint {
  blocked: boolean
  reason:  string
}

type AgentConstraintMap = Record<AgentType, AgentConstraint>

const AGENT_CONSTRAINTS: Record<BusinessState, AgentConstraintMap> = {
  NO_FOUNDATION: {
    SEO:         { blocked: true,  reason: 'No indexable foundation — SEO spend is wasted until basics are in place' },
    CRO:         { blocked: false, reason: 'Primary focus — fix CTAs, contact info, and basic trust signals' },
    REPUTATION:  { blocked: true,  reason: 'Fix the site before pushing reputation' },
    CONTENT:     { blocked: false, reason: 'Allowed for basic structure only' },
    MEDIA_BUYER: { blocked: true,  reason: 'Hard blocked — no paid traffic until the site can convert' },
  },
  CONVERSION_BROKEN: {
    SEO:         { blocked: false, reason: 'Limited — basic on-page SEO only' },
    CRO:         { blocked: false, reason: 'Primary focus — booking flows, CTAs, trust signals' },
    REPUTATION:  { blocked: false, reason: 'Allowed — reviews and GMB support conversion' },
    CONTENT:     { blocked: false, reason: 'Allowed — conversion-focused copy only' },
    MEDIA_BUYER: { blocked: true,  reason: 'Blocked — do not drive paid traffic to a site that cannot convert' },
  },
  LOW_VISIBILITY: {
    SEO:         { blocked: false, reason: 'Primary focus — local SEO, schema, citations' },
    CRO:         { blocked: false, reason: 'Maintained — prevent conversion regression' },
    REPUTATION:  { blocked: false, reason: 'Active — reviews boost local SEO signals' },
    CONTENT:     { blocked: false, reason: 'Active — SEO-optimized content' },
    MEDIA_BUYER: { blocked: false, reason: 'Cautious — small budget tests only' },
  },
  SCALING: {
    SEO:         { blocked: false, reason: 'Full — authority building, backlinks, technical SEO' },
    CRO:         { blocked: false, reason: 'Advanced — funnel optimization' },
    REPUTATION:  { blocked: false, reason: 'Full — proactive review acquisition' },
    CONTENT:     { blocked: false, reason: 'Full — thought leadership, service pages' },
    MEDIA_BUYER: { blocked: false, reason: 'Active — increase budget, expand channels' },
  },
  OPTIMIZING: {
    SEO:         { blocked: false, reason: 'Elite — E-E-A-T signals, authority consolidation' },
    CRO:         { blocked: false, reason: 'Micro-optimization — marginal UX improvements' },
    REPUTATION:  { blocked: false, reason: 'Brand protection — monitor at scale' },
    CONTENT:     { blocked: false, reason: 'Leadership — original research, PR-worthy content' },
    MEDIA_BUYER: { blocked: false, reason: 'Full — performance max, creative testing' },
  },
}

interface TransitionRule {
  from:      BusinessState
  to:        BusinessState
  condition: (scores: PillarScores, consecutiveAuditsAbove?: number) => boolean
  reason:    string
}

const TRANSITION_RULES: TransitionRule[] = [
  {
    from:      'NO_FOUNDATION',
    to:        'CONVERSION_BROKEN',
    condition: (s) => s.overall >= 30,
    reason:    'Overall score reached 30 — basic foundation established',
  },
  {
    from:      'CONVERSION_BROKEN',
    to:        'LOW_VISIBILITY',
    condition: (s) => s.overall >= 50 && s.conversion >= 45,
    reason:    'Overall >= 50 and conversion >= 45 — site now converts',
  },
  {
    from:      'LOW_VISIBILITY',
    to:        'SCALING',
    condition: (s) => s.overall >= 65 && s.seo >= 55,
    reason:    'Overall >= 65 and SEO >= 55 — visibility threshold reached',
  },
  {
    from:      'SCALING',
    to:        'OPTIMIZING',
    condition: (s, consecutive = 0) => s.overall >= 80 && consecutive >= 2,
    reason:    'Overall >= 80 for 2 consecutive crawler audits',
  },
  {
    from:      'OPTIMIZING',
    to:        'SCALING',
    condition: (s) => s.overall < 75,
    reason:    'Score regressed below 75',
  },
  {
    from:      'SCALING',
    to:        'LOW_VISIBILITY',
    condition: (s) => s.overall < 60,
    reason:    'Score regressed below 60',
  },
  {
    from:      'LOW_VISIBILITY',
    to:        'CONVERSION_BROKEN',
    condition: (s) => s.overall < 45 || s.conversion < 35,
    reason:    'Score regressed — conversion or overall dropped',
  },
  {
    from:      'CONVERSION_BROKEN',
    to:        'NO_FOUNDATION',
    condition: (s) => s.overall < 25,
    reason:    'Severe regression — overall dropped below 25',
  },
]

function isUpgrade(from: BusinessState, to: BusinessState): boolean {
  return STATE_ORDER.indexOf(to) > STATE_ORDER.indexOf(from)
}

export function deriveStateFromScores(scores: PillarScores): BusinessState {
  if (scores.overall >= 80) return 'OPTIMIZING'
  if (scores.overall >= 65) return 'SCALING'
  if (scores.overall >= 50 && scores.conversion >= 45) return 'LOW_VISIBILITY'
  if (scores.overall >= 30) return 'CONVERSION_BROKEN'
  return 'NO_FOUNDATION'
}

export function evaluateTransition(
  currentState: BusinessState,
  scores: PillarScores,
  consecutiveAuditsAboveThreshold: number = 0
): TransitionResult {
  for (const rule of TRANSITION_RULES) {
    if (rule.from === currentState && isUpgrade(rule.from, rule.to)) {
      if (rule.condition(scores, consecutiveAuditsAboveThreshold)) {
        return { newState: rule.to, previousState: currentState, transitioned: true, reason: rule.reason }
      }
    }
  }
  for (const rule of TRANSITION_RULES) {
    if (rule.from === currentState && !isUpgrade(rule.from, rule.to)) {
      if (rule.condition(scores, consecutiveAuditsAboveThreshold)) {
        return { newState: rule.to, previousState: currentState, transitioned: true, reason: rule.reason }
      }
    }
  }
  return { newState: currentState, previousState: currentState, transitioned: false, reason: 'No transition conditions met' }
}

export function evaluateState(
  currentState: BusinessState | null,
  scores: PillarScores,
  consecutiveAuditsAboveThreshold: number = 0
): StateEvaluation {
  let resolvedState: BusinessState
  let transitioned = false
  const previousState = currentState

  if (!currentState) {
    resolvedState = deriveStateFromScores(scores)
    transitioned  = true
  } else {
    const result  = evaluateTransition(currentState, scores, consecutiveAuditsAboveThreshold)
    resolvedState = result.newState
    transitioned  = result.transitioned
  }

  const constraints   = AGENT_CONSTRAINTS[resolvedState]
  const blockedAgents = (Object.keys(constraints) as AgentType[]).filter((a) => constraints[a].blocked)
  const allowedAgents = (Object.keys(constraints) as AgentType[]).filter((a) => !constraints[a].blocked)

  return {
    state: resolvedState,
    previousState,
    transitioned,
    blockedAgents,
    allowedAgents,
    rationale: `Score ${scores.overall}. ${blockedAgents.length > 0 ? 'Blocked: ' + blockedAgents.join(', ') : 'All agents permitted.'}`,
  }
}

export function guardAgent(state: BusinessState, agent: AgentType): string | null {
  const constraint = AGENT_CONSTRAINTS[state][agent]
  if (constraint.blocked) {
    return `Agent ${agent} is blocked in state ${state}: ${constraint.reason}`
  }
  return null
}

export function getStateConstraints(state: BusinessState): AgentConstraintMap {
  return AGENT_CONSTRAINTS[state]
}
