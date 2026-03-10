import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import prisma from '../../../lib/prisma';
import { OPS_SYSTEM_PROMPT } from '../../../lib/agents/prompts';
import { marketingPlanSchema } from '../../../lib/agents/schemas';

export const maxDuration = 60; // Allow 60 seconds for LLM generation

export async function POST(req) {
    try {
        const { businessData, auditResults, businessId } = await req.json();

        if (!businessData || !auditResults) {
            return NextResponse.json({ error: 'Missing business data or audit results' }, { status: 400 });
        }

        const promptString = `Build a 90-day actionable marketing plan based on this business and audit.
CLIENT: ${businessData.businessName} | ${businessData.industry} | ${businessData.services} | Geo: ${businessData.location} | Budget: ${businessData.budget}
AUDIT: ${auditResults.qualityScore}/100 — ${auditResults.headline}
FINDINGS: ${(auditResults.findings || []).map(f => `[${f.severity}] ${f.title}`).join('; ')}
`;

        let parsedData;

        if (!process.env.ANTHROPIC_API_KEY || process.env.MOCK_LLM === 'true') {
            console.warn("MOCK_LLM is true or missing API key. Returning mock marketing plan.");
            parsedData = {
                executiveSummary: [
                    "Fix core technical SEO immediately.",
                    "Build out dedicated service pages.",
                    "Implement a robust review generation system.",
                    "Optimize Google Business Profile for local packs.",
                    "Launch retargeting to capture abandoned traffic."
                ],
                bottleneckDiagnosis: "Lack of local market visibility and trust signals preventing warm leads from converting.",
                roadmap: [
                    {
                        phase: "30_days",
                        tasks: [
                            { title: "Fix missing H1 tags & Alt Attributes", effort: "Low", impact: "High", assignedAgent: "SEO Agent" },
                            { title: "Add hero reviews", effort: "Low", impact: "Medium", assignedAgent: "Creative Agent" }
                        ]
                    },
                    {
                        phase: "60_days",
                        tasks: [
                            { title: "Publish 3 new service area pages", effort: "Medium", impact: "High", assignedAgent: "SEO Agent" },
                            { title: "Configure call tracking", effort: "Medium", impact: "High", assignedAgent: "Ops Agent" }
                        ]
                    },
                    {
                        phase: "90_days",
                        tasks: [
                            { title: "Set up Meta Retargeting Pixel", effort: "Medium", impact: "High", assignedAgent: "Paid Ads Agent" },
                            { title: "Automate review collection flow", effort: "Low", impact: "Medium", assignedAgent: "Ops Agent" }
                        ]
                    }
                ],
                agentBriefs: [
                    { agent: "SEO Agent", objective: "Fix on-page errors", priority: "High" }
                ]
            };
        } else {
            // Modern Vercel AI SDK wrapper forcing the LLM to output accurate Marketing Plan schema
            const { object: generatedObj } = await generateObject({
                model: anthropic('claude-sonnet-4-6'),
                system: OPS_SYSTEM_PROMPT, // Assuming MARKETING_PLAN_PROMPT is a typo and OPS_SYSTEM_PROMPT is intended based on original file
                prompt: promptString,
                schema: marketingPlanSchema,
            });
            parsedData = generatedObj;
        }

        // Save the marketing plan to database if businessId is provided
        if (businessId) {
            for (const phase of parsedData.roadmap) {
                await prisma.marketingPlan.create({
                    data: {
                        business_id: businessId,
                        timeframe: phase.phase,
                        action_items: phase.tasks,
                        status: 'active'
                    }
                });
            }
        }

        return NextResponse.json({ success: true, data: parsedData });
    } catch (error) {
        console.error('Marketing Plan Generation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
