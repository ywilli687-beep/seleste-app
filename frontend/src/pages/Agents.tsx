import { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { AgentsShell, AgentsPageData } from '@/components/agents/AgentsShell'

export default function Agents() {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [data, setData] = useState<AgentsPageData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !user) return

    getToken().then((token: string | null) => {
      const API_URL = import.meta.env.VITE_API_URL || ''
      fetch(`${API_URL}/api/agents/page/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(resData => {
        if (!resData.success) {
          throw new Error(resData.error || 'Failed to load agents page data')
        }
        setData(resData.data)
      })
      .catch(err => setError(err.message))
    })
  }, [isLoaded, user, getToken])

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg)' }}>
        <div style={{ fontFamily: 'var(--ff-display, serif)', fontSize: '1.75rem', color: '#f0ede8' }}>
          Agent Engine Error
        </div>
        <p style={{ color: '#9b9890', maxWidth: 520, lineHeight: 1.6 }}>{error}</p>
        <a href="/" style={{ color: '#c8a96e', fontSize: 14 }}>← Run an audit first</a>
      </div>
    )
  }

  if (!data) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0ede8', backgroundColor: 'var(--bg)' }}>Loading AI Specialists...</div>

  return <AgentsShell data={data} />
}
