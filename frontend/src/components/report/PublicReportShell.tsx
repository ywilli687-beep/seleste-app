import React, { useState } from 'react'
import type { Vertical, Grade, PillarId } from '@/types/audit'

interface PublicReportProps {
  report: {
    business: {
      domain: string
      name: string | null
      city: string | null
      vertical: Vertical
      slug: string | null
      latestOverallScore: number | null
      latestGrade: Grade | null
      latestConversionScore: number | null
      latestTrustScore: number | null
      latestPerformanceScore: number | null
      latestUxScore: number | null
      latestDiscoverScore: number | null
      latestContentScore: number | null
      latestDataScore: number | null
      latestTechnicalScore: number | null
      latestBrandScore: number | null
      latestScalabilityScore: number | null
    }
    snapshot: {
      createdAt: string
      totalScore: number
      grade: Grade
      revenueLeakage: number | null
      topIssues: Array<{
        title: string
        description: string
        impact: number
        pillar: string
      }>
      pillarScores: Record<string, number | null>
    }
  }
}

const VERTICAL_LABELS: Record<string, string> = {
  RESTAURANT: 'Restaurant',
  AUTO_REPAIR: 'Auto repair',
  DENTAL: 'Dental',
  FITNESS: 'Gym / fitness',
  BEAUTY_SALON: 'Beauty salon',
  CLEANING: 'Cleaning service',
  LANDSCAPING: 'Landscaping',
  PLUMBING: 'Plumbing',
  HVAC: 'HVAC',
  HOME_SERVICES: 'Home services',
  LEGAL: 'Legal',
  REAL_ESTATE: 'Real estate',
  PET_SERVICES: 'Pet services',
  CAR_WASH: 'Car wash',
  LOCAL_SERVICE: 'Local business',
}

const GRADE_LABELS: Record<string, string> = {
  A: 'Strong performer',
  B: 'Above average',
  C: 'Needs improvement',
  D: 'At risk',
  F: 'Critical issues',
}

const PILLAR_LABELS: Record<string, string> = {
  conversion:      'Turning visitors into customers',
  trust:           'Building visitor trust',
  performance:     'Page speed & reliability',
  ux:              'Ease of use',
  discoverability: 'Getting found online',
  content:         'Content quality',
  data:            'Tracking & insights',
  technical:       'Technical health',
  brand:           'Brand clarity',
  scalability:     'Growth readiness',
}

