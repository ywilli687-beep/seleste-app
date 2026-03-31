import { 
  Check, X
} from 'lucide-react'
import { getAgentInfo } from '../../lib/agents/config'

interface Proposal {
  id: string
  agentName?: string
  title: string
  description: string
  draftContent?: string
  status: 'pending' | 'approved' | 'rejected'
  category: string
  impact: number
}

interface ApprovalInboxProps {
  proposals: Proposal[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function ApprovalInbox({ proposals, onApprove, onReject }: ApprovalInboxProps) {
  const pendingCount = proposals.filter(p => p.status === 'pending').length

  if (pendingCount === 0) {
    return (
      <div style={{ 
        padding: '48px 24px', textAlign: 'center', 
        background: 'white', borderRadius: 16, border: '1px solid #E5E7EB' 
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✅</div>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Inbox Cleared</h3>
        <p style={{ color: '#6B7280', fontSize: 14 }}>Your growth agents have no pending proposals. They are currently monitoring and optimizing.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Approval Inbox</h3>
        <span style={{ 
          background: '#EEF2FF', color: '#4F46E5', 
          padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 600 
        }}>
          {pendingCount} Pending Proposals
        </span>
      </div>

      {proposals.filter(p => p.status === 'pending').map(proposal => {
        const agent = getAgentInfo(proposal.category)
        const Icon = agent.icon
        
        return (
          <div key={proposal.id} style={{ 
            background: 'white', border: '1px solid #E5E7EB', borderRadius: 16, 
            overflow: 'hidden', transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ 
                    width: 32, height: 32, borderRadius: 8, background: agent.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={16} color={agent.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9CA3AF' }}>
                      {agent.name}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{proposal.title}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ 
                    background: '#ECFDF5', color: '#059669', 
                    padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 
                  }}>
                    +{Number(proposal.impact)} pts
                  </span>
                </div>
              </div>

              <p style={{ color: '#4B5563', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                {proposal.description}
              </p>

              {proposal.draftContent && (
                <div style={{ 
                  background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: 12, 
                  padding: 16, marginBottom: 20, position: 'relative'
                }}>
                  <div style={{ position: 'absolute', top: -10, left: 12, background: 'white', padding: '0 8px', fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>
                    PROPOSED ACTIONS
                  </div>
                  <div style={{ fontSize: 13, color: '#374151', whiteSpace: 'pre-wrap', fontFamily: 'var(--ff-serif, serif)', fontStyle: 'italic' }}>
                    "{proposal.draftContent}"
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
                <button 
                  onClick={() => onReject(proposal.id)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', 
                    background: 'white', color: '#6B7280', padding: '8px 16px', borderRadius: 8,
                    fontSize: 13, fontWeight: 500, cursor: 'pointer'
                  }}
                >
                  <X size={14} /> Ignore
                </button>
                <button 
                  onClick={() => onApprove(proposal.id)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 6, border: 'none', 
                    background: '#111827', color: 'white', padding: '8px 24px', borderRadius: 8,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}
                >
                  <Check size={14} /> Approve & Deploy
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
