// ─────────────────────────────────────────────────────────────────────────────
// Feed types — Growth Command Center OS
// ─────────────────────────────────────────────────────────────────────────────

export type FeedCardType = 'urgent' | 'action' | 'opportunity' | 'info'

export interface FeedAction {
  label: string
  primary?: boolean
  onClick?: () => void
}

export interface PipelineStep {
  label: string
  status: 'done' | 'active' | 'pending'
}

export interface FeedMetric {
  label: string
  value: string
  green?: boolean
}

export interface FeedDetail {
  agentName: string
  agentInitials: string
  agentColor: string
  agentTextColor: string
  why: string
  metrics: FeedMetric[]
  pipeline: PipelineStep[]
  /** ID of the WeeklyAction in the DB, if this card maps to a real proposal */
  weeklyActionId?: string
}

export interface FeedItem {
  id: string
  type: FeedCardType
  title: string
  body: string
  impact?: string
  time: string
  actions?: FeedAction[]
  detail?: FeedDetail
}

// ─────────────────────────────────────────────────────────────────────────────
// Agent visual config — maps category → dot colour + initials
// ─────────────────────────────────────────────────────────────────────────────

export interface AgentDotConfig {
  initials: string
  bg: string
  text: string
  name: string
}

export const AGENT_DOT: Record<string, AgentDotConfig> = {
  reputation:  { initials: 'RE', bg: '#E1F5EE', text: '#0F6E56', name: 'Reputation Agent' },
  seo:         { initials: 'SE', bg: '#EEF2FF', text: '#4338CA', name: 'SEO Agent' },
  content:     { initials: 'CO', bg: '#FEF3C7', text: '#92400E', name: 'Content Agent' },
  conversion:  { initials: 'CR', bg: '#FCEAEA', text: '#991B1B', name: 'CRO Agent' },
  growth:      { initials: 'GA', bg: '#EEEDFE', text: '#534AB7', name: 'Growth Architect' },
  performance: { initials: 'PE', bg: '#E0F2FE', text: '#075985', name: 'Performance Agent' },
  media:       { initials: 'MB', bg: '#F3E8FF', text: '#6B21A8', name: 'Media Buyer Agent' },
  default:     { initials: 'AG', bg: '#F1F5F9', text: '#334155', name: 'Growth Agent' },
}

export function getAgentDot(category: string): AgentDotConfig {
  return AGENT_DOT[category.toLowerCase()] ?? AGENT_DOT.default
}

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline builder — derives step statuses from category + approval state
// ─────────────────────────────────────────────────────────────────────────────

const PIPELINES: Record<string, string[]> = {
  seo:         ['Keyword research', 'Copy', 'Optimise', 'Publish', 'Monitor'],
  reputation:  ['Audit reviews', 'Draft response', 'Review', 'Publish', 'Track'],
  content:     ['Research', 'Draft', 'Edit', 'Publish', 'Monitor'],
  conversion:  ['Diagnose', 'Wireframe', 'Copy', 'Deploy', 'A/B test'],
  performance: ['Audit', 'Compress', 'Configure', 'Deploy', 'Verify'],
  media:       ['Keyword research', 'Ad copy', 'Bid setup', 'Launch', 'Monitor'],
  default:     ['Analyse', 'Plan', 'Execute', 'Verify', 'Monitor'],
}

/** For a pending proposal: first two steps done, third active, rest pending */
export function buildPipeline(category: string): PipelineStep[] {
  const labels = PIPELINES[category.toLowerCase()] ?? PIPELINES.default
  return labels.map((label, i) => ({
    label,
    status: i < 2 ? 'done' : i === 2 ? 'active' : 'pending',
  }))
}

// ─────────────────────────────────────────────────────────────────────────────
// WeeklyAction → FeedItem converter
// ─────────────────────────────────────────────────────────────────────────────

export interface WeeklyActionRaw {
  id: string
  title: string
  description: string
  draftContent?: string | null
  effort: string
  estimatedLift: number
  category: string
  rank: number
  status: string
  confidence?: string | null
  createdAt?: string
}

export function weeklyActionToFeedItem(
  action: WeeklyActionRaw,
  onApprove?: (id: string) => void,
  onReject?: (id: string) => void,
): FeedItem {
  const dot = getAgentDot(action.category)

  return {
    id: `wa-${action.id}`,
    type: 'action',
    title: action.title,
    body: action.description,
    impact: action.estimatedLift > 0 ? `+${action.estimatedLift} pts estimated` : undefined,
    time: 'Pending approval',
    actions: [
      { label: 'Review & Approve', primary: true },
      { label: 'Reject' },
    ],
    detail: {
      agentName: dot.name,
      agentInitials: dot.initials,
      agentColor: dot.bg,
      agentTextColor: dot.text,
      why: action.draftContent
        ? `${action.description}\n\nProposed action: "${action.draftContent}"`
        : action.description,
      metrics: [
        { label: 'Score impact', value: `+${action.estimatedLift} pts`, green: true },
        { label: 'Effort',       value: action.effort ?? 'Medium' },
        { label: 'Confidence',   value: action.confidence ?? 'Medium' },
      ],
      pipeline: buildPipeline(action.category),
      weeklyActionId: action.id,
    },
  }
}