export default function PublicReportShell({ report }: PublicReportProps) {
  const { business, snapshot } = report
  const [compDomain, setCompDomain] = useState('')

  const handleCheckCompetitor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!compDomain.trim()) return
    window.location.href = `/?url=${encodeURIComponent(compDomain)}&ref=competitor`
  }

  const scoreColor = snapshot.totalScore >= 75 ? 'var(--green)' : snapshot.totalScore >= 60 ? 'var(--amber)' : 'var(--red)'
  const domain = business.domain.replace(/^https?:\/\//, '').replace(/^www\./, '')
  const dateStr = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(snapshot.createdAt))

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--ff-sans)' }}>
      {/* 1. Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 70, background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <a href="/" style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', color: 'var(--accent)', textDecoration: 'none' }}>Seleste</a>
        <a href="/?ref=report-nav" className="primary-button" style={{ padding: '8px 20px', fontSize: 13 }}>Get your free audit →</a>
      </nav>

      <div style={{ maxWidth: 840, margin: '0 auto', padding: '120px 2rem 80px' }}>
        
        {/* 2. Hero */}
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: '1rem' }}>
            {domain}
          </div>
          <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
            {business.name || domain}
          </h1>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '6.5rem', fontWeight: 800, fontFamily: 'var(--ff-display)', color: scoreColor, lineHeight: 1, marginBottom: '0.5rem' }}>
              {snapshot.totalScore}
            </div>
            <div style={{ fontSize: '1.25rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>
              Grade {snapshot.grade} — {GRADE_LABELS[snapshot.grade] || 'Analysis complete'}
            </div>
          </div>

          <div style={{ marginTop: '2rem', fontSize: 13, color: 'var(--text3)' }}>
            Audited {dateStr} · {business.city || 'National'} · {VERTICAL_LABELS[business.vertical] || 'Local Business'}
          </div>
        </header>

        {/* 3. Revenue Leakage Callout */}
        {snapshot.revenueLeakage && snapshot.revenueLeakage > 0 && (
          <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(10,10,15,0) 100%)', border: '1px solid rgba(239,68,68,0.2)', borderLeft: '4px solid var(--red)', borderRadius: 'var(--r)', padding: '2rem', marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem' }}>💸</div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--red)', marginBottom: 4 }}>
                Estimated Revenue Leakage
              </div>
              <p style={{ color: 'var(--text2)', margin: 0, fontSize: '1.1rem', lineHeight: 1.5 }}>
                This business is losing an estimated <strong style={{ color: 'var(--text)' }}>${snapshot.revenueLeakage.toLocaleString()}/month</strong> in potential revenue due to growth system gaps.
              </p>
            </div>
          </div>
        )}

        {/* 4. Top 3 Issues */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.75rem', marginBottom: '2rem' }}>Critical Findings</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {snapshot.topIssues.map((issue, i) => (
              <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                    {PILLAR_LABELS[issue.pillar] || 'Growth Area'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--red)', background: 'rgba(239,68,68,0.1)', padding: '4px 8px', borderRadius: 4, fontWeight: 600 }}>
                    -{issue.impact} Points
                  </div>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text)' }}>
                  {issue.title}
                </h3>
                <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  {issue.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Gated Breakdown */}
        <section style={{ position: 'relative', overflow: 'hidden', paddingBottom: '2rem' }}>
          <div style={{ opacity: 0.3, filter: 'blur(8px)', pointerEvents: 'none', userSelect: 'none' }}>
             <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.75rem', marginBottom: '2rem' }}>Full Analysis</h2>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {Object.keys(PILLAR_LABELS).map(p => (
                  <div key={p} style={{ height: 60, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--rs)' }} />
                ))}
             </div>
          </div>

          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom, rgba(10,10,15,0) 0%, rgba(10,10,15,1) 80%)' }}>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--accent)', borderRadius: 'var(--r)', padding: '3rem', textAlign: 'center', maxWidth: 480, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</div>
              <h3 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.75rem', marginBottom: '1rem' }}>Unlock Full Breakdown</h3>
              <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, marginBottom: '2rem' }}>
                Join 500+ business owners using Seleste to track their growth. Get all 47 checks, your 90-day roadmap, and competitor benchmarking.
              </p>
              
              <div style={{ textAlign: 'left', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['All 47 checks across 10 pillars', 'Personalized 90-day growth roadmap', 'Real-time competitor benchmarking', 'Historical score tracking'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text2)' }}>
                    <span style={{ color: 'var(--green)' }}>✓</span> {item}
                  </div>
                ))}
              </div>

              <a href="/?ref=report-gate" className="primary-button" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
                Audit your website for free →
              </a>
            </div>
          </div>
        </section>

        {/* 6. Competitor CTA */}
        <section style={{ marginTop: '8rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '4rem 2rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2.2rem', marginBottom: '1rem' }}>
            How does your competitor score?
          </h2>
          <p style={{ color: 'var(--text3)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
            Enter a domain to see their growth profile and tactical gaps.
          </p>
          
          <form onSubmit={handleCheckCompetitor} style={{ maxWidth: 500, margin: '0 auto', display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={compDomain}
              onChange={e => setCompDomain(e.target.value)}
              placeholder="competitor.com"
              style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', color: 'white', padding: '12px 18px', borderRadius: 'var(--rs)', fontSize: 15, outline: 'none' }}
            />
            <button type="submit" className="primary-button" style={{ fontSize: 15 }}>Check →</button>
          </form>
        </section>

        {/* 7. Footer */}
        <footer style={{ marginTop: '100px', textAlign: 'center', padding: '40px 0', borderTop: '1px solid var(--border)', color: 'var(--text3)', fontSize: 12, letterSpacing: '.05em' }}>
          WEBSITE AUDIT POWERED BY SELESTE AGENTIC INTELLIGENCE — ALL RIGHTS RESERVED
        </footer>
      </div>
    </div>
  )
}
