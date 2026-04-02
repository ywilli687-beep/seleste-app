import React, { useEffect, useState } from 'react'
import { getGrade, getGradeColor } from '@/lib/constants'

export function ScoreRing({ score, size = 120 }: { score: number, size?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  
  useEffect(() => {
    const duration = 1200
    let startTime: number | null = null
    
    function step(ts: number) {
      if (!startTime) startTime = ts
      const p = Math.min((ts - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3) 
      setAnimatedScore(Math.round(ease * score))
      
      if (p < 1) requestAnimationFrame(step)
    }
    
    const timer = setTimeout(() => requestAnimationFrame(step), 300)
    return () => clearTimeout(timer)
  }, [score])

  const circumference = 314.16 // 2 * Math.PI * 50
  const dashoffset = circumference * (1 - animatedScore / 100)
  
  const color = getGradeColor(getGrade(score))

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        <circle 
          cx="60" cy="60" r="50" 
          fill="none" stroke="var(--border)" strokeWidth="8"
        />
        <circle 
          cx="60" cy="60" r="50" 
          fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.4s ease-in-out', transitionDelay: '300ms' }}
        />
      </svg>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span className="text-h1" style={{ fontSize: size * 0.3, lineHeight: 1, marginBottom: 2 }}>{animatedScore}</span>
        <span className="text-small" style={{ color: 'var(--ink-muted)', fontSize: 10 }}>SCORE</span>
      </div>
    </div>
  )
}
