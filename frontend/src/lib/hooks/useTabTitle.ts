import { useEffect } from 'react'

export function useTabTitle(pendingCount: number) {
  useEffect(() => {
    const base     = 'Seleste — Command Center'
    document.title = pendingCount > 0 ? `(${pendingCount}) ${base}` : base
    return () => { document.title = base }
  }, [pendingCount])
}
