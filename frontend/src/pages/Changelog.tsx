import React from 'react'
import { MarketingLayout } from '../components/MarketingLayout'

const LOGS = [
  {
    version: 'Audit Engine v2.4',
    date: 'March 20, 2024',
    title: 'Deeper Technical Scan Architecture',
    changes: [
      'Implemented 12 new technical data points including structured data validation.',
      'Revised scoring logic for localized Industry Standards.',
      'Faster report generation (average reduction of 15 seconds).',
      'Improved accuracy of revenue leak assessments.'
    ]
  },
  {
    version: 'Audit Engine v2.3',
    date: 'February 15, 2024',
    title: 'New Service Categories',
    changes: [
      'Added optimized intelligence for Lawn Care and HVAC categories.',
      'Enhanced AI narrative engine for more actionable growth roadmaps.',
      'Refined grade thresholds to better reflect market authority targets.'
    ]
  },
  {
    version: 'Audit Engine v2.2',
    date: 'January 10, 2024',
    title: 'Intelligence Dashboard Alpha',
    changes: [
      'Initial release of the authenticated dashboard for history tracking.',
      'Added baseline scores for all 10 analysis categories.',
      'Clerk authentication integration for better data security.'
    ]
  }
]

export default function Changelog() {
  return (
    <MarketingLayout>
      <div style={{ backgroundColor: 'var(--bg)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text)' }}>
              Engine Evolution.
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text2)', lineHeight: 1.6 }}>
              A history of improvements to our intelligence engine and industry standards.
            </p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            {LOGS.map((log, i) => (
              <section key={log.version} style={{ borderLeft: '2px solid var(--border)', paddingLeft: '2rem', position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', top: 0, left: -22, width: 42, height: 42, 
                  background: 'var(--bg)', borderRadius: '50%', border: '2px solid var(--accent)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 10
                }}>v{i === 0 ? 'Latest' : 2.4 - i * 0.1}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                  <h3 style={{ fontFamily: 'var(--ff-display)', color: 'var(--text)', fontSize: '1.5rem', margin: 0 }}>{log.title}</h3>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>{log.date}</span>
                </div>
                <div style={{ background: 'var(--bg2)', padding: '1.5rem', borderRadius: 'var(--r)', border: '1px solid var(--border)' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {log.changes.map(c => (
                      <li key={c} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', gap: 10, lineHeight: 1.6 }}>
                        <span style={{ color: 'var(--accent)' }}>•</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
