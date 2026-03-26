'use client'
import type { LoadingStage } from '@/app/page'

const STAGES: Array<{ id: LoadingStage; label: string; detail: string }> = [
  { id: 'fetching',     label: 'Fetching real website',        detail: 'HTTP · follows redirects · reads full HTML' },
  { id: 'hard_signals', label: 'Extracting hard signals',       detail: 'SSL · analytics · schema · CMS · tech stack' },
  { id: 'ai_signals',   label: 'AI reads page content',         detail: 'CTAs · booking · trust signals · content quality' },
  { id: 'scoring',      label: 'Running rules engine',          detail: '47+ rules · caps and penalties · 10 pillar scores' },
  { id: 'narrative',    label: 'Writing AI growth analysis',    detail: 'Specific insights from what was found on this page' },
  { id: 'saving',       label: 'Saving to intelligence layer',  detail: '80+ structured fields · score history updated' },
  { id: 'done',         label: 'Complete',                      detail: '' },
]

const ORDER: LoadingStage[] = ['fetching','hard_signals','ai_signals','scoring','narrative','saving','done']

function stageIndex(s: LoadingStage) { return ORDER.indexOf(s) }

export default function LoadingScreen({
  stage,
  hard,
}: {
  stage: LoadingStage
  hard?: { pageTitle?: string; detectedCMS?: string | null; wordCount?: number; isSSL?: boolean } | null
}) {
  const current = stageIndex(stage)
  const progress = Math.round((current / (ORDER.length - 1)) * 88) + 4

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 560, width: '100%' }}>

        {/* Spinner */}
        <div style={{ width: 64, height: 64, margin: '0 auto 2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
          <div style={{ position: 'absolute', top: 10, left: 10, right: 10, bottom: 10, borderRadius: '50%', border: '1px solid var(--border)', borderBottomColor: 'var(--accent2)', animation: 'spin 1.8s linear infinite reverse' }} />
        </div>

        <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.8rem', marginBottom: '.4rem', textAlign: 'center' }}>
          Analyzing website
        </h2>
        <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: '1.75rem', textAlign: 'center' }}>
          Running the full pipeline — every result persisted as structured data
        </p>

        {/* Hard signal preview — appears once stage 1 completes */}
        {hard && (
          <div style={{ background: 'rgba(200,169,110,.06)', border: '1px solid rgba(200,169,110,.18)', borderRadius: 'var(--r)', padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {hard.pageTitle && (
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 3 }}>Page title</div>
                <div style={{ fontSize: 13, color: 'var(--text)' }}>{hard.pageTitle.slice(0, 60)}{hard.pageTitle.length > 60 ? '…' : ''}</div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {hard.detectedCMS && <Signal label="CMS" val={hard.detectedCMS} />}
              {hard.wordCount !== undefined && <Signal label="Words" val={String(hard.wordCount)} />}
              <Signal label="SSL" val={hard.isSSL ? '✓' : '✗'} color={hard.isSSL ? 'var(--green)' : 'var(--red)'} />
            </div>
          </div>
        )}

        {/* Stage list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.25rem' }}>
          {STAGES.filter(s => s.id !== 'done').map((s, i) => {
            const idx  = stageIndex(s.id)
            const done = idx < current
            const act  = idx === current
            return (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '9px 14px',
                background: act ? 'rgba(200,169,110,.06)' : 'var(--bg2)',
                borderRadius: 'var(--rs)',
                border: `1px solid ${act ? 'var(--accent)' : done ? 'var(--border)' : 'var(--border)'}`,
                opacity: !done && !act ? 0.5 : 1,
                transition: 'all .3s',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontFamily: 'var(--ff-mono)',
                  background: done ? 'var(--gdim)' : act ? 'var(--adim)' : 'var(--bg3)',
                  border: `1px solid ${done ? 'var(--green)' : act ? 'var(--accent)' : 'var(--border2)'}`,
                  color: done ? 'var(--green)' : act ? 'var(--accent)' : 'var(--text3)',
                }}>
                  {done ? '✓' : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: act ? 500 : 400, color: done ? 'var(--text2)' : 'var(--text)' }}>
                    {s.label}
                  </div>
                  {act && s.detail && (
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{s.detail}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--bg3)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
            borderRadius: 99, transition: 'width .8s ease',
          }} />
        </div>
        <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: '.75rem', fontFamily: 'var(--ff-mono)', textAlign: 'center' }}>
          {STAGES.find(s => s.id === stage)?.label ?? 'Processing'}...
        </p>
      </div>
    </div>
  )
}

function Signal({ label, val, color }: { label: string; val: string; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontFamily: 'var(--ff-mono)', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12, color: color ?? 'var(--text)', fontFamily: 'var(--ff-mono)' }}>{val}</div>
    </div>
  )
}
