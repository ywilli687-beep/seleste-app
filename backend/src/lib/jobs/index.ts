import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Runs asynchronously after an audit completes.
 * 1. Computes AuditQuality
 * 2. Maps nearest BusinessCompetitors
 */
export async function runPostAuditJobs(auditId: string) {
  try {
    const snapshot = await prisma.auditSnapshot.findUnique({
      where: { id: auditId },
      include: { business: true }
    })
    
    if (!snapshot) return

    // Job 1: Quality Scoring
    await computeQuality(snapshot)

    // Job 2: Competitor Graph
    await mapCompetitors(snapshot)
    
  } catch (err) {
    console.error('[Background Jobs Error]', err)
  }
}

async function computeQuality(snapshot: any) {
  const wordCount = snapshot.wordCount || 0
  
  // Weights matching V2 spec
  const qUrlValid = 1.0 // Assume valid for now
  const qPageResolved = wordCount > 50 ? 1.0 : wordCount > 20 ? 0.5 : 0.0
  const qContentSufficient = Math.min(wordCount / 300, 1.0)
  const qVerticalConfident = snapshot.inputVertical !== 'unknown' ? 1.0 : 0.0
  const qLocationResolved = snapshot.inputLocation ? 1.0 : 0.0
  const qSignalConsistent = 1.0
  const qNotDuplicate = 1.0

  const overallQuality = 
    (qUrlValid * 0.25) + 
    (qPageResolved * 0.20) + 
    (qContentSufficient * 0.15) + 
    (qVerticalConfident * 0.15) + 
    (qLocationResolved * 0.10) + 
    (qSignalConsistent * 0.10) + 
    (qNotDuplicate * 0.05)

  const qualityBand = overallQuality >= 0.8 ? 'high' 
                    : overallQuality >= 0.6 ? 'medium' 
                    : overallQuality >= 0.4 ? 'low' : 'excluded'
  
  await prisma.auditQuality.upsert({
    where: { auditId: snapshot.id },
    create: {
      auditId: snapshot.id,
      qUrlValid, qPageResolved, qContentSufficient, qVerticalConfident,
      qLocationResolved, qSignalConsistent, qNotDuplicate,
      overallQuality, qualityBand,
      excludeFromBenchmarks: overallQuality < 0.4
    },
    update: {
      overallQuality, qualityBand, excludeFromBenchmarks: overallQuality < 0.4
    }
  })
}

async function mapCompetitors(snapshot: any) {
  // Find up to 10 other businesses in the same vertical and city
  if (!snapshot.business.city) return

  const competitors = await prisma.business.findMany({
    where: {
      id: { not: snapshot.businessId },
      vertical: snapshot.inputVertical,
      city: snapshot.business.city
    },
    take: 10
  })

  for (const comp of competitors) {
    const focalScore = snapshot.overallScore
    const compScore = comp.latestOverallScore || 0
    const delta = focalScore - compScore
    
    const deltaDirection = delta > 0 ? 'ahead' : delta < 0 ? 'behind' : 'parity'
    const deltaClass = Math.abs(delta) > 20 ? 'dominant' : 'competitive'

    await prisma.businessCompetitor.upsert({
      where: {
        focalBusinessId_competitorBusinessId: {
          focalBusinessId: snapshot.businessId,
          competitorBusinessId: comp.id
        }
      },
      create: {
        focalBusinessId: snapshot.businessId,
        competitorBusinessId: comp.id,
        sameVertical: true,
        sameCity: true,
        focalScore,
        competitorScore: compScore,
        scoreDelta: delta,
        deltaDirection,
        deltaClass,
        biggestGapPillar: 'Conversion',
        biggestGapDelta: Math.abs(delta),
        focalAuditId: snapshot.id,
        competitorAuditId: 'unknown'
      },
      update: {
        focalScore,
        competitorScore: compScore,
        scoreDelta: delta,
        deltaDirection,
        deltaClass,
        focalAuditId: snapshot.id
      }
    })
  }
}
