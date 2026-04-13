// @ts-nocheck
import { db as prisma } from './db'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface XPEvent {
  type: XPEventType
  userId: string
  businessId: string
  auditId?: string
  metadata?: Record<string, unknown>
}

export type XPEventType =
  | 'first_audit'
  | 'subsequent_audit'
  | 'roadmap_action_completed'
  | 'score_improved_10'
  | 'grade_upgraded'
  | 'streak_7_day'
  | 'streak_30_day'
  | 'outcome_report_filed'
  | 'competitor_beaten'

export interface LevelInfo {
  level: number
  name: string
  xpRequired: number
  xpNextLevel: number
}

export interface AchievementCheckResult {
  newlyEarned: string[]          
  allEarned: string[]            
}

// ─────────────────────────────────────────────
// XP AWARDS TABLE
// ─────────────────────────────────────────────

export const XP_AWARDS: Record<XPEventType, number> = {
  first_audit:                 500,
  subsequent_audit:            150,
  roadmap_action_completed:    200,
  score_improved_10:           300,
  grade_upgraded:              500,
  streak_7_day:                250,
  streak_30_day:              1000,
  outcome_report_filed:        400,
  competitor_beaten:           350,
}

// ─────────────────────────────────────────────
// LEVEL TABLE
// ─────────────────────────────────────────────

export const LEVELS: LevelInfo[] = [
  { level: 1,  name: 'Digital Newcomer',   xpRequired: 0,      xpNextLevel: 500   },
  { level: 2,  name: 'Web Starter',        xpRequired: 500,    xpNextLevel: 1500  },
  { level: 3,  name: 'Visibility Builder', xpRequired: 1500,   xpNextLevel: 3000  },
  { level: 4,  name: 'Local Competitor',   xpRequired: 3000,   xpNextLevel: 5500  },
  { level: 5,  name: 'Growth Seeker',      xpRequired: 5500,   xpNextLevel: 9000  },
  { level: 6,  name: 'Digital Strategist', xpRequired: 9000,   xpNextLevel: 14000 },
  { level: 7,  name: 'Market Contender',   xpRequired: 14000,  xpNextLevel: 20000 },
  { level: 8,  name: 'Local Authority',    xpRequired: 20000,  xpNextLevel: 28000 },
  { level: 9,  name: 'Growth Leader',      xpRequired: 28000,  xpNextLevel: 40000 },
  { level: 10, name: 'Seleste Champion',   xpRequired: 40000,  xpNextLevel: 40000 },
]

// ─────────────────────────────────────────────
// ACHIEVEMENT DEFINITIONS
// ─────────────────────────────────────────────

export interface AchievementContext {
  totalAudits: number
  bestScore: number
  overallScore: number
  maxMonthlyImprovement: number  
  completedActions: number       
  streakDays: number
  localRank: number | null
  verticalMedian: number
}

export const ACHIEVEMENTS = [
  {
    id: 'first_launch',
    name: 'First Launch',
    chipColor: 'chip-blue',
    lockedLabel: 'Complete your first audit',
    xpReward: 0,   
    check: (ctx: AchievementContext) => ctx.totalAudits >= 1,
  },
  {
    id: 'on_the_rise',
    name: 'On the Rise',
    chipColor: 'chip-green',
    lockedLabel: 'Improve your score by 10+ points in one month',
    xpReward: 100,
    check: (ctx: AchievementContext) => ctx.maxMonthlyImprovement >= 10,
  },
  {
    id: 'action_taker',
    name: 'Action Taker',
    chipColor: 'chip-teal',
    lockedLabel: 'Complete 3 roadmap actions',
    xpReward: 150,
    check: (ctx: AchievementContext) => ctx.completedActions >= 3,
  },
  {
    id: 'on_fire',
    name: 'On Fire',
    chipColor: 'chip-orange',
    lockedLabel: 'Maintain a 7-day streak',
    xpReward: 200,
    check: (ctx: AchievementContext) => ctx.streakDays >= 7,
  },
  {
    id: 'grade_c',
    name: 'Grade C',
    chipColor: 'chip-purple',
    lockedLabel: 'Reach a score of 40+',
    xpReward: 250,
    check: (ctx: AchievementContext) => ctx.bestScore >= 40,
  },
  {
    id: 'analyst',
    name: 'Analyst',
    chipColor: 'chip-indigo',
    lockedLabel: 'Complete 10+ audits',
    xpReward: 200,
    check: (ctx: AchievementContext) => ctx.totalAudits >= 10,
  },
  {
    id: 'grade_b',
    name: 'Grade B',
    chipColor: 'chip-slate',
    lockedLabel: 'Reach a score of 60+',
    xpReward: 400,
    check: (ctx: AchievementContext) => ctx.bestScore >= 60,
  },
  {
    id: 'local_leader',
    name: 'Local Leader',
    chipColor: 'chip-slate',
    lockedLabel: 'Rank #1 in your city and vertical',
    xpReward: 500,
    check: (ctx: AchievementContext) => ctx.localRank === 1,
  },
  {
    id: 'grade_a',
    name: 'Grade A',
    chipColor: 'chip-slate',
    lockedLabel: 'Reach a score of 80+',
    xpReward: 750,
    check: (ctx: AchievementContext) => ctx.bestScore >= 80,
  },
  {
    id: 'century',
    name: 'Century',
    chipColor: 'chip-slate',
    lockedLabel: 'Complete 100+ audits',
    xpReward: 1000,
    check: (ctx: AchievementContext) => ctx.totalAudits >= 100,
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    chipColor: 'chip-slate',
    lockedLabel: 'Maintain a 30-day streak',
    xpReward: 800,
    check: (ctx: AchievementContext) => ctx.streakDays >= 30,
  },
  {
    id: 'market_beater',
    name: 'Market Beater',
    chipColor: 'chip-slate',
    lockedLabel: 'Score above your vertical median',
    xpReward: 300,
    check: (ctx: AchievementContext) => ctx.overallScore > ctx.verticalMedian,
  },
]

