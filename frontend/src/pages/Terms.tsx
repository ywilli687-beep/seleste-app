import MarketingLayout from '@/components/MarketingLayout'

export default function Terms() {
  const sectionStyle: React.CSSProperties = { padding: '120px 2rem', maxWidth: '800px', margin: '0 auto', boxSizing: 'border-box' }
  const blockStyle: React.CSSProperties = { marginBottom: '4rem' }
  const headlineStyle: React.CSSProperties = { fontFamily: 'var(--ff-display)', fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--ink)' }
  const paraStyle: React.CSSProperties = { color: 'var(--ink-muted)', lineHeight: 1.8, fontSize: '16px', marginBottom: '1.5rem' }

  return (
    <MarketingLayout>
      <section style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <h1 className="text-h1" style={{ marginBottom: '1.5rem' }}>Terms of Service</h1>
          <p className="text-body" style={{ maxWidth: '640px', margin: '0 auto' }}>
             Last updated Oct 28, 2026. The rules of the road for using Seleste.
          </p>
        </div>

        <div style={blockStyle}>
          <h2 style={headlineStyle}>1. Usage Rules</h2>
          <p style={paraStyle}>
            By using Seleste, you agree to provide accurate information and to only scan websites that you own or have permission to audit. You should use our roadmap and recommendations responsibly to grow your business presence online.
          </p>
        </div>

        <div style={blockStyle}>
          <h2 style={headlineStyle}>2. Account Ownership</h2>
          <p style={paraStyle}>
            You are responsible for keeping your Seleste account information, including your login credentials, kept safe. Any actions taken through your account are your responsibility.
          </p>
        </div>

        <div style={blockStyle}>
          <h2 style={headlineStyle}>3. Limitation of Liability</h2>
          <p style={paraStyle}>
            Seleste provides growth advice based on automated analysis. While we provide high-quality roadmaps, we cannot guarantee specific revenue results. You are responsible for any changes you make to your website based on our suggestions.
          </p>
        </div>

        <div style={blockStyle}>
          <h2 style={headlineStyle}>4. Service Changes</h2>
          <p style={paraStyle}>
            We continuously improve our audit engine. We may update features or change pricing from time to time. We will always notify you of significant changes to our service that affect your account.
          </p>
        </div>
      </section>
    </MarketingLayout>
  )
}
