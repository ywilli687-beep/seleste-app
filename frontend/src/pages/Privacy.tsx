import React from 'react'
import { MarketingLayout } from '../components/MarketingLayout'

export default function Privacy() {
  return (
    <MarketingLayout>
      <div style={{ backgroundColor: 'var(--bg)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text)' }}>
              Privacy Statement.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text2)', lineHeight: 1.6 }}>
              How we handle your business intelligence and data points.
            </p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', color: 'var(--text2)', lineHeight: 1.8, fontSize: 15 }}>
            <section>
              <h3 style={{ color: 'var(--text)', marginBottom: '1rem' }}>1. Information We Extract</h3>
              <p>When you run an audit, our engine fetches your public business URL to analyze structured data, technical foundations, and user experience patterns. This intelligence is stored securely as a "snapshot" of your market authority.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text)', marginBottom: '1rem' }}>2. Data Intelligence Usage</h3>
              <p>We use your audit results to build industry standards and to provide personalized growth actions. We do not sell your raw business data to third parties. Our internal comparison tools use anonymized aggregates for vertical performance scoring.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text)', marginBottom: '1rem' }}>3. Secure Authentication</h3>
              <p>We use Clerk for all identity management. Your password and personal login credentials never touch our servers directly. For more details on how your account data is handled, please refer to the Clerk privacy policy.</p>
            </section>

            <section>
              <h3 style={{ color: 'var(--text)', marginBottom: '1rem' }}>4. Analysis Retention</h3>
              <p>Free audits are retained for 30 days unless a permanent account is created. Pro users have indefinite access to their intelligence history and roadmap progress until account deletion.</p>
            </section>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
