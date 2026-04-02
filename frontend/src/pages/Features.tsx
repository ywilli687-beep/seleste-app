import React from 'react'
import { MarketingLayout } from '../components/MarketingLayout'

export default function Features() {
  return (
    <MarketingLayout>
      <div style={{ backgroundColor: 'var(--bg)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text)' }}>
              Intelligence That Drives Growth.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text2)', maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
              We extract 60+ critical data points from your local business website to benchmark your performance against 
              high-growth standards in your specific industry.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4rem', marginBottom: '6rem' }}>
            <div>
              <div style={{ background: 'var(--bg2)', padding: '2.5rem', borderRadius: 'var(--r)', border: '1px solid var(--border)', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
                <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
                  Deep-Scan Analysis
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>
                  Our proprietary engine doesn't just skim the surface. We analyze your technical foundations, user experience, 
                  content authority, and trust indicators using 47 rule-based logic checks.
                </p>
              </div>
            </div>
            <div>
              <div style={{ background: 'var(--bg2)', padding: '2.5rem', borderRadius: 'var(--r)', border: '1px solid var(--border)', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📈</div>
                <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
                  Industry Comparisons
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>
                  Stop guessing. We compare your growth metrics against real-world standards for landscaping, dental practices, 
                  home services, and more. See exactly where you lead and where you lag.
                </p>
              </div>
            </div>
            <div>
              <div style={{ background: 'var(--bg2)', padding: '2.5rem', borderRadius: 'var(--r)', border: '1px solid var(--border)', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
                <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
                  Instant Recommendations
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>
                  Within seconds, you'll receive high-impact growth actions tailored to your score. No generic advice — just 
                  precise optimizations that move the needle for your business authority.
                </p>
              </div>
            </div>
            <div>
              <div style={{ background: 'var(--bg2)', padding: '2.5rem', borderRadius: 'var(--r)', border: '1px solid var(--border)', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
                <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
                  Authority Tracking
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>
                  Your score isn't a one-time event. Use our intelligence dashboard to track your progress over time, 
                  unlock achievements as you fix critical gaps, and maintain a 30-day snapshot of your market position.
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--bg2) 0%, rgba(200, 169, 110, 0.05) 100%)', padding: '5rem 3rem', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text)' }}>
              Ready for your intelligence report?
            </h2>
            <p style={{ color: 'var(--text2)', maxWidth: 600, margin: '0 auto 2.5rem', fontSize: '1.125rem' }}>
              Run your audit now and uncover your growth potential in under 60 seconds.
            </p>
            <a href="/" style={{ 
              display: 'inline-block',
              padding: '1rem 2.5rem', 
              background: 'var(--accent)', 
              color: '#0a0a0f', 
              fontSize: '15px', 
              fontWeight: 700, 
              borderRadius: 'var(--rs)', 
              textDecoration: 'none',
              boxShadow: '0 10px 20px rgba(200, 169, 110, 0.15)'
            }}>
              Start Free Scan →
            </a>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
