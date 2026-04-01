import { useState, useCallback } from 'react'
import { useUser } from '@clerk/clerk-react'
import type { AuditResult, AuditRequest, LoadingStage } from '@/types/audit'

export type View = 'landing' | 'intake' | 'loading' | 'results'

export function useAuditFlow() {
  const { user } = useUser()
  const [view, setView]     = useState<View>('landing')
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [stage, setStage]   = useState<LoadingStage>('fetching')
  const [hardPreview, setHardPreview] = useState<{
    pageTitle?: string; detectedCMS?: string | null; wordCount?: number; isSSL?: boolean
  } | null>(null)

  const API_URL = import.meta.env.VITE_API_URL || ''

  const runAudit = useCallback(async (req: AuditRequest) => {
    setError(null)
    setStage('fetching')
    setHardPreview(null)
    setView('loading')

    try {
      // Simulate progression since we have a single POST route
      setStage('fetching')
      
      const res = await fetch(`${API_URL}/api/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...req,
          userId: user?.id ?? null,
        }),
      })

      setStage('ai_signals') // AI reads page content
      await new Promise(r => setTimeout(r, 600))
      
      setStage('scoring') // Running rules engine
      await new Promise(r => setTimeout(r, 400))
      
      setStage('narrative') // Writing AI growth analysis
      await new Promise(r => setTimeout(r, 300))

      const data = await res.json()
      if (!data.success || !data.result) {
        throw new Error(data.error || 'Intelligence extraction failed')
      }

      setStage('saving') // Saving to intelligence layer
      await new Promise(r => setTimeout(r, 300))
      setStage('done')

      setResult(data.result)
      if (data.result.auditId) {
        localStorage.setItem('last_anonymous_audit', data.result.auditId)
      }
      setView('results')
    } catch (err: any) {
      console.error('[Audit Error]', err)
      setError(err.message || 'Analysis failed')
      setView('intake')
    }
  }, [user?.id, API_URL])

  const triggerReaudit = useCallback(async (payload: {
    url: string
    businessName: string
    location: string
    vertical: string
  }) => {
    if (!user) {
      window.location.href = '/sign-in'
      return
    }

    setError(null)
    setResult(null)
    setHardPreview(null)
    setView('loading')
    setStage('fetching')

    try {
      // Stage 1 - Simulated Fetch
      await new Promise(r => setTimeout(r, 400))
      setStage('fetching')

      const res = await fetch(`${API_URL}/api/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          userId: user.id,
          triggeredBy: 'MANUAL'
        }),
      })

      setStage('ai_signals')
      await new Promise(r => setTimeout(r, 800))

      setStage('scoring')
      await new Promise(r => setTimeout(r, 500))

      setStage('narrative')
      const data = await res.json()
      
      if (!data.success || !data.result) {
        throw new Error(data.error || 'Re-audit failed')
      }

      setStage('saving')
      await new Promise(r => setTimeout(r, 300))
      setStage('done')

      setResult(data.result)
      setView('results')
    } catch (err: any) {
      console.error('[Re-audit Error]', err)
      setError(err.message || 'Re-audit failed')
      setView('results') // If re-audit fails, stay on current page but maybe show error to user? 
      // Prompt says: "skip intake form entirely". If error happens, I'll go back to results view
    }
  }, [user, API_URL])

  const reset = useCallback(() => {
    setView('intake')
    setResult(null)
    setError(null)
    setStage('fetching')
    setHardPreview(null)
  }, [])

  return {
    view, setView,
    result, setResult,
    error, setError,
    stage, setStage,
    hardPreview, setHardPreview,
    runAudit,
    triggerReaudit,
    reset
  }
}
