'use client'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import type { AuditResult, Recommendation, PillarId } from '@/types/audit'
import { PILLARS } from '@/lib/constants'
import ErrorBoundary from '@/components/ErrorBoundary'
import ExplainIcon from '@/components/ExplainIcon'
import ExplainerPopover from '@/components/ExplainerPopover'

const ghost: React.CSSProperties = {
  background: 'none', border: '1px solid var(--border2)', color: 'var(--text2)',
  padding: '6px 16px', borderRadius: 'var(--rs)', cursor: 'pointer',
  fontFamily: 'var(--ff-sans)', fontSize: 13,
}

export default function ResultsView({
  result,
  onNewAudit,
}: {
  result: AuditResult
  onNewAudit: () => void
}) {
  const {
    pillarScores, overallScore, grade, gradeLabel, revenueLeak, confidence,
    recommendations, benchmark, aiNarrative, aiQuickWins, aiTopIssues,
    appliedRules, roadmap, signals, input, delta, verticalPercentile,
  } = result

  const biz = input.businessName || input.url.replace(/https?:\/\//, '').split('/')[0]
  const [recTab, setRecTab] = useState<'revenue_leaks' | 'quick_wins' | 'high_impact'>('revenue_leaks')
  
  const [explanations, setExplanations] = useState<Record<string, string>>({})
  const [loadingKey, setLoadingKey] = useState<string | null>(null)
  const [openKey, setOpenKey] = useState<{ key: string, label: string, rect: DOMRect } | null>(null)
  
  const { getToken } = useAuth()

  async function fetchExplanation(key: string, label: string, e: React.MouseEvent, context: any) {
    const rect = (e.currentTarget as Element).getBoundingClientRect()
    if (explanations[key]) {
      setOpenKey(openKey?.key === key ? null : { key, label, rect })
      return
    }
    setLoadingKey(key)
    setOpenKey(null)
    try {
      const token = await getToken()
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      const API_URL = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${API_URL}/api/explain`, { method: 'POST', headers, body: JSON.stringify(context) })
      const data = await res.json()
      setExplanations(prev => ({ ...prev, [key]: data.explanation }))
      setOpenKey({ key, label, rect })
    } catch {
      setExplanations(prev => ({ ...prev, [key]: 'Unable to load explanation right now.' }))
      setOpenKey({ key, label, rect })
    } finally {
      setLoadingKey(null)
    }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target as Element).closest('.explain-anchor') && !(e.target as Element).closest('.explainer-popover')) {
        setOpenKey(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const gradeColor = (s: number) => s >= 75 ? 'var(--green)' : s >= 60 ? 'var(--accent)' : s >= 45 ? 'var(--amber)' : 'var(--red)'
  const sorted = [...PILLARS].sort((a, b) => pillarScores[b.id] - pillarScores[a.id])

  return (
    <div style={{ paddingBottom: '6rem' }}>

      {/* Fixed nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 60, background: 'rgba(10,10,15,.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div onClick={onNewAudit} style={{ fontFamily: 'var(--ff-display)', fontSize: '1.25rem', color: 'var(--accent)', cursor: 'pointer' }}>
          Seleste <span style={{ color: 'var(--text3)', fontSize: '.65rem', fontFamily: 'var(--ff-mono)', marginLeft: 8 }}>AUDIT ENGINE V2</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/dashboard" style={{ ...ghost, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Intelligence →</a>
          <button onClick={onNewAudit} style={ghost}>← New Audit</button>
          <button onClick={() => window.print()} className="no-print" style={ghost}>Print</button>
        </div>
      </nav>

      {/* Page header */}
      <div style={{ paddingTop: 60 }}>
        <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.75rem' }}>{biz}</div>
            <div style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>
              {input.url} · {input.location} · {input.vertical.replace('_', ' ').toLowerCase()}
            </div>
            <div style={{ display: 'flex', gap: 7, marginTop: 8, flexWrap: 'wrap' }}>
              <Bdg c="accent">COMPLETED</Bdg>
              <Bdg c={confidence.pct >= 70 ? 'green' : confidence.pct >= 50 ? 'amber' : 'red'}>CONFIDENCE {confidence.pct}%</Bdg>
              {signals.detectedCMS && <Bdg c="blue">{signals.detectedCMS}</Bdg>}
              {verticalPercentile !== undefined && (
                <Bdg c="purple">TOP {100 - verticalPercentile}% IN VERTICAL</Bdg>
              )}
              {delta && (
                <Bdg c={delta.scoreDelta >= 0 ? 'green' : 'red'}>
                  {delta.scoreDelta >= 0 ? '▲' : '▼'} {Math.abs(delta.scoreDelta)} vs LAST AUDIT
                </Bdg>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }} className="no-print">
            <button onClick={onNewAudit} style={ghost}>← New Audit</button>
            <button onClick={() => window.print()} style={ghost}>Print Report</button>
          </div>
        </div>
      </div>

      {/* ── UNLOCKED TEASER SECTION ── */}
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '310px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card title="Digital Preparedness Score">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '.5rem' }}>
              <ScoreDial score={overallScore} />
              <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.4rem', marginTop: '1rem', color: gradeColor(overallScore), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Grade {grade}
                <ExplainIcon 
                  onClick={(e) => fetchExplanation('overall_score', 'Score & Grade', e, { type: 'overall_score', score: overallScore, grade, gradeLabel, businessName: biz, vertical: input.vertical, topPillar: sorted[0].name, lowestPillar: sorted[sorted.length-1].name, revenueLeak: revenueLeak.totalPct })}
                  loading={loadingKey === 'overall_score'} loaded={!!explanations['overall_score']}
                />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3, textAlign: 'center' }}>{gradeLabel}</div>
              {verticalPercentile !== undefined && (
                <div style={{ marginTop: 8, fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', textAlign: 'center' }}>
                  Better than {verticalPercentile}% of {input.vertical.replace('_', ' ').toLowerCase()} businesses
                </div>
              )}
            </div>
          </Card>

          {delta && (
            <Card title="Score Change vs. Last Audit">
              <div style={{ textAlign: 'center', padding: '.5rem 0 1rem' }}>
                <div style={{ fontFamily: 'var(--ff-display)', fontSize: '3rem', color: delta.scoreDelta >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {delta.scoreDelta >= 0 ? '+' : ''}{delta.scoreDelta}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>
                  {delta.previousScore} → {overallScore}
                </div>
                <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', marginTop: 4 }}>
                  vs. audit on {new Date(delta.previousDate).toLocaleDateString()}
                </div>
              </div>
              {delta.improvedPillars.length > 0 && (
                <div style={{ marginTop: '.75rem' }}>
                  <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--green)', marginBottom: 6 }}>▲ Improved</div>
                  {delta.improvedPillars.map(p => (
                    <div key={p} style={{ fontSize: 12, color: 'var(--text2)', padding: '3px 0' }}>
                      {PILLARS.find(x => x.id === p)?.name}
                    </div>
                  ))}
                </div>
              )}
              {delta.regressedPillars.length > 0 && (
                <div style={{ marginTop: '.75rem' }}>
                  <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--red)', marginBottom: 6 }}>▼ Regressed</div>
                  {delta.regressedPillars.map(p => (
                    <div key={p} style={{ fontSize: 12, color: 'var(--text2)', padding: '3px 0' }}>
                      {PILLARS.find(x => x.id === p)?.name}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          <Card title="Key Findings">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
              <MStat label="Revenue Leak" val={`${revenueLeak.totalPct}%`} color="var(--red)" sub="opp. lost/mo" />
              <MStat label="Top Pillar" val={`${pillarScores[sorted[0].id]}/100`} color="var(--green)" sub={sorted[0].name} />
              <MStat label="Lowest Pillar" val={`${pillarScores[sorted[sorted.length - 1].id]}/100`} color="var(--red)" sub={sorted[sorted.length - 1].name} />
              <MStat label="Rules Hit" val={`${appliedRules.length}`} color="var(--amber)" sub="caps & penalties" />
            </div>
          </Card>
        </div>

        {/* MAIN TEASER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card title="Revenue Leakage Analysis">
            <div style={{ textAlign: 'center', padding: '1.25rem 0' }}>
              <div style={{ fontFamily: 'var(--ff-display)', fontSize: '3.8rem', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {revenueLeak.totalPct}%
                <ExplainIcon 
                  onClick={(e) => fetchExplanation('revenue_leakage', 'Revenue Leakage', e, { type: 'revenue_leakage', leakPercent: revenueLeak.totalPct, businessName: biz, vertical: input.vertical, lowestPillars: sorted.slice(-2).map(p=>p.name) })}
                  loading={loadingKey === 'revenue_leakage'} loaded={!!explanations['revenue_leakage']}
                />
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 3 }}>
                Estimated conversion opportunity lost per month
              </div>
              {revenueLeak.estimatedMonthlyLoss != null && (
                <div style={{ marginTop: '1rem', fontFamily: 'var(--ff-display)', fontSize: '1.5rem', color: 'var(--red)' }}>
                  ~${revenueLeak.estimatedMonthlyLoss.toLocaleString()}/mo being lost
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {revenueLeak.breakdown.map(b => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg3)', borderRadius: 'var(--rs)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>{b.icon} {b.label}</span>
                  <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, color: 'var(--red)' }}>−{b.pct}%</span>
                </div>
              ))}
            </div>
          </Card>

          {result.auditId && (
            <div style={{ background: 'rgba(74,222,128,.05)', border: '1px solid rgba(74,222,128,.15)', borderRadius: 'var(--r)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>Audit saved to intelligence layer</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--ff-mono)' }}>
                  ID: {result.auditId} · 80+ structured fields persisted · benchmarks updated
                </div>
              </div>
              <a href="/dashboard" style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--accent)', textDecoration: 'none', whiteSpace: 'nowrap' }}>View in dashboard →</a>
            </div>
          )}
        </div>
      </div>

      {/* ── LOCKED FULL AUDIT SECTION ── */}
      <div style={{ position: 'relative', marginTop: '-1rem' }}>
        {/* The blurred content container */}
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 2rem 2rem', display: 'grid', gridTemplateColumns: '310px 1fr', gap: '2rem', alignItems: 'start', filter: 'blur(10px) opacity(0.5)', pointerEvents: 'none', userSelect: 'none' }}>
          
          {/* SIDEBAR LOCKED */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Audit confidence */}
            <Card title="Audit Confidence">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
                <span style={{ fontSize: 13, color: 'var(--text2)', whiteSpace: 'nowrap' }}>Signal quality</span>
                <div style={{ flex: 1, height: 7, background: 'var(--bg3)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${confidence.pct}%`, background: `linear-gradient(90deg, var(--amber), var(--green))`, borderRadius: 99 }} />
                </div>
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, color: 'var(--text2)' }}>{confidence.pct}%</span>
              </div>
              {confidence.missingSignals.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text2)', marginTop: 6 }}>
                  <span style={{ color: 'var(--amber)', flexShrink: 0 }}>!</span>{m}
                </div>
              ))}
            </Card>

            {/* Signals detected */}
            <Card title="Signals Detected">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {([
                  ['CTA above fold',        signals.hasCTA],
                  ['Online booking',        signals.hasBooking],
                  ['Contact form',          signals.hasContactForm],
                  ['Pricing shown',         signals.hasPricing],
                  ['Reviews displayed',     signals.hasReviews],
                  ['SSL / HTTPS',           signals.hasSSL],
                  ['Mobile optimized',      signals.isMobileOptimized],
                  ['Google Business Profile', signals.hasGBP],
                  ['Schema markup',         signals.hasSchema],
                  ['Analytics installed',   signals.hasAnalytics],
                  ['Remarketing pixel',     signals.hasPixel],
                  ['Physical address',      signals.hasAddress],
                  ['Service list',          signals.hasServiceList],
                  ['FAQ section',           signals.hasFAQ],
                  ['Blog / content hub',    signals.hasBlog],
                  ['Logo present',          signals.hasLogo],
                ] as [string, boolean][]).map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text2)', display: 'flex', alignItems: 'center' }}>
                      {label}
                      <ExplainIcon 
                        onClick={(e) => fetchExplanation(`signal_${label}`, label as string, e, { type: 'signal', signalName: label, signalValue: val ? 'was found' : 'was NOT found', businessName: biz, vertical: input.vertical })}
                        loading={loadingKey === `signal_${label}`} loaded={!!explanations[`signal_${label}`]}
                      />
                    </span>
                    <span style={{ color: val ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--ff-mono)', fontSize: 11 }}>
                      {val ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
                <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text2)' }}>Word count</span>
                  <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 11, color: signals.wordCount >= 300 ? 'var(--green)' : 'var(--red)' }}>
                    {signals.wordCount}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* MAIN LOCKED */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* AI Narrative */}
            {aiNarrative && (
              <ErrorBoundary label="AI narrative" fallback={
                <div style={{ padding: '1.25rem', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', fontSize: 13, color: 'var(--text2)' }}>
                  AI analysis unavailable — scores and recommendations are deterministic and accurate.
                </div>
              }>
                <div style={{ background: 'linear-gradient(135deg, rgba(200,169,110,.06), rgba(167,139,250,.04))', border: '1px solid rgba(200,169,110,.18)', borderRadius: 'var(--r)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', animation: 'blink 2s infinite', display: 'inline-block' }} />
                    <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
                      AI Growth Analysis — Real page content
                    </span>
                  </div>
                  <div className="ai-narrative" style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}
                    dangerouslySetInnerHTML={{ __html: aiNarrative }} />
                  {aiTopIssues.length > 0 && (
                    <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(200,169,110,.12)' }}>
                      <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', marginBottom: 8 }}>TOP ISSUES DETECTED ON PAGE</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {aiTopIssues.map((issue, i) => (
                          <span key={i} style={{ fontSize: 11, padding: '3px 10px', background: 'var(--rdim)', color: 'var(--red)', border: '1px solid rgba(248,113,113,.2)', borderRadius: 99, fontFamily: 'var(--ff-mono)' }}>
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ErrorBoundary>
            )}

            {/* Pillar scores */}
            <Card title="Pillar Breakdown — Weighted Scores">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {PILLARS.map(p => {
                  const sc = pillarScores[p.id] ?? 0
                  const col = gradeColor(sc)
                  const bm = benchmark.avg[PILLARS.findIndex(x => x.id === p.id)] ?? 50
                  return (
                    <div key={p.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <div style={{ fontSize: 13, display: 'flex', alignItems: 'center' }}>
                        {p.icon} {p.name}
                        <ExplainIcon 
                          onClick={(e) => fetchExplanation(`pillar_${p.id}`, p.name, e, { type: 'pillar', pillarName: p.name, pillarScore: sc, pillarWeight: p.weight * 100, industryAvg: bm, businessName: biz, vertical: input.vertical })}
                          loading={loadingKey === `pillar_${p.id}`} loaded={!!explanations[`pillar_${p.id}`]}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text3)' }}>avg {bm}</span>
                          <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 13, color: col }}>{sc}/100</span>
                        </div>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${bm}%`, width: 1, background: 'rgba(255,255,255,.15)', zIndex: 1 }} />
                        <div style={{ height: '100%', width: `${sc}%`, background: col, borderRadius: 99, transition: 'width 1.2s ease' }} />
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--ff-mono)', marginTop: 3 }}>
                        weight: {Math.round(p.weight * 100)}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Recommendations */}
            <Card title="Recommendations Engine">
              <div style={{ display: 'flex', gap: 2, marginBottom: '1.5rem', background: 'var(--bg3)', borderRadius: 'var(--rs)', padding: 3 }}>
                {(['revenue_leaks', 'quick_wins', 'high_impact'] as const).map(tab => (
                  <button key={tab} onClick={() => setRecTab(tab)} style={{
                    flex: 1, padding: '8px 10px', borderRadius: 6,
                    border: recTab === tab ? '1px solid var(--border)' : 'none',
                    background: recTab === tab ? 'var(--bg2)' : 'none',
                    color: recTab === tab ? 'var(--text)' : 'var(--text3)',
                    fontSize: 11, fontFamily: 'var(--ff-mono)', cursor: 'pointer', textAlign: 'center',
                  }}>
                    {tab === 'revenue_leaks' ? 'Revenue Leaks' : tab === 'quick_wins' ? 'Quick Wins' : 'High Impact'}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recommendations[recTab].length === 0
                  ? <p style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center', padding: '1.5rem' }}>Strong performance here — no critical issues in this category.</p>
                  : recommendations[recTab].map((rec, i) => <RecCard key={i} rec={rec} num={i + 1} />)
                }
              </div>
            </Card>

            {/* Benchmark */}
            <Card title={`Benchmark — vs. ${input.vertical.replace('_', ' ').toLowerCase()} vertical${benchmark.count ? ` (n=${benchmark.count})` : ''}`}>
              {PILLARS.slice(0, 8).map((p, i) => {
                const you = pillarScores[p.id]
                const avg = benchmark.avg[i] ?? 50
                const top = benchmark.top[i] ?? 80
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < 7 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontSize: 12, color: 'var(--text2)', width: 130, flexShrink: 0 }}>{p.name}</div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {[{ l: 'You', v: you, c: 'var(--accent)' }, { l: 'Avg', v: avg, c: 'var(--blue)' }, { l: 'Top', v: top, c: 'var(--green)' }].map(row => (
                        <div key={row.l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontFamily: 'var(--ff-mono)' }}>
                          <span style={{ color: row.c, width: 22 }}>{row.l}</span>
                          <div style={{ flex: 1, height: 4, background: 'var(--bg3)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${row.v}%`, background: row.c, borderRadius: 99 }} />
                          </div>
                          <span style={{ width: 22, textAlign: 'right', color: row.c }}>{row.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
              <div style={{ marginTop: '1rem', display: 'flex', gap: 16, fontSize: 11, fontFamily: 'var(--ff-mono)' }}>
                {[['You', 'var(--accent)'], ['Vertical avg', 'var(--blue)'], ['Top 10%', 'var(--green)']].map(([l, c]) => (
                  <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 10, height: 2, background: c, borderRadius: 2, display: 'inline-block' }} />{l}
                  </span>
                ))}
                {benchmark.count && benchmark.count > 5 && (
                  <span style={{ color: 'var(--green)', marginLeft: 'auto' }}>✓ Live data ({benchmark.count} businesses)</span>
                )}
              </div>
            </Card>

            {/* Roadmap */}
            <Card title="30 / 60 / 90 Day Roadmap">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {(['30', '60', '90'] as const).map(ph => {
                  const cfg = { '30': { bg: 'var(--adm)', fg: 'var(--amber)', lbl: 'Foundation' }, '60': { bg: 'var(--bdim)', fg: 'var(--blue)', lbl: 'Acceleration' }, '90': { bg: 'var(--gdim)', fg: 'var(--green)', lbl: 'Scale' } }[ph]
                  return (
                    <div key={ph} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                        <div style={{ width: 30, height: 30, borderRadius: 'var(--rs)', background: cfg.bg, color: cfg.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontFamily: 'var(--ff-mono)', fontWeight: 600 }}>{ph}d</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{ph}-Day Sprint</div>
                          <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--ff-mono)' }}>{cfg.lbl}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {roadmap[ph].slice(0, 5).map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text2)', lineHeight: 1.4 }}>
                            <span style={{ color: 'var(--text3)', flexShrink: 0 }}>→</span>{item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Rules trace */}
            <Card title="Audit Trace — Every Rule That Fired">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {appliedRules.length === 0
                  ? <p style={{ fontSize: 13, color: 'var(--text3)' }}>No critical rules triggered — site passed all baseline checks.</p>
                  : appliedRules.map((ar, i) => {
                    const pname = PILLARS.find(p => p.id === ar.pillarId)?.name ?? ar.pillarId
                    return (
                      <div key={i} style={{ padding: '9px 13px', background: 'var(--bg3)', borderRadius: 'var(--rs)', borderLeft: `3px solid ${ar.type === 'CAP' ? 'var(--red)' : 'var(--amber)'}` }}>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2 }}>[{pname}] {ar.rule.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--ff-mono)' }}>
                          {ar.type === 'CAP' ? `CAP → score max ${ar.rule.cap}` : `PENALTY → −${ar.rule.pen} pts`}
                          {ar.baseScore !== undefined && (
                            <span style={{ marginLeft: 12 }}>{ar.baseScore} → {ar.finalScore}</span>
                          )}
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </Card>

          </div>
        </div>

        {/* ── PAYWALL OVERLAY ── */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '6rem' }}>
          <div style={{ background: 'rgba(10,10,15,0.7)', backdropFilter: 'blur(36px)', border: '1px solid rgba(200,169,110,0.3)', padding: '3.5rem', borderRadius: 'var(--r)', textAlign: 'center', maxWidth: 480, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--adim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 1.5rem', border: '1px solid rgba(200,169,110,.2)' }}>
              🔒
            </div>
            <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--ff-display)', marginBottom: '1rem', color: '#fff' }}>Unlock Full Audit</h3>
            <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Your complete growth analysis, 10-pillar breakdown, competitor benchmarks, and prioritized 90-day roadmap are ready.
            </p>
            <button 
              className="no-print"
              onClick={() => alert('Payment integration pending. You will be redirected to Stripe to pay $100.')} 
              style={{ background: 'var(--accent)', color: '#0a0a0f', border: 'none', padding: '16px 32px', borderRadius: 'var(--rs)', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'opacity 0.2s', ...ghost, backgroundColor: 'var(--accent)' }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              Unlock Report — $100 <span style={{ fontFamily: 'var(--ff-mono)' }}>→</span>
            </button>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyItems: 'center', gap: 6, justifyContent: 'center' }}>
              <span style={{ color: 'var(--green)' }}>✓</span> Secure one-time payment
            </div>
          </div>
        </div>

      </div>

      {/* Sticky bar */}
      <div className="no-print" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90, background: 'rgba(10,10,15,.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)', padding: '12px 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ fontSize: 13, color: 'var(--text2)' }}>
          <strong style={{ color: 'var(--text)' }}>{biz}</strong> scored <strong style={{ color: gradeColor(overallScore) }}>{overallScore}/100</strong>
          {delta && <span style={{ color: delta.scoreDelta >= 0 ? 'var(--green)' : 'var(--red)', marginLeft: 10 }}>({delta.scoreDelta >= 0 ? '+' : ''}{delta.scoreDelta} vs last)</span>}
          {result.auditId && <span style={{ marginLeft: 12, color: 'var(--green)', fontSize: 11 }}>● Saved</span>}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/dashboard" style={{ ...ghost, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Intelligence →</a>
          <button onClick={onNewAudit} style={{ background: 'var(--accent)', border: 'none', color: '#0a0a0f', padding: '8px 20px', borderRadius: 'var(--rs)', cursor: 'pointer', fontFamily: 'var(--ff-sans)', fontSize: 13, fontWeight: 600 }}>
            Audit Another →
          </button>
        </div>
      </div>
      {openKey && <ExplainerPopover label={openKey.label} text={explanations[openKey.key]} rect={openKey.rect} onClose={() => setOpenKey(null)} />}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '1.5rem' }}>
      <div style={{ fontSize: 11, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '1rem' }}>{title}</div>
      {children}
    </div>
  )
}

