"use client";

import Link from 'next/link';

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-dark-bg text-dark-text p-8 md:p-16 flex flex-col items-center">
            <div className="max-w-3xl w-full">
                <header className="mb-12 border-b border-dark-s3 pb-6">
                    <Link href="/" className="font-display font-bold text-xl text-white mb-6 inline-block hover:text-teal transition-colors">
                        ← Back to Seleste
                    </Link>
                    <h1 className="font-display text-4xl font-bold mb-4 text-white">Terms of Service & Data Policy</h1>
                    <p className="font-mono text-sm text-dim">Last Updated: March 2026</p>
                </header>

                <div className="prose prose-invert prose-teal max-w-none space-y-8 text-sm md:text-base text-dim leading-relaxed">

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
                        <p>
                            Welcome to Seleste ("we," "our," or "us"). By using our platform, digital audits, and agentic growth intelligence services, you agree to these Terms of Service. Seleste is an AI-driven platform designed to ingest marketing signals, provide strategic insights, and autonomously execute growth tasks for your business.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-teal mb-3">2. How We Collect and Use Your Data (The Seleste Intelligence System)</h2>
                        <p className="mb-3">
                            Seleste is built on continuous learning. In order to provide our core services, benchmarks, and AI recommendations, we collect and process specific technical and performance data regarding your business.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-3">
                            <li><strong>Business Profile & Audit Data:</strong> We collect the information you provide (industry, location, target audience) and the data we autonomously gather via our Digital Preparedness Audits (website performance, SEO metrics, conversion friction, and local search presence).</li>
                            <li><strong>Execution & Performance Telemetry:</strong> When our AI Agents execute tasks on your behalf, we track the actions taken and measure the subsequent outcomes (e.g., changes in keyword rankings or estimated traffic).</li>
                            <li><strong>Competitor Intelligence:</strong> We may analyze publicly available data regarding your local competitors to generate comparative benchmarks.</li>
                        </ul>
                        <p>
                            <strong>The AIMemoryBank:</strong> A core feature of Seleste is our aggregate learning model. We anonymize and aggregate performance data (e.g., "Implementing Schema X in the Plumbing industry led to a 15% increase in local maps visibility") to train our proprietary vector databases. <strong>We never share your specific PII, customer lists, or proprietary business secrets with competitors.</strong> We use aggregated, anonymized telemetry strictly to make our AI agents smarter and more effective for the entire Seleste network.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. AI-Generated Content and Autonomous Execution</h2>
                        <p>
                            Seleste utilizes advanced Large Language Models (LLMs) and autonomous agents. While we strive for absolute precision:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You acknowledge that AI-generated recommendations, copy, and code may occasionally contain errors or unexpected outputs.</li>
                            <li>When you "Deploy" a task, you authorize our AI to make changes to connected digital assets. You remain solely responsible for reviewing and approving high-risk changes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Proprietary Rights & Benchmarking</h2>
                        <p>
                            By using Seleste, you grant us a perpetual, irrevocable, royalty-free license to use your anonymized performance data to calculate industry benchmarks and train our internal machine learning models. The aggregated insights, algorithms, and AI models developed by Seleste remain our exclusive intellectual property.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Disclaimer of Warranties</h2>
                        <p>
                            Seleste provides insights and tools designed to improve your digital growth, but we do not guarantee specific financial results, search engine rankings, or conversion rates. The platform is provided "as is."
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
