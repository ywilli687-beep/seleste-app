// @ts-nocheck
import { z } from 'zod'
import { AgentType, BusinessState } from '@prisma/client'

const UpdateMetaPayload       = z.object({ page: z.enum(['homepage','service_page','contact','about']), suggested_title: z.string().max(60), suggested_meta: z.string().max(160), target_keyword: z.string(), includes_location: z.boolean(), current_title: z.string().nullable().optional() })
const AddSchemaPayload        = z.object({ schema_type: z.enum(['LocalBusiness','Service','FAQPage','Review','BreadcrumbList']), priority_fields: z.array(z.string()), implementation: z.enum(['json_ld','microdata']), page: z.string() })
const FixSitemapPayload       = z.object({ issue: z.enum(['missing','not_submitted','broken_urls','not_linked']), recommended_url_count: z.number().int().positive(), cms_specific_notes: z.string().nullable().optional() })
const AddCitationPayload      = z.object({ directories: z.array(z.string()), nap_consistency_issue: z.boolean(), nap_details: z.object({ name: z.string(), address: z.string().nullable().optional(), phone: z.string().nullable().optional() }) })
const OptimizeHeadingsPayload = z.object({ suggested_h1: z.string(), h2_suggestions: z.array(z.string()).max(3), keyword_gaps: z.array(z.string()), current_h1: z.string().nullable().optional() })
const AddCtaPayload           = z.object({ placement: z.enum(['hero','below_fold','sidebar','footer','sticky_bar']), cta_text: z.string(), cta_style: z.enum(['button','banner','inline']), phone_number: z.boolean(), urgency_copy: z.string().nullable().optional() })
const FixBookingWidgetPayload = z.object({ issue: z.string(), placement: z.string(), recommended_tool: z.string().nullable().optional() })
const AddTrustBadgePayload    = z.object({ badge_type: z.enum(['review_count','certification','guarantee','association','award']), source: z.string(), placement: z.string(), copy_suggestion: z.string() })
const ImproveFormPayload      = z.object({ issue: z.string(), fields_to_remove: z.array(z.string()), fields_to_add: z.array(z.string()), new_cta_text: z.string() })
const AddTestimonialPayload   = z.object({ placement: z.string(), format: z.enum(['quote_card','video_embed','star_rating_summary']), source_suggestion: z.string(), minimum_count: z.number().int().positive() })
const GmbUpdatePayload        = z.object({ update_type: z.enum(['business_hours','photos','services','description','post','category']), suggested_value: z.string(), reason: z.string(), current_value: z.string().nullable().optional() })
const RequestReviewPayload    = z.object({ target_platform: z.enum(['Google','Yelp','Facebook','Industry-specific']), delivery_method: z.enum(['email','sms','in_person_card','receipt_qr']), template_suggestion: z.string(), current_review_count: z.number().nullable().optional(), current_rating: z.number().nullable().optional() })
const RespondReviewPayload    = z.object({ strategy: z.enum(['respond_to_negatives','respond_to_all','flag_fake']), tone_guidance: z.string(), response_template: z.string() })
const UpdateListingPayload    = z.object({ directory: z.string(), issue: z.enum(['missing','incorrect_nap','unclaimed','outdated_hours']), priority: z.enum(['HIGH','MEDIUM','LOW']), nap_correction: z.record(z.string()).nullable().optional() })
const PublishContentPayload   = z.object({ content_type: z.enum(['blog_post','service_page','resource_guide','case_study']), suggested_title: z.string(), target_keyword: z.string(), word_count_target: z.number().int().positive(), outline: z.array(z.string()).min(3).max(5), cta_to_include: z.string() })
const UpdateCopyPayload       = z.object({ page: z.string(), section: z.enum(['hero','about','services','cta','footer']), issue: z.string(), rewrite_guidance: z.string(), keywords_to_include: z.array(z.string()) })
const AddFaqPayload           = z.object({ page: z.string(), questions: z.array(z.string()).min(3).max(7), schema_eligible: z.boolean(), tone: z.enum(['formal','conversational']) })
const AddLocationPagePayload  = z.object({ city: z.string(), service: z.string(), suggested_url: z.string(), target_keyword: z.string(), population_note: z.string().nullable().optional() })
const UpdateServicePagePayload = z.object({ service_name: z.string(), issues: z.array(z.string()), additions: z.array(z.string()), target_keyword: z.string(), page_url: z.string().nullable().optional() })
const CreateCampaignPayload   = z.object({ platform: z.enum(['Google Ads','Meta Ads','Microsoft Ads','LSA']), campaign_type: z.enum(['search','display','local_service','performance_max']), suggested_budget_monthly: z.number().positive(), target_keywords: z.array(z.string()).max(5), geo_target: z.string(), goal: z.enum(['calls','form_submissions','store_visits']), justification: z.string() })
const UpdateAdCopyPayload     = z.object({ platform: z.string(), headlines: z.array(z.string()).max(3), descriptions: z.array(z.string()).max(2), keywords_to_include: z.array(z.string()), current_issue: z.string() })
const AdjustBudgetPayload     = z.object({ direction: z.enum(['increase','decrease','reallocate']), percentage: z.number().positive().max(100), rationale: z.string(), from_campaign: z.string().nullable().optional(), to_campaign: z.string().nullable().optional() })
const AddKeywordPayload       = z.object({ platform: z.string(), keywords: z.array(z.string()), match_type: z.enum(['exact','phrase','broad']), negative_keywords: z.array(z.string()), estimated_monthly_searches: z.number().nullable().optional() })
const PauseCampaignPayload    = z.object({ campaign_identifier: z.string(), reason: z.string(), budget_to_reallocate: z.number().nullable().optional() })

