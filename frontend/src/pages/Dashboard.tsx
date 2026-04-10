import { useEffect, useCallback } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useAuditFlow } from '@/lib/hooks/useAuditFlow'
import LoadingScreen from '@/components/LoadingScreen'
import ResultsView from '@/components/ResultsView'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import type { DashboardData } from '@/types/dashboard'
import type { WeeklyActionRaw, AgentOutput, CycleState } from '@/types/feed'

export default function Dashboard() {
  const { user, isLoaded: isUserLoaded } = useUser()
  const {
    view,
    result,
    stage,
    hardPreview,
    triggerReaudit,
    reset
  } = useAuditFlow()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  // 1. Claim anonymous audits on login
  useEffect(() => {
    if (!isUserLoaded || !user) return
    const lastAnonId = localStorage.getItem('last_anonymous_audit')
    if (!lastAnonId) return

    const claimAudit = async () => {
      try {
        const token = await getToken()
        await fetch('/api/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ auditId: lastAnonId, userId: user.id })
        })
        localStorage.removeItem('last_anonymous_audit')
        queryClient.invalidateQueries({ queryKey: ['dashboard', user.id] })
      } catch (e) {
        console.error('[Claim Error]', e)
      }
    }
    claimAudit()
  }, [isUserLoaded, user, getToken, queryClient])

  // 2. Dashboard data
  const { data, isLoading, error: queryError } = useQuery<DashboardData>({
    queryKey: ['dashboard', user?.id],
    queryFn: async () => {
      const token = await getToken()
      const res = await fetch(`/api/dashboard/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const resData = await res.json()
      if (!resData.success) throw new Error(resData.error || 'Failed to load dashboard')
      return resData.data
    },
    enabled: !!isUserLoaded && !!user
  })

  // 3. Agent data (runs in parallel — non-blocking if it fails)
  const { data: agentsData } = useQuery<{
    weeklyActions: WeeklyActionRaw[]
    agentOutputs: AgentOutput[]
    cycleState: CycleState
    lastCycleAt: string | null
  }>({
    queryKey: ['agents', user?.id],
    queryFn: async () => {
      const token = await getToken()
      const res = await fetch(`/api/agents/page/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const resData = await res.json()
      if (!resData.success) return { weeklyActions: [], agentOutputs: [], cycleState: 'no_cycle' as CycleState, lastCycleAt: null }
      return {
        weeklyActions: resData.data?.weeklyActions ?? [],
        agentOutputs: resData.data?.agentOutputs ?? [],
        cycleState: (resData.data?.state ?? 'no_cycle') as CycleState,
        lastCycleAt: resData.data?.latestCycle?.completedAt ?? null,
      }
    },
    enabled: !!isUserLoaded && !!user,
  })

  // 4. Approve action mutation
  const approveMutation = useMutation({
    mutationFn: async (actionId: string) => {
      const token = await getToken()
      const res = await fetch(`/api/agents/approve/${actionId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      const resData = await res.json()
      if (!resData.success) throw new Error(resData.error || 'Approval failed')
      return resData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', user?.id] })
    }
  })

  // 5. Reject action mutation (optimistic — just marks as ignored locally)
  const rejectMutation = useMutation({
    mutationFn: async (actionId: string) => {
      const token = await getToken()
      // Reject endpoint doesn't exist yet — gracefully no-ops
      await fetch(`/api/agents/reject/${actionId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      }).catch(() => { /* swallow — endpoint may not exist */ })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents', user?.id] })
    }
  })

  const handleApprove = useCallback((id: string) => {
    approveMutation.mutate(id)
  }, [approveMutation])

  const handleReject = useCallback((id: string) => {
    rejectMutation.mutate(id)
  }, [rejectMutation])

  const isProd = import.meta.env.PROD
  const API_URL = import.meta.env.VITE_API_URL || ''

  if (view === 'loading') return <LoadingScreen stage={stage} hard={hardPreview} />
  if (view === 'results' && result) return <ResultsView result={result} onNewAudit={reset} />

  if (isProd && !API_URL) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', padding: '2rem', textAlign: 'center', background: 'var(--os-bg-tert)', color: 'var(--os-text-prim)' }}>
        <div style={{ fontSize: '3rem' }}>⚙️</div>
        <div style={{ fontFamily: 'var(--ff-sans)', fontSize: 18, fontWeight: 500 }}>Configuration Required</div>
        <p style={{ color: 'var(--os-text-sec)', maxWidth: 500, lineHeight: 1.6, fontSize: 14 }}>
          The <code style={{ background: 'var(--os-bg-sec)', padding: '2px 6px', borderRadius: 4 }}>VITE_API_URL</code> environment variable is missing.
        </p>
      </div>
    )
  }

  if (isLoading || !isUserLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--os-bg-tert)', color: 'var(--os-text-sec)', fontFamily: 'var(--ff-sans)', fontSize: 13 }}>
        Loading...
      </div>
    )
  }

  if (queryError) {
    const errorMsg = queryError instanceof Error ? queryError.message : String(queryError)
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center', background: 'var(--os-bg-tert)', color: 'var(--os-text-prim)' }}>
        <div style={{ fontSize: '2rem' }}>📡</div>
        <div style={{ fontFamily: 'var(--ff-sans)', fontSize: 16, fontWeight: 500 }}>Dashboard offline</div>
        <p style={{ color: 'var(--os-text-sec)', maxWidth: 480, lineHeight: 1.6, fontSize: 13 }}>
          {errorMsg.includes('Unexpected token')
            ? 'The API returned an invalid response. Check your backend URL.'
            : errorMsg}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.location.reload()} style={{ background: 'var(--os-text-prim)', color: 'var(--os-bg-tert)', border: 'none', padding: '8px 20px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--ff-sans)' }}>Retry</button>
          <button onClick={() => window.location.href = '/'} style={{ color: 'var(--os-text-sec)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Return Home</button>
        </div>
      </div>
    )
  }

  const userName = user?.firstName ?? undefined
  const pendingActions = (agentsData?.weeklyActions ?? []).filter(a => a.status === 'pending')

  if (data?.totalAudits === 0) {
    return (
      <DashboardShell
        data={data}
        userName={userName}
        weeklyActions={[]}
        agentOutputs={agentsData?.agentOutputs ?? []}
        cycleState={agentsData?.cycleState ?? 'no_cycle'}
        lastCycleAt={agentsData?.lastCycleAt ?? null}
        onReaudit={triggerReaudit}
        onApprove={handleApprove}
        onReject={handleReject}
      >
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

  return (
    <DashboardShell
      data={data!}
      userName={userName}
      weeklyActions={pendingActions}
      agentOutputs={agentsData?.agentOutputs ?? []}
      cycleState={agentsData?.cycleState ?? 'no_cycle'}
      lastCycleAt={agentsData?.lastCycleAt ?? null}
      onReaudit={triggerReaudit}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  )
}
