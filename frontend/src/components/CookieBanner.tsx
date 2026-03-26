import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('seleste_cookies')
    if (!accepted) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('seleste_cookies', 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)', padding: '1rem 1.5rem', display: 'flex',
      alignItems: 'center', gap: '1.5rem', maxWidth: 600, width: 'calc(100% - 3rem)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)',
    }}>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, flex: 1 }}>
        We use cookies for authentication and to remember your preferences.{' '}
        <a href="/privacy" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Privacy Policy</a>
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={() => setVisible(false)} style={{ background: 'none', border: '1px solid var(--border2)', color: 'var(--text3)', padding: '8px 16px', borderRadius: 'var(--rs)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--ff-sans)' }}>
          Decline
        </button>
        <button onClick={accept} style={{ background: 'var(--accent)', border: 'none', color: '#0a0a0f', padding: '8px 16px', borderRadius: 'var(--rs)', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--ff-sans)' }}>
          Accept
        </button>
      </div>
    </div>
  )
}