export const ACTION_PAYLOAD_SCHEMAS: Record<string, z.ZodType<any>> = {
  UPDATE_META:          UpdateMetaPayload,
  ADD_SCHEMA:           AddSchemaPayload,
  FIX_SITEMAP:          FixSitemapPayload,
  UPDATE_ROBOTS:        z.object({ issue: z.string(), fix: z.string() }),
  ADD_CITATION:         AddCitationPayload,
  OPTIMIZE_HEADINGS:    OptimizeHeadingsPayload,
  ADD_CTA:              AddCtaPayload,
  FIX_BOOKING_WIDGET:   FixBookingWidgetPayload,
  ADD_TRUST_BADGE:      AddTrustBadgePayload,
  IMPROVE_FORM:         ImproveFormPayload,
  ADD_TESTIMONIAL:      AddTestimonialPayload,
  GMB_UPDATE:           GmbUpdatePayload,
  REQUEST_REVIEW:       RequestReviewPayload,
  RESPOND_REVIEW:       RespondReviewPayload,
  UPDATE_LISTING:       UpdateListingPayload,
  PUBLISH_CONTENT:      PublishContentPayload,
  UPDATE_COPY:          UpdateCopyPayload,
  ADD_FAQ:              AddFaqPayload,
  ADD_LOCATION_PAGE:    AddLocationPagePayload,
  UPDATE_SERVICE_PAGE:  UpdateServicePagePayload,
  CREATE_CAMPAIGN:      CreateCampaignPayload,
  UPDATE_AD_COPY:       UpdateAdCopyPayload,
  ADJUST_BUDGET:        AdjustBudgetPayload,
  ADD_KEYWORD:          AddKeywordPayload,
  PAUSE_CAMPAIGN:       PauseCampaignPayload,
}

export const ActionSchema = z.object({
  title:           z.string().min(1).max(200),
  description:     z.string().min(20).max(2000),
  pillar:          z.string().min(1),
  goal:            z.string().min(1),
  metric:          z.string().min(1),
  targetValue:     z.number().int().min(0).max(100).optional(),
  estimatedImpact: z.number().int().min(0).max(100),
  estimatedEffort: z.number().int().min(1).max(5),
  riskTier:        z.enum(['LOW','MEDIUM','HIGH']),
  actionType:      z.string().min(1),
  actionPayload:   z.record(z.unknown()),
  channelSynergy:  z.array(z.string()).default([]),
  urgencySignal:   z.number().int().min(0).max(100).default(50),
})

export type ValidatedAction = z.infer<typeof ActionSchema>

export interface ValidationResult {
  valid:    boolean
  action:   ValidatedAction | null
  errors:   string[]
  warnings: string[]
}

export interface BatchValidationResult {
  passed:   ValidatedAction[]
  rejected: Array<{ index: number; title: string; errors: string[] }>
  warnings: Array<{ index: number; title: string; warnings: string[] }>
}

export function validateAction(
  raw: unknown,
  agentType: AgentType,
  businessState: BusinessState,
  currentPillarScore: number = 50
): ValidationResult {
  const errors: string[]   = []
  const warnings: string[] = []
  const parse = ActionSchema.safeParse(raw)
  if (!parse.success) {
    return { valid: false, action: null, errors: parse.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`), warnings: [] }
  }
  const action = parse.data
  const payloadSchema = ACTION_PAYLOAD_SCHEMAS[action.actionType]
  if (!payloadSchema) {
    errors.push(`Unknown actionType: "${action.actionType}"`)
  } else {
    const payloadParse = payloadSchema.safeParse(action.actionPayload)
    if (!payloadParse.success) {
      errors.push(`actionPayload invalid for ${action.actionType}: ` + payloadParse.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '))
    }
  }
  const stateBlocks: Partial<Record<BusinessState, AgentType[]>> = {
    NO_FOUNDATION:     ['SEO','REPUTATION','MEDIA_BUYER'],
    CONVERSION_BROKEN: ['MEDIA_BUYER'],
  }
  const blocked = stateBlocks[businessState] ?? []
  if (blocked.includes(agentType)) errors.push(`Agent ${agentType} is blocked in state ${businessState}`)
  const scoreGap = 100 - currentPillarScore
  const maxDefensible = Math.min(scoreGap * 0.5, 60)
  if (action.estimatedImpact > maxDefensible) {
    warnings.push(`estimatedImpact ${action.estimatedImpact} exceeds ceiling ${Math.round(maxDefensible)} for pillar score ${currentPillarScore}`)
  }
  return { valid: errors.length === 0, action: errors.length === 0 ? action : null, errors, warnings }
}

export function validateBatch(
  actions: unknown[],
  agentType: AgentType,
  businessState: BusinessState,
  pillarScores: Record<string, number>
): BatchValidationResult {
  const passed:   ValidatedAction[]                 = []
  const rejected: BatchValidationResult['rejected'] = []
  const warnings: BatchValidationResult['warnings'] = []
  for (let i = 0; i < actions.length; i++) {
    const raw       = actions[i] as any
    const pillarKey = raw?.pillar?.toLowerCase() ?? 'overall'
    const score     = pillarScores[pillarKey] ?? pillarScores['overall'] ?? 50
    const result    = validateAction(raw, agentType, businessState, score)
    if (!result.valid) {
      rejected.push({ index: i, title: raw?.title ?? 'unknown', errors: result.errors })
    } else {
      passed.push(result.action!)
      if (result.warnings.length > 0) warnings.push({ index: i, title: result.action!.title, warnings: result.warnings })
    }
  }
  return { passed, rejected, warnings }
}
