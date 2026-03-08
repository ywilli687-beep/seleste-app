import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    try {
        const { id } = params;

        // Auth check should usually happen here

        const business = await prisma.business.findUnique({
            where: { id },
            include: {
                audits: { orderBy: { created_at: 'desc' } },
                marketing_plans: { orderBy: { created_at: 'desc' } },
                agent_tasks: { orderBy: { created_at: 'desc' } },
                competitors: true,
                recommendations: true
            }
        });

        // Compute Priority Score: (Impact * 10) / Difficulty to sort by highest ROI
        if (business?.recommendations) {
            business.recommendations.forEach(rec => {
                rec.priority_score = (rec.impact_score * 10) / (rec.difficulty_level || 5);
            });
            business.recommendations.sort((a, b) => b.priority_score - a.priority_score);
        }

        // Also fetch the specific industry benchmark
        const slug = (business.industry || 'local-service').toLowerCase().replace(/\s+/g, '-');
        const benchmark = await prisma.industryBenchmark.findUnique({
            where: { industry_slug: slug }
        });

        if (!business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: { ...business, benchmark } });
    } catch (error) {
        console.error('Fetch Business Detail Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
