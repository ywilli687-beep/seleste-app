import React from 'react'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const navStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    height: '64px',
    background: 'rgba(10, 10, 15, 0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    width: '100%',
    boxSizing: 'border-box'
  }

  const logoStyle: React.CSSProperties = {
    fontFamily: "var(--ff-display)",
    color: "var(--ink)",
    fontSize: "24px",
    fontWeight: 800,
    textDecoration: "none",
    letterSpacing: "-0.04em"
  }

  const navLinksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  }

  const navLinkStyle: React.CSSProperties = {
    color: 'var(--ink-muted)',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'color 0.2s'
  }

  const ctaStyle: React.CSSProperties = {
    background: 'var(--accent)',
    color: '#000',
    padding: '8px 18px',
    borderRadius: '100px',
    fontWeight: 700,
    fontSize: '14px',
    textDecoration: 'none',
    transition: 'transform 0.2s'
  }

  const footerStyle: React.CSSProperties = {
    padding: '6rem 2rem',
    background: '#0c0c12',
    borderTop: '1px solid var(--border)',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box'
  }

  const footerLinksStyle: React.CSSProperties = {
    display: 'flex',
    gap: '2.5rem',
    justifyContent: 'center',
    marginBottom: '2.5rem',
    flexWrap: 'wrap'
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={navStyle}>
        <a href="/" style={logoStyle}>Seleste</a>
        <div style={navLinksStyle}>
          <a href="/features" style={navLinkStyle}>Features</a>
          <a href="/pricing" style={navLinkStyle}>Pricing</a>
          <a href="/blog" style={navLinkStyle}>Blog</a>
          <a href="/dashboard" style={ctaStyle}>Dashboard</a>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        {children}
      </main>

      <footer style={footerStyle}>
        <div style={footerLinksStyle}>
          <a href="/privacy" style={navLinkStyle}>Privacy</a>
          <a href="/terms" style={navLinkStyle}>Terms</a>
          <a href="/contact" style={navLinkStyle}>Contact</a>
          <a href="/faq" style={navLinkStyle}>FAQ</a>
          <a href="/changelog" style={navLinkStyle}>Changelog</a>
        </div>
        <div style={{ color: '#444', fontSize: '12px', fontFamily: 'var(--ff-mono)' }}>
          © 2026 Seleste AI. Built for the Main Street economy.
        </div>
      </footer>
    </div>
  )
}
