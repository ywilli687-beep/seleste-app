import React, { useState } from 'react'
import { MarketingLayout } from '../components/MarketingLayout'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <MarketingLayout>
      <div style={{ backgroundColor: 'var(--bg)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text)' }}>
              Let's Connect.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text2)', lineHeight: 1.6 }}>
              Whether you're looking for enterprise intelligence or just have a quick question about your report.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4rem' }}>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h4 style={{ fontFamily: 'var(--ff-display)', color: 'var(--text)', fontSize: 16, marginBottom: 8 }}>General Questions</h4>
                  <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                    support@seleste-app.com <br/>
                    We typically respond in under 4 hours during business days.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--ff-display)', color: 'var(--text)', fontSize: 16, marginBottom: 8 }}>Plan Consults</h4>
                  <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                    sales@seleste-app.com <br/>
                    Discuss Pro plans or white-labeling our intelligence snapshot for your agency.
                  </p>
                </div>
                 <div>
                  <h4 style={{ fontFamily: 'var(--ff-display)', color: 'var(--text)', fontSize: 16, marginBottom: 8 }}>Our Headspace</h4>
                  <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
                    Distributed first. <br/>
                    San Francisco / New York / Remote.
                  </p>
                </div>
              </div>
            </div>

            <div>
              {sent ? (
                <div style={{ textAlign: 'center', background: 'var(--bg2)', padding: '4rem 2rem', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
                  <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', marginBottom: '1rem' }}>Message Received.</h3>
                  <p style={{ fontSize: 14, color: 'var(--text2)' }}>One of our analysts will be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ background: 'var(--bg2)', padding: '2.5rem', borderRadius: 'var(--r)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Full Name</label>
                    <input type="text" required style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--rs)', color: 'var(--text)' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Email Address</label>
                    <input type="email" required style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--rs)', color: 'var(--text)' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>How can we help?</label>
                    <textarea required rows={4} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--rs)', color: 'var(--text)', resize: 'none' }} />
                  </div>
                  <button type="submit" style={{ background: 'var(--accent)', border: 'none', padding: '16px', borderRadius: 'var(--rs)', fontWeight: 700, color: '#0a0a0f', cursor: 'pointer', marginTop: 10 }}>Submit Inquiry</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
