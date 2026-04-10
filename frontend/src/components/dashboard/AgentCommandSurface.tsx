import { useState, useRef, useEffect } from 'react'
import type { DashboardData } from '../../types/dashboard'
import type { AgentOutput, CycleState } from '../../types/feed'

// ── Intent → agent mapping ─────────────────────────────────────────────────

interface AgentChip {
  id: string
  label: string
  icon: string
  description: string
  keywords: string[]
}

const AGENTS: AgentChip[] = [
  {
    id: 'seo',
    label: 'SEO Agent',
    icon: '🔍',
    description: 'Keyword gaps, meta copy, and local SEO improvements',
    keywords: ['seo', 'search', 'google', 'rank', 'keyword', 'traffic', 'found', 'discover'],
  },
  {
    id: 'conversion',
    label: 'CRO Agent',
    icon: '🎯',
    description: 'CTA improvements, form optimisation, and checkout fixes',
    keywords: ['convert', 'cro', 'cta', 'button', 'form', 'booking', 'buy', 'checkout', 'revenue'],
  },
  {
    id: 'reputation',
    label: 'Reputation Agent',
    icon: '⭐',
    description: 'Review responses, trust signals, and testimonial strategy',
    keywords: ['review', 'reputation', 'trust', 'testimonial', 'rating', 'star', 'respond'],
  },
  {
    id: 'content',
    label: 'Content Agent',
    icon: '✍️',
    description: 'Page copy, blog posts, and messaging clarity',
    keywords: ['content', 'copy', 'write', 'blog', 'text', 'message', 'words', 'clarity'],
  },
  {
    id: 'performance',
    label: 'Performance Agent',
    icon: '⚡',
    description: 'Page speed, Core Web Vitals, and image optimisation',
    keywords: ['speed', 'performance', 'fast', 'load', 'image', 'core web', 'pagespeed'],
  },
  {
    id: 'media',
    label: 'Media Buyer',
    icon: '📢',
    description: 'Google Ads keywords, ad copy, and bid strategy',
    keywords: ['ads', 'media', 'paid', 'google ads', 'campaign', 'ppc', 'bid'],
  },
]

const SUGGESTIONS = [
  'Improve my Google ranking',
  'Get more people to book online',
  'Respond to my reviews automatically',
  'Make my website faster',
  'Write better page copy',
  'Help me compete against local rivals',
]

function matchAgents(intent: string): AgentChip[] {
  if (!intent.trim()) return []
  const lower = intent.toLowerCase()
  const scored = AGENTS.map(a => ({
    agent: a,
    score: a.keywords.filter(k => lower.includes(k)).length,
  }))
  const matched = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score)
  return matched.length > 0 ? matched.map(m => m.agent) : AGENTS
}

// ── Recent command history (localStorage) ─────────────────────────────────

interface CommandRecord {
  intent: string
  agents: string[]
  status: 'success' | 'error'
  timestamp: string
}

function loadHistory(): CommandRecord[] {
  try {
    return JSON.parse(localStorage.getItem('seleste_command_history') ?? '[]')
  } catch { return [] }
}

function saveHistory(records: CommandRecord[]) {
  localStorage.setItem('seleste_command_history', JSON.stringify(records.slice(0, 8)))
}

// ── Component ──────────────────────────────────────────────────────────────

interface Props {
  data: DashboardData
  agentOutputs: AgentOutput[]
  cycleState: CycleState
  onRunCycle: (businessId: string, intent: string) => Promise<void>
}

