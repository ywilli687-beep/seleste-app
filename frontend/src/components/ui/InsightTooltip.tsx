'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InsightTooltipProps {
  text: string
  title?: string
  position?: 'right' | 'left' | 'top'
}

export default function InsightTooltip({ text, title, position = 'right' }: InsightTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle Escape key to close
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const toggleTooltip = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  // Positioning logic
  const getVariants = () => {
    switch (position) {
      case 'left':
        return { initial: { opacity: 0, x: 5, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 } }
      case 'top':
        return { initial: { opacity: 0, y: 5, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 } }
      default:
        return { initial: { opacity: 0, x: -5, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 } }
    }
  }

  const getStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      zIndex: 9999,
      width: 240,
      background: '#0B0B0B',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 10,
      padding: '12px 14px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
      cursor: 'default',
      pointerEvents: 'auto',
    }

    if (position === 'right') {
      return { ...base, left: 'calc(100% + 12px)', top: '50%', transform: 'translateY(-50%)' }
    }
    if (position === 'left') {
      return { ...base, right: 'calc(100% + 12px)', top: '50%', transform: 'translateY(-50%)' }
    }
    if (position === 'top') {
      return { ...base, bottom: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)' }
    }
    return base
  }

  return (
    <div 
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: 6 }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={toggleTooltip}
        type="button"
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: 'none',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontFamily: 'var(--ff-mono)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          padding: 0,
          outline: 'none',
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      >
        ?
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...getVariants()}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={getStyle()}
          >
            {title && (
              <div style={{ 
                fontFamily: 'var(--ff-mono)', 
                fontSize: 10, 
                color: 'var(--accent)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                marginBottom: 6,
                fontWeight: 600
              }}>
                {title}
              </div>
            )}
            <div style={{ 
              fontSize: 13, 
              color: 'rgba(255,255,255,0.9)', 
              lineHeight: 1.5,
              fontWeight: 400
            }}>
              {text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
