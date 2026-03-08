import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { AUDIT_SYSTEM_PROMPT } from '../../../lib/agents/prompts';
import { auditSchema } from '../../../lib/agents/schemas';
import { sendWelcomeEmail } from '../../../lib/email';
import { scrapeWebsiteMetrics } from '../../../lib/seo/scraper';
import { getPageSpeedMetrics } from '../../../lib/seo/pagespeed';

export const maxDuration = 60; // Allow 60 seconds for LLM generation

export async function POST(req) {
    try {
        const body = await req.json();
        const { businessData } = body;

        if (!businessData) {
            return NextResponse.json({ error: 'Missing business data' }, { status: 400 });
        }

        const goalMap = { 'leads': 'Generate more leads', 'visibility': 'Improve local visibility', 'conversion': 'Increase conversion rate', 'retention': 'Retain & upsell customers', 'expand': 'Expand to new markets', 'compete': 'Outrank competitors' };

        let liveDataSection = "";

        if (businessData.website && businessData.website !== 'None') {
            const [seoData, speedData] = await Promise.all([
                scrapeWebsiteMetrics(businessData.website),
                getPageSpeedMetrics(businessData.website)
            ]);

            liveDataSection = `
[LIVE WEBSITE DATA]
Target URL: ${businessData.website}
SEO Extraction: ${seoData ? JSON.stringify(seoData) : 'Failed to fetch'}
Mobile PageSpeed Insights: ${speedData ? JSON.stringify(speedData) : 'Failed to fetch'}

INSTRUCTION: You must base your audit findings and growth recommendations heavily around the errors or successes found in this LIVE WEBSITE DATA. If they are missing an H1, write a task to fix it. If their mobile score is under 50, write a task to fix it.
`;
        }

        const promptString = `Run a full digital growth audit on this local business.
Business: ${businessData.businessName} | Industry: ${businessData.industry} | Services: ${businessData.services}
Location: ${businessData.location} | Stage: ${businessData.stage} | Goals: ${(businessData.goals || []).map(g => goalMap[g] || g).join(', ')}
Budget: ${businessData.budget} | Channels: ${(businessData.channels || []).join(', ')} | Website: ${businessData.website || 'None'}
${liveDataSection}
`;

        let parsedData;
        if (!process.env.ANTHROPIC_API_KEY) {
            console.warn("No Anthropic API key found. Returning mock audit data for local testing.");
            parsedData = {
                qualityScore: 42,
                scoreLabel: "Fair",
                headline: "Your digital presence is unoptimized, leaving significant revenue on the table.",
                winOpportunity: "Add an explicit CTA above the fold to capture abandoning traffic.",
                findings: [
                    { skill: "seo-audit", severity: "critical", title: "Missing H1 Tags", description: "Your homepage lacks a primary H1 tag.", action: "Add H1 tag outlining your primary service.", impactScore: 8, difficultyLevel: 2, estRevenueImpact: "$500 - $1k MRR" },
                    { skill: "page-cro", severity: "warning", title: "Low Social Proof", description: "No testimonials or reviews are visible above the fold.", action: "Add 3-5 Google reviews to the hero section.", impactScore: 7, difficultyLevel: 3, estRevenueImpact: "$1k+ MRR" },
                    { skill: "paid-ads", severity: "good", title: "LSA Activated", description: "You have Local Service Ads running.", action: "Continue monitoring LSA budget.", impactScore: 5, difficultyLevel: 1, estRevenueImpact: "Maintaining" },
                    { skill: "analytics", severity: "critical", title: "No Call Tracking", description: "You are not tracking phone calls from the website.", action: "Implement dynamic number insertion.", impactScore: 9, difficultyLevel: 4, estRevenueImpact: "$2k - $4k MRR" },
                    { skill: "copywriting", severity: "warning", title: "Weak Value Prop", description: "Hero text is too generic.", action: "Rewrite hero text to focus on user outcome.", impactScore: 6, difficultyLevel: 3, estRevenueImpact: "$500 MRR" }
                ],
                roadmap: [
                    { phase: "30", skill: "page-cro", task: "Add reviews to homepage", assignedAgent: "Ops Agent" },
                    { phase: "30", skill: "seo-audit", task: "Add missing H1 tags", assignedAgent: "SEO Agent" },
                    { phase: "60", skill: "analytics", task: "Set up call tracking", assignedAgent: "Ops Agent" },
                    { phase: "60", skill: "copywriting", task: "Rewrite hero copy", assignedAgent: "Creative Agent" },
                    { phase: "90", skill: "page-cro", task: "A/B test the main CTA", assignedAgent: "Creative Agent" },
                    { phase: "90", skill: "paid-ads", task: "Launch retargeting campaign", assignedAgent: "Paid Ads Agent" }
                ]
            };
        } else {
            // Modern Vercel AI SDK wrapper: Enforces Zod schema on Claude so it doesn't break JSON parsing
            const { object: generatedObj } = await generateObject({
                model: anthropic('claude-3-5-sonnet-latest'),
                system: AUDIT_SYSTEM_PROMPT,
                prompt: promptString,
                schema: auditSchema,
            });
            parsedData = generatedObj;
        }

        const userEmail = businessData.email || 'demo@seleste.com';
        const userName = businessData.firstName || 'Demo User';
        const rawPassword = businessData.password || null;

        // Save to Database
        let user = await prisma.user.findUnique({ where: { email: userEmail } });

        let hashedPassword = null;
        if (rawPassword) {
            hashedPassword = await bcrypt.hash(rawPassword, 10);
        }

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: userEmail,
                    name: userName,
                    ...(hashedPassword && { password: hashedPassword })
                }
            });
        } else if (!user.password && hashedPassword) {
            // Update user with password if they didn't have one
            user = await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
            });
        }

        const business = await prisma.business.create({
            data: {
                user_id: user.id,
                name: businessData.businessName || 'Unknown Business',
                industry: businessData.industry || 'Local Service',
                location: businessData.location || null,
                revenue_range: businessData.revenue || null,
                website_url: businessData.website || null,
            }
        });

        const audit = await prisma.audit.create({
            data: {
                business_id: business.id,
                preparedness_score: parsedData.qualityScore || 0,
                raw_data: parsedData,
            }
        });

        // Trigger welcome/confirmation email transactionally (runs async/mock if no API key)
        sendWelcomeEmail(userEmail, userName, businessData.businessName);

        // --- NEW ADVANCED DATA MODELS POPULATION ---

        // 1. Create Actionable Growth Recommendations
        if (parsedData.findings && parsedData.findings.length > 0) {
            await prisma.growthRecommendation.createMany({
                data: parsedData.findings.map(finding => ({
                    business_id: business.id,
                    audit_id: audit.id,
                    problem_detected: finding.description,
                    suggested_action: finding.action,
                    impact_score: finding.impactScore || 7,
                    difficulty_level: finding.difficultyLevel || 5,
                    est_revenue_impact: finding.estRevenueImpact || 'Unknown',
                }))
            });
        }

        // 2. Map Competitor Benchmarking Intelligence
        if (parsedData.competitors && parsedData.competitors.length > 0) {
            await prisma.competitorInfo.createMany({
                data: parsedData.competitors.map(comp => ({
                    business_id: business.id,
                    competitor_domain: comp.domain || comp.name,
                    estimated_traffic: comp.estimatedTraffic || 0,
                    market_share_est: comp.marketShare || 0.1,
                    ad_presence: comp.adPresence || false,
                }))
            });
        }

        // 3. Continuously Update Rolling Industry Benchmarks
        const slug = (businessData.industry || 'local-service').toLowerCase().replace(/\s+/g, '-');
        const existingBench = await prisma.industryBenchmark.findUnique({
            where: { industry_slug: slug }
        });

        if (!existingBench) {
            await prisma.industryBenchmark.create({
                data: {
                    industry_slug: slug,
                    avg_preparedness: parsedData.qualityScore || 50,
                    top_10_percentile: Math.min((parsedData.qualityScore || 50) + 20, 100),
                    avg_seo_score: 50,
                    avg_conversion: 50
                }
            });
        } else {
            // Real-time rolling average of the industry as Seleste processes more audits
            await prisma.industryBenchmark.update({
                where: { industry_slug: slug },
                data: {
                    avg_preparedness: (existingBench.avg_preparedness + (parsedData.qualityScore || 50)) / 2
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: parsedData,
            businessId: business.id,
            auditId: audit.id
        });
    } catch (error) {
        console.error('Audit Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
