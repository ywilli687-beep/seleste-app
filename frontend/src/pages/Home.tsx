import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useAuditFlow } from '@/lib/hooks/useAuditFlow'
import type { AuditResult, AuditRequest, LoadingStage } from '@/types/audit'
import Landing from '@/components/Landing'
import IntakeForm from '@/components/IntakeForm'
import LoadingScreen from '@/components/LoadingScreen'
import ResultsView from '@/components/ResultsView'
import { SEO } from '@/components/SEO'

type View = 'landing' | 'intake' | 'loading' | 'results' | 'error'

export default function Home() {
  const { user } = useUser()
  const {
    view, setView,
    result, setResult,
    error, setError,
    stage, setStage,
    hardPreview, setHardPreview,
    runAudit,
    reset
  } = useAuditFlow()

  return (
    <>
      <SEO />
      {view === 'landing'  && <Landing onStart={() => setView('intake')} />}
      {view === 'intake'   && <IntakeForm onSubmit={runAudit} onBack={() => setView('landing')} error={error} />}
      {view === 'loading'  && <LoadingScreen stage={stage} hard={hardPreview} />}
      {view === 'results'  && result && <ResultsView result={result} onNewAudit={reset} />}
      
      {view === 'error' && (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', padding: '2rem' }}>
          <div style={{ maxWidth: 500, width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '2.5rem', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⚠️</div>
            <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text)' }}>Analysis Interrupted</h2>
            <p style={{ color: 'var(--coral)', marginBottom: '2rem', lineHeight: 1.6, fontSize: '14px', background: 'rgba(239,68,68,0.08)', padding: '12px', borderRadius: 'var(--rs)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error || 'An unexpected error occurred during the intelligence deep-scan.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                onClick={reset}
                style={{ 
                  background: 'var(--primary)', 
                  color: '#0a0a0f', 
                  padding: '12px 24px', 
                  borderRadius: 'var(--rs)', 
                  border: 'none', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Try again
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                style={{ background: 'transparent', color: 'var(--text2)', border: 'none', cursor: 'pointer', fontSize: '13px' }}
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
