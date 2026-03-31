import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PublicReportShell, { PublicReportProps } from '@/components/report/PublicReportShell'

export default function PublicReport() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  
  const [report, setReport] = useState<PublicReportProps['report'] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    const API_URL = import.meta.env.VITE_API_URL || ''
    fetch(`${API_URL}/api/public-report/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success || !data.report) {
          throw new Error(data.error || 'Report not found or set to private.')
        }
        setReport(data.report)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)', color: 'var(--text2)' }}>
        Loading report...
      </div>
    )
  }

  if (error || !report) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg)' }}>
        <h2 style={{ fontFamily: 'var(--ff-display)', fontSize: '2rem' }}>Report Not Found</h2>
        <p style={{ color: 'var(--text3)', maxWidth: 480, lineHeight: 1.6 }}>{error || "This report might be private or the link has changed."}</p>
        <button onClick={() => navigate('/')} className="primary-button">← Back to Seleste</button>
      </div>
    )
  }

  return <PublicReportShell report={report} />
}
