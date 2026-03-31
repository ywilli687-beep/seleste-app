import React from 'react'
import { 
  Sparkles, Target, Zap, 
  Search, BarChart3, Megaphone, Layout, Type
} from 'lucide-react'

export const SPECIALIST_CONFIG: Record<string, { name: string; icon: React.ElementType; color: string; bg: string }> = {
  reputation: { name: 'GBP Specialist', icon: Sparkles, color: '#7C3AED', bg: '#F5F3FF' },
  seo: { name: 'SEO Authority', icon: Search, color: '#2563EB', bg: '#EFF6FF' },
  conversion: { name: 'CRO Specialist', icon: Target, color: '#059669', bg: '#ECFDF5' },
  performance: { name: 'Ops Tech', icon: Zap, color: '#D97706', bg: '#FFFBEB' },
  paid_ads: { name: 'Media Buyer', icon: Megaphone, color: '#DC2626', bg: '#FEF2F2' },
  data: { name: 'Data Analyst', icon: BarChart3, color: '#2563EB', bg: '#EFF6FF' },
  ux: { name: 'UX Designer', icon: Layout, color: '#DB2777', bg: '#FDF2F8' },
  content: { name: 'Content Strategist', icon: Type, color: '#4B5563', bg: '#F9FAFB' }
}

export function getAgentInfo(category: string) {
  return SPECIALIST_CONFIG[category] || { name: 'Growth Agent', icon: Sparkles, color: '#6B7280', bg: '#F3F4F6' }
}
