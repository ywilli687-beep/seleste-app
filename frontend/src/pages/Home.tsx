import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useAuditFlow } from '@/lib/hooks/useAuditFlow'
import type { AuditResult, AuditRequest, LoadingStage } from '@/types/audit'
import Landing from '@/components/Landing'
import IntakeForm from '@/components/IntakeForm'
import LoadingScreen from '@/components/LoadingScreen'
import ResultsView from '@/components/ResultsView'

type View = 'landing' | 'intake' | 'loading' | 'results'

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
      {view === 'landing'  && <Landing onStart={() => setView('intake')} />}
      {view === 'intake'   && <IntakeForm onSubmit={runAudit} onBack={() => setView('landing')} error={error} />}
      {view === 'loading'  && <LoadingScreen stage={stage} hard={hardPreview} />}
      {view === 'results'  && result && <ResultsView result={result} onNewAudit={reset} />}
    </>
  )
}
