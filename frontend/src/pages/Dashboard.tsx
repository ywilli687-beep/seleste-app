import { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded || !user) return

    getToken().then((token: string | null) => {
      const API_URL = import.meta.env.VITE_API_URL || ''
      fetch(`${API_URL}/api/dashboard/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(resData => {
        if (!resData.success) {
          throw new Error(resData.error || 'Failed to load dashboard data')
        }
        setData(resData.data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
    })
  }, [isLoaded, user, getToken])

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0ede8', backgroundColor: 'var(--bg)' }}>Loading...</div>
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg)' }}>
        <div style={{ fontFamily: 'var(--ff-display, serif)', fontSize: '1.75rem', color: '#f0ede8' }}>
          Dashboard error
        </div>
        <p style={{ color: '#9b9890', maxWidth: 520, lineHeight: 1.6 }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ color: '#c8a96e', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>Try refreshing</button>
      </div>
    )
  }

  if (data?.totalAudits === 0) {
    return (
      <DashboardShell data={data}>
        <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg2)', borderRadius: 'var(--r)', border: '1px solid var(--border)', marginTop: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🚀</div>
          <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2rem', marginBottom: '1rem' }}>Welcome to your Command Center</h2>
          <p style={{ color: 'var(--text2)', maxWidth: 500, margin: '0 auto 2rem', lineHeight: 1.6 }}>
            You haven't linked any audits to your account yet. Run your first deep-scan to unlock growth intelligence, competitor benchmarks, and your 90-day roadmap.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ background: 'var(--accent)', color: '#0a0a0f', padding: '12px 32px', borderRadius: 'var(--rs)', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
          >
            Run First Audit →
          </button>
        </div>
      </DashboardShell>
    )
  }

  return <DashboardShell data={data} />
}
