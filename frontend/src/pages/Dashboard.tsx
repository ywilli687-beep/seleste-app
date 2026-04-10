import { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuditFlow } from '@/lib/hooks/useAuditFlow'
import LoadingScreen from '@/components/LoadingScreen'
import ResultsView from '@/components/ResultsView'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import type { DashboardData } from '@/types/dashboard'

export default function Dashboard() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const {
    view, setView,
    result, setResult,
    error, setError,
    stage, setStage,
    hardPreview, setHardPreview,
    triggerReaudit,
    reset
  } = useAuditFlow()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  // 1. Audit Claiming Logic (Side Effect)
  useEffect(() => {
    if (!isUserLoaded || !user) return

    const lastAnonId = localStorage.getItem('last_anonymous_audit')
    if (lastAnonId) {
      const claimAudit = async () => {
        try {
          const token = await getToken()
          const API_URL = '' // Use relative path
          await fetch(`${API_URL}/api/claim`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ auditId: lastAnonId, userId: user.id })
          })
          localStorage.removeItem('last_anonymous_audit')
          // Invalidate query to show the newly claimed audit
          queryClient.invalidateQueries({ queryKey: ['dashboard', user.id] })
        } catch (e) {
          console.error('[Claim Error]', e)
        }
      }
      claimAudit()
    }
  }, [isUserLoaded, user, getToken, queryClient])

  // 2. Data Fetching with React Query
  const { data, isLoading, error: queryError } = useQuery<DashboardData>({
    queryKey: ['dashboard', user?.id],
    queryFn: async () => {
      const token = await getToken()
      const BASE_API_URL = '' // Use relative path for Vercel proxy
      const res = await fetch(`${BASE_API_URL}/api/dashboard/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const resData = await res.json()
      if (!resData.success) throw new Error(resData.error || 'Failed to load dashboard')
      return resData.data
    },
    enabled: !!isUserLoaded && !!user
  })

  const isProd = import.meta.env.PROD
  const API_URL = import.meta.env.VITE_API_URL || ''

  if (view === 'loading') return <LoadingScreen stage={stage} hard={hardPreview} />
  if (view === 'results' && result) return <ResultsView result={result} onNewAudit={reset} />

  // 1. Guard against missing VITE_API_URL in production
  if (isProd && !API_URL) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', padding: '2rem', textAlign: 'center', backgroundColor: '#F8F9FB', color: '#1A1D21' }}>
        <div style={{ fontSize: '3rem' }}>⚙️</div>
        <div style={{ fontFamily: 'var(--ff-display, sans-serif)', fontSize: '1.75rem', fontWeight: 600 }}>Configuration Required</div>
        <p style={{ color: '#4B5563', maxWidth: 500, lineHeight: 1.6 }}>
          The <strong style={{color: '#1A1A1A'}}>VITE_API_URL</strong> environment variable is missing. The system cannot reach the intelligence engine without it.
        </p>
        <div style={{ background: '#FFFFFF', padding: '16px 24px', borderRadius: 12, fontSize: 13, border: '1px solid #E5E7EB', textAlign: 'left', fontFamily: 'var(--ff-mono)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          1. Go to Vercel Dashboard → Projects Settings<br/>
          2. Environment Variables → Add <strong>VITE_API_URL</strong><br/>
          3. Set it to your backend URL (e.g. https://api.seleste.app)
        </div>
      </div>
    )
  }

  if (isLoading || !isUserLoaded) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1D21', backgroundColor: '#F8F9FB', fontFamily: 'var(--ff-sans)' }}>Loading intelligence dashboard...</div>
  }

  if (queryError) {
    const errorMsg = queryError instanceof Error ? queryError.message : String(queryError)
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center', backgroundColor: '#F8F9FB', color: '#1A1D21' }}>
        <div style={{ fontSize: '2rem' }}>📡</div>
        <div style={{ fontFamily: 'var(--ff-display, sans-serif)', fontSize: '1.75rem', fontWeight: 600 }}>Intelligence Center Offline</div>
        <p style={{ color: '#4B5563', maxWidth: 520, lineHeight: 1.6 }}>
          {errorMsg.includes('Unexpected token') 
            ? 'The API returned an invalid response. Please verify your backend URL is correct.' 
            : errorMsg}
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => window.location.reload()} style={{ color: '#1A1D21', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>Retry Connection</button>
          <button onClick={() => window.location.href = '/'} style={{ color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>Return Home</button>
        </div>
      </div>
    )
  }

  const userName = user?.firstName ?? undefined

  if (data?.totalAudits === 0) {
    return (
      <DashboardShell data={data} userName={userName} onReaudit={triggerReaudit}>
        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚀</div>
          <div style={{ fontFamily: 'var(--ff-sans)', fontSize: 16, fontWeight: 500, color: 'var(--os-text-prim)', marginBottom: 10 }}>
            Run your first audit
          </div>
          <p style={{ color: 'var(--os-text-sec)', maxWidth: 400, margin: '0 auto 28px', lineHeight: 1.6, fontSize: 13, fontFamily: 'var(--ff-sans)' }}>
            Unlock your score, growth roadmap, and revenue intelligence by scanning your website.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{ background: 'var(--os-text-prim)', color: 'var(--os-bg-tert)', padding: '10px 28px', borderRadius: 7, border: 'none', fontWeight: 500, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--ff-sans)' }}
          >
            Start First Scan →
          </button>
        </div>
      </DashboardShell>
    )
  }

  return <DashboardShell data={data!} userName={userName} onReaudit={triggerReaudit} />
}
