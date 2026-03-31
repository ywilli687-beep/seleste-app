import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function runPostAuditJobs(auditId: string, results: any) {
  try {
    console.log(`[Job] Running post-audit tasks for ${auditId}...`)

    // Save final audit status if needed or trigger specialist agents
    const businessData = {
      audit_id: auditId,
      business_name: results.businessName,
      website: results.website,
      industry: results.industry,
      scores: results.scores,
      raw_results: results // Full audit payload for the specialist to chew on
    };

    // Trigger Specialist Cluster for all key departments
    const categories = ['reputation', 'seo', 'conversion', 'content', 'paid_ads'];
    const WEBHOOK_URL = process.env.SEL_MASTER_AGENT_WEBHOOK || "https://selste.app.n8n.cloud/webhook/seleste-gbp-agent";
    
    await Promise.all(categories.map(async (category) => {
      try {
        console.log(`[Specialist] Triggering ${category} agent...`);
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...businessData,
            category,
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error(`[Specialist] Error triggering ${category} agent:`, error);
      }
    }));
    
    console.log(`[Orchestration] All specialists dispatched for Audit ${auditId}`);
  } catch (err) {
    console.error('[Background Jobs Error]', err)
  }
}
