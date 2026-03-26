import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import type { AuditResult } from '@/types/audit'
import ResultsView from '@/components/ResultsView'

export default function Report() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded || !user || !id) return

    getToken().then((token) => {
      const API_URL = import.meta.env.VITE_API_URL || ''
      fetch(`${API_URL}/api/report/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.success || !data.result) {
          throw new Error(data.error || 'Failed to load report')
        }
        setResult(data.result)
      })
      .catch(err => setError(err.message))
    })
  }, [isLoaded, user, getToken, id])

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg)' }}>
        <div style={{ fontFamily: 'var(--ff-display, serif)', fontSize: '1.75rem', color: '#f0ede8' }}>Report error</div>
        <p style={{ color: '#9b9890', maxWidth: 520, lineHeight: 1.6 }}>{error}</p>
        <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', color: '#c8a96e', fontSize: 14, cursor: 'pointer' }}>← Back to History</button>
      </div>
    )
  }

  if (!result) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0ede8', backgroundColor: 'var(--bg)' }}>Loading report...</div>

  return <ResultsView result={result} onNewAudit={() => navigate('/')} />
}
