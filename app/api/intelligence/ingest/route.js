import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req) {
    try {
        const payload = await req.json();
        const { businessId, dataSource, data } = payload;

        if (!businessId || !dataSource || !data) {
            return NextResponse.json({ error: 'Missing required payload fields.' }, { status: 400 });
        }

        let ingestedRecord;

        // Route data to the appropriate longitudinal intelligence pillar
        switch (dataSource) {
            case 'PAID_MEDIA':
                // e.g. Facebook Ads, Google Ads Webhook data
                ingestedRecord = await prisma.paidMediaPerformance.create({
                    data: {
                        business_id: businessId,
                        campaign_id: data.campaignId,
                        platform: data.platform,
                        ad_creative_type: data.creativeType,
                        creative_description: data.creativeDescription,
                        cpc: data.cpc,
                        cpm: data.cpm,
                        ctr: data.ctr,
                        cpa: data.cpa,
                        roas: data.roas,
                        conversion_rate: data.conversionRate,
                        geographic_region: data.region,
                        industry_category: data.industry
                    }
                });
                break;

            case 'REVENUE_INTELLIGENCE':
                // e.g. CRM hook (Hubspot / Salesforce)
                ingestedRecord = await prisma.revenueIntelligence.create({
                    data: {
                        business_id: businessId,
                        period_start: new Date(data.periodStart),
                        period_end: new Date(data.periodEnd),
                        leads_generated: data.leads,
                        calls_booked: data.calls,
                        jobs_sold: data.jobs,
                        revenue_generated: data.revenue,
                        repeat_customers: data.repeatCustomers,
                        customer_acquisition_cost: data.cac,
                        lifetime_value: data.ltv
                    }
                });
                break;

            case 'LONGITUDINAL':
                // E.g. internal cron roll-ups at the end of the month
                ingestedRecord = await prisma.longitudinalPerformance.create({
                    data: {
                        business_id: businessId,
                        period_type: data.periodType, // 'MONTHLY', etc.
                        period_start: new Date(data.periodStart),
                        period_end: new Date(data.periodEnd),
                        revenue_growth_pct: data.revenueGrowth,
                        lead_growth_pct: data.leadGrowth,
                        cpa_change_pct: data.cpaChange
                    }
                });
                break;

            default:
                return NextResponse.json({ error: 'Unknown data source type.' }, { status: 400 });
        }

        // Fire off an async event to recalculate industry benchmarks based on this new row
        // fetch('/api/intelligence/benchmarks/recalculate', ... ) 

        return NextResponse.json({ success: true, ingestedId: ingestedRecord.id });
    } catch (error) {
        console.error('Data Ingestion Pipeline Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
