import { z } from 'zod';

// The precise JSON structure enforced onto Claude for the Core Audit
export const auditSchema = z.object({
    qualityScore: z.number().describe('Most local businesses score 25-55; be honest. Value should be between 0 and 100.'),
    scoreLabel: z.enum(["Poor", "Fair", "Good", "Strong"]),
    executiveSummary: z.string().describe('A 2-3 sentence executive summary detailing their current state and the most critical path forward.'),
    headline: z.string().describe('One sharp sentence naming the single biggest growth blocker'),
    winOpportunity: z.string().describe('The fastest win they could implement this week (1-2 sentences)'),
    findings: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["critical", "warning", "good"]),
        title: z.string(),
        description: z.string(),
        action: z.string(),
        impactScore: z.number().describe('1-10 score of revenue impact'),
        difficultyLevel: z.number().describe('1-10 score of effort needed'),
        estRevenueImpact: z.string().describe('Estimate like "$1k - 3k MRR" or "$500/mo"')
    })).describe('Array of exactly 5 findings ranked by impact'),
    roadmap: z.array(z.object({
        phase: z.enum(["30", "60", "90"]),
        skill: z.string(),
        task: z.string(),
        assignedAgent: z.enum(["SEO Agent", "Creative Agent", "Ops Agent", "Paid Ads Agent", "Human Owner"]).describe("The autonomous agent best suited to execute this step")
    })).describe('Array of exactly 6 roadmap tasks'),
    competitors: z.array(z.object({
        name: z.string(),
        domain: z.string(),
        estimatedTraffic: z.number(),
        marketShare: z.number().describe('0.0 to 1.0 estimate'),
        adPresence: z.boolean()
    })).describe('Identify top 3 probable competitors in this local market').optional()
});

// The structure for generating 90-day execution plans
export const marketingPlanSchema = z.object({
    executiveSummary: z.array(z.string()).describe('Array of exactly 5 bullet points'),
    bottleneckDiagnosis: z.string().describe('Primary constraint stopping them from growing'),
    roadmap: z.array(z.object({
        phase: z.enum(["30_days", "60_days", "90_days"]),
        tasks: z.array(z.object({
            title: z.string().describe("Specific execution task"),
            effort: z.enum(["Low", "Medium", "High"]),
            impact: z.enum(["Low", "Medium", "High"]),
            assignedAgent: z.enum(["SEO Agent", "Creative Agent", "Ops Agent", "Paid Ads Agent", "Human Owner"])
        })).describe('Generate 2 to 4 unique tasks for this particular timeframe')
    })).describe('Must contain 3 array elements for 30, 60, and 90 day phases'),
    agentBriefs: z.array(z.object({
        agent: z.string(),
        objective: z.string(),
        priority: z.enum(["High", "Medium", "Low"])
    }))
});
// The structure enforcing strict boundaries on what the SEO execution agent can output.
export const seoExecutionSchema = z.object({
    execution_type: z.enum([
        "META_TITLE_GENERATION",
        "META_DESCRIPTION_GENERATION",
        "SCHEMA_MARKUP_LOCAL_BUSINESS",
        "HEADER_STRUCTURE_RECOMMENDATION",
        "INTERNAL_LINK_SUGGESTIONS",
        "SEO_CONTENT_BRIEF"
    ]),
    summary: z.string().describe('1-2 sentences summarizing what was accomplished.'),
    rationale: z.string().describe('Explanation of WHY these changes matter and match intent.'),
    confidence_score: z.number(),
    draft_output: z.record(z.any()).describe('JSON object containing the actual deliverables (like title tags or schema code)'),
    requires_approval: z.boolean().default(true)
});
