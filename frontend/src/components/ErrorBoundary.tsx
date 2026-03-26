'use client'
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  label?: string
}

interface State {
  hasError: boolean
  message: string
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message ?? 'An unexpected error occurred' }
  }

  componentDidCatch(err: Error) {
    console.error(`[ErrorBoundary:${this.props.label ?? 'unknown'}]`, err)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div style={{
          padding: '1.25rem', borderRadius: 'var(--r)',
          background: 'var(--rdim)', border: '1px solid rgba(248,113,113,.2)',
          fontSize: 13, color: 'var(--red)',
        }}>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            {this.props.label ? `${this.props.label} failed to render` : 'Section failed to render'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--ff-mono)' }}>
            {this.state.message}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            style={{ marginTop: 10, background: 'none', border: '1px solid rgba(248,113,113,.3)', color: 'var(--red)', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
