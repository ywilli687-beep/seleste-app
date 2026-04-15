import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { requireAuth } from '@/lib/auth'
import rateLimit from 'express-rate-limit'
import { LayerViolationError } from '@/lib/guards'

dotenv.config()

import auditRoutes from './routes/audit'
import dashboardRoutes from './routes/dashboard'
import historyRoutes from './routes/history'
import reportRoutes from './routes/report'
import explainRoutes from './routes/explain'
import agentsRoutes from './routes/agents'
import cronRoutes from './routes/cron'
import claimRoutes from './routes/claim'
import callbackRoutes from './routes/callback'
import tasksRoutes from './routes/tasks'
import businessRouter from './routes/business'
import executeRouter from './routes/execute'
import publicReportRoutes from './routes/public-report'
import badgeRoutes from './routes/badge'
import statsRoutes from './routes/stats'
import stripeRoutes from './routes/stripe'
import outboundRoutes from './routes/outbound'
import waitlistRoutes from './routes/waitlist'
import outreachRoutes from './routes/outreach'
import verticalPagesRoutes from './routes/vertical-pages'
import learningRouter from './routes/learning'
import chatRouter from './routes/chat'
import teamRouter from './routes/team'

const app = express()

app.use(cors({
  origin: (origin: string | undefined, callback: any) => {
    // If no origin, allow (like server-to-server or non-browser)
    if (!origin) return callback(null, true)
    
    const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1')
    const isVercel = origin.endsWith('.vercel.app')
    const isSeleste = origin.endsWith('.seleste.io') || origin.endsWith('.seleste.com')
    
    // Always allow local and our own domains
    if (isLocal || isVercel || isSeleste) {
      return callback(null, origin)
    }
    
    // If FRONTEND_URL is explicitly set, honor it
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, origin)
    }

    // In dev, reflect everything. In prod, be careful.
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, origin)
    }
    
    // Default to allow the origin for now as we transition to proper domain routing
    return callback(null, origin)
  },
  credentials: true
}))
app.use(express.json({
  verify: (req: any, res, buf) => {
    if (req.originalUrl.startsWith('/api/stripe/webhook')) {
      req.rawBody = buf
    }
  }
}))

// Rate limiting — 5 audits per hour per IP
const auditLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many audits. You can run up to 5 per hour. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for']
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : Array.isArray(forwarded) ? forwarded[0] : null)?.trim()
    return ip || req.socket.remoteAddress || 'unknown'
  },
})

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please slow down.' },
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for']
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : Array.isArray(forwarded) ? forwarded[0] : null)?.trim()
    return ip || req.socket.remoteAddress || 'unknown'
  },
})
app.use(globalLimiter)

app.use('/api/audit', auditLimiter, auditRoutes)
app.use('/api/explain', explainRoutes)
app.use('/api/public-report', publicReportRoutes)
app.use('/api/badge', badgeRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/dashboard', requireAuth, dashboardRoutes)
app.use('/api/history', requireAuth, historyRoutes)
app.use('/api/report', requireAuth, reportRoutes)
app.use('/api/agents', requireAuth, agentsRoutes)
app.use('/api/claim', requireAuth, claimRoutes)

// Auto-outbound & Stripe
app.use('/api/stripe', stripeRoutes)
app.use('/api/outbound', outboundRoutes)
app.use('/api/cron', cronRoutes)
app.use('/api/callback', callbackRoutes) // Public callback for agents
app.use('/api/tasks', requireAuth, tasksRoutes)
app.use('/api/business', businessRouter)
app.use('/api/execute', executeRouter)
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', port: PORT, env: process.env.NODE_ENV })
})
app.use('/api/waitlist', waitlistRoutes)
app.use('/api/outreach', outreachRoutes)
app.use('/api/vertical-pages', verticalPagesRoutes)
app.use('/api/learning', learningRouter)
app.use('/api/chat', chatRouter)
app.use('/api', teamRouter)       // handles /api/user/businesses, /api/business (POST), /api/business/:id/team/*, /api/invites/*

// LayerViolationError handler — registered before the generic handler.
// Catches guard violations from any layer and returns a structured 400.
app.use((err: any, _req: any, res: any, next: any) => {
  if (err instanceof LayerViolationError) {
    return res.status(400).json({
      error:     'LAYER_VIOLATION',
      layer:     err.layer,
      violation: err.violation,
    })
  }
  next(err)
})

// Global error handler — must be last. Converts all unhandled errors to JSON.
app.use((err: any, req: any, res: any, _next: any) => {
  console.error('[Global Error]', err?.message || err)
  const status = err?.status || err?.statusCode || 500
  res.status(status).json({ success: false, error: err?.message || 'Internal Server Error' })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
