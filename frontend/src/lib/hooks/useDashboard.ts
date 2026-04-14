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
      // Normalize old single-business shape → Phase 8 businesses array
      // d.state is US state (e.g. "md"); d.businessState is the machine state
      const displayName = d.businessName && !d.businessName.includes('.')
        ? d.businessName
        : (d.vertical ? `${d.vertical.replace(/_/g, ' ')} business` : d.businessName)
      const businesses = d.totalAudits === 0 ? [] : [{
        businessId:     d.id,
        name:           displayName,
        overallScore:   d.overallScore,
        scoreDelta:     d.scoreDelta,
        state:          d.businessState ?? null,
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
    queryFn:  async () => {
      const token = await getToken()
      return apiGet(`/api/business/${businessId}/state`, token!)
    },
    enabled: !!businessId,
  })
}

export function useAuditHistory(businessId: string | undefined) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['audit-history', businessId],
    queryFn:  async () => {
      const token = await getToken()
      return apiGet(`/api/business/${businessId}/audits?limit=10`, token!)
    },
    enabled: !!businessId,
  })
}

export function useInbox(businessId: string | undefined) {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['inbox', businessId],
    queryFn:  async () => {
      const token = await getToken()
      return apiGet(`/api/tasks?businessId=${businessId}&status=ACTIVE&limit=20`, token!)
    },
    enabled:         !!businessId,
    refetchInterval: 15000,
  })
}

export function useApproveTask(businessId: string) {
  const { getToken }   = useAuth()
  const queryClient    = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      const token = await getToken()
      return apiPost(`/api/tasks/${taskId}/approve`, token!)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox', businessId] })
    },
  })
}

export function useRejectTask(businessId: string) {
  const { getToken }   = useAuth()
  const queryClient    = useQueryClient()
  return useMutation({
    mutationFn: async ({ taskId, reason }: { taskId: string; reason?: string }) => {
      const token = await getToken()
      return apiPost(`/api/tasks/${taskId}/reject`, token!, { reason })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox', businessId] })
    },
  })
}

export function useLearningDashboard() {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['learning-dashboard'],
    queryFn:  async () => {
      const token = await getToken()
      return apiGet('/api/learning/dashboard', token!)
    },
  })
}
