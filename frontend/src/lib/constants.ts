// Client-safe constants — no Prisma or server imports.
// ResultsView and other client components import from here, not from @/lib/engine.

export const PILLARS = [
  { id: 'conversion',      name: 'Conversion System',        weight: 0.25, icon: '🎯' },
  { id: 'trust',           name: 'Trust & Credibility',      weight: 0.15, icon: '🛡️' },
  { id: 'performance',     name: 'Performance',              weight: 0.15, icon: '⚡' },
  { id: 'ux',              name: 'UX & Experience',          weight: 0.10, icon: '✨' },
  { id: 'discoverability', name: 'Discoverability',          weight: 0.10, icon: '🔍' },
  { id: 'content',         name: 'Content & Messaging',      weight: 0.08, icon: '📝' },
  { id: 'data',            name: 'Data & Tracking',          weight: 0.07, icon: '📊' },
  { id: 'technical',       name: 'Technical Infrastructure', weight: 0.05, icon: '⚙️' },
  { id: 'brand',           name: 'Brand & Differentiation',  weight: 0.03, icon: '💎' },
  { id: 'scalability',     name: 'Scalability',              weight: 0.02, icon: '📈' },
] as const

export type PillarId = typeof PILLARS[number]['id']

export type Grade = 'A' | 'B' | 'C' | 'D'

export const getGrade = (score: number): Grade => {
  if (score >= 75) return 'A'
  if (score >= 60) return 'B'
  if (score >= 45) return 'C'
  return 'D'
}

export const getGradeLabel = (grade: Grade): string => {
  switch (grade) {
    case 'A': return 'Strong Performer'
    case 'B': return 'Above Average'
    case 'C': return 'Needs Improvement'
    case 'D': return 'At Risk'
    default: return 'At Risk'
  }
}

export const getGradeColor = (grade: Grade): string => {
  switch (grade) {
    case 'A': return 'var(--green)'
    case 'B': return 'var(--accent)'
    case 'C': return 'var(--amber)'
    case 'D': return 'var(--red)'
    default: return 'var(--red)'
  }
}
