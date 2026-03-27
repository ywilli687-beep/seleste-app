import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import type { AuditResult, AuditRequest, LoadingStage } from '@/types/audit'
import Landing from '@/components/Landing'
import IntakeForm from '@/components/IntakeForm'
import LoadingScreen from '@/components/LoadingScreen'
import ResultsView from '@/components/ResultsView'

type View = 'landing' | 'intake' | 'loading' | 'results'

export default function Home() {
  const { user } = useUser()
  const [view, setView]   = useState<View>('landing')
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [stage, setStage]   = useState<LoadingStage>('fetching')
  const [hardPreview, setHardPreview] = useState<{
    pageTitle?: string; detectedCMS?: string | null; wordCount?: number; isSSL?: boolean
  } | null>(null)

  const runAudit = async (req: AuditRequest) => {
    setError(null)
    setStage('fetching')
    setHardPreview(null)
    setView('loading')

    try {
      setStage('ai_signals')

      // Simplified single stage call since time limits aren't constrained
      const API_URL = import.meta.env.VITE_API_URL || ''
      const analyzeRes = await fetch(`${API_URL}/api/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...req,
          userId: user?.id ?? null,
        }),
      })

      setStage('scoring')
      await new Promise(r => setTimeout(r, 400))
      setStage('narrative')

      const analyzeData = await analyzeRes.json()
      if (!analyzeData.success || !analyzeData.result) {
        throw new Error(analyzeData.error || 'Analysis failed')
      }

      setStage('saving')
      await new Promise(r => setTimeout(r, 300))
      setStage('done')

      setResult(analyzeData.result)
      if (analyzeData.result.auditId) {
        localStorage.setItem('last_anonymous_audit', analyzeData.result.auditId)
      }
      setView('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setView('intake')
    }
  }

  const reset = () => {
    setView('intake')
    setResult(null)
    setError(null)
    setStage('fetching')
    setHardPreview(null)
  }

  return (
    <>
      {view === 'landing'  && <Landing onStart={() => setView('intake')} />}
      {view === 'intake'   && <IntakeForm onSubmit={runAudit} onBack={() => setView('landing')} error={error} />}
      {view === 'loading'  && <LoadingScreen stage={stage} hard={hardPreview} />}
      {view === 'results'  && result && <ResultsView result={result} onNewAudit={reset} />}
    </>
  )
}
