import React, { useState, useRef } from 'react'

interface Props {
  text: string
  children: React.ReactNode
}

export function Tooltip({ text, children }: Props) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const ref = useRef<HTMLSpanElement>(null)

  const show = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 8, left: rect.left })
    }
    setVisible(true)
  }

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'default' }}
      >
        {children}
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 14, height: 14, borderRadius: '50%',
          background: 'var(--border2)', color: 'var(--ink-muted)',
          fontSize: 9, fontWeight: 700, flexShrink: 0, cursor: 'help'
        }}>?</span>
      </span>

      {visible && (
        <div style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          zIndex: 9999,
          maxWidth: 240,
          background: 'var(--dark)',
          color: 'rgba(255,255,255,0.85)',
          fontSize: 12,
          lineHeight: 1.5,
          padding: '10px 14px',
          borderRadius: 8,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
        }}>
          {text}
        </div>
      )}
    </>
  )
}
