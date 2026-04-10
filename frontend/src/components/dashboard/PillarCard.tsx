import React, { useEffect, useState } from 'react'
import { Tooltip } from './Tooltip'

interface PillarCardProps {
  pillars: { id: string; score: number; industryAvg: number }[]
}

const PILLAR_NAMES: Record<string, string> = {
  conversion: 'Getting Customers to Act',
  trust: 'Trust & Credibility',
  performance: 'Page Speed',
  discoverability: 'Found on Google',
  ux: 'Ease of Use',
  content: 'Writing & Messaging',
  data: 'Tracking & Analytics',
  technical: 'Technical Health',
  brand: 'Brand Consistency',
  scalability: 'Room to Grow'
}

const PILLAR_DESCRIPTIONS: Record<string, string> = {
  conversion: 'How well your site turns visitors into leads or customers — things like clear buttons, contact forms, and calls to action.',
  trust: 'How trustworthy your site looks to a first-time visitor — reviews, testimonials, security badges, and professional design.',
  performance: 'How fast your pages load. Slow pages lose visitors. Google also ranks faster sites higher.',
  discoverability: 'How easy it is for people to find you on Google when searching for your services nearby.',
  ux: 'How easy your site is to navigate, especially on a phone. Can visitors quickly find what they need?',
  content: 'How clear and helpful your text is. Does it explain what you do, who you help, and why someone should choose you?',
  data: 'Whether you have tools set up to understand how visitors use your site (e.g. Google Analytics, Facebook Pixel).',
  technical: 'Behind-the-scenes stuff that affects performance and Google ranking — like SSL certificates and mobile-friendliness.',
  brand: 'Whether your logo, colours, and overall look feel consistent and professional across the site.',
  scalability: 'Whether your site is set up to handle growth — like booking systems, integrations, and automation.'
}

export function PillarCard({ pillars }: PillarCardProps) {
  const [widths, setWidths] = useState<number[]>(pillars.map(() => 0))

  useEffect(() => {
    pillars.forEach((p, i) => {
      setTimeout(() => {
        setWidths(prev => {
          const next = [...prev]
          next[i] = p.score
          return next
        })
      }, i * 80 + 300)
    })
  }, [pillars])

  return (
    <div className="card-v2" style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <h3 className="text-h2">Score by Area</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {pillars.map((p, i) => {
          const w = widths[i]
          const color = w >= 80 ? 'var(--green)' : w >= 60 ? 'var(--blue)' : w >= 40 ? 'var(--amber)' : 'var(--coral)'

          return (
            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 500 }}>
                <Tooltip text={PILLAR_DESCRIPTIONS[p.id] || ''}>
                  <span>{PILLAR_NAMES[p.id] || p.id}</span>
                </Tooltip>
                <span>{p.score}</span>
              </div>
              <div style={{ position: 'relative', height: 8, background: 'var(--page-bg)', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute', top: 0, left: 0, height: '100%',
                    background: color, borderRadius: 4, width: `${w}%`,
                    transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
                <div
                  style={{
                    position: 'absolute', top: 0, bottom: 0, width: 2,
                    background: 'rgba(0,0,0,0.3)', left: `${p.industryAvg}%`,
                    zIndex: 2
                  }}
                  title={`Others in your industry avg: ${p.industryAvg}`}
                />
              </div>
            </div>
          )
        })}
      </div>
      <a href="#pillars" className="section-link" style={{ marginTop: 'auto' }}>See full breakdown →</a>
    </div>
  )
}
