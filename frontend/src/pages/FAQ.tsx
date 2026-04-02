import React, { useState } from 'react'
import { MarketingLayout } from '../components/MarketingLayout'

const FAQS = [
  {
    q: 'How does the analysis engine work?',
    a: 'Seleste scans your website in real-time, extracting 60+ critical data points ranging from technical speed to content authority. We run these against 47 industry-standard rules to build your growth score.'
  },
  {
    q: 'Are the scores accurate for local businesses?',
    a: 'Yes. Our intelligence layer is specifically tuned for local business requirements. We compare your metrics against the standards of your specific industry and location, not generic global websites.'
  },
  {
    q: 'Do I need technical skills to understand the report?',
    a: 'Not at all. While the backend analysis is complex, we present our findings in plain English with clear, high-priority actions any business owner can understand and implement.'
  },
  {
    q: 'Can I cancel my Pro plan at any time?',
    a: 'Absolutely. We believe in earning your trust every month. You can downgrade or cancel from your workspace settings with a single click — no hidden fees or cancellation penalties.'
  },
  {
    q: 'What industries do you support?',
    a: 'We have optimized intelligence for home services, landscaping, dental, restaurant, legal, fitness, and many more categories where local market authority is critical for growth.'
  },
  {
    q: 'How often should I run an audit?',
    a: 'Market authority is dynamic. We recommend running a deep-scan every 30 days to track your progress as you implement optimizations and to see how your industry standards shift over time.'
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <MarketingLayout>
      <div style={{ backgroundColor: 'var(--bg)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text)' }}>
              Common Questions.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text2)', lineHeight: 1.6 }}>
              Everything you need to know about our growth intelligence platform for local businesses.
            </p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FAQS.map((f, i) => (
              <div 
                key={i} 
                style={{ 
                  background: 'var(--bg2)', 
                  borderRadius: 'var(--r)', 
                  border: '1px solid var(--border)', 
                  overflow: 'hidden'
                }}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{ 
                    width: '100%', 
                    padding: '1.5rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    background: 'transparent', 
                    border: 'none', 
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{f.q}</span>
                  <span style={{ fontSize: 20, color: 'var(--accent)', transition: 'transform 0.2s', transform: openIndex === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {openIndex === i && (
                  <div style={{ padding: '0 1.5rem 1.5rem', fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
