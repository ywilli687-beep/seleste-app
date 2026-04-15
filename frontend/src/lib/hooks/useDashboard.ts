import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { apiGet, apiPost } from '../api'

export function useGlobalDashboard() {
  const { getToken, userId } = useAuth()
  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn:  async () => {
      const token = await getToken()
      // Use new multi-business endpoint
      const res = await apiGet<{ success: boolean; businesses: any[]; error?: string }>(
        '/api/user/businesses', token!
      )
      if (!res.success) throw new Error(res.error || 'Failed to load dashboard')
      const businesses = res.businesses ?? []
      const avgScore = businesses.length
        ? Math.round(businesses.reduce((s: number, b: any) => s + (b.overallScore ?? 0), 0) / businesses.length)
        : null
      return {
        businesses,
        globalSummary: {
          totalPendingActions: businesses.reduce((s: number, b: any) => s + (b.pendingActions ?? 0), 0),
          avgScore,
          topMover: null,
        },
      }
    },
    enabled:         !!userId,
    refetchInterval: 30000,
  })
}

export function useBusinessState(businessId: string | undefined) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['business-state', businessId],
    queryFn:  async () => { const token = await getToken(); return apiGet(`/api/business/${businessId}/state`, token!) },
    enabled:  !!businessId,
  })
}

export function useAuditHistory(businessId: string | undefined) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['audit-history', businessId],
    queryFn:  async () => { const token = await getToken(); return apiGet(`/api/business/${businessId}/audits?limit=10`, token!) },
    enabled:  !!businessId,
  })
}

export function useInbox(businessId: string | undefined) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['inbox', businessId],
    queryFn:  async () => { const token = await getToken(); return apiGet(`/api/tasks?businessId=${businessId}&status=ACTIVE&limit=20`, token!) },
    enabled:  !!businessId,
    refetchInterval: 15000,
  })
}

export function useApproveTask(businessId: string) {
  const { getToken } = useAuth()
  const queryClient  = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => { const token = await getToken(); return apiPost(`/api/tasks/${taskId}/approve`, token!) },
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['inbox', businessId] }),
  })
}

export function useRejectTask(businessId: string) {
  const { getToken } = useAuth()
  const queryClient  = useQueryClient()
  return useMutation({
    mutationFn: async ({ taskId, reason }: { taskId: string; reason?: string }) => {
      const token = await getToken(); return apiPost(`/api/tasks/${taskId}/reject`, token!, { reason })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inbox', businessId] }),
  })
}

export function useLearningDashboard() {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['learning-dashboard'],
    queryFn:  async () => { const token = await getToken(); return apiGet('/api/learning/dashboard', token!) },
  })
}

export function useAllAuditHistories(businessIds: string[]) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['all-audit-histories', businessIds.join(',')],
    queryFn:  async () => {
      const token   = await getToken()
      const results = await Promise.all(
        businessIds.map((id) =>
          apiGet<{ audits: any[] }>(`/api/business/${id}/audits?limit=7`, token!)
            .then((r) => ({ id, scores: r.audits.map((a: any) => a.overallScore).reverse() }))
            .catch(() => ({ id, scores: [] }))
        )
      )
      return Object.fromEntries(results.map((r) => [r.id, r.scores]))
    },
    enabled: businessIds.length > 0,
  })
}

// ── Team / multi-business hooks ───────────────────────────────────────────────

export function useTeam(businessId: string | undefined) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['team', businessId],
    queryFn:  async () => { const token = await getToken(); return apiGet(`/api/business/${businessId}/team`, token!) },
    enabled:  !!businessId,
  })
}

export function useCreateBusiness() {
  const { getToken } = useAuth()
  const queryClient  = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; website: string; industry: string; city?: string; region?: string }) => {
      const token = await getToken()
      return apiPost('/api/business', token!, data)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
  })
}

export function useInviteMember(businessId: string) {
  const { getToken } = useAuth()
  const queryClient  = useQueryClient()
  return useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const token = await getToken()
      return apiPost(`/api/business/${businessId}/team/invite`, token!, { email, role })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team', businessId] }),
  })
}

export function useRemoveMember(businessId: string) {
  const { getToken } = useAuth()
  const queryClient  = useQueryClient()
  return useMutation({
    mutationFn: async (memberId: string) => {
      const token = await getToken()
      return fetch(`/api/business/${businessId}/team/${memberId}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json())
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team', businessId] }),
  })
}