export function AgentCommandSurface({ data, agentOutputs, cycleState, onRunCycle }: Props) {
  const [intent, setIntent]         = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [history, setHistory]       = useState<CommandRecord[]>(loadHistory)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const matched = matchAgents(intent)
  const isRunning = cycleState === 'cycle_running' || submitting

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [intent])

  const handleSubmit = async () => {
    if (!intent.trim() || isRunning) return
    setSubmitting(true)
    setError(null)
    try {
      await onRunCycle(data.id, intent.trim())
      const record: CommandRecord = {
        intent: intent.trim(),
        agents: matched.slice(0, 3).map(a => a.label),
        status: 'success',
        timestamp: new Date().toISOString(),
      }
      const updated = [record, ...history]
      setHistory(updated)
      saveHistory(updated)
      setSubmitted(true)
      setIntent('')
      setTimeout(() => setSubmitted(false), 4000)
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="os-cmd-surface">

      {/* Header */}
      <div className="os-cmd-header">
        <div className="os-cmd-header-title">Agent Command</div>
        <div className="os-cmd-header-sub">
          Tell your agents what to work on — they'll draft proposals for your approval.
        </div>
      </div>

      {/* Intent input */}
      <div className="os-cmd-input-wrap">
        <div className="os-cmd-input-label">What do you want to improve?</div>
        <textarea
          ref={textareaRef}
          className="os-cmd-textarea"
          placeholder="e.g. Help me get found on Google for 'emergency plumber near me'…"
          value={intent}
          onChange={e => setIntent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isRunning}
          rows={2}
        />
        <div className="os-cmd-input-hint">⌘ Enter to run</div>
      </div>

      {/* Suggestions */}
      {!intent && (
        <div style={{ padding: '0 20px 16px' }}>
          <div className="os-cmd-section-label">Suggestions</div>
          <div className="os-cmd-suggestions">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                className="os-cmd-suggestion-chip"
                onClick={() => setIntent(s)}
                disabled={isRunning}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Matched agents */}
      {intent.trim() && (
        <div style={{ padding: '0 20px 16px' }}>
          <div className="os-cmd-section-label">
            {matched.length === AGENTS.length ? 'All agents will be queued' : `${matched.length} agent${matched.length !== 1 ? 's' : ''} matched`}
          </div>
          <div className="os-cmd-agent-chips">
            {(matched.length === AGENTS.length ? AGENTS : matched).map(a => (
              <div key={a.id} className="os-cmd-agent-chip">
                <span className="os-cmd-agent-chip-icon">{a.icon}</span>
                <div>
                  <div className="os-cmd-agent-chip-name">{a.label}</div>
                  <div className="os-cmd-agent-chip-desc">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Run button */}
      <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className={`os-cmd-run-btn${isRunning ? ' running' : ''}`}
          onClick={handleSubmit}
          disabled={!intent.trim() || isRunning}
        >
          {isRunning
            ? <><span className="os-cmd-spinner" /> Running…</>
            : submitted
            ? '✓ Dispatched'
            : '→ Run Agents'}
        </button>
        {error && (
          <div style={{ fontSize: 12, color: 'var(--os-red)', fontFamily: 'var(--ff-sans)' }}>
            {error}
          </div>
        )}
      </div>

      {/* Live cycle status */}
      {cycleState === 'cycle_running' && agentOutputs.length > 0 && (
        <div className="os-cmd-live-block">
          <div className="os-cmd-section-label" style={{ marginBottom: 10 }}>Live status</div>
          {agentOutputs.map(o => (
            <div key={o.agentId} className="os-cmd-live-row">
              <div className={`os-cmd-live-dot ${o.status}`} />
              <div className="os-cmd-live-name">{o.agentName}</div>
              <div className={`os-cmd-live-status ${o.status}`}>
                {o.status === 'running' ? 'Running…' :
                 o.status === 'done'    ? 'Done'     :
                 o.status === 'failed'  ? 'Failed'   :
                 o.status === 'skipped' ? 'Skipped'  : 'Queued'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Command history */}
      {history.length > 0 && (
        <div className="os-cmd-history-block">
          <div className="os-cmd-section-label" style={{ marginBottom: 8 }}>Recent commands</div>
          {history.map((h, i) => (
            <div key={i} className="os-cmd-history-row">
              <div className={`os-cmd-history-dot ${h.status}`} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="os-cmd-history-intent">{h.intent}</div>
                <div className="os-cmd-history-meta">
                  {h.agents.join(', ')} · {new Date(h.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <button
                className="os-cmd-rerun-btn"
                onClick={() => setIntent(h.intent)}
                disabled={isRunning}
              >
                ↺
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
