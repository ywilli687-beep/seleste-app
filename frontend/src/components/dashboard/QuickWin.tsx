import React from 'react'
import { triggerNotification } from '@/lib/notifications'

interface Props {
  action: string
  difficulty: string
  estimatePts: number
  implementation: string
}

export function QuickWin({ action, difficulty, estimatePts, implementation }: Props) {
  return (
    <div className="card-v2" style={{ 
      background: 'var(--dark)', color: 'white', padding: '24px', 
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ 
          width: 48, height: 48, background: 'rgba(255,255,255,0.1)', 
          borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24
        }}>
          ⚡️
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="text-small" style={{ color: 'var(--green2)' }}>HIGHEST ROI ACTION</span>
            <span className="chip" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>+{estimatePts} PTS</span>
            <span className="chip" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>{difficulty}</span>
          </div>
          <span className="text-h2" style={{ fontSize: 18, margin: '4px 0' }}>{action}</span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{implementation}</span>
        </div>
      </div>
      <button 
        className="btn-primary-v2" 
        style={{ background: 'white', color: 'var(--dark)', padding: '12px 24px', fontSize: 14 }}
        onClick={() => triggerNotification({ type: 'quickWinClicked', title: 'Task Started', body: 'Documentation opened.', duration: 3000 })}
      >
        Start implementation
      </button>
    </div>
  )
}
