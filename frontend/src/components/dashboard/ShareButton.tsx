// frontend/src/components/dashboard/ShareButton.tsx
// Drop this anywhere in the audit result view.
// Props: snapshotId — the AuditSnapshot.id from the audit result

import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'

interface Props {
  snapshotId: string
}

type State = 'idle' | 'loading' | 'copied' | 'error'

export default function ShareButton({ snapshotId }: Props) {
  const { getToken } = useAuth()
  const [state, setState] = useState<State>('idle')
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  async function handleShare() {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl)
      setState('copied')
      setTimeout(() => setState('idle'), 2000)
      return
    }

    setState('loading')
    try {
      const token = await getToken()
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/report/${snapshotId}/share`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      if (!res.ok) throw new Error('Failed')
      const { share_url } = await res.json()
      setShareUrl(share_url)
      await navigator.clipboard.writeText(share_url)
      setState('copied')
      setTimeout(() => setState('idle'), 2500)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 2000)
    }
  }

  const label =
    state === 'loading' ? 'Generating link...'
    : state === 'copied' ? 'Link copied!'
    : state === 'error' ? 'Something went wrong'
    : shareUrl ? 'Copy share link'
    : 'Share this report'

  return (
    <button
      onClick={handleShare}
      disabled={state === 'loading'}
      style={{
        fontSize: 13,
        padding: '7px 14px',
        opacity: state === 'loading' ? 0.6 : 1,
        cursor: state === 'loading' ? 'not-allowed' : 'pointer',
      }}
    >
      {label}
    </button>
  )
}
