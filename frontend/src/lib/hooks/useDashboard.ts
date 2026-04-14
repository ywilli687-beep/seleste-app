import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { apiGet, apiPost } from '../api'

export function useGlobalDashboard() {
  const { getToken } = useAuth()
  return useQuery({
    queryKey: ['dashboard'],
    queryFn:  async () => {
      const token = await getToken()
      return apiGet('/api/dashboard', token!)
    },
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
