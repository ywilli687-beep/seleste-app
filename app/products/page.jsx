import Link from 'next/link';
import { ArrowRight, CheckCircle2, Bot, LayoutTemplate, ShieldCheck, Zap, Key } from 'lucide-react';

export const metadata = {
    title: 'Products — Seleste | AI Growth OS',
    description: 'The complete suite of tools and autonomous marketing agents in the Seleste ecosystem.',
};

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-[#f4ebe1] text-[#111] font-serif selection:bg-[#2a7a6f] selection:text-white">

            {/* SECTION 1 — HERO */}
            <section className="pt-32 pb-32 bg-[#121212] relative overflow-hidden">
                <div className="max-w-[85rem] mx-auto px-8 relative z-10 text-center flex flex-col items-center">
                    <div className="inline-flex py-1.5 px-3 border border-[#333] rounded-sm text-[10px] font-mono tracking-[0.2em] text-[#888] uppercase mb-8">
                        Everything Seleste Does
                    </div>

                    <h1 className="font-serif text-5xl md:text-6xl lg:text-[5rem] font-bold mb-8 leading-[1.05] tracking-tight text-[#f4ebe1] max-w-4xl mx-auto">
                        One system. Every part of your <span className="text-[#00e5c7] italic font-normal">digital growth covered.</span>
                    </h1>

                    <p className="text-xl md:text-[22px] text-[#aaa] font-serif italic mb-0 leading-relaxed max-w-3xl mx-auto">
                        Seleste is built from the ground up for local service businesses. Every product in the Seleste suite connects to the others — so your audit informs your strategy, your strategy drives your agents, and your agents report back to your dashboard. Nothing operates in isolation.
                    </p>
                </div>
            </section>

            {/* SECTION 2 — CORE PLATFORM */}
            <section className="py-32 bg-[#f4ebe1] relative z-20 border-b border-[#222]/10">
                <div className="max-w-[85rem] mx-auto px-8">
                    <div className="mb-20 text-center">
                        <span className="font-mono text-[11px] font-bold text-[#2a7a6f] tracking-[0.25em] uppercase block mb-4">Core Platform</span>
                        <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6 text-[#111]">The foundation everything runs on.</h2>
                        <p className="text-[#555] font-serif text-xl italic">These are the core products every Seleste customer gets access to — regardless of plan.</p>
                    </div>

                    <div className="flex flex-col gap-12 max-w-5xl mx-auto">

                        {/* 1. Digital Presence Audit */}
                        <div className="bg-white border-[2px] border-[#111] p-10 md:p-14 shadow-[8px_8px_0px_#111] flex flex-col md:flex-row gap-10">
                            <div className="md:w-1/3 flex flex-col items-start">
                                <span className="text-4xl mb-4">🔍</span>
                                <h3 className="font-sans font-bold text-2xl mb-2 text-[#111]">Digital Presence Audit</h3>
                                <span className="px-3 py-1 bg-[#111] text-[#f4ebe1] text-[9px] font-mono uppercase tracking-widest font-bold">All Plans</span>
                            </div>
                            <div className="md:w-2/3">
                                <p className="font-sans text-lg font-bold text-[#2a7a6f] mb-4">A complete picture of where your business stands online — scored, ranked, and explained in plain English.</p>
                                <p className="font-serif text-[#555] text-[16px] leading-[1.8] mb-6">
                                    Seleste's audit engine scans your entire digital presence across six domains and produces a Quality Score from 0 to 100. It runs automatically every week, tracks your score over time, and alerts you immediately when something drops.
                                </p>
                                <div className="mb-6">
                                    <strong className="font-sans text-[#111] text-sm block mb-3 uppercase tracking-widest">The six domains scored:</strong>
                                    <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-4 font-mono text-xs text-[#555]">
                                        <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-[#2a7a6f] shrink-0" /> Website SEO & Technical Health</li>
                                        <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-[#2a7a6f] shrink-0" /> Conversion Likelihood (UX, trust)</li>
                                        <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-[#2a7a6f] shrink-0" /> Local SEO & Google Business Profile</li>
                                        <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-[#2a7a6f] shrink-0" /> Tracking Readiness</li>
                                        <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-[#2a7a6f] shrink-0" /> Competitor Positioning</li>
                                        <li className="flex gap-2 items-start"><CheckCircle2 size={16} className="text-[#2a7a6f] shrink-0" /> Paid Media Readiness</li>
                                    </ul>
                                </div>
                                <p className="font-serif text-[#555] text-[15px] leading-[1.8] bg-[#fdfaf6] p-4 border-l-2 border-[#2a7a6f]">
                                    <strong className="text-[#111]">What makes it different:</strong> Every finding is translated into business impact — not technical jargon. "Your LCP is failing" becomes "your site loads 3 seconds slower than your top competitor, which is costing you calls." Every issue is ranked by priority and effort, so you always know what to fix first.
                                </p>
                            </div>
                        </div>

                        {/* 2. 90-Day Growth Roadmap */}
                        <div className="bg-white border-[2px] border-[#111] p-10 md:p-14 shadow-[8px_8px_0px_#111] flex flex-col md:flex-row gap-10">
                            <div className="md:w-1/3 flex flex-col items-start">
                                <span className="text-4xl mb-4">🗺️</span>
                                <h3 className="font-sans font-bold text-2xl mb-2 text-[#111]">90-Day Growth Roadmap</h3>
                                <span className="px-3 py-1 bg-[#111] text-[#f4ebe1] text-[9px] font-mono uppercase tracking-widest font-bold">All Plans</span>
                            </div>
                            <div className="md:w-2/3">
                                <p className="font-sans text-lg font-bold text-[#2a7a6f] mb-4">A personalised plan from Day 1 — built from your audit, your goals, and your budget.</p>
                                <p className="font-serif text-[#555] text-[16px] leading-[1.8] mb-6">
                                    After your first audit, Seleste generates a prioritised 90-day roadmap specific to your business. It identifies the highest-impact actions across the six audit domains, sequences them by effort and return, and maps them against your revenue goal and monthly budget. The roadmap is a live document — it updates as your score improves, as agents complete actions, and as new opportunities are identified.
                                </p>
                                <p className="font-serif text-[#555] text-[15px] leading-[1.8] bg-[#fdfaf6] p-4 border-l-2 border-[#2a7a6f]">
                                    <strong className="text-[#111] block mb-2">What it includes:</strong>
                                    Foundation actions (fix what's broken first) · Visibility actions (improve rankings and local presence) · Conversion actions (turn more visitors into calls) · Acquisition actions (paid media readiness and launch) · Retention and scale actions (for Grow and above)
                                </p>
                            </div>
                        </div>

                        {/* 3. Approval Queue & Dashboard */}
                        <div className="bg-white border-[2px] border-[#111] p-10 md:p-14 shadow-[8px_8px_0px_#111] flex flex-col md:flex-row gap-10">
                            <div className="md:w-1/3 flex flex-col items-start">
                                <span className="text-4xl mb-4">✅</span>
                                <h3 className="font-sans font-bold text-2xl mb-2 text-[#111]">Approval Queue & Dashboard</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-[#111] text-[#f4ebe1] text-[9px] font-mono uppercase tracking-widest font-bold">All Plans</span>
                                </div>
                            </div>
                            <div className="md:w-2/3">
                                <p className="font-sans text-lg font-bold text-[#2a7a6f] mb-4">Every significant action, surfaced for your review before it goes live.</p>
                                <p className="font-serif text-[#555] text-[16px] leading-[1.8] mb-6">
                                    The Approval Queue is where Seleste agents bring their completed work for your sign-off. New campaign drafts, copy variations, budget reallocation requests, landing page changes — all presented with context, rationale, and a single clear action for you to take. The Dashboard gives you a live view of your Quality Score, active agents, pending approvals, recent actions taken, and performance by channel.
                                </p>
                                <p className="font-serif text-[#555] text-[15px] leading-[1.8] bg-[#fdfaf6] p-4 border-l-2 border-[#2a7a6f]">
                                    <strong className="text-[#111]">The principle:</strong> Seleste handles the work. You make the calls that matter. The approval queue is the line between the two. <br /><span className="text-xs italic mt-2 block opacity-70">(Diagnose gets read-only Orchestrator view; Grow and above get full approval workflow)</span>
                                </p>
                            </div>
                        </div>

                        {/* 4. Living Memory Bank */}
                        <div className="bg-white border-[2px] border-[#111] p-10 md:p-14 shadow-[8px_8px_0px_#111] flex flex-col md:flex-row gap-10">
                            <div className="md:w-1/3 flex flex-col items-start">
                                <span className="text-4xl mb-4">🧠</span>
                                <h3 className="font-sans font-bold text-2xl mb-2 text-[#111]">Living Memory Bank</h3>
                                <span className="px-3 py-1 bg-[#111] text-[#f4ebe1] text-[9px] font-mono uppercase tracking-widest font-bold">All Plans</span>
                            </div>
                            <div className="md:w-2/3">
                                <p className="font-sans text-lg font-bold text-[#2a7a6f] mb-4">The system that learns your business — so it never asks you the same thing twice.</p>
                                <p className="font-serif text-[#555] text-[16px] leading-[1.8] mb-6">
                                    Every Seleste customer has a Living Memory Bank — a continuously updated profile of their business that all agents read from and write to. It starts with what you tell Seleste at onboarding and grows with every audit, every campaign, every approved or declined action.
                                </p>
                                <div className="space-y-4 font-serif text-[#555] text-[15px] leading-[1.8] bg-[#fdfaf6] p-6 border-l-2 border-[#2a7a6f]">
                                    <p><strong className="text-[#111]">Static (set at onboarding):</strong> business name, service area, industry, core services, monthly budget, average job value, revenue goal, known competitors.</p>
                                    <p><strong className="text-[#111]">Dynamic (updated continuously):</strong> brand voice and tone, winning ad hooks, rejected copy and why, channel performance history, seasonal demand peaks, declined opportunities, approval patterns, Quality Score history.</p>
                                    <p className="border-t border-[#222]/10 pt-4 mt-4 text-[#111] font-bold">Why it matters: Most marketing tools start from zero every time. Seleste compounds. The longer it runs, the more precisely it knows what works for your business.</p>
                                </div>
                            </div>
                        </div>

                        {/* 5. Onboarding Flow */}
                        <div className="bg-white border-[2px] border-[#111] p-10 md:p-14 shadow-[8px_8px_0px_#111] flex flex-col md:flex-row gap-10">
                            <div className="md:w-1/3 flex flex-col items-start">
                                <span className="text-4xl mb-4">🚀</span>
                                <h3 className="font-sans font-bold text-2xl mb-2 text-[#111]">Onboarding Flow</h3>
                                <span className="px-3 py-1 bg-[#111] text-[#f4ebe1] text-[9px] font-mono uppercase tracking-widest font-bold">All Plans</span>
                            </div>
                            <div className="md:w-2/3">
                                <p className="font-sans text-lg font-bold text-[#2a7a6f] mb-4">Connected and audited in under 10 minutes.</p>
                                <p className="font-serif text-[#555] text-[16px] leading-[1.8] mb-6">
                                    Seleste's onboarding flow connects all your data sources — website, Google Business Profile, Google Analytics, Search Console, and ad accounts — and runs your first audit automatically. No technical knowledge required.
                                </p>
                                <p className="font-serif text-[#555] text-[15px] leading-[1.8] bg-[#fdfaf6] p-4 border-l-2 border-[#2a7a6f]">
                                    <strong className="text-[#111] block mb-2">What happens on Day 1:</strong> Accounts connected (guided step-by-step) · First audit triggered automatically · Quality Score delivered within 24 hours · 90-Day Roadmap generated · Agents activated based on your plan.
                                </p>
                                <span className="text-xs font-mono text-[#777] mt-4 block">(Fast-Track Onboarding add-on available for white-glove setup)</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 3 — THE AI AGENTS */}
            <section className="py-32 bg-[#fffcf8] relative z-20 border-b border-[#222]/10">
                <div className="max-w-[85rem] mx-auto px-8">
                    <div className="mb-20 text-center">
                        <span className="font-mono text-[11px] font-bold text-[#d97706] tracking-[0.25em] uppercase block mb-4">The AI Agents</span>
                        <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6 text-[#111]">Five specialists running in the background. <span className="italic font-serif text-[#d97706] tracking-normal mb-8 leading-[1.05]">Always.</span></h2>
                        <p className="text-[#555] font-serif text-xl italic max-w-3xl mx-auto">
                            Each agent is purpose-built for a specific job. They communicate with each other, brief downstream agents, and escalate to your approval queue when a decision requires your input. Which agents are active depends on your plan.
                        </p>
                    </div>

                    <div className="flex flex-col gap-24 max-w-6xl mx-auto">

                        {/* 1. AUDIT AGENT */}
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                                <div className="w-full aspect-square max-h-[400px] border-[2px] border-[#111] bg-[#f4ebe1] p-12 flex flex-col items-center justify-center text-center shadow-[8px_8px_0px_#111] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#00e5c7]/10 rounded-full blur-3xl" />
                                    <span className="text-7xl mb-6 relative z-10">🔍</span>
                                    <h4 className="font-mono text-2xl font-bold tracking-widest uppercase text-[#111] relative z-10">Audit Agent</h4>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1 bg-[#111] text-[#fffcf8] text-[9px] font-mono tracking-widest uppercase font-bold">Autonomous</span>
                                    <span className="px-3 py-1 border border-[#ccc] text-[#555] text-[9px] font-mono tracking-widest uppercase font-bold">All Plans</span>
                                </div>
                                <h3 className="font-sans text-3xl font-bold mb-4 text-[#111]">Audit Agent</h3>
                                <p className="font-sans text-xl font-bold text-[#00e5c7] mb-6 drop-shadow-sm">Your digital health check. Every week. Without fail.</p>
                                <p className="font-serif text-[#555] text-[17px] leading-[1.8] mb-6">
                                    Every Monday at 6am, the Audit Agent runs a complete scan of your digital presence. It pulls data from Google Search Console, Google Analytics, PageSpeed, and your Google Business Profile — scores six domains — and compares results against last week's. If your Quality Score drops by 5 or more points, you get an immediate alert with a plain-English explanation of what changed. If something can be fixed automatically, it fixes it. If it needs your input, it goes to your approval queue.
                                </p>
                                <p className="font-serif text-[#555] text-[17px] leading-[1.8] mb-6">
                                    It also feeds every other agent — its findings are what the Opportunity Agent uses to identify gaps, what the Campaign Agent uses to assess paid readiness, and what the Creative Agent uses to flag underperforming landing pages.
                                </p>
                                <div className="bg-[#f0f9f8] p-5 border-l-4 border-[#00e5c7]">
                                    <h5 className="font-mono text-[10px] font-bold text-[#111] tracking-widest uppercase mb-3">Execution Triggers</h5>
                                    <ul className="text-sm font-sans text-[#555] space-y-2">
                                        <li><strong>Weekly:</strong> Every Monday at 6am</li>
                                        <li><strong>On-demand:</strong> When Orchestrator flags an anomaly</li>
                                        <li><strong>Manually:</strong> Via dashboard at any time</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 2. OPPORTUNITY AGENT - FLIPPED */}
                        <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
                            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                                <div className="w-full aspect-square max-h-[400px] border-[2px] border-[#111] bg-[#f4ebe1] p-12 flex flex-col items-center justify-center text-center shadow-[8px_8px_0px_#111] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#d97706]/10 rounded-full blur-3xl" />
                                    <span className="text-7xl mb-6 relative z-10">🎯</span>
                                    <h4 className="font-mono text-2xl font-bold tracking-widest uppercase text-[#111] relative z-10">Opportunity Agent</h4>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1 bg-[#111] text-[#fffcf8] text-[9px] font-mono tracking-widest uppercase font-bold">Advisory</span>
                                    <span className="px-3 py-1 border border-[#ccc] text-[#555] text-[9px] font-mono tracking-widest uppercase font-bold">All Plans</span>
                                </div>
                                <h3 className="font-sans text-3xl font-bold mb-4 text-[#111]">Opportunity Agent</h3>
                                <p className="font-sans text-xl font-bold text-[#d97706] mb-6 drop-shadow-sm">Spots what your business should be doing before you think to ask.</p>
                                <p className="font-serif text-[#555] text-[17px] leading-[1.8] mb-6">
                                    Every Wednesday, the Opportunity Agent scans across four opportunity types: keyword gaps (searches you almost rank for), seasonal demand windows (what's about to peak in your industry), competitor weaknesses (where rivals have dropped off), and channel gaps (platforms your industry converts on that you're not using).
                                </p>
                                <p className="font-serif text-[#555] text-[17px] leading-[1.8] mb-6">
                                    Every opportunity comes pre-packaged: what it is, why it exists right now, estimated monthly value, confidence level, and exactly what action captures it. Where the action needs another agent, the brief is prepared and waiting. It never resurfaces an opportunity you've already declined — it remembers every decision.
                                </p>
                                <div className="bg-[#fff8f0] p-5 border-l-4 border-[#d97706]">
                                    <h5 className="font-mono text-[10px] font-bold text-[#111] tracking-widest uppercase mb-3">Execution Triggers</h5>
                                    <ul className="text-sm font-sans text-[#555] space-y-2">
                                        <li><strong>Weekly:</strong> Every Wednesday at 7am</li>
                                        <li><strong>On-demand:</strong> When Audit Agent flags a significant score change</li>
                                        <li><strong>Event-based:</strong> When a known competitor drops from top 3 local rankings</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 3. CAMPAIGN AGENT */}
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="w-full lg:w-1/2 flex justify-center lg:justify-start relative">
                                {/* Lock Badge Overlay */}
                                <div className="absolute -top-4 -left-4 z-30 bg-[#111] text-white px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest shadow-xl flex items-center gap-2">
                                    <Key size={14} className="text-[#00e5c7]" /> Unlocks on Grow
                                </div>
                                <div className="w-full aspect-square max-h-[400px] border-[2px] border-[#111] bg-[#f4ebe1] p-12 flex flex-col items-center justify-center text-center shadow-[8px_8px_0px_#111] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#9333ea]/10 rounded-full blur-3xl" />
                                    <span className="text-7xl mb-6 relative z-10">📡</span>
                                    <h4 className="font-mono text-2xl font-bold tracking-widest uppercase text-[#111] relative z-10">Campaign Agent</h4>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1 bg-[#111] text-[#fffcf8] text-[9px] font-mono tracking-widest uppercase font-bold">Semi-Autonomous</span>
                                    <span className="px-3 py-1 border-[2px] border-[#00e5c7] text-[#111] text-[9px] font-mono tracking-[0.2em] uppercase font-bold">Grow +</span>
                                </div>
                                <h3 className="font-sans text-3xl font-bold mb-4 text-[#111]">Campaign Agent</h3>
                                <p className="font-sans text-xl font-bold text-[#9333ea] mb-6 drop-shadow-sm">Launches, manages, and optimises your Google and Meta campaigns.</p>
                                <p className="font-serif text-[#555] text-[17px] leading-[1.8] mb-4">
                                    When the Opportunity Agent identifies a gap worth acting on, the Campaign Agent drafts the full campaign response — ad sets, targeting, match types, bid strategy — and brings it to your approval queue. You approve. It launches.
                                </p>
                                <p className="font-serif text-[#555] text-[17px] leading-[1.8] mb-6">
                                    Once campaigns are live, it monitors daily. Underperforming ad sets get paused automatically after 14 days below the performance floor. Bid adjustments happen within ±20% without approval. Budget reallocation above 25% requires your sign-off. Your monthly spend cap is a hard ceiling nothing can override. New channels require explicit approval. Every action is logged.
                                </p>
                                <div className="grid grid-cols-2 gap-4 mb-6 text-sm font-sans">
                                    <div className="bg-white border border-[#ccc] p-4">
                                        <strong className="block text-[#111] mb-2 font-mono text-[10px] uppercase">Handles Automatically</strong>
                                        <ul className="text-[#555] space-y-1 list-disc pl-4 text-xs">
                                            <li>Bid adjustments within ±20% </li>
                                            <li>Pausing failing ads after 14 days</li>
                                            <li>Keyword match type tweaks</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white border border-[#ccc] p-4">
                                        <strong className="block text-[#111] mb-2 font-mono text-[10px] uppercase">Needs Your Approval</strong>
                                        <ul className="text-[#555] space-y-1 list-disc pl-4 text-xs">
                                            <li>New campaign creation</li>
                                            <li>New channels or audiences</li>
                                            <li>Budget shifts above 25%</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-[#f5eeff] p-5 border-l-4 border-[#9333ea]">
                                    <h5 className="font-mono text-[10px] font-bold text-[#111] tracking-widest uppercase mb-3">Execution Triggers</h5>
                                    <ul className="text-sm font-sans text-[#555] space-y-2">
                                        <li>Opportunity Agent brief received</li>
                                        <li>ROAS drops below floor</li>
                                        <li>New creative variant approved</li>
                                        <li>Budget Agent flags reallocation</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 4. BUDGET AGENT - FLIPPED */}
                        <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
                            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
                                <div className="absolute -top-4 -right-4 lg:-left-4 lg:-right-auto z-30 bg-[#111] text-white px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest shadow-xl flex items-center gap-2">
                                    <Key size={14} className="text-[#00e5c7]" /> Unlocks on Grow
                                </div>
                                <div className="w-full aspect-square max-h-[400px] border-[2px] border-[#111] bg-[#f4ebe1] p-12 flex flex-col items-center justify-center text-center shadow-[8px_8px_0px_#111] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#c64e32]/10 rounded-full blur-3xl" />
                                    <span className="text-7xl mb-6 relative z-10">💰</span>
                                    <h4 className="font-mono text-2xl font-bold tracking-widest uppercase text-[#111] relative z-10">Budget Agent</h4>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1 bg-[#111] text-[#fffcf8] text-[9px] font-mono tracking-widest uppercase font-bold">Autonomous</span>
                                    <span className="px-3 py-1 border-[2px] border-[#00e5c7] text-[#111] text-[9px] font-mono tracking-[0.2em] uppercase font-bold">Grow +</span>
                                </div>
                                <h3 className="font-sans text-3xl font-bold mb-4 text-[#111]">Budget Agent</h3>
                                <p className="font-sans text-xl font-bold text-[#c64e32] mb-6 drop-shadow-sm">Your ad spend, watched daily — so you don't have to.</p>
                                <p className="font-serif text-[#555] text-[17px] leading-[1.8] mb-6">
                                    Every morning at 6am, the Budget Agent checks pacing across channels, ROAS by campaign, and variance from the 7-day rolling average. If one channel is outperforming and another isn't, it rebalances within your approved limits.
                                </p>
                                <p className="font-serif text-[#555] text-[17px] leading-[1.8] mb-6">
                                    If spend hits 80% of your monthly cap, it alerts you. At 100%, campaigns hard-pause with no exceptions. Every rebalancing action above 25% of a channel's budget requires your approval.
                                </p>
                                <div className="bg-[#fdf0ed] p-5 border-l-4 border-[#c64e32]">
                                    <h5 className="font-mono text-[10px] font-bold text-[#111] tracking-widest uppercase mb-3">Execution Triggers</h5>
                                    <ul className="text-sm font-sans text-[#555] space-y-2">
                                        <li><strong>Daily:</strong> 6am every day</li>
                                        <li>ROAS variance greater than 15% from 7-day average</li>
                                        <li>Spend reaches 80% or 100% of monthly cap</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 5. CREATIVE AGENT */}
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="w-full lg:w-1/2 flex justify-center lg:justify-start relative">
                                <div className="absolute -top-4 -left-4 z-30 bg-[#111] text-white px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest shadow-xl flex items-center gap-2">
                                    <Key size={14} className="text-[#3b82f6]" /> Unlocks on Dominate
                                </div>
                                <div className="w-full aspect-square max-h-[400px] border-[2px] border-[#111] bg-[#f4ebe1] p-12 flex flex-col items-center justify-center text-center shadow-[8px_8px_0px_#111] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#3b82f6]/10 rounded-full blur-3xl" />
                                    <span className="text-7xl mb-6 relative z-10">🎨</span>
                                    <h4 className="font-mono text-2xl font-bold tracking-widest uppercase text-[#111] relative z-10">Creative Agent</h4>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-3 py-1 bg-[#111] text-[#fffcf8] text-[9px] font-mono tracking-widest uppercase font-bold">Semi-Autonomous</span>
                                    <span className="px-3 py-1 border-[2px] border-[#3b82f6] text-[#111] text-[9px] font-mono tracking-[0.2em] uppercase font-bold">Dominate +</span>
                                </div>
                                <h3 className="font-sans text-3xl font-bold mb-4 text-[#111]">Creative Agent</h3>
                                <p className="font-sans text-xl font-bold text-[#3b82f6] mb-6 drop-shadow-sm">Writes your ads, tests what converts, and gets better every time.</p>
                                <p className="font-serif text-[#555] text-[17px] leading-[1.8] mb-6">
                                    The Creative Agent generates ad copy — headlines, descriptions, calls to action — trained on your brand voice, service area, industry, and the specific campaign it's supporting. Every piece comes to your approval queue before going anywhere near a live platform. Once approved, it runs A/B tests automatically — retiring underperformers after 14 days, scaling winners. It maintains a brand voice library that updates with every approved and rejected piece.
                                </p>
                                <p className="font-serif text-[#555] text-[17px] leading-[1.8] mb-6">
                                    It also monitors landing pages. If a page is underperforming against conversion benchmarks for your industry, it drafts an improved version and brings it to you with the supporting data. <strong className="text-[#111]">One absolute rule: nothing is published to a live platform without your explicit approval.</strong>
                                </p>
                                <div className="bg-[#eff6ff] p-5 border-l-4 border-[#3b82f6]">
                                    <h5 className="font-mono text-[10px] font-bold text-[#111] tracking-widest uppercase mb-3">Execution Triggers</h5>
                                    <ul className="text-sm font-sans text-[#555] space-y-2">
                                        <li>New campaign launched</li>
                                        <li>CTR drops below floor for 14+ days</li>
                                        <li>Seasonal demand signal from Opportunity Agent</li>
                                        <li>Underperforming landing page detected by Audit Agent</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 4 — PLANS */}
            <section className="py-32 bg-[#121212] relative z-20">
                <div className="max-w-[85rem] mx-auto px-8">
                    <div className="mb-20">
                        <span className="font-mono text-[11px] font-bold text-[#00e5c7] tracking-[0.25em] uppercase block mb-4">Plans</span>
                        <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6 text-[#f4ebe1]">Everything above is bundled into four plans.</h2>
                        <p className="text-[#aaa] font-serif text-xl italic max-w-3xl">Each plan is built for a specific stage of business growth. Start where you are.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {/* Diagnose */}
                        <div className="border border-[#333] p-8 flex flex-col bg-[#1a1a1a]">
                            <h3 className="font-sans text-2xl font-bold text-white mb-2">Diagnose</h3>
                            <div className="font-mono text-xl text-[#00e5c7] mb-6">$97<span className="text-sm text-[#777]">/mo</span></div>
                            <p className="text-[#aaa] text-sm leading-relaxed mb-8 flex-1">
                                Audit Agent + Opportunity Agent. Weekly audit, Quality Score, 90-day roadmap, opportunity alerts.
                            </p>
                        </div>

                        {/* Grow */}
                        <div className="border-2 border-[#teal] p-8 flex flex-col bg-[#111] relative shadow-[0_0_30px_rgba(42,122,111,0.2)]">
                            <div className="absolute -top-3 left-8 bg-[#2a7a6f] text-white text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1">Most Popular</div>
                            <h3 className="font-sans text-2xl font-bold text-white mb-2">Grow</h3>
                            <div className="font-mono text-xl text-[#2a7a6f] mb-6">$297<span className="text-sm text-[#777]">/mo</span></div>
                            <p className="text-[#ccc] text-sm leading-relaxed mb-8 flex-1">
                                Adds Campaign Agent + Budget Agent. Full ad execution, budget automation, approval dashboard.
                            </p>
                        </div>

                        {/* Dominate */}
                        <div className="border border-[#333] p-8 flex flex-col bg-[#1a1a1a]">
                            <h3 className="font-sans text-2xl font-bold text-white mb-2">Dominate</h3>
                            <div className="font-mono text-xl text-white mb-6">$597<span className="text-sm text-[#777]">/mo</span></div>
                            <p className="text-[#aaa] text-sm leading-relaxed mb-8 flex-1">
                                Adds Creative Agent. All 5 agents active. AI creative, A/B testing, full autonomous operation.
                            </p>
                        </div>

                        {/* Agency */}
                        <div className="border border-[#333] p-8 flex flex-col bg-[#1a1a1a]">
                            <h3 className="font-sans text-2xl font-bold text-white mb-2">Agency</h3>
                            <div className="font-mono text-xl text-[#777] mb-6">From $1,497<span className="text-sm text-[#555]">/mo</span></div>
                            <p className="text-[#aaa] text-sm leading-relaxed mb-8 flex-1">
                                All 5 agents, white-label, multi-client dashboard, API access, dedicated success manager.
                            </p>
                        </div>
                    </div>

                    <div className="text-left">
                        <Link href="/#pricing" className="inline-flex items-center gap-2 text-[#00e5c7] font-mono text-xs uppercase tracking-widest hover:text-white transition-colors pb-1 border-b border-[#00e5c7] hover:border-white">
                            See full pricing and what's included <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION 5 — ADD-ONS */}
            <section className="py-32 bg-[#f4ebe1] relative z-20">
                <div className="max-w-[85rem] mx-auto px-8">
                    <div className="mb-16">
                        <span className="font-mono text-[11px] font-bold text-[#2a7a6f] tracking-[0.25em] uppercase block mb-4">Add-Ons</span>
                        <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6 text-[#111]">Bolt on what you need.</h2>
                        <p className="text-[#555] font-serif text-xl italic max-w-3xl">Available on any plan. Add or remove as your business scales.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Add-on 1 */}
                        <div className="bg-white border-[2px] border-[#111] p-10 flex flex-col shadow-[4px_4px_0px_#111]">
                            <span className="text-3xl mb-4">🚀</span>
                            <h3 className="font-sans text-xl font-bold text-[#111] mb-2">Fast-Track Onboarding</h3>
                            <div className="font-mono text-sm text-[#2a7a6f] mb-6 font-bold">$299 one-time</div>
                            <p className="text-[#555] font-serif leading-relaxed mb-6 flex-1">
                                White-glove setup from the Seleste team. We configure all integrations, run your first audit, and walk you through your 90-day plan on a 60-minute live call.
                            </p>
                            <div className="pt-6 border-t border-[#eee]">
                                <span className="font-mono text-[10px] uppercase font-bold text-[#111] tracking-widest block mb-2">Best For:</span>
                                <span className="text-sm font-serif text-[#777]">Businesses that want to skip the setup and go straight to results.</span>
                            </div>
                        </div>

                        {/* Add-on 2 */}
                        <div className="bg-white border-[2px] border-[#111] p-10 flex flex-col shadow-[4px_4px_0px_#111]">
                            <span className="text-3xl mb-4">📣</span>
                            <h3 className="font-sans text-xl font-bold text-[#111] mb-2">Ad Management Fee</h3>
                            <div className="font-mono text-sm text-[#2a7a6f] mb-6 font-bold">12% of monthly ad spend</div>
                            <p className="text-[#555] font-serif leading-relaxed mb-6 flex-1">
                                Seleste takes full responsibility for your ad budget — planning, execution, optimisation, and reporting. Requires Grow tier or above. Minimum $200/month ad spend.
                            </p>
                            <div className="pt-6 border-t border-[#eee]">
                                <span className="font-mono text-[10px] uppercase font-bold text-[#111] tracking-widest block mb-2">Best For:</span>
                                <span className="text-sm font-serif text-[#777]">Businesses that want hands-off ad management without hiring an agency.</span>
                            </div>
                        </div>

                        {/* Add-on 3 */}
                        <div className="bg-white border-[2px] border-[#111] p-10 flex flex-col shadow-[4px_4px_0px_#111]">
                            <span className="text-3xl mb-4">📊</span>
                            <h3 className="font-sans text-xl font-bold text-[#111] mb-2">Stakeholder Report Pack</h3>
                            <div className="font-mono text-sm text-[#2a7a6f] mb-6 font-bold">$49/month</div>
                            <p className="text-[#555] font-serif leading-relaxed mb-6 flex-1">
                                Monthly branded PDF reports formatted for sharing with partners, investors, or franchise networks. Includes before/after Quality Score, ROI summary, and 30-day forward plan.
                            </p>
                            <div className="pt-6 border-t border-[#eee]">
                                <span className="font-mono text-[10px] uppercase font-bold text-[#111] tracking-widest block mb-2">Best For:</span>
                                <span className="text-sm font-serif text-[#777]">Multi-owner businesses, franchises, or anyone proving results to someone else.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6 — CLOSING CTA */}
            <section className="py-32 bg-[#121212] relative z-20 text-center border-t-8 border-[#2a7a6f]">
                <div className="max-w-[85rem] mx-auto px-8">
                    <h2 className="font-serif text-5xl md:text-6xl font-bold mb-8 leading-[1.1] tracking-tight text-[#f4ebe1] max-w-4xl mx-auto">
                        Everything your business needs to grow online. <span className="text-[#00e5c7] italic font-normal">In one system.</span>
                    </h2>

                    <p className="text-[#aaa] font-serif text-xl italic max-w-2xl mx-auto mb-12">
                        Start with what you need today. Add more when you're ready. Every product in the Seleste suite is designed to work harder the longer it runs.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <Link
                            href="/#pricing"
                            className="w-full sm:w-auto px-10 py-5 bg-[#00e5c7] text-[#111] font-bold font-mono text-[13px] tracking-widest uppercase transition-colors hover:bg-white text-center flex justify-center items-center h-16"
                        >
                            See Plans & Pricing
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-10 py-5 bg-transparent border-2 border-[#fff] text-[#fff] font-bold font-mono text-[13px] tracking-widest uppercase hover:bg-[#fff] hover:text-[#111] transition-all text-center flex justify-center items-center h-16"
                        >
                            Book a walkthrough
                        </Link>
                    </div>

                    <p className="text-[#555] font-mono text-[10px] tracking-widest uppercase">
                        No long-term contract. Cancel any time. Setup in under 10 minutes.
                    </p>
                </div>
            </section>

        </div>
    );
}
