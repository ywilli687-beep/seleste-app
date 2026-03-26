export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '120px 2rem 6rem' }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 60, background: 'rgba(10,10,15,.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <a href="/" style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', color: 'var(--accent)', textDecoration: 'none' }}>Seleste</a>
      </nav>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '2.5rem', marginBottom: '.5rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text3)', fontSize: 13, fontFamily: 'var(--ff-mono)', marginBottom: '3rem' }}>Last updated: March 26, 2026</p>
        {[
          { h: '1. What We Collect', b: 'We collect your email address and name when you sign up via Clerk. We also collect the business URLs you submit for auditing, and the structured audit data we generate from those URLs. We do not sell your data to third parties.' },
          { h: '2. How We Use Your Data', b: 'Your data is used solely to provide the Seleste service — running audits, displaying results, and improving our scoring engine. We may send you transactional emails (audit completion, weekly digests) if you opt in.' },
          { h: '3. Data Storage', b: 'Audit data is stored in a secure Supabase PostgreSQL database hosted in the United States. Authentication is handled by Clerk, a SOC 2 Type II certified provider.' },
          { h: '4. Third-Party Services', b: 'We use Clerk for authentication, Supabase for data storage, Anthropic (Claude) for AI narrative generation, and Vercel/Render for hosting. Each of these providers has their own privacy policies.' },
          { h: '5. Cookies', b: 'We use cookies only for authentication session management via Clerk. We do not use advertising cookies or tracking pixels.' },
          { h: '6. Your Rights (GDPR)', b: 'If you are located in the EU/UK, you have the right to access, correct, or delete your personal data at any time. Contact us at privacy@seleste.app to exercise these rights.' },
          { h: '7. Data Retention', b: 'We retain your audit data for as long as you have an active account. When you delete your account, all associated data is permanently removed within 30 days.' },
          { h: '8. Contact', b: 'For any privacy-related questions, email us at privacy@seleste.app.' },
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
