export default function Terms() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '120px 2rem 6rem' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 60, background: 'rgba(10,10,15,.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <a href="/" style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', color: 'var(--accent)', textDecoration: 'none' }}>Seleste</a>
      </nav>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '2.5rem', marginBottom: '.5rem' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text3)', fontSize: 13, fontFamily: 'var(--ff-mono)', marginBottom: '3rem' }}>Last updated: March 26, 2026</p>
        {[
          { h: '1. Acceptance of Terms', b: 'By creating an account or using Seleste, you agree to these Terms of Service. If you do not agree, do not use the service.' },
          { h: '2. Description of Service', b: 'Seleste provides AI-powered digital audit and business intelligence services for small businesses. We analyze publicly accessible website data to generate scoring and recommendations.' },
          { h: '3. User Accounts', b: 'You are responsible for maintaining the security of your account credentials. You must provide accurate information when creating your account. Accounts may not be shared or resold.' },
          { h: '4. Acceptable Use', b: 'You may not use Seleste to audit websites you do not own or have explicit permission to analyze. You may not attempt to reverse-engineer, scrape, or abuse the service infrastructure.' },
          { h: '5. Audit Accuracy', b: 'Seleste provides analysis based on publicly available data at the time of auditing. We do not guarantee that all recommendations will improve your business outcomes. Results are informational, not guaranteed outcomes.' },
          { h: '6. Payment & Cancellation', b: 'Paid plans are billed monthly in advance. You may cancel at any time and your access continues until the end of the current billing period. We offer a 14-day money-back guarantee for first-time subscribers.' },
          { h: '7. Intellectual Property', b: 'Seleste and its scoring methodology remain our intellectual property. Your business data and audit results belong to you.' },
          { h: '8. Limitation of Liability', b: 'Seleste is not liable for any indirect, incidental, or consequential damages arising from use of the service. Our maximum liability shall not exceed the amount you paid us in the prior three months.' },
          { h: '9. Termination', b: 'We reserve the right to suspend or terminate accounts that violate these terms. You may terminate your account at any time from your settings page.' },
          { h: '10. Contact', b: 'For legal inquiries, contact legal@seleste.app.' },
        ].map(s => (
          <div key={s.h} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', marginBottom: '.75rem', color: 'var(--accent)' }}>{s.h}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--text2)' }}>{s.b}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
