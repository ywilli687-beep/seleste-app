import { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import type { DashboardData } from '@/types/dashboard'

export default function Dashboard() {
  const { user, isLoaded: isUserLoaded } = useUser()
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
          const API_URL = import.meta.env.VITE_API_URL || ''
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
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard', user?.id],
    queryFn: async () => {
      const token = await getToken()
      const API_URL = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${API_URL}/api/dashboard/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const resData = await res.json()
      if (!resData.success) throw new Error(resData.error || 'Failed to load dashboard')
      return resData.data
    },
    enabled: !!isUserLoaded && !!user
  })

  if (isLoading || !isUserLoaded) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0ede8', backgroundColor: 'var(--bg)' }}>Loading Growth Intelligence...</div>
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg)' }}>
        <div style={{ fontFamily: 'var(--ff-display, serif)', fontSize: '1.75rem', color: '#f0ede8' }}>Command Center Offline</div>
        <p style={{ color: '#9b9890', maxWidth: 520, lineHeight: 1.6 }}>{(error as Error).message}</p>
        <button onClick={() => window.location.reload()} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>Reconnect →</button>
      </div>
    )
  }

  if (data?.totalAudits === 0) {
    return (
      <DashboardShell data={data}>
        <div style={{ padding: '64px 32px', textAlign: 'center', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '1px solid var(--border)', marginTop: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '24px' }}>🚀</div>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2rem', marginBottom: '16px' }}>Initialize growth intelligence</h2>
          <p style={{ color: 'var(--text2)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Your command center is ready. Run your first deep-scan to unlock historical tracking, competitor benchmarks, and your 90-day growth roadmap.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ background: 'var(--accent)', color: '#0a0a0f', padding: '14px 36px', borderRadius: 'var(--rs)', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
          >
            Run First Audit →
          </button>
        </div>
      </DashboardShell>
    )
  }

  return <DashboardShell data={data!} />
}
