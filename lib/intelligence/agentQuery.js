import prisma from '../prisma';

/**
 * Seleste Agent Query System
 * 
 * Provides agents with proprietary data tools so they aren't relying on generalized LLM knowledge.
 * The intelligence layer routes agents directly to the AIMemoryBank and Longitudinal performance data.
 */

// 1. Get Top Performing Strategies by Industry
export async function queryTopStrategies(industrySlug, limit = 5) {
    // Queries the AIMemoryBank to find the highest 'success_metric' actions for the given industry
    const topActions = await prisma.aIMemoryBank.findMany({
        where: {
            industry: industrySlug,
            outcome_delta: { gt: 0 } // Only successful actions
        },
        orderBy: {
            outcome_delta: 'desc'
        },
        take: limit
    });

    return topActions.map(action => ({
        agent: action.agent_type,
        actionTaken: action.action_taken,
        outcomeImpact: `+${(action.outcome_delta * 100).toFixed(1)}% ${action.outcome_metric}`,
        confidence: action.confidence_score
    }));
}

// 2. Query Industry Benchmarks
export async function queryBenchmarks(industrySlug) {
    const benchmark = await prisma.industryBenchmark.findUnique({
        where: { industry_slug: industrySlug }
    });

    if (!benchmark) return null;

    return {
        avgCPL: benchmark.avg_cpl ? `$${Number(benchmark.avg_cpl).toFixed(2)}` : 'N/A',
        top25CPL: benchmark.top_25_percentile_cpl ? `$${Number(benchmark.top_25_percentile_cpl).toFixed(2)}` : 'N/A',
        avgJobValue: benchmark.avg_job_value ? `$${Number(benchmark.avg_job_value).toFixed(2)}` : 'N/A',
        conversionRate: `${Number(benchmark.avg_conversion).toFixed(1)}%`
    };
}

// 3. Query Successful Ad Creatives by Industry
export async function queryTopAdCreatives(industrySlug, platform) {
    const historicalAds = await prisma.paidMediaPerformance.findMany({
        where: {
            industry_category: industrySlug,
            platform: platform,
            roas: { gte: 2.0 } // Only looking at ads with > 2.0 Return on Ad Spend
        },
        orderBy: {
            roas: 'desc'
        },
        take: 3
    });

    return historicalAds.map(ad => ({
        type: ad.ad_creative_type,
        description: ad.creative_description,
        roas: ad.roas,
        cpl: ad.cpa
    }));
}