function Bdg({ c, children }: { c: string; children: React.ReactNode }) {
  const m: Record<string, { bg: string; fg: string; bd: string }> = {
    accent:  { bg: 'var(--adim)', fg: 'var(--accent)', bd: 'rgba(200,169,110,.2)' },
    green:   { bg: 'var(--gdim)', fg: 'var(--green)',  bd: 'rgba(74,222,128,.2)'  },
    amber:   { bg: 'var(--adm)',  fg: 'var(--amber)',  bd: 'rgba(251,191,36,.2)'  },
    red:     { bg: 'var(--rdim)', fg: 'var(--red)',    bd: 'rgba(248,113,113,.2)' },
    blue:    { bg: 'var(--bdim)', fg: 'var(--blue)',   bd: 'rgba(96,165,250,.2)'  },
    purple:  { bg: 'rgba(167,139,250,.1)', fg: '#a78bfa', bd: 'rgba(167,139,250,.2)' },
  }
  const s = m[c] ?? m.accent
  return <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontFamily: 'var(--ff-mono)', background: s.bg, color: s.fg, border: `1px solid ${s.bd}` }}>{children}</span>
}

function MStat({ label, val, color, sub }: { label: string; val: string; color: string; sub: string }) {
  return (
    <div style={{ background: 'var(--bg3)', borderRadius: 'var(--rs)', border: '1px solid var(--border)', padding: '.9rem' }}>
      <div style={{ fontSize: 10, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
      <div style={{ fontFamily: 'var(--ff-display)', fontSize: '1.35rem', color, marginBottom: 3 }}>{val}</div>
      <div style={{ fontSize: 11, color: 'var(--text2)' }}>{sub}</div>
    </div>
  )
}

function ScoreDial({ score }: { score: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const cx = 95, cy = 95, r = 72
    const sa = Math.PI * 0.75, ea = Math.PI * 2.25
    ctx.clearRect(0, 0, 190, 190)
    ctx.beginPath(); ctx.arc(cx, cy, r, sa, ea)
    ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.stroke()
    const col = score >= 75 ? '#4ade80' : score >= 60 ? '#c8a96e' : score >= 45 ? '#fbbf24' : '#f87171'
    ctx.beginPath(); ctx.arc(cx, cy, r, sa, sa + (ea - sa) * (score / 100))
    ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.stroke()
  }, [score])
  return (
    <div style={{ position: 'relative', width: 190, height: 190 }}>
      <canvas ref={ref} width={190} height={190} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', marginTop: 8 }}>
        <div style={{ fontFamily: 'var(--ff-display)', fontSize: '3.5rem', lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--ff-mono)', marginTop: 3 }}>/ 100</div>
      </div>
    </div>
  )
}

function RecCard({ rec, num }: { rec: Recommendation; num: number }) {
  const ib = rec.iconColor === 'red' ? 'var(--rdim)' : rec.iconColor === 'green' ? 'var(--gdim)' : 'var(--bdim)'
  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--rs)', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ width: 30, height: 30, borderRadius: 'var(--rs)', background: ib, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{rec.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{rec.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 7, lineHeight: 1.5 }}>{rec.desc}</div>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          <Pill c="red">Impact: {rec.impact}</Pill>
          <Pill c="blue">Effort: {rec.effort}</Pill>
          <Pill c="amber">{rec.timeframe}</Pill>
        </div>
      </div>
    </div>
  )
}

function Pill({ c, children }: { c: string; children: React.ReactNode }) {
  const m: Record<string, { bg: string; fg: string; bd: string }> = {
    red:   { bg: 'var(--rdim)', fg: 'var(--red)',   bd: 'rgba(248,113,113,.2)' },
    blue:  { bg: 'var(--bdim)', fg: 'var(--blue)',  bd: 'rgba(96,165,250,.2)'  },
    amber: { bg: 'var(--adm)',  fg: 'var(--amber)', bd: 'rgba(251,191,36,.2)'  },
  }
  const s = m[c] ?? m.red
  return <span style={{ fontSize: 10, fontFamily: 'var(--ff-mono)', padding: '2px 8px', borderRadius: 99, background: s.bg, color: s.fg, border: `1px solid ${s.bd}` }}>{children}</span>
}
