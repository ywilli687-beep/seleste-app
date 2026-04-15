// @ts-nocheck
import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { db } from '../lib/db'
import { requireAuth } from '../lib/auth'
import { MembershipRole, MembershipStatus } from '@prisma/client'

const router = Router()

// ── Permission helper ────────────────────────────────────────────────────────

async function getMembership(userId: string, businessId: string) {
  // An owner-by-userId counts as OWNER even without a membership row
  const business = await db.business.findUnique({
    where: { id: businessId },
    select: { userId: true },
  })
  if (!business) return null

  // Check explicit membership first
  const membership = await db.membership.findUnique({
    where: { userId_businessId: { userId, businessId } },
  })
  if (membership) return membership

  // Fall back: original owner with no membership row yet
  if (business.userId === userId) {
    return { userId, businessId, role: 'OWNER' as MembershipRole, status: 'ACTIVE' as MembershipStatus }
  }

  return null
}

function canManageTeam(role: MembershipRole) {
  return role === 'OWNER' || role === 'ADMIN'
}

// ── GET /api/user/businesses ─────────────────────────────────────────────────
// Returns all businesses the authenticated user owns or is a member of.
router.get('/user/businesses', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as any).auth.userId
  try {
    // Upsert user row (Clerk users may not have a DB row yet)
    await db.user.upsert({
      where:  { id: userId },
      update: {},
      create: { id: userId, email: `${userId}@pending.seleste.io` },
    })

    // Businesses via explicit membership
    const memberships = await db.membership.findMany({
      where:  { userId, status: 'ACTIVE' },
      include: {
        business: {
          include: {
            auditSnapshots: {
              orderBy: { createdAt: 'desc' },
              take:    1,
              select:  { overallScore: true, scoreDelta: true, createdAt: true },
            },
            _count: { select: { weeklyActions: true } },
          },
        },
      },
    })

    // Businesses owned directly (userId field) that have no membership row yet
    const ownedWithoutMembership = await db.business.findMany({
      where: {
        userId,
        memberships: { none: { userId } },
      },
      include: {
        auditSnapshots: {
          orderBy: { createdAt: 'desc' },
          take:    1,
          select:  { overallScore: true, scoreDelta: true, createdAt: true },
        },
        _count: { select: { weeklyActions: true } },
      },
    })

    const format = (b: any, role: string) => {
      const latest = b.auditSnapshots?.[0]
      return {
        businessId:     b.id,
        name:           b.name,
        website:        b.website,
        industry:       b.industry,
        state:          b.state,
        overallScore:   latest?.overallScore ?? null,
        scoreDelta:     (latest?.scoreDelta as any)?.overall ?? null,
        lastAuditAt:    latest?.createdAt?.toISOString() ?? null,
        pendingActions: b._count?.weeklyActions ?? 0,
        role,
      }
    }

    const businesses = [
      ...memberships.map((m) => format(m.business, m.role)),
      ...ownedWithoutMembership.map((b) => format(b, 'OWNER')),
    ]

    // De-duplicate by businessId (shouldn't happen but be safe)
    const seen = new Set<string>()
    const unique = businesses.filter((b) => {
      if (seen.has(b.businessId)) return false
      seen.add(b.businessId)
      return true
    })

    return res.json({ success: true, businesses: unique })
  } catch (err: any) {
    console.error('[GET /user/businesses]', err?.message)
    return res.status(500).json({ success: false, error: err.message })
  }
})

// ── POST /api/business ───────────────────────────────────────────────────────
// Creates a new business and registers the creator as OWNER.
const CreateBusinessSchema = z.object({
  name:     z.string().min(1).max(100),
  website:  z.string().url(),
  industry: z.enum([
    'AUTO_REPAIR','DENTAL','RESTAURANT','PLUMBING','HVAC','LAW_FIRM',
    'REAL_ESTATE','MEDICAL','VETERINARY','SALON_SPA','GYM_FITNESS',
    'ACCOUNTING','INSURANCE','ROOFING','LANDSCAPING','OTHER',
  ]),
  city:     z.string().optional(),
  region:   z.string().optional(),
})

router.post('/business', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as any).auth.userId
  const parse  = CreateBusinessSchema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ error: 'VALIDATION_FAILED', details: parse.error.errors })
  }
  const { name, website, industry, city, region } = parse.data

  try {
    await db.user.upsert({
      where:  { id: userId },
      update: {},
      create: { id: userId, email: `${userId}@pending.seleste.io` },
    })

    const business = await db.business.create({
      data: { name, website, industry: industry as any, userId, city, region },
    })

    // Create explicit OWNER membership
    await db.membership.create({
      data: { userId, businessId: business.id, role: 'OWNER', status: 'ACTIVE' },
    })

    return res.status(201).json({ success: true, business: { id: business.id, name: business.name } })
  } catch (err: any) {
    console.error('[POST /business]', err?.message)
    return res.status(500).json({ error: err.message })
  }
})

