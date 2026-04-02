import React, { useState, useEffect } from 'react'
import { ApprovalInbox } from './ApprovalInbox'
import { getAgentInfo } from '../../lib/agents/config'
import { SpecialistDetailModal } from './SpecialistDetailModal'
import { WaitlistModal } from '../ui/WaitlistModal'

interface WeeklyAction {
  id: string
  category: string
  title: string
  description: string
  draftContent: string
  status: 'pending' | 'approved' | 'completed' | 'ignored'
  estimatedLift: number
}

export interface AgentsPageData {
  latestCycle: {
    id: string
    status: 'pending' | 'running' | 'complete' | 'partial' | 'failed'
    trigger: string
    completedAt: string | null
    agentsRun: string[]
    agentsFailed: string[]
    durationMs: number | null
  } | null
  nextCycleAt: string | null     
  cycleCount: number             
  weeklyActions: WeeklyAction[]  
  agentOutputs: {
    agentId: string
    agentName: string            
    chipColor: string
    status: 'complete' | 'failed' | 'skipped' | 'pending'
    completedAt: string | null
    thisWeeksAction: string | null 
    confidence: 'high' | 'medium' | 'low' | null
    durationMs: number | null
  }[]
  integrations: {
    platform: string
    displayName: string           
    status: 'connected' | 'expired' | 'error' | 'missing'
    connectedAt: string | null
    unlocks: string               
    connectUrl: string            
    chipColor: string
  }[]
  reportingOutput: {
    executiveSummary: string
  } | null
  growthArchitectOutput: Record<string, unknown> | null
  optimizationOutput: Record<string, unknown> | null
  state: 'no_cycle' | 'cycle_running' | 'cycle_complete' | 'cycle_failed'
  planTier: 'free' | 'pro' | 'agency'
}

