export type DashboardData = {
  myBusinessesCount: number
  businessName: string | null
  vertical: string
  city: string | null
  state: string | null
  slug: string
  overallScore: number
  scoreDelta: number | null
  grade: 'A' | 'B' | 'C' | 'D'
  previousGrade: 'A' | 'B' | 'C' | 'D' | null
  pillars: { id: string; score: number; industryAvg: number }[]
  revenueLeakMonthly: number | null
  
  // Gamification
  xpTotal: number
  levelId: number
  levelName: string
  xpToNextLevel: number
  unlockedFeatures: string[]
  achievements: { id: string; earned: boolean; earnedAt?: string; lockedLabel: string; name: string; chipColor: string }[]
  newlyEarnedAchievementIds: string[]
  
  // Streak
  streakHistory: (0 | 1 | 2)[] // 28 days
  streakDays: number
  streakPtsThisMonth: number // xp earned this month
  totalAudits: number
  daysSinceAudit: number
  scoreHistory: number[] // up to 24 points
  
  // Recommendations
  quickWin: { action: string; difficulty: string; estimatePts: number; implementation: string } | null
  issues: { feature: string; risk: 'critical' | 'warn' | 'ok'; description: string }[]
  roadmap: { phase: number; feature: string; impact: string; difficulty: string }[]
  roadmapDurationWeeks: string // "2-3"
  
  // Market intel
  verticalMedianScore: number
  bookingAdoptionRate: number
  topGap: string // "No schema markup"
  avgMonthlyImprovement: number
  competitorScores: number[] 
  competitorGap: number | null
  recentAudits: { id: string; createdAt: string; overallScore: number; scoreDelta: number | null; grade: string; inputUrl: string; version: string }[]
  chartData: { date: string; score: number }[]

  // Agency / Workspace
  isAgency: boolean
  workspaces: { id: string; name: string; businessCount: number }[]
}
