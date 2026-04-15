import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiPost } from '../../lib/api'

export function OnboardingCard() {
  const [url,   setUrl]   = useState('')
  const [name,  setName]  = useState('')
  const [error, setError] = useState('')
  const { getToken } = useAuth()
  const queryClient  = useQueryClient()

  const runAudit = useMutation({
    mutationFn: async () => {
      if (!url.trim())             throw new Error('Enter a website URL')
      if (!url.startsWith('http')) throw new Error('URL must start with https://')
      const token = await getToken()
      return apiPost('/api/audit', token!, {
        url:          url.trim(),
        businessName: name.trim() || new URL(url.trim()).hostname,
        industry:     'OTHER',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setUrl(''); setName(''); setError('')
    },
    onError: (err: any) => setError(err.message),
  })

  return (
    <div className="onboarding-card">
      <div className="onboarding-card__icon">⚡</div>
      <h2 className="onboarding-card__title">Run your first audit</h2>
      <p className="onboarding-card__desc">
        Seleste scores your website across 10 pillars, identifies revenue opportunities,
        and queues AI-powered fixes automatically.
      </p>
      <div className="onboarding-card__form">
        <input
          className="onboarding-input"
          type="text"
          placeholder="Business name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="onboarding-input"
          type="url"
          placeholder="https://yourbusiness.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runAudit.mutate()}
        />
        {error && <div className="onboarding-card__error">{error}</div>}
        <button
          className="btn btn--command"
          onClick={() => runAudit.mutate()}
          disabled={runAudit.isPending || !url.trim()}
          style={{ width: '100%', padding: '12px' }}
        >
          {runAudit.isPending ? 'Auditing — ~30 seconds...' : 'Audit my website →'}
        </button>
      </div>
      <div className="onboarding-card__trust">Free · No card required · Results in ~30 seconds</div>
    </div>
  )
}
