import { NextResponse } from 'next/server';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { anthropic } from '@ai-sdk/anthropic';
import prisma from '../../../lib/prisma';
import { OPS_SYSTEM_PROMPT } from '../../../lib/agents/prompts';

export const maxDuration = 60;

export async function POST(req) {
    try {
        const { businessId, agentId, message, history, businessData, auditResults, marketingPlans } = await req.json();

        if (!businessId || !message) {
            return NextResponse.json({ error: 'Missing business ID or message' }, { status: 400 });
        }

        // Build a highly contextual system prompt that includes all their data dynamically
        const contextString = `
You are the Seleste ${agentId} agent ("Ops Orchestrator").
You are speaking directly with the business owner of: ${businessData?.businessName || 'the business'}.
Industry: ${businessData?.industry}
Website: ${businessData?.website || 'N/A'}

LATEST AUDIT SCORE: ${auditResults?.qualityScore || 'N/A'}/100
MAJOR BLOCKERS: ${(auditResults?.findings || []).slice(0, 3).map(f => f.title).join('; ')}

CURRENT 90-DAY PLAN:
${marketingPlans?.length > 0 ? marketingPlans.map(p => `[${p.phase}] ${p.tasks.join(', ')}`).join('\n') : 'Not generated yet. Recommend they generate it.'}

Your job is to act as a highly competent, autonomous Chief Operations Officer. You should answer their questions based *strictly* on the data provided above, give strategic advice, and help them execute the tasks in their roadmap. Do not use markdown headers (# or ##), keep your responses conversational, brief, and highly impactful.

CRITICAL INSTRUCTION: If the user asks you to do something, execute a task, or deploy an agent, YOU MUST USE THE deployTask TOOL to actually schedule it. Do not just say you will do it. USE THE TOOL.
`;

        // We use pure text streaming back to the client for the chat interface
        const result = await streamText({
            model: anthropic('claude-sonnet-4-6'),
            system: `${OPS_SYSTEM_PROMPT}\n\n${contextString}`,
            messages: [
                ...history.map(msg => ({ role: msg.role, content: msg.content })),
                { role: 'user', content: message }
            ],
            tools: {
                deployTask: tool({
                    description: 'Deploy a new task to one of the specialized agents. Use this immediately when the user agrees to start, execute, or deploy a task from their roadmap.',
                    parameters: z.object({
                        agent_type: z.enum(['SEO', 'PAID_MEDIA', 'CREATIVE', 'OFFER', 'SOCIAL', 'INTEL', 'DIRECTOR', 'OPS', 'ANALYTICS', 'SETUP', 'GA4', 'LOOP']).describe("The type of agent specialist needed for this task."),
                        action_description: z.string().describe("A concise, action-oriented description of what the agent needs to do.")
                    }),
                    execute: async ({ agent_type, action_description }) => {
                        const newTask = await prisma.agentTask.create({
                            data: {
                                business_id: businessId,
                                agent_type,
                                action_description,
                                status: 'QUEUED'
                            }
                        });

                        // Trigger the specialist agent asynchronously (fire and forget for now)
                        if (agent_type === 'SEO') {
                            fetch(`http://localhost:3000/api/agents/seo`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ taskId: newTask.id })
                            }).catch(console.error);
                        }

                        return { success: true, taskId: newTask.id, message: `Successfully deployed task to ${agent_type} agent: ${action_description}` };
                    }
                })
            },
            maxSteps: 5
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error('Chat Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
