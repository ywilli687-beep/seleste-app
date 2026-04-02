import React, { useState } from 'react'
import { MarketingLayout } from '../components/MarketingLayout'

const POSTS = [
  {
    title: 'How a Local Dental Practice Improved Their Growth Score by 40%',
    desc: 'Uncovering the critical technical and content gaps that were stalling patient acquisition.',
    date: 'March 28, 2024',
    category: 'Case Study'
  },
  {
    title: 'The 10 High-Authority Data Points Every Home Service Business Needs',
    desc: 'Why technical foundations and trust indicators matter more than design for market leaders.',
    date: 'March 22, 2024',
    category: 'Growth Insights'
  },
  {
    title: 'Understanding Industry Standards in the Restaurant Category',
    desc: 'How conversion-optimized sites differ from digital brochures in the dining industry.',
    date: 'March 15, 2024',
    category: 'Deep-Scan'
  }
]

export default function Blog() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setDone(true)
  }

  return (
    <MarketingLayout>
      <div style={{ backgroundColor: 'var(--bg)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem' }}>
            {/* Posts */}
            <div>
              <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '3rem', color: 'var(--text)' }}>
                Intelligence & Analysis.
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {POSTS.map(p => (
                  <article key={p.title} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '3rem' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.05em' }}>{p.category}</div>
                    <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)', lineHeight: 1.3 }}>{p.title}</h2>
                    <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: '1.5rem', lineHeight: 1.7 }}>{p.desc}</p>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>{p.date} • Read full report →</div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside>
              <div style={{ background: 'var(--bg2)', padding: '2rem', borderRadius: 'var(--r)', border: '1px solid var(--border)', position: 'sticky', top: 104 }}>
                <h4 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text)' }}>Weekly Findings</h4>
                <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Direct insights from our audit engine delivered to your inbox once a week.
                </p>
                {done ? (
                  <div style={{ padding: '12px', background: 'var(--green-bg)', color: 'var(--green)', borderRadius: 'var(--rs)', fontSize: 13, fontWeight: 600 }}>
                    Successfully subscribed. Welcome!
                  </div>
                ) : (
                  <form onSubmit={subscribe} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <input 
                      type="email" 
                      placeholder="business@example.com" 
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--rs)', color: 'var(--text)', fontSize: 14 }}
                    />
                    <button style={{ background: 'var(--accent)', border: 'none', padding: '12px', borderRadius: 'var(--rs)', fontWeight: 700, cursor: 'pointer', color: '#0a0a0f' }}>Subscribe</button>
                  </form>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
