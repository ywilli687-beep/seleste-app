'use client'
import { useState } from 'react'
import MarketingLayout from '@/components/MarketingLayout'

const PLANS = [
  { name: "First Audit", price: "$0", features: ["Full growth scan", "Actionable roadmap", "90-day fix ranking", "Business trust check", "Single report history"], button: "Start for free", href: "/" },
  { name: "Growth Monthly", price: "$49", features: ["Monthly re-scans", "Performance tracking", "New fix alerts", "Competitor gap analysis", "Everything in free"], button: "Choose Growth", href: "/sign-up" },
  { name: "Accelerator", price: "$149", features: ["Weekly scan updates", "Revenue leak detection", "Direct strategist support", "Priority rendering", "Everything in Growth"], button: "Go Accelerator", href: "/sign-up", popular: true }
]

export default function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  const sectionStyle: React.CSSProperties = {
    padding: '120px 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    boxSizing: 'border-box'
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2.5rem',
    marginTop: '6rem'
  }

  const pricingCardStyle = (popular?: boolean): React.CSSProperties => ({
    background: popular ? 'rgba(200, 169, 110, 0.04)' : 'var(--panel)',
    border: popular ? '1px solid var(--accent)' : '1px solid var(--border)',
    borderRadius: '32px',
    padding: '3.5rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'transform 0.3s'
  })

  return (
    <MarketingLayout>
      <section style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="text-h1" style={{ marginBottom: '1.5rem' }}>Transparent pricing for growing teams</h1>
          <p className="text-body" style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
            Get your first roadmap free. Unlock continuous monitoring as your business grows. No hidden fees.
          </p>

          <div style={{ display: 'inline-flex', background: 'var(--panel)', padding: '6px', borderRadius: '100px', border: '1px solid var(--border)' }}>
            <button onClick={() => setBilling('monthly')} style={{ background: billing === 'monthly' ? 'var(--accent)' : 'transparent', color: billing === 'monthly' ? '#000' : 'var(--ink-muted)', border: 'none', padding: '10px 24px', borderRadius: '100px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>Monthly</button>
            <button onClick={() => setBilling('annual')} style={{ background: billing === 'annual' ? 'var(--accent)' : 'transparent', color: billing === 'annual' ? '#000' : 'var(--ink-muted)', border: 'none', padding: '10px 24px', borderRadius: '100px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>Annual (Save 20%)</button>
          </div>
        </div>

        <div style={gridStyle}>
          {PLANS.map((plan, i) => (
            <div key={i} style={pricingCardStyle(plan.popular)}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#000', fontSize: '12px', fontWeight: 800, padding: '6px 16px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Most Popular
                </div>
              )}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 className="text-h2" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--ff-display)', color: 'var(--ink)' }}>{plan.price}</span>
                  <span style={{ color: 'var(--ink-muted)', fontSize: '14px' }}>/mo</span>
                </div>
              </div>

              <div style={{ flex: 1, marginBottom: '3rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ink-muted)', fontSize: '15px', marginBottom: '14px' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 800 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <a href={plan.href} style={{ background: plan.popular ? 'var(--accent)' : 'var(--ink)', color: plan.popular ? '#000' : '#fff', textAlign: 'center', textDecoration: 'none', padding: '16px 20px', borderRadius: '100px', fontWeight: 800, fontSize: '16px', transition: 'filter 0.2s' }}>
                {plan.button}
              </a>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '8rem', textAlign: 'center' }}>
          <p className="text-body" style={{ marginBottom: '1.5rem' }}>Trusted by over 1,200 local business owners.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', opacity: 0.4, filter: 'grayscale(1)' }}>
             {/* [Logos placeholder style] */}
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
