/**
 * Seleste Proprietary Data Engine
 * Entry point — starts the scheduler and keeps the process alive.
 */
import dotenv from 'dotenv'
dotenv.config({ path: '../backend/.env' })

import { startScheduler } from './scheduler'

console.log('[seleste-crawler] Starting up...')
startScheduler()

// Keep process alive
process.on('SIGTERM', () => {
  console.log('[seleste-crawler] SIGTERM received — shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('[seleste-crawler] SIGINT received — shutting down gracefully')
  process.exit(0)
})