// ── GET /api/business/:businessId/team ───────────────────────────────────────
router.get('/business/:businessId/team', requireAuth, async (req: Request, res: Response) => {
  const userId     = (req as any).auth.userId
  const { businessId } = req.params
  const membership = await getMembership(userId, businessId)
  if (!membership || membership.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'FORBIDDEN' })
  }

  const [members, pendingInvites] = await Promise.all([
    db.membership.findMany({
      where:   { businessId, status: 'ACTIVE' },
      include: { user: { select: { id: true, email: true } } },
      orderBy: { createdAt: 'asc' },
    }),
    db.businessInvite.findMany({
      where:   { businessId, acceptedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return res.json({
    members: members.map((m) => ({
      memberId:  m.id,
      userId:    m.userId,
      email:     m.user.email,
      role:      m.role,
      joinedAt:  m.createdAt.toISOString(),
      isYou:     m.userId === userId,
    })),
    pendingInvites: pendingInvites.map((i) => ({
      inviteId:  i.id,
      email:     i.email,
      role:      i.role,
      expiresAt: i.expiresAt.toISOString(),
    })),
    yourRole: membership.role,
  })
})

// ── POST /api/business/:businessId/team/invite ───────────────────────────────
const InviteSchema = z.object({
  email: z.string().email(),
  role:  z.enum(['ADMIN', 'MEMBER', 'VIEWER']).default('MEMBER'),
})

router.post('/business/:businessId/team/invite', requireAuth, async (req: Request, res: Response) => {
  const userId     = (req as any).auth.userId
  const { businessId } = req.params
  const parse      = InviteSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: 'VALIDATION_FAILED' })

  const membership = await getMembership(userId, businessId)
  if (!membership || !canManageTeam(membership.role as MembershipRole)) {
    return res.status(403).json({ error: 'FORBIDDEN — only OWNER or ADMIN can invite' })
  }

  const { email, role } = parse.data

  // Don't double-invite
  const existing = await db.businessInvite.findFirst({
    where: { businessId, email, acceptedAt: null, expiresAt: { gt: new Date() } },
  })
  if (existing) return res.status(409).json({ error: 'ALREADY_INVITED' })

  const invite = await db.businessInvite.create({
    data: {
      businessId,
      email,
      role:       role as MembershipRole,
      invitedBy:  userId,
      expiresAt:  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  })

  // TODO: send invite email via email.ts when template is ready
  console.log(`[Invite] token=${invite.token} email=${email} business=${businessId}`)

  return res.status(201).json({ success: true, inviteToken: invite.token, expiresAt: invite.expiresAt })
})

// ── GET /api/invites/:token ──────────────────────────────────────────────────
// Public — returns invite metadata so the accept page can show business name.
router.get('/invites/:token', async (req: Request, res: Response) => {
  const invite = await db.businessInvite.findUnique({
    where:   { token: req.params.token },
    include: { business: { select: { name: true, industry: true } } },
  })
  if (!invite)                         return res.status(404).json({ error: 'INVITE_NOT_FOUND' })
  if (invite.acceptedAt)               return res.status(410).json({ error: 'INVITE_ALREADY_USED' })
  if (invite.expiresAt < new Date())   return res.status(410).json({ error: 'INVITE_EXPIRED' })

  return res.json({
    email:        invite.email,
    role:         invite.role,
    businessName: invite.business.name,
    industry:     invite.business.industry,
    expiresAt:    invite.expiresAt.toISOString(),
  })
})

// ── POST /api/invites/:token/accept ─────────────────────────────────────────
router.post('/invites/:token/accept', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as any).auth.userId
  const invite  = await db.businessInvite.findUnique({ where: { token: req.params.token } })
  if (!invite)                       return res.status(404).json({ error: 'INVITE_NOT_FOUND' })
  if (invite.acceptedAt)             return res.status(410).json({ error: 'INVITE_ALREADY_USED' })
  if (invite.expiresAt < new Date()) return res.status(410).json({ error: 'INVITE_EXPIRED' })

  try {
    await db.$transaction([
      // Create membership
      db.membership.upsert({
        where:  { userId_businessId: { userId, businessId: invite.businessId } },
        update: { role: invite.role, status: 'ACTIVE' },
        create: { userId, businessId: invite.businessId, role: invite.role, status: 'ACTIVE', invitedBy: invite.invitedBy },
      }),
      // Mark invite as used
      db.businessInvite.update({
        where: { token: req.params.token },
        data:  { acceptedAt: new Date() },
      }),
    ])
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }

  return res.json({ success: true, businessId: invite.businessId, role: invite.role })
})

// ── DELETE /api/business/:businessId/team/:memberId ──────────────────────────
router.delete('/business/:businessId/team/:memberId', requireAuth, async (req: Request, res: Response) => {
  const userId         = (req as any).auth.userId
  const { businessId, memberId } = req.params

  const myMembership = await getMembership(userId, businessId)
  if (!myMembership || !canManageTeam(myMembership.role as MembershipRole)) {
    return res.status(403).json({ error: 'FORBIDDEN' })
  }

  const target = await db.membership.findUnique({ where: { id: memberId } })
  if (!target || target.businessId !== businessId) return res.status(404).json({ error: 'NOT_FOUND' })
  if (target.role === 'OWNER') return res.status(400).json({ error: 'CANNOT_REMOVE_OWNER' })

  await db.membership.update({ where: { id: memberId }, data: { status: 'REMOVED' } })
  return res.json({ success: true })
})

// ── PATCH /api/business/:businessId/team/:memberId ───────────────────────────
const UpdateRoleSchema = z.object({ role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']) })

router.patch('/business/:businessId/team/:memberId', requireAuth, async (req: Request, res: Response) => {
  const userId         = (req as any).auth.userId
  const { businessId, memberId } = req.params

  const myMembership = await getMembership(userId, businessId)
  if (!myMembership || myMembership.role !== 'OWNER') {
    return res.status(403).json({ error: 'FORBIDDEN — only OWNER can change roles' })
  }

  const parse = UpdateRoleSchema.safeParse(req.body)
  if (!parse.success) return res.status(400).json({ error: 'VALIDATION_FAILED' })

  const target = await db.membership.findUnique({ where: { id: memberId } })
  if (!target || target.businessId !== businessId) return res.status(404).json({ error: 'NOT_FOUND' })
  if (target.role === 'OWNER') return res.status(400).json({ error: 'CANNOT_CHANGE_OWNER_ROLE' })

  await db.membership.update({ where: { id: memberId }, data: { role: parse.data.role as MembershipRole } })
  return res.json({ success: true })
})

export default router
