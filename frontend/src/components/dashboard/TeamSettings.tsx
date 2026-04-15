import { useState } from 'react'
import { useTeam, useInviteMember, useRemoveMember } from '@/lib/hooks/useDashboard'

const ROLE_COLORS: Record<string, string> = {
  OWNER:  'var(--accent)',
  ADMIN:  'var(--purple)',
  MEMBER: 'var(--green)',
  VIEWER: 'var(--ink-muted)',
}

interface Props { businessId: string }

export function TeamSettings({ businessId }: Props) {
  const { data, isLoading } = useTeam(businessId)
  const inviteMember = useInviteMember(businessId)
  const removeMember = useRemoveMember(businessId)

  const [email,    setEmail]    = useState('')
  const [role,     setRole]     = useState('MEMBER')
  const [invErr,   setInvErr]   = useState('')
  const [invOk,    setInvOk]    = useState(false)

  async function sendInvite() {
    setInvErr(''); setInvOk(false)
    if (!email.trim() || !email.includes('@')) return setInvErr('Enter a valid email.')
    try {
      await inviteMember.mutateAsync({ email: email.trim(), role })
      setEmail(''); setInvOk(true)
    } catch (e: any) {
      setInvErr(e?.message || 'Failed to send invite.')
    }
  }

  if (isLoading) return <div className="os-right__muted">Loading team…</div>

  const { members = [], pendingInvites = [], yourRole = 'VIEWER' } = (data as any) ?? {}
  const canManage = yourRole === 'OWNER' || yourRole === 'ADMIN'

  return (
    <div className="team-settings">
      {/* Member list */}
      <div className="team-section">
        <div className="team-section__label">Team members</div>
        {members.map((m: any) => (
          <div key={m.memberId} className="team-member">
            <div className="team-member__avatar">{m.email[0].toUpperCase()}</div>
            <div className="team-member__info">
              <span className="team-member__email">{m.isYou ? `${m.email} (you)` : m.email}</span>
              <span className="team-member__role" style={{ color: ROLE_COLORS[m.role] }}>{m.role}</span>
            </div>
            {canManage && !m.isYou && m.role !== 'OWNER' && (
              <button
                className="team-member__remove"
                onClick={() => removeMember.mutate(m.memberId)}
                title="Remove"
              >×</button>
            )}
          </div>
        ))}
      </div>

      {/* Pending invites */}
      {pendingInvites.length > 0 && (
        <div className="team-section">
          <div className="team-section__label">Pending invites</div>
          {pendingInvites.map((inv: any) => (
            <div key={inv.inviteId} className="team-member team-member--pending">
              <div className="team-member__avatar" style={{ opacity: 0.4 }}>?</div>
              <div className="team-member__info">
                <span className="team-member__email">{inv.email}</span>
                <span className="team-member__role" style={{ color: 'var(--ink-muted)' }}>
                  Invited · {inv.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite form */}
      {canManage && (
        <div className="team-section">
          <div className="team-section__label">Invite someone</div>
          <div className="team-invite">
            <input
              className="modal-input"
              style={{ fontSize: 12 }}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendInvite()}
            />
            <select
              className="modal-input"
              style={{ fontSize: 12, width: 'auto', flexShrink: 0 }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
              <option value="VIEWER">Viewer</option>
            </select>
            <button
              className="os-btn os-btn--primary os-btn--sm"
              onClick={sendInvite}
              disabled={inviteMember.isPending}
            >
              {inviteMember.isPending ? '…' : 'Invite'}
            </button>
          </div>
          {invErr && <div className="modal-error" style={{ marginTop: 6 }}>{invErr}</div>}
          {invOk  && <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 6 }}>Invite sent.</div>}
        </div>
      )}

      {/* Role legend */}
      <div className="team-section team-section--legend">
        {[['OWNER','Full control'],['ADMIN','Manage team, run audits'],['MEMBER','Run audits, view reports'],['VIEWER','Read-only']].map(([r, desc]) => (
          <div key={r} className="team-legend-row">
            <span style={{ color: ROLE_COLORS[r], fontWeight: 600, fontSize: 11, minWidth: 52 }}>{r}</span>
            <span style={{ color: 'var(--ink-muted)', fontSize: 11 }}>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
