import { useState, useCallback, useRef } from 'react'
import { useUser } from '@clerk/clerk-react'
import type { AuditResult, AuditRequest, LoadingStage } from '@/types/audit'

export type View = 'landing' | 'intake' | 'loading' | 'results' | 'error'

export function useAuditFlow() {
  const { user } = useUser()
  const [view, setView]     = useState<View>('landing')
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [stage, setStage]   = useState<LoadingStage>('fetching')
  const [hardPreview, setHardPreview] = useState<{
    pageTitle?: string; detectedCMS?: string | null; wordCount?: number; isSSL?: boolean
  } | null>(null)
  
  const isRunning = useRef(false)

  const API_URL = '' // Use relative path for Vercel proxy

  const runAudit = useCallback(async (req: AuditRequest) => {
    if (isRunning.current) return
    isRunning.current = true
    
    setError(null)
    setStage('fetching')
    setHardPreview(null)
    setView('loading')

    try {
      // Stage 1 - Target connection & Initial Fetch
      const targetUrl = `${API_URL}/api/audit`
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...req,
          userId: user?.id ?? null,
        }),
      })

      const data = await res.json()
      
      // Validation check before Stage 2
      if (!data.success || !data.result || !data.result.auditId) {
        throw new Error(data.error || 'Failed to establish connection — invalid fetch identity.')
      }

      // Stage 2 - Signal Extraction
      setStage('ai_signals')
      
      // Simulate real-time parsing feel
      await new Promise(r => setTimeout(r, 800))
      setStage('scoring')
      await new Promise(r => setTimeout(r, 600))
      
      setStage('narrative')
      await new Promise(r => setTimeout(r, 400))

      setStage('saving')
      await new Promise(r => setTimeout(r, 300))
      
      setStage('done')
      setResult(data.result)
      
      // Persistent ref for anonymous recovery
      if (data.result.auditId) {
        localStorage.setItem('last_anonymous_audit', data.result.auditId)
      }
      
      setView('results')
    } catch (err: any) {
      console.error('[Audit Flow Error]', err)
      setError(err.message || 'Audit Interrupted — unable to complete the analysis deep-scan.')
      setView('error') // NEVER reset to 'intake' or 'form' here
    } finally {
      isRunning.current = false
    }
  }, [user?.id, API_URL])

  const triggerReaudit = useCallback(async (payload: {
    url: string
    businessName: string
    location: string
    vertical: string
  }) => {
    if (isRunning.current) return
    if (!user) {
      window.location.href = '/sign-in'
      return
    }

    isRunning.current = true
    setError(null)
    setResult(null)
    setHardPreview(null)
    setView('loading')
    setStage('fetching')

    try {
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
      const data = await res.json()
      
      if (!data.success || !data.result) {
        throw new Error(data.error || 'Re-analysis failed')
      }

      setStage('scoring')
      await new Promise(r => setTimeout(r, 500))

      setStage('narrative')
      await new Promise(r => setTimeout(r, 300))

      setStage('saving')
      await new Promise(r => setTimeout(r, 300))
      setStage('done')

      setResult(data.result)
      setView('results')
    } catch (err: any) {
      console.error('[Re-audit Error]', err)
      setError(err.message || 'Re-analysis failed — please try again.')
      setView('error') 
    } finally {
      isRunning.current = false
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
