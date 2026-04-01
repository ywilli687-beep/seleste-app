import { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useAuditFlow } from '@/lib/hooks/useAuditFlow'
import LoadingScreen from '@/components/LoadingScreen'
import ResultsView from '@/components/ResultsView'
import HistoryShell, { BusinessRow } from '@/components/history/HistoryShell'

export default function History() {
  const { user, isLoaded } = useUser()
  const {
    view, setView,
    result, setResult,
    error: auditError, setError: setAuditError,
    stage, setStage,
    hardPreview, setHardPreview,
    triggerReaudit,
    reset
  } = useAuditFlow()
  const { getToken } = useAuth()
  const [businesses, setBusinesses] = useState<BusinessRow[] | null>(null)
  const [historyError, setHistoryError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !user) return

    getToken().then((token: string | null) => {
      const API_URL = import.meta.env.VITE_API_URL || ''
      fetch(`${API_URL}/api/history/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(resData => {
        if (!resData.success) {
          throw new Error(resData.error || 'Failed to load history data')
        }
        setBusinesses(resData.businesses)
      })
      .catch(err => setHistoryError(err.message))
    })
  }, [isLoaded, user, getToken])

  if (view === 'loading') return <LoadingScreen stage={stage} hard={hardPreview} />
  if (view === 'results' && result) return <ResultsView result={result} onNewAudit={reset} />

  if (historyError) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--page-bg)' }}>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ink)' }}>
          History error
        </div>
        <p style={{ color: 'var(--ink-muted)', maxWidth: 520, lineHeight: 1.6 }}>{historyError}</p>
        <a href="/" style={{ color: 'var(--blue)', fontSize: 14, fontWeight: 600 }}>← Run an analysis first</a>
      </div>
    )
  }

  if (!businesses) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-muted)', backgroundColor: 'var(--page-bg)' }}>Loading...</div>

  return <HistoryShell businesses={businesses} onReaudit={triggerReaudit} />
}
