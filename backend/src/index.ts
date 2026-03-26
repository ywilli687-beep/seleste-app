import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import rateLimit from 'express-rate-limit'

dotenv.config()

import auditRoutes from './routes/audit'
import dashboardRoutes from './routes/dashboard'
import historyRoutes from './routes/history'
import reportRoutes from './routes/report'
import explainRoutes from './routes/explain'
import agentsRoutes from './routes/agents'

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))
app.use(express.json())

// Rate limiting — 5 audits per hour per IP
const auditLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many audits. You can run up to 5 per hour. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please slow down.' },
})
app.use(globalLimiter)

app.use('/api/audit', auditLimiter, auditRoutes)
app.use('/api/explain', explainRoutes)
app.use('/api/dashboard', ClerkExpressRequireAuth() as any, dashboardRoutes)
app.use('/api/history', ClerkExpressRequireAuth() as any, historyRoutes)
app.use('/api/report', ClerkExpressRequireAuth() as any, reportRoutes)
app.use('/api/agents', ClerkExpressRequireAuth() as any, agentsRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
