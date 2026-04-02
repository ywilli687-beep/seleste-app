import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { X, Loader2, CheckCircle2 } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  source: string
  score?: number
  vertical?: string
}

export function WaitlistModal({ isOpen, onClose, source, score, vertical }: Props) {
  const { user } = useUser()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setEmail(user.primaryEmailAddress.emailAddress)
    }
  }, [user])

  if (!isOpen) return null

  const handleJoin = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, score, vertical }),
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('[Waitlist Fetch Error]', err)
      setStatus('error')
      setErrorMessage('Network error. Please check your connection.')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div className="modal-success">
            <CheckCircle2 size={48} color="var(--green)" style={{ marginBottom: 24 }} />
            <h2 className="text-h1" style={{ textAlign: 'center' }}>You're on the list!</h2>
            <p className="text-body" style={{ textAlign: 'center', marginTop: 12, maxWidth: 320 }}>
              We'll notify you as soon as Growth Pro spots open up for {vertical || 'your area'}.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={onClose}
              style={{ marginTop: 32, padding: '14px 40px', width: '100%' }}
            >
              Back to Audit
            </button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <span className="chip" style={{ background: 'var(--green-bg)', color: 'var(--green)', border: '1px solid var(--green)' }}>Coming Soon</span>
              <h2 className="text-h1" style={{ marginTop: 16 }}>Join the Growth Pro Waitlist</h2>
              <p className="text-body" style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6 }}>
                Be the first to unlock automated budget re-balancing, 24/7 competitor poaching, and weekly growth snapshots.
              </p>
            </div>

            <div className="modal-body" style={{ marginTop: 32 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label className="text-small" style={{ color: 'var(--ink)' }}>Work Email</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="you@business.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  autoFocus
                />
              </div>

              {status === 'error' && (
                <p style={{ color: 'var(--coral)', fontSize: 13, marginTop: 12, fontWeight: 500 }}>{errorMessage}</p>
              )}

              <button 
                className="btn btn-primary" 
                onClick={handleJoin}
                disabled={status === 'loading'}
                style={{ 
                  marginTop: 32, 
                  width: '100%', 
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  fontSize: 16
                }}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Secure My Spot'
                )}
              </button>

              <p className="text-body" style={{ textAlign: 'center', marginTop: 20, color: 'var(--ink-muted)', fontSize: 12 }}>
                Join 2,400+ owners building with Seleste.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
