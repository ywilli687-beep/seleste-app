import MarketingLayout from '@/components/MarketingLayout'

export default function Privacy() {
  const sectionStyle: React.CSSProperties = { padding: '120px 2rem', maxWidth: '800px', margin: '0 auto', boxSizing: 'border-box' }
  const blockStyle: React.CSSProperties = { marginBottom: '4rem' }
  const headlineStyle: React.CSSProperties = { fontFamily: 'var(--ff-display)', fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--ink)' }
  const paraStyle: React.CSSProperties = { color: 'var(--ink-muted)', lineHeight: 1.8, fontSize: '16px', marginBottom: '1.5rem' }

  return (
    <MarketingLayout>
      <section style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <h1 className="text-h1" style={{ marginBottom: '1.5rem' }}>Privacy Policy</h1>
          <p className="text-body" style={{ maxWidth: '640px', margin: '0 auto' }}>
             Last updated Oct 28, 2026. How we protect your business data at Seleste.
          </p>
        </div>

        <div style={blockStyle}>
          <h2 style={headlineStyle}>1. Data We Collect</h2>
          <p style={paraStyle}>
            When you run an audit, we securely fetch your website's public data. We do not access private servers or internal documents. If you sign up for an account, we collect your email address and business name to provide your growth roadmap.
          </p>
        </div>

        <div style={blockStyle}>
          <h2 style={headlineStyle}>2. How We Use Your Data</h2>
          <p style={paraStyle}>
            The information we gather is used only to generate your website audit and provide direct advice on how to grow your business. We do not sell your business data, contact lists, or reports to third parties.
          </p>
        </div>

        <div style={blockStyle}>
          <h2 style={headlineStyle}>3. Security Measures</h2>
          <p style={paraStyle}>
            All audit reports and account data are encrypted and stored on secure cloud servers. Access is strictly limited to the necessary infrastructure for processing your requests and providing technical support.
          </p>
        </div>

        <div style={blockStyle}>
          <h2 style={headlineStyle}>4. Your Rights</h2>
          <p style={paraStyle}>
            You can request a complete copy of your business data or ask for the total deletion of your account and all associated scan history at any time by contacting us through our support desk.
          </p>
        </div>
      </section>
    </MarketingLayout>
  )
}
