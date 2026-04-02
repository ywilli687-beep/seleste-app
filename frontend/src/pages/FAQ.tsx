'use client'
import { useState } from 'react'
import MarketingLayout from '@/components/MarketingLayout'

const FAQS = [
  { q: "How much does Seleste cost?", a: "Your first deep-scan is 100% free with no credit card required. Our paid plans start at $49/mo for businesses that want continuous monitoring and monthly growth updates." },
  { q: "What is a 'scan' exactly?", a: "It's a complete analysis of your live website. We look at 47 different areas—from how you show up in local search to how fast your mobile site loads—to see why you aren't converting more visitors into customers." },
  { q: "How long does the audit take?", a: "Typically under 20 seconds. We fetch your live site and process our growth roadmap immediately, so you don't have to wait days for a report." },
  { q: "Do I need to be tech-savvy?", a: "Not at all. We specifically build our reports for local business owners. All our advice is written in plain English, telling you exactly what to do and why it will increase your sales." },
  { q: "How is this different from free tools like PageSpeed?", a: "Generic tools only look at speed. Seleste looks at your business strategy. We analyze your customer trust proof, your local positioning, and your conversion paths to give you a complete growth picture." },
  { q: "Who is Seleste for?", a: "Anyone running a local service business, retail shop, or restaurant on Main Street. We focus on the things that actually matter to local customers, not enterprise-level jargon." },
  { q: "Do you fix the issues for me?", a: "We provide the clear roadmap of what needs to be fixed. Many of our customers share these reports directly with their web developer or use them to make simple updates themselves in minutes." }
]

function AccordionItem({ q, a }: { q: string, a: string }) {
  const [open, setOpen] = useState(false)
  
  const itemStyle: React.CSSProperties = {
    background: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    marginBottom: '1rem',
    overflow: 'hidden'
  }

  const btnStyle: React.CSSProperties = {
    width: '100%',
    padding: '1.75rem 2rem',
    background: 'transparent',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    textAlign: 'left',
    color: 'var(--ink)',
    fontFamily: 'var(--ff-display)',
    fontSize: '1.25rem',
    fontWeight: 600
  }

  return (
    <div style={itemStyle}>
      <button onClick={() => setOpen(!open)} style={btnStyle}>
        <span>{q}</span>
        <span style={{ fontSize: '1.5rem', opacity: open ? 1 : 0.5 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 2rem 2rem 2rem', color: 'var(--ink-muted)', lineHeight: 1.7, fontSize: '16px' }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  const sectionStyle: React.CSSProperties = {
    padding: '120px 2rem',
    maxWidth: '800px',
    margin: '0 auto',
    boxSizing: 'border-box'
  }

  return (
    <MarketingLayout>
      <section style={sectionStyle}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h1 className="text-h1" style={{ marginBottom: '1.5rem' }}>Your questions, answered</h1>
          <p className="text-body" style={{ fontSize: '1.1rem' }}>
            Everything you need to know about getting your first growth roadmap.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FAQS.map((f, i) => <AccordionItem key={i} {...f} />)}
        </div>

        <div style={{ marginTop: '6rem', textAlign: 'center', background: 'var(--panel)', padding: '4rem', borderRadius: '32px', border: '1px solid var(--border)' }}>
          <h2 className="text-h2" style={{ marginBottom: '1rem' }}>Still have questions?</h2>
          <p className="text-body" style={{ marginBottom: '2rem' }}>Our team is here to help you get the most out of your audit.</p>
          <a href="/contact" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, fontSize: '16px' }}>
            Message our team →
          </a>
        </div>
      </section>
    </MarketingLayout>
  )
}
