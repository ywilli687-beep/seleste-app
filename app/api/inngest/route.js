import { serve } from "inngest/next";
import { inngest } from "../../../lib/inngest/client";

// MOCK AGENT JOB: Example of an SEO background agent that can run for 5+ minutes
const draftSeoPost = inngest.createFunction(
    { id: "draft-seo-post" },
    { event: "app/agent.draft_seo_post" },
    async ({ event, step }) => {
        const { businessId, industry } = event.data;

        // 1. Pretend to crawl rankings (takes 30s)
        await step.sleep("crawl-rankings", "30s");

        // 2. Draft content
        const postDraft = `Here is a drafted SEO post for ${industry}...`;

        // 3. Save to database as "Awaiting Approval"
        // await prisma.agentTask.create(...)

        return { success: true, postDraft };
    }
);

// MOCK AGENT JOB: Competitor analysis
const analyzeCompetitor = inngest.createFunction(
    { id: "analyze-competitor" },
    { event: "app/agent.analyze_competitor" },
    async ({ event, step }) => {
        await step.sleep("scrape-competitor", "1m");
        return { success: true, insight: "Competitor just lowered prices by 10%" };
    }
);

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [draftSeoPost, analyzeCompetitor],
});
