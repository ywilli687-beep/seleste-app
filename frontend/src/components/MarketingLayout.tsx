import React from 'react'

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, left: 0, right: 0, 
        height: 64, 
        backgroundColor: 'rgba(10, 10, 15, 0.82)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 100
      }}>
        <a href="/" style={{ 
          fontFamily: 'var(--ff-display)', 
          fontSize: '1.5rem', 
          fontWeight: 800, 
          color: 'var(--accent)', 
          textDecoration: 'none',
          letterSpacing: '-0.04em'
        }}>
          Seleste
        </a>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <a href="/features" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', textDecoration: 'none' }}>Analysis Features</a>
          <a href="/pricing" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', textDecoration: 'none' }}>Plan & Cost</a>
          <a href="/faq" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', textDecoration: 'none' }}>Common Questions</a>
          <a href="/sign-in" style={{ 
            fontSize: 13, 
            fontWeight: 600, 
            color: '#0a0a0f', 
            backgroundColor: 'var(--accent)',
            padding: '8px 16px',
            borderRadius: 'var(--rs)',
            textDecoration: 'none'
          }}>
            Explore Intelligence →
          </a>
        </div>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, paddingTop: 64 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border)', 
        padding: '4rem 2rem 2rem', 
        backgroundColor: 'var(--bg2)',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 12 }}>Seleste</div>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, maxWidth: 280 }}>
              Leading-edge growth intelligence for local businesses. Uncover the standards that drive market authority.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Resources</div>
              <a href="/features" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>Features</a>
              <a href="/blog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>Blog & Analysis</a>
              <a href="/changelog" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>Release Notes</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Legal</div>
              <a href="/privacy" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="/terms" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>Terms of Service</a>
              <a href="/contact" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>Contact Support</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Company</div>
              <a href="/faq" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>General FAQ</a>
              <a href="https://github.com/ywilli687-beep/seleste-app" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>GitHub Profile</a>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '2rem auto 0', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.03)', textAlign: 'center', fontSize: 12, color: 'rgba(244,241,236,0.42)' }}>
          © {new Date().getFullYear()} Seleste Antigravity Intelligence. Built for local authority.
        </div>
      </footer>
    </div>
  )
}