// ─────────────────────────────────────────────
// EXPORTED FUNCTIONS
// ─────────────────────────────────────────────

export async function awardXP(event: XPEvent): Promise<number> {
  const amount = XP_AWARDS[event.type]
  if (!amount) return 0

  const business = await prisma.business.update({
    where: { id: event.businessId },
    data: {
      xpTotal: { increment: amount }
    }
  })

  return business.xpTotal
}

export function getLevelInfo(xpTotal: number): LevelInfo {
  let matchedLevel = LEVELS[0]
  for (const lvl of LEVELS) {
    if (xpTotal >= lvl.xpRequired) {
      matchedLevel = lvl
    } else {
      break
    }
  }
  return matchedLevel
}

export async function checkAndAwardAchievements(
  userId: string,
  businessId: string,
  context: AchievementContext
): Promise<AchievementCheckResult> {
  const earnedRecords = await prisma.businessAchievement.findMany({
    where: { businessId }
  })
  const earnedIds = new Set(earnedRecords.map(r => r.achievementId))

  const newlyEarned: string[] = []
  let newlyEarnedXP = 0

  for (const ach of ACHIEVEMENTS) {
    if (!earnedIds.has(ach.id)) {
      if (ach.check(context)) {
        newlyEarned.push(ach.id)
        earnedIds.add(ach.id)
        newlyEarnedXP += ach.xpReward
      }
    }
  }

  if (newlyEarned.length > 0) {
    await prisma.businessAchievement.createMany({
      data: newlyEarned.map(id => ({ businessId, achievementId: id }))
    })

    const business = await prisma.business.findUnique({ where: { id: businessId }})
    if (business) {
      await prisma.business.update({
        where: { id: businessId },
        data: {
          xpTotal: { increment: newlyEarnedXP }, 
          // Use string formatting since push to array requires explicit syntax handling, 
          // Prisma handles string[] natively in PostgreSQL via `push`
          pendingNotifications: {
            push: newlyEarned
          }
        }
      })
    }
  }

  return {
    newlyEarned,
    allEarned: Array.from(earnedIds)
  }
}

export async function computeStreak(
  businessId: string
): Promise<{ streakDays: number; history: (0 | 1 | 2)[] }> {
  const audits = await prisma.auditSnapshot.findMany({
    where: { businessId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true }
  })

  const activeDates = new Set<string>()
  for (const a of audits) {
    const d = new Date(a.createdAt).toISOString().split('T')[0]
    activeDates.add(d)
  }

  if (activeDates.size === 0) {
    return { streakDays: 0, history: Array(28).fill(0) }
  }

  const today = new Date()
  today.setHours(0,0,0,0)

  let streakDays = 0
  const history: (0 | 1 | 2)[] = []
  
  for (let i = 27; i >= 0; i--) {
    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() - (27 - i))
    const dateStr = targetDate.toISOString().split('T')[0]
    
    if (i === 27) {
      history.unshift(activeDates.has(dateStr) ? 2 : 0)
    } else {
      history.unshift(activeDates.has(dateStr) ? 1 : 0)
    }
  }

  let checkDate = new Date(today)
  while (true) {
    const ds = checkDate.toISOString().split('T')[0]
    if (activeDates.has(ds)) {
      streakDays++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      if (checkDate.getTime() === today.getTime()) {
        checkDate.setDate(checkDate.getDate() - 1)
        continue 
      }
      break
    }
  }

  return { streakDays, history }
}

export type DashboardState = 'full' | 'first_audit' | 'stale' | 'error'

export function computeDashboardState(data: {
  totalAudits: number
  daysSinceAudit: number
  hasError: boolean
}): DashboardState {
  if (data.hasError) return 'error'
  if (data.totalAudits === 1) return 'first_audit'
  if (data.daysSinceAudit > 30) return 'stale'
  return 'full'
}