export function AgentsShell({ data: initialData }: { data: AgentsPageData }) {
  const [data, setData] = useState(initialData)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)

  // Polling logic for when the cycle is running
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (data.state === 'cycle_running') {
      interval = setInterval(() => {
        // Poll logic would fetch fresh updates for the running cycle
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [data.state])

  const { latestCycle, agentOutputs, integrations } = data

  const handleRunManual = () => {
    if (data.planTier === 'free') {
      setIsWaitlistOpen(true)
    } else {
      alert("Triggering manual cycle...")
    }
  }

  return (
    <div className="grid-shell">
      <div className="sidebar">
        <div style={{ marginBottom: 40, fontWeight: 700, fontSize: 20 }}>Seleste V2</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }} onClick={() => window.location.href = '/dashboard'}>Command Center</div>
          <div style={{ color: 'var(--green2)', fontWeight: 600, cursor: 'pointer' }}>AI Specialists</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }} onClick={() => window.location.href = '/history'}>Audit History</div>
        </nav>
      </div>

      <div className="main-content">
        <header style={{ padding: '40px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 className="text-h1" style={{ fontSize: 28, marginBottom: 8 }}>AI Specialists</h1>
            <p className="text-body">Your autonomous growth team executing while you sleep.</p>
          </div>
          <button 
            className="btn-primary-v2" 
            style={{ 
              padding: '10px 20px', 
              fontSize: 13, 
              background: data.planTier === 'free' ? 'rgba(255,255,255,0.05)' : 'white', 
              color: data.planTier === 'free' ? 'rgba(255,255,255,0.5)' : 'black',
              border: data.planTier === 'free' ? '1px solid rgba(255,255,255,0.1)' : 'none',
              opacity: 1
            }}
            onClick={handleRunManual}
          >
            {data.planTier === 'free' ? 'Upgrade to Pro for Manual Runs' : 'Run Cycle Manually →'}
          </button>
        </header>

        <WaitlistModal 
          isOpen={isWaitlistOpen}
          onClose={() => setIsWaitlistOpen(false)}
          source="agents_manual_run"
        />


        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* CYCLE STATUS STRIP */}
          <div className="card-v2" style={{ 
            background: 'var(--dark)', color: 'white', 
            display: 'flex', flexDirection: 'column', gap: 8, padding: '24px 32px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14 }}>Last run: <b>{latestCycle?.completedAt ? new Date(latestCycle.completedAt).toLocaleString() : 'Never'}</b> · {latestCycle?.agentsRun?.length || 0} agents · {(latestCycle?.durationMs || 0)/1000}s</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                 <div style={{ 
                   width: 8, height: 8, borderRadius: '50%', 
                   background: data.state === 'cycle_running' ? 'var(--amber)' : data.state === 'cycle_failed' ? 'var(--coral)' : 'var(--green2)',
                   animation: data.state === 'cycle_running' ? 'pulse 2s infinite' : 'none'
                 }} />
                 <span style={{ fontSize: 13, fontWeight: 500 }}>
                   {data.state === 'cycle_running' ? 'Cycle running...' : 
                    data.state === 'cycle_failed' ? 'Cycle failed' : 
                    data.state === 'no_cycle' ? 'No cycle data' : 'Cycle complete'}
                 </span>
              </div>
            </div>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>Next run: {data.nextCycleAt ? new Date(data.nextCycleAt).toLocaleString() : 'Not scheduled'}</span>
          </div>

          {/* APPROVAL INBOX (P0 for Bounded Execution) */}
          <ApprovalInbox 
            proposals={data.weeklyActions.filter(a => a.status === 'pending').map(a => ({
              id: a.id,
              agentName: a.category === 'reputation' ? 'GBP Specialist' : 'Growth Architect',
              title: a.title,
              description: a.description,
              draftContent: a.draftContent, 
              status: 'pending',
              category: a.category,
              impact: Number(a.estimatedLift) || 0
            }))}
            onApprove={async (id: string) => {
              try {
                const token = await (window as unknown as { Clerk?: { session?: { getToken: () => Promise<string> } } }).Clerk?.session?.getToken()
                const API_URL = import.meta.env.VITE_API_URL || ''
                const res = await fetch(`${API_URL}/api/agents/approve/${id}`, {
                  method: 'POST',
                  headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                })
                const resData = await res.json()
                if (resData.success) {
                  alert("Action approved! The specialist agent is now executing the proposal.")
                  setData(prev => ({
                    ...prev,
                    weeklyActions: prev.weeklyActions.map(a => a.id === id ? { ...a, status: 'approved' } : a)
                  }))
                } else {
                  alert("Failed to approve: " + (resData.error || "Unknown error"))
                }
              } catch (e) {
                console.error("Approval error:", e)
                alert("An error occurred during approval.")
              }
            }}
            onReject={(id: string) => alert(`Ignoring action ${id}...`)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24 }}>
             {/* ACTIONS CARD — Completed / Accepted */}
             <div className="card-v2" style={{ padding: 24 }}>
                <h3 className="text-h2" style={{ marginBottom: 16 }}>Execution Queue ({data.weeklyActions?.filter(a => a.status === 'approved' || a.status === 'completed').length || 0})</h3>
                <span className="text-small text-body" style={{ color: 'var(--ink-muted)' }}>Approved for automation</span>
                <div style={{ marginTop: 16 }}>
                   {data.weeklyActions?.filter(a => a.status === 'approved' || a.status === 'completed').length === 0 ? (
                     <p className="text-body" style={{ fontSize: 13, color: '#9CA3AF', fontStyle: 'italic' }}>No approved actions in the queue.</p>
                   ) : (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                       {data.weeklyActions.filter(a => a.status === 'approved' || a.status === 'completed').map((action, i) => (
                         <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, border: '1px solid #ECEEEF', borderRadius: 8, background: '#FAFAFB' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: action.status === 'completed' ? '#10B981' : '#F59E0B' }} />
                              <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1D21' }}>{action.title}</span>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>{action.status}</span>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
             </div>

             {/* REPORTING SUMMARY */}
             <div className="card-v2" style={{ padding: 24, background: '#FFFFFF' }}>
                <h3 className="text-h2" style={{ marginBottom: 16 }}>Market Intelligence Report</h3>
                <span className="text-small text-body" style={{ color: '#6B7280' }}>Executive summary for the board</span>
                <p className="text-body" style={{ marginTop: 16, fontSize: 14, lineHeight: 1.6, color: '#4B5563' }}>
                  {data.reportingOutput?.executiveSummary || "The specialist team is compiling your latest growth report..."}
                </p>
             </div>
          </div>

          {/* AGENT STATUS GRID */}
          <div className="card-v2" style={{ padding: 24, background: '#FFFFFF', border: '1px solid #ECEEEF' }}>
            <h3 className="text-h2" style={{ marginBottom: 24, color: '#111827' }}>Specialist Execution Grid</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {agentOutputs.map(ag => {
                const category = ag.agentId.toLowerCase().includes('reporting') ? 'data' : 
                                 ag.agentId.toLowerCase().includes('seo') ? 'seo' :
                                 ag.agentId.toLowerCase().includes('gbp') ? 'reputation' :
                                 ag.agentId.toLowerCase().includes('conversion') ? 'conversion' :
                                 ag.agentId.toLowerCase().includes('architect') ? 'ux' : 'content'
                const agent = getAgentInfo(category)
                const Icon = agent.icon
                
                return (
                  <div key={ag.agentId} 
                    onClick={() => setSelectedAgent(ag.agentId)}
                    style={{ 
                      padding: '20px 16px', border: '1px solid #ECEEEF', borderRadius: 16,
                      display: 'flex', flexDirection: 'column', gap: 12,
                      position: 'relative', overflow: 'hidden', background: '#FAFAFB',
                      transition: 'all 0.2s ease', cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 40, height: 40, borderRadius: 10, background: 'white',
                        border: '1px solid #ECEEEF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                      }}>
                        <Icon size={18} color={agent.color} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{agent.name}</span>
                        <span style={{ fontSize: 11, color: '#6B7280' }}>v{data.planTier === 'pro' ? '2.4.0' : '2.1.0'}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ 
                          width: 6, height: 6, borderRadius: '50%', 
                          background: ag.status === 'failed' ? '#EF4444' : ag.status === 'complete' ? '#10B981' : '#D1D5DB'
                        }} />
                        <span style={{ 
                          fontSize: 11, fontWeight: 600, 
                          color: ag.status === 'failed' ? '#EF4444' : ag.status === 'complete' ? '#10B981' : '#6B7280',
                          textTransform: 'uppercase'
                        }}>
                          {ag.status}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>{(ag.durationMs||0)/1000}s</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* AGENT DETAIL MODAL */}
          {selectedAgent && (
            <SpecialistDetailModal 
              agentId={selectedAgent}
              runs={[]} // historical runs placeholder
              onClose={() => setSelectedAgent(null)}
              planTier={data.planTier}
            />
          )}

          {/* INTEGRATIONS */}
          <div className="card-v2" style={{ padding: 24 }}>
            <h3 className="text-h2" style={{ marginBottom: 24 }}>Integrations</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
               <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Connected ({integrations.filter(i => i.status === 'connected').length})</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {integrations.filter(i => i.status === 'connected').map(ig => (
                      <div key={ig.platform} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, border: '1px solid var(--border)', borderRadius: 8 }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                           <div style={{ width: 24, height: 24, borderRadius: 4, background: `var(--${ig.chipColor})` }} />
                           <span style={{ fontSize: 13, fontWeight: 500 }}>{ig.displayName}</span>
                         </div>
                         <span style={{ fontSize: 12, color: 'var(--green2)' }}>Connected</span>
                      </div>
                    ))}
                  </div>
               </div>
               <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Missing ({integrations.filter(i => i.status === 'missing').length})</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {integrations.filter(i => i.status === 'missing').map(ig => (
                      <div key={ig.platform} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--page-bg)' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                           <div style={{ width: 24, height: 24, borderRadius: 4, background: `var(--${ig.chipColor})`, opacity: 0.3 }} />
                           <div style={{ display: 'flex', flexDirection: 'column' }}>
                             <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1D21' }}>{ig.displayName}</span>
                             <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>Unlocks {ig.unlocks}</span>
                           </div>
                         </div>
                         <button className="btn-primary-v2" style={{ padding: '6px 12px', fontSize: 11 }}>Connect →</button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
