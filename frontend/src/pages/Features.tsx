import MarketingLayout from '@/components/MarketingLayout'

export default function Features() {
  const sectionStyle: React.CSSProperties = {
    padding: '120px 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    boxSizing: 'border-box'
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '3rem',
    marginTop: '5rem'
  }

  const featureCardStyle: React.CSSProperties = {
    background: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: '24px',
    padding: '3rem',
    transition: 'transform 0.3s'
  }

  const iconStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    display: 'block'
  }

  return (
    <MarketingLayout>
      <section style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <h1 className="text-h1" style={{ marginBottom: '1.5rem' }}>Growth tools for Main Street</h1>
          <p className="text-body" style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1.1rem' }}>
            We built Seleste to give local business owners the same data-driven advantages that big tech companies use every day.
          </p>
        </div>

        <div style={gridStyle}>
          <div style={featureCardStyle}>
            <span style={iconStyle}>🔍</span>
            <h2 className="text-h2" style={{ marginBottom: '1.25rem' }}>Live Website Analysis</h2>
            <p className="text-body">
              Seleste doesn't just look at code; it looks at your business from a customer's point of view. We scan 47 different areas of your site to find exactly where you're losing traffic.
            </p>
          </div>

          <div style={featureCardStyle}>
            <span style={iconStyle}>🗺️</span>
            <h2 className="text-h2" style={{ marginBottom: '1.25rem' }}>Growth Roadmap</h2>
            <p className="text-body">
              Stop guessing what to fix first. We rank every technical issue by its direct impact on your sales, giving you a clear path to follow over the next 90 days.
            </p>
          </div>

          <div style={featureCardStyle}>
            <span style={iconStyle}>🤖</span>
            <h2 className="text-h2" style={{ marginBottom: '1.25rem' }}>AI-Driven Strategy</h2>
            <p className="text-body">
              Our growth engine writes specific, plain-English advice for your business. No more technical jargon or dense reports you can't understand.
            </p>
          </div>

          <div style={featureCardStyle}>
            <span style={iconStyle}>📈</span>
            <h2 className="text-h2" style={{ marginBottom: '1.25rem' }}>Industry Tracking</h2>
            <p className="text-body">
              See how your online presence measures up against other businesses in your area. We show you the gaps your competitors are leaving for you to fill.
            </p>
          </div>

          <div style={featureCardStyle}>
            <span style={iconStyle}>🛡️</span>
            <h2 className="text-h2" style={{ marginBottom: '1.25rem' }}>Trust Verification</h2>
            <p className="text-body">
              We check for the small things that build big trust: secure connections, clear contact info, and visible customer proof that turns visitors into buyers.
            </p>
          </div>

          <div style={featureCardStyle}>
            <span style={iconStyle}>⚡</span>
            <h2 className="text-h2" style={{ marginBottom: '1.25rem' }}>Speed Diagnostics</h2>
            <p className="text-body">
              A slow site is a dead site. We identify the exact images or scripts that are slowing down your visitors, especially on mobile devices.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--panel)', padding: '100px 2rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <h2 className="text-h2" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Ready to grow?</h2>
        <a href="/" style={{ ...featureCardStyle, background: 'var(--accent)', color: '#000', padding: '16px 40px', borderRadius: '100px', fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
          Run your first scan free
        </a>
      </section>
    </MarketingLayout>
  )
}
