import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const dbUrl = process.env.DATABASE_URL

if (!dbUrl) {
  console.error('[DB] CRITICAL: DATABASE_URL is missing from environment!')
}

// In Prisma 7, using the explicit adapter is standard and more robust
const pool = new Pool({ connectionString: dbUrl })
const adapter = new PrismaPg(pool as any)

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
