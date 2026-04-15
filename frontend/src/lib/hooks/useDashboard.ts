import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { apiGet, apiPost } from '../api'

export function useGlobalDashboard() {
  const { getToken, userId } = useAuth()
  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn:  async () => {
      const token = await getToken()
      const res   = await apiGet<{ success: boolean; data: any; error?: string }>(`/api/dashboard/${userId}`, token!)
      if (!res.success) throw new Error(res.error || 'Failed to load dashboard')
      const d = res.data
      // Normalize single-business shape → Phase 8 businesses array
      const displayName = d.businessName && !d.businessName.includes('.')
        ? d.businessName
        : (d.vertical ? d.vertical.replace(/_/g, ' ').toLowerCase() : d.businessName)
      const businesses = d.totalAudits === 0 ? [] : [{
        businessId:     d.id,
        name:           displayName,
        overallScore:   d.overallScore,
        scoreDelta:     d.scoreDelta,
        state:          d.businessState ?? null,
        industry:       d.vertical ?? 'OTHER',
        pendingActions: 0,
      }]
      return {
        ...d,
        businesses,
        globalSummary: {
          totalPendingActions: 0,
          avgScore:            d.overallScore ?? null,
          topMover:            null,
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
