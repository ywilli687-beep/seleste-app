import prisma from '../prisma';

/**
 * Calculates Seleste Industry Benchmarks dynamically from the database.
 * Instead of rigid pre-defined numbers, this engine processes thousands of 
 * rows of paid media and longitudinal performance to calculate averages and top deciles.
 */

export async function recalculateIndustryBenchmarks(industrySlug) {
    try {
        console.log(`[Benchmarking Engine] Triggering recalculation for ${industrySlug}`);

        // 1. Fetch all businesses in this industry category to find relevant IDs
        const businesses = await prisma.business.findMany({
            where: { industry: industrySlug },
            select: { id: true }
        });

        if (businesses.length === 0) {
            console.warn(`No businesses found for industry: ${industrySlug}`);
            return null;
        }

        const bIds = businesses.map(b => b.id);

        // 2. Fetch all Paid Media Performance for those businesses over last 90 days
        const recentDate = new Date();
        recentDate.setDate(recentDate.getDate() - 90);

        const paidPerformance = await prisma.paidMediaPerformance.findMany({
            where: {
                business_id: { in: bIds },
                recorded_at: { gte: recentDate }
            }
        });

        // 3. Extract and Sort CPL arrays to calculate metrics
        const cpls = paidPerformance.map(p => parseFloat(p.cpa)).filter(n => !isNaN(n)).sort((a, b) => a - b);
        let averageCPL = 0;
        let top25CPL = 0;

        if (cpls.length > 0) {
            averageCPL = cpls.reduce((a, b) => a + b, 0) / cpls.length;
            // The top 25% performers are the lowest 25% CPAs
            const p25Index = Math.max(0, Math.floor(cpls.length * 0.25) - 1);
            top25CPL = cpls[p25Index];
        }

        // 4. Fetch Revenue Intelligence to calculate average Job Value
        const revenueData = await prisma.revenueIntelligence.findMany({
            where: {
                business_id: { in: bIds },
                recorded_at: { gte: recentDate }
            }
        });

        const jobValues = revenueData.map(r => {
            const revenue = parseFloat(r.revenue_generated);
            const jobs = parseInt(r.jobs_sold);
            return jobs > 0 ? (revenue / jobs) : null;
        }).filter(n => n !== null).sort((a, b) => b - a);

        const avgJobValue = jobValues.length > 0 ? (jobValues.reduce((a, b) => a + b, 0) / jobValues.length) : 0;

        // 5. Build/Upsert benchmark record
        const benchmarkRecord = await prisma.industryBenchmark.upsert({
            where: { industry_slug: industrySlug },
            update: {
                avg_cpl: averageCPL,
                top_25_percentile_cpl: top25CPL,
                avg_job_value: avgJobValue,
                updated_at: new Date()
            },
            create: {
                industry_slug: industrySlug,
                avg_cpl: averageCPL,
                top_25_percentile_cpl: top25CPL,
                avg_job_value: avgJobValue,
                // Default placeholders for the other scores if they aren't calculated here yet
                avg_preparedness: 50,
                top_10_percentile: 75,
                avg_seo_score: 50,
                avg_conversion: 2.5
            }
        });

        console.log(`[Benchmarking Engine] Successfully updated ${industrySlug}`);
        return benchmarkRecord;

    } catch (e) {
        console.error('Benchmarking Engine Error:', e);
        throw e;
    }
}
