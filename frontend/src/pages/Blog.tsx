'use client'
import { useState } from 'react'
import MarketingLayout from '@/components/MarketingLayout'

const POSTS = [
  { date: "Oct 24, 2026", title: "Why your mobile speed is costing you customers", summary: "Learn how a 3-second delay on your mobile site can lead to a 50% drop in store bookings.", icon: "⚡" },
  { date: "Oct 12, 2026", title: "5 small things that build big customer trust", summary: "Simple design changes that turn your local website from a brochure into a growth machine.", icon: "🛡️" },
  { date: "Sep 28, 2026", title: "How to rank better in local search this year", summary: "A plain-English guide to getting found by customers in your immediate neighborhood.", icon: "📍" },
  { date: "Sep 15, 2026", title: "The secret to growing your restaurant online", summary: "How to optimize your digital menu and booking path for maximum conversion.", icon: "🍴" }
]

function EmailCapture() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    padding: '16px 20px',
    borderRadius: '100px',
    color: 'var(--ink)',
    fontSize: '16px',
    width: '100%',
    flex: 1,
    outline: 'none'
  }

  const btnStyle: React.CSSProperties = {
    background: 'var(--accent)',
    color: '#000',
    padding: '16px 40px',
    borderRadius: '100px',
    fontWeight: 800,
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  }

  if (subscribed) {
    return <div style={{ color: 'var(--green)', fontWeight: 600 }}>Thanks for subscribing! Check your inbox soon.</div>
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '640px', margin: '0 auto', flexWrap: 'wrap' }}>
      <input type="email" placeholder="Your work email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
      <button onClick={() => setSubscribed(true)} style={btnStyle}>Subscribe</button>
    </div>
  )
}

export default function Blog() {
  const sectionStyle: React.CSSProperties = { padding: '120px 2rem', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }
  const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '3rem', marginTop: '6rem' }
  const postCardStyle: React.CSSProperties = { background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '32px', padding: '3.5rem', display: 'flex', gap: '2rem', transition: 'transform 0.3s', cursor: 'pointer' }

  return (
    <MarketingLayout>
      <section style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <h1 className="text-h1" style={{ marginBottom: '1.5rem' }}>Growth Insights for Local Business</h1>
          <p className="text-body" style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1.1rem', marginBottom: '4rem' }}>
            Actionable advice, real-world examples, and the latest trends in the Main Street economy.
          </p>
          <EmailCapture />
        </div>

        <div style={gridStyle}>
          {POSTS.map((p, i) => (
            <div key={i} style={postCardStyle}>
              <div style={{ fontSize: '3rem', flexShrink: 0 }}>{p.icon}</div>
              <div style={{ flex: 1 }}>
                 <div style={{ color: 'var(--ink-muted)', fontSize: '13px', fontFamily: 'var(--ff-mono)', marginBottom: '1rem' }}>{p.date}</div>
                 <h2 className="text-h2" style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>{p.title}</h2>
                 <p className="text-body" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.summary}</p>
                 <div style={{ color: 'var(--accent)', marginTop: '1.5rem', fontWeight: 600, fontSize: '14px' }}>Read article →</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MarketingLayout>
  )
}
