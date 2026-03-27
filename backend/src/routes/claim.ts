import { Router, Request, Response } from 'express'
import { db } from '@/lib/db'

const router = Router()

/**
 * POST /api/audit/claim
 * Links an anonymous audit to an authenticated user.
 */
router.post('/', async (req: Request, res: Response) => {
  const { auditId, userId } = req.body

  if (!auditId || !userId) {
    return res.status(400).json({ success: false, error: 'Missing auditId or userId' })
  }

  try {
    // 1. Find the audit
    const audit = await db.auditSnapshot.findUnique({
      where: { id: auditId },
      include: { business: true }
    })

    if (!audit) {
      return res.status(404).json({ success: false, error: 'Audit not found' })
    }

    // 2. Only claim if it's currently anonymous or belongs to 'anon'
    // If it already belongs to a different user, don't allow stealing
    if (audit.triggeredByUser && audit.triggeredByUser !== 'anon') {
      return res.status(200).json({ success: true, message: 'Audit already claimed' })
    }

    // 3. Update the audit
    await db.auditSnapshot.update({
      where: { id: auditId },
      data: { triggeredByUser: userId }
    })

    // 4. Update the business if it was also anonymous
    if (!audit.business.createdByUser) {
      await db.business.update({
        where: { id: audit.businessId },
        data: { createdByUser: userId }
      })
    }

    res.json({ success: true, message: 'Audit successfully claimed' })
  } catch (err: any) {
    console.error('[Claim Error]', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
