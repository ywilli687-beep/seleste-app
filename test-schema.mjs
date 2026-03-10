import fs from 'fs';
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { auditSchema } from './lib/agents/schemas.js';

const envFile = fs.readFileSync('.env', 'utf-8');
const keyMatch = envFile.match(/ANTHROPIC_API_KEY="?([^"\n]+)"?/);
if (keyMatch) {
    process.env.ANTHROPIC_API_KEY = keyMatch[1];
}

async function main() {
    try {
        const anthropic = createAnthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
        const model = anthropic('claude-sonnet-4-6');
        console.log("Model setup:", model.modelId);

        console.log("Generating with schema...");
        const { object } = await generateObject({
            model,
            schema: auditSchema,
            prompt: 'Generate a fake local business audit for Acme Plumbing in Austin, TX. Revenue is $10k/mo.',
        });
        console.log("Success! Generated Object:", JSON.stringify(object, null, 2));
    } catch (err) {
        console.error("SDK Error details:");
        console.error("Name:", err.name);
        console.error("Message:", err.message);
    }
}
main();
