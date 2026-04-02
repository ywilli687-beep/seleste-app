import MarketingLayout from '@/components/MarketingLayout'

export default function Contact() {
  const sectionStyle: React.CSSProperties = { padding: '120px 2rem', maxWidth: '800px', margin: '0 auto', boxSizing: 'border-box' }
  const fieldStyle: React.CSSProperties = { marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }
  const inputStyle: React.CSSProperties = { background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 18px', color: 'var(--ink)', fontSize: '15px' }
  const labelStyle: React.CSSProperties = { color: 'var(--ink-muted)', fontSize: '14px', fontWeight: 600 }

  return (
    <MarketingLayout>
      <section style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <h1 className="text-h1" style={{ marginBottom: '1.5rem' }}>Get in Touch</h1>
          <p className="text-body" style={{ maxWidth: '640px', margin: '0 auto' }}>
             Have questions? Our team is available to help clarify your growth Roadmap.
          </p>
        </div>

        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '32px', padding: '4rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <form style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Your Name</label>
              <input type="text" placeholder="Jane Doe" style={inputStyle} />
            </div>
            
            <div style={fieldStyle}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" placeholder="jane@mainstreet.com" style={inputStyle} />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>How can we help?</label>
              <textarea placeholder="Tell us about your business and your growth goals..." style={{ ...inputStyle, minHeight: '150px', resize: 'none' }}></textarea>
            </div>

            <button type="button" style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '18px', borderRadius: '100px', fontWeight: 800, fontSize: '16px', marginTop: '1.5rem', cursor: 'pointer' }}>
               Send Message
            </button>
          </form>
        </div>

        <div style={{ marginTop: '5rem', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '4rem' }}>
          <div>
            <div style={{ color: 'var(--accent)', fontWeight: 800, marginBottom: '0.5rem' }}>Email</div>
            <div style={{ color: 'var(--ink-muted)' }}>hello@selesteai.com</div>
          </div>
          <div>
            <div style={{ color: 'var(--accent)', fontWeight: 800, marginBottom: '0.5rem' }}>Support</div>
            <div style={{ color: 'var(--ink-muted)' }}>support@selesteai.com</div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
