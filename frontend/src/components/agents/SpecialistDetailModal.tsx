import React from 'react'
import { X, ExternalLink, Activity, Clock, ShieldCheck, Zap } from 'lucide-react'
import { getAgentInfo } from '../../lib/agents/config'

interface AgentRunRecord {
  id: string
  status: string
  createdAt: string
  durationMs: number
}

interface SpecialistDetailModalProps {
  agentId: string
  runs: AgentRunRecord[]
  onClose: () => void
}

export function SpecialistDetailModal({ agentId, runs, onClose }: SpecialistDetailModalProps) {
  const category = agentId.toLowerCase().includes('reporting') ? 'data' : 
                   agentId.toLowerCase().includes('seo') ? 'seo' :
                   agentId.toLowerCase().includes('gbp') ? 'reputation' :
                   agentId.toLowerCase().includes('conversion') ? 'conversion' :
                   agentId.toLowerCase().includes('architect') ? 'ux' : 'content'
  const agent = getAgentInfo(category)
  const Icon = agent.icon

  const avgDuration = runs.length > 0 ? (runs.reduce((acc, r) => acc + r.durationMs, 0) / runs.length / 1000).toFixed(2) : '0'
  const successRate = runs.length > 0 ? ((runs.filter(r => r.status === 'complete').length / runs.length) * 100).toFixed(0) : '100'

  return (
    <div style={{ 
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', 
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', 
      justifyContent: 'center', zIndex: 1000, padding: 24 
    }}>
      <div style={{ 
        width: '100%', maxWidth: 640, background: 'white', 
        borderRadius: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        overflow: 'hidden', border: '1px solid #ECEEEF'
      }}>
        {/* HEADER */}
        <div style={{ 
          padding: '32px 32px 24px', position: 'relative', 
          background: `linear-gradient(135deg, ${agent.bg} 0%, #FFFFFF 100%)`,
          borderBottom: '1px solid #ECEEEF'
        }}>
          <button 
            onClick={onClose}
            style={{ 
              position: 'absolute', top: 24, right: 24, border: 'none', background: '#FFFFFF', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderRadius: '50%', padding: 8, cursor: 'pointer' 
            }}
          >
            <X size={18} color="#6B7280" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ 
              width: 56, height: 56, borderRadius: 16, background: 'white',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #ECEEEF',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Icon size={24} color={agent.color} />
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>{agent.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>System Specialist v2.4.0</span>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#D1D5DB' }} />
                <span style={{ fontSize: 13, color: agent.color, fontWeight: 700 }}>Operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* STATS STRIP */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#ECEEEF' }}>
          <div style={{ padding: '20px 32px', background: 'white' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 4 }}>Success Rate</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{successRate}%</div>
          </div>
          <div style={{ padding: '20px 32px', background: 'white' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 4 }}>Avg. Speed</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{avgDuration}s</div>
          </div>
          <div style={{ padding: '20px 32px', background: 'white' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 4 }}>Intelligence</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>Gold Class</div>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 32, maxHeight: '60vh', overflowY: 'auto' }}>
          
          <section>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={16} color="#2563EB" /> Core Mission
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#4B5563', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, border: '1px solid #ECEEEF' }}>
              Responsible for the analysis and optimization of {agent.name.toLowerCase()} signals. 
              {agentId.includes('gbp') ? " Evaluates Google Business Profile recency, sentiment, and visual impact to maximize local search impressions." : 
              agentId.includes('reporting') ? " Synthesizes complex growth data into executive-level narratives for weekly stakeholders." : 
              " Uses recursive intelligence loops to identify and solve growth friction in real-time across your digital ecosystem."}
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={16} color="#6B7280" /> Execution History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {runs.map(run => (
                <div key={run.id} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '12px 16px', background: 'white', border: '1px solid #ECEEEF', borderRadius: 12 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: run.status === 'complete' ? '#10B981' : '#EF4444' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Run Complete</span>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>{new Date(run.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#4B5563' }}>{(run.durationMs/1000).toFixed(1)}s</span>
                    <ExternalLink size={14} color="#9CA3AF" />
                  </div>
                </div>
              ))}
              {runs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px 0', border: '1px dashed #D1D5DB', borderRadius: 12 }}>
                  <span style={{ fontSize: 13, color: '#9CA3AF' }}>No run history recorded for this version.</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div style={{ padding: '24px 32px', background: '#F9FAFB', borderTop: '1px solid #ECEEEF', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
           <button 
             onClick={onClose}
             style={{ 
               padding: '10px 24px', border: '1px solid #E5E7EB', background: 'white', 
               borderRadius: 12, fontSize: 14, fontWeight: 600, color: '#4B5563', cursor: 'pointer' 
             }}
           >
             Close Deep Dive
           </button>
           <button 
             style={{ 
               padding: '10px 24px', border: 'none', background: '#111827', 
               borderRadius: 12, fontSize: 14, fontWeight: 700, color: 'white', cursor: 'pointer',
               display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
             }}
           >
             <Zap size={14} fill="white" /> Relaunch Agent
           </button>
        </div>
      </div>
    </div>
  )
}
