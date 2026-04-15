import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { apiPost } from '../../lib/api'

interface Message { role: 'user' | 'assistant'; content: string; ts: number }
interface AskSelesteProps { businessId: string | undefined }

const STARTERS = [
  'What should I fix first?',
  'Why is my SEO score low?',
  'How do I improve conversions?',
  "What's my biggest revenue opportunity?",
]

export function AskSeleste({ businessId }: AskSelesteProps) {
  const [open,     setOpen]     = useState(false)
  const [input,    setInput]    = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading,  setLoading]  = useState(false)
  const { getToken } = useAuth()
  const bottomRef    = useRef<HTMLDivElement>(null)
  const inputRef     = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [open, messages])

  async function send(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg || !businessId || loading) return
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: msg, ts: Date.now() }])
    setLoading(true)
    try {
      const token    = await getToken()
      const response = await apiPost<{ reply: string }>('/api/chat', token!, { message: msg, businessId })
      setMessages((prev) => [...prev, { role: 'assistant', content: response.reply, ts: Date.now() }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong — please try again.', ts: Date.now() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button className="ask-trigger" onClick={() => setOpen((o) => !o)} aria-label="Ask Seleste">
        <span className="ask-trigger__icon">{open ? '×' : 'Ask'}</span>
      </button>

      {open && (
        <div className="ask-panel">
          <div className="ask-panel__header">
            <span className="ask-panel__title">Ask Seleste</span>
            <span className="ask-panel__sub">Answers based on your real audit data</span>
          </div>
          <div className="ask-panel__messages">
            {messages.length === 0 && (
              <div className="ask-panel__starters">
                <div className="ask-starters__label">Quick questions</div>
                {STARTERS.map((p) => (
                  <button key={p} className="ask-starter" onClick={() => send(p)}>{p}</button>
                ))}
              </div>
            )}
            {messages.map((m) => (
              <div key={m.ts} className={`ask-message ask-message--${m.role}`}>{m.content}</div>
            ))}
            {loading && (
              <div className="ask-message ask-message--assistant ask-message--loading">
                <span className="ask-dot" /><span className="ask-dot" /><span className="ask-dot" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="ask-panel__input">
            <input
              ref={inputRef}
              className="ask-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask anything about your business..."
              disabled={loading || !businessId}
            />
            <button
              className="ask-send"
              onClick={() => send()}
              disabled={loading || !input.trim() || !businessId}
            >→</button>
          </div>
        </div>
      )}
    </>
  )
}
