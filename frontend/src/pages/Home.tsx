import { useEffect, useRef } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useAuditFlow } from '@/lib/hooks/useAuditFlow'
import Landing from '@/components/Landing'
import IntakeForm from '@/components/IntakeForm'
import LoadingScreen from '@/components/LoadingScreen'
import ResultsView from '@/components/ResultsView'
import { SEO } from '@/components/SEO'
import { loadPendingAudit, clearPendingAudit } from '@/lib/pendingAudit'

export default function Home() {
  const { isSignedIn, isLoaded } = useUser()
  const intentConsumed = useRef(false)
  const {
    view, setView,
    result,
    error,
    stage,
    hardPreview,
    runAudit,
    reset
  } = useAuditFlow()

  // ── Intent recovery: runs once when Clerk confirms the user is signed in ──
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return
    if (intentConsumed.current) return

    const intent = loadPendingAudit()
    if (!intent) return

    // Mark consumed BEFORE async work to prevent double execution
    intentConsumed.current = true
    clearPendingAudit()

    runAudit({
      url:            intent.url,
      businessName:   intent.businessName,
      location:       intent.location,
      vertical:       intent.vertical as any,
      monthlyRevenue: intent.monthlyRevenue,
    })
  }, [isLoaded, isSignedIn, runAudit])

  return (
    <>
      <SEO />
      {view === 'landing'  && <Landing onStart={() => setView('intake')} />}
      {view === 'intake'   && <IntakeForm onSubmit={runAudit} onBack={() => setView('landing')} error={error} />}
      {view === 'loading'  && <LoadingScreen stage={stage} hard={hardPreview} />}
      {view === 'results'  && result && <ResultsView result={result} onNewAudit={reset} />}
      
      {view === 'error' && (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: 'var(--bg)', 
          padding: '2rem' 
        }}>
          <div style={{ 
            maxWidth: 480, 
            width: '100%', 
            background: 'var(--panel)', 
            border: '1px solid var(--border)', 
            borderRadius: '24px', 
            padding: '3rem', 
            textAlign: 'center', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' 
          }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1.5rem',
              filter: 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.3))' 
            }}>⚠️</div>
            
            <h2 style={{ 
              fontFamily: 'var(--ff-display)', 
              fontSize: '1.75rem', 
              marginBottom: '1rem', 
              color: 'var(--ink)',
              letterSpacing: '-0.02em' 
            }}>Analysis Interrupted</h2>
            
            <p style={{ 
              color: 'var(--coral)', 
              marginBottom: '2rem', 
              lineHeight: 1.6, 
              fontSize: '15px', 
              background: 'rgba(239, 68, 68, 0.05)', 
              padding: '16px', 
              borderRadius: '16px', 
              border: '1px solid rgba(239, 68, 68, 0.1)',
              fontWeight: 500 
            }}>
              {error || 'An unexpected error occurred during the intelligence deep-scan.'}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <button 
                onClick={reset}
                style={{ 
                  background: 'var(--ink)', 
                  color: '#fff', 
                  padding: '14px 24px', 
                  borderRadius: '100px', 
                  border: 'none', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontFamily: 'var(--ff-display)',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                Try again
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                style={{ 
                  background: 'transparent', 
                  color: 'var(--ink-muted)', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'color 0.2s'
                }}
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
