import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ExplainerPopoverProps {
  label: string
  text: string
  rect: DOMRect | null
  onClose: () => void
}

export default function ExplainerPopover({ label, text, rect, onClose }: ExplainerPopoverProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !rect) return null

  // Calculate position: default anchor underneath, but if too close to screen bottom, flip above
  const isTooLow = rect.bottom + 150 > window.innerHeight
  const top = isTooLow ? 'auto' : rect.bottom + 8
  const bottom = isTooLow ? window.innerHeight - rect.top + 8 : 'auto'
  
  // Calculate horizontal position: perfectly center aligned with the icon, avoiding screen edges
  const rawLeft = rect.left + (rect.width / 2) - 150
  const left = Math.max(16, Math.min(rawLeft, window.innerWidth - 300 - 16))

  return createPortal(
    <div
      className="explainer-popover"
      style={{
        position: 'fixed',
        top, bottom, left,
        width: 300,
        background: '#1a1a14',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 8,
        padding: '14px 16px',
        zIndex: 99999,
        boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{
        fontFamily: 'var(--ff-mono)', fontSize: 10, color: 'var(--text3)',
        textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 6
      }}>
        <div style={{ width: 3, height: 10, background: '#2D7A50', borderRadius: 2 }} />
        AI Insight: {label}
      </div>
      <div style={{
        fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6,
        paddingLeft: 9,
      }}>
        {text}
      </div>
    </div>,
    document.body
  )
}
