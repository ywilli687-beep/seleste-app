import React, { useState } from 'react'
import { MarketingLayout } from '../components/MarketingLayout'
import { WaitlistModal } from '../components/ui/WaitlistModal'

export default function Pricing() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)

  return (
    <MarketingLayout>
      <div style={{ backgroundColor: 'var(--bg)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text)' }}>
              Plans for Market Authority.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text2)', maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
              Whether you're just starting to audit or you're managing multiple workspaces, 
              we have a growth plan that fits your business stage.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem', maxWidth: 900, margin: '0 auto 6rem' }}>
            {/* Free */}
            <div style={{ background: 'var(--bg2)', padding: '3.5rem 3rem', borderRadius: 'var(--r)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.05em' }}>Free Explorer</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800 }}>$0</span>
                <span style={{ color: 'var(--text2)' }}>/ mo</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: '2rem', lineHeight: 1.6 }}>Perfect for independent business owners who want to see their market position.</p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['One Deep-Scan Analysis', '10-Category Dashboard', 'Priority Growth Actions', '30-Day Snapshot Retention'].map(f => (
                  <li key={f} style={{ fontSize: 13, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--green)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="/sign-up" style={{ marginTop: 'auto', textAlign: 'center', padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--rs)', color: 'var(--text)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>Get Started Free</a>
            </div>

            {/* Pro */}
            <div style={{ background: 'var(--panel)', padding: '3.5rem 3rem', borderRadius: 'var(--r)', border: '2px solid var(--accent)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
               <div style={{ 
                position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                background: 'var(--accent)', color: '#0a0a0f', padding: '4px 14px', borderRadius: 'var(--rs)', 
                fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>Most Popular</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.05em' }}>Pro Authority</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800 }}>$49</span>
                <span style={{ color: 'var(--text2)' }}>/ mo</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: '2rem', lineHeight: 1.6 }}>For high-growth agencies managing authority for local businesses.</p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Unlimited Analyses', 'White-Label Snapshots', 'Advanced Market Comparison', 'Intelligence API Access'].map(f => (
                  <li key={f} style={{ fontSize: 13, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--green)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => setIsWaitlistOpen(true)}
                style={{ 
                  marginTop: 'auto', textAlign: 'center', padding: '12px', background: 'var(--accent)', 
                  borderRadius: 'var(--rs)', color: '#0a0a0f', border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700 
                }}
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>

      <WaitlistModal 
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        source="pricing_page_pro"
      />
    </MarketingLayout>
  )
}
