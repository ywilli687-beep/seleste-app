import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X, Search, Zap, Rocket, PieChart, PenTool, ShieldCheck } from 'lucide-react';
export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-[#f4ebe1] text-[#111] font-sans selection:bg-[#2a7a6f] selection:text-white pb-32">

            {/* SECTION 1 — HERO */}
            <section className="bg-[#111] text-[#f4ebe1] pt-32 pb-32 px-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#2a7a6f]/10 blur-[150px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-[#2a7a6f]/5 blur-[120px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <span className="font-mono text-[11px] font-bold text-[#2a7a6f] tracking-[0.25em] uppercase mb-6 block">
                        How Seleste Works
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight font-bold mb-8 text-[#fff]">
                        Every great strategy begins with<br />
                        <span className="font-serif italic text-[#2a7a6f] font-normal tracking-normal">a brutally honest audit.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#aaa] font-serif leading-[1.6] max-w-3xl mx-auto mb-12">
                        Before Seleste launches campaigns or optimises budgets, it runs a deep diagnostic on your digital health. It shows you exactly where you're losing customers to competitors &mdash; and then acts as your AI marketing team to fix it.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 bg-[#2a7a6f] text-white font-mono text-[11px] font-bold tracking-widest uppercase hover:bg-white hover:text-[#111] transition-colors">
                            Get Your First Audit
                        </Link>
                        <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#333] text-[#f4ebe1] font-mono text-[11px] font-bold tracking-widest uppercase hover:border-[#f4ebe1] transition-colors">
                            Book a Walkthrough
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION 2 — THE COST OF BLIND MARKETING */}
            <section className="py-32 px-8 max-w-[85rem] mx-auto border-b border-[#222]/10">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
                    <div className="lg:col-span-5">
                        <span className="font-mono text-[10px] text-[#eab308] tracking-[0.2em] font-bold uppercase mb-4 flex items-center gap-2"><Zap size={10} /> The Cost of Blind Marketing</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.1] mb-6 tracking-tight text-[#111]">
                            You're likely bleeding money before your ads even run.
                        </h2>
                    </div>
                    <div className="lg:col-span-7">
                        <p className="font-sans text-[17px] text-[#555] leading-[1.8] mb-6">
                            You don't build a house on a cracked foundation. Yet 90% of local businesses pour cash into Google Ads, SEO, and social managers without knowing if their digital foundation is actually capable of converting website visitors into paying customers.
                        </p>
                        <p className="font-sans text-[17px] text-[#555] leading-[1.8] mb-10">
                            If your website loads 3 seconds slower than a competitor's, you instantly lose <strong className="text-[#111]">40% of your traffic</strong>. If your Google Business Profile is missing key categories, you're literally invisible in the local map pack. Throwing money at marketing without diagnosing these underlying leaks is like pumping expensive water into a broken bucket.
                        </p>
                        <p className="font-serif text-2xl font-bold text-[#111] italic mb-10 border-l-4 border-[#2a7a6f] pl-6 py-2">
                            A brutally honest audit is the only way to plug the holes. Here's why you can't afford to skip it:
                        </p>

                        <div className="space-y-6">
                            {/* Comparison 1 */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-[#eee] p-6 text-[#777] border border-[#ddd]">
                                    <div className="font-mono text-[10px] tracking-widest uppercase mb-3 font-bold flex items-center gap-2 text-[#999]"><X size={12} /> Without an audit</div>
                                    <p className="text-sm leading-relaxed">You launch expensive ad campaigns blindly and guess why leads aren't calling.</p>
                                </div>
                                <div className="bg-[#eefaf8] p-6 text-[#022c22] border-2 border-[#2a7a6f] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#2a7a6f]/10 rounded-bl-full"></div>
                                    <div className="font-mono text-[10px] tracking-widest uppercase mb-3 font-bold text-[#2a7a6f] flex items-center gap-2"><Check size={12} /> The Seleste Audit</div>
                                    <p className="text-sm leading-relaxed font-bold">Uncovers the exact broken links, page load delays, and missing tracking before spending a dime.</p>
                                </div>
                            </div>

                            {/* Comparison 2 */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-[#eee] p-6 text-[#777] border border-[#ddd]">
                                    <div className="font-mono text-[10px] tracking-widest uppercase mb-3 font-bold flex items-center gap-2 text-[#999]"><X size={12} /> Without an audit</div>
                                    <p className="text-sm leading-relaxed">Competitors constantly outrank you and you have no idea how to catch up.</p>
                                </div>
                                <div className="bg-[#eefaf8] p-6 text-[#022c22] border-2 border-[#2a7a6f] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#2a7a6f]/10 rounded-bl-full"></div>
                                    <div className="font-mono text-[10px] tracking-widest uppercase mb-3 font-bold text-[#2a7a6f] flex items-center gap-2"><Check size={12} /> The Seleste Audit</div>
                                    <p className="text-sm leading-relaxed font-bold">Reveals the exact keywords your competitors use, giving you the blueprint to steal their traffic.</p>
                                </div>
                            </div>

                            {/* Comparison 3 */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-[#eee] p-6 text-[#777] border border-[#ddd]">
                                    <div className="font-mono text-[10px] tracking-widest uppercase mb-3 font-bold flex items-center gap-2 text-[#999]"><X size={12} /> Without an audit</div>
                                    <p className="text-sm leading-relaxed">Marketing feels like a black box of vanity metrics and monthly agency retainers.</p>
                                </div>
                                <div className="bg-[#eefaf8] p-6 text-[#022c22] border-2 border-[#2a7a6f] shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#2a7a6f]/10 rounded-bl-full"></div>
                                    <div className="font-mono text-[10px] tracking-widest uppercase mb-3 font-bold text-[#2a7a6f] flex items-center gap-2"><Check size={12} /> The Seleste Audit</div>
                                    <p className="text-sm leading-relaxed font-bold">Provides a single Quality Score (0-100) quantifying exactly how prepared your business is to grow.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3 — WHAT SELESTE IS */}
            <section className="py-32 px-8 bg-white border-b border-[#222]/10">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="font-mono text-[10px] text-[#2a7a6f] tracking-[0.2em] font-bold uppercase mb-4 block">What It Is</span>
                    <h2 className="font-sans text-3xl md:text-5xl font-bold leading-[1.2] tracking-tight text-[#111] mb-12">
                        An AI system that runs your marketing in the background &mdash; and gets better the longer it runs.
                    </h2>
                </div>

                <div className="max-w-3xl mx-auto text-[17px] font-sans text-[#555] leading-[1.8] space-y-6 mb-20 text-center">
                    <p>
                        Seleste is not an agency. It's not a dashboard. It's not another tool you have to log into every day.
                    </p>
                    <p>
                        It's a set of AI agents &mdash; each one specialised in a different part of your digital growth &mdash; that work together continuously. They watch your website, monitor your competitors, manage your ads, and surface the opportunities most businesses miss because they're too busy running the actual business.
                    </p>
                    <p>
                        Every action goes through you. Seleste drafts, recommends, and prepares &mdash; you approve. The bigger the decision, the more control you keep. The small stuff (bid adjustments, budget rebalancing, underperforming ad pauses) happens automatically so you don't have to think about it.
                    </p>
                    <p>
                        The more it knows about your business, the sharper it gets. Over time, Seleste builds a memory of what's worked, what you've declined, what your customers respond to, and what your competitors are doing. It stops guessing and starts knowing.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto border-l-4 border-[#2a7a6f] pl-8 py-4">
                    <p className="font-serif text-3xl md:text-4xl text-[#111] leading-[1.3] font-bold italic">
                        "You don't hire Seleste to run a campaign. You bring it in to run your growth &mdash; the same way you'd want a marketing director who never sleeps, never forgets, and always has your numbers in front of them."
                    </p>
                </div>
            </section>

            {/* SECTION 4 — HOW IT WORKS (PROCESS) */}
            <section className="py-32 px-8 max-w-[85rem] mx-auto bg-[#f4ebe1]">
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <span className="font-mono text-[10px] text-[#2a7a6f] tracking-[0.2em] font-bold uppercase mb-4 block">The Process</span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#111] leading-[1.1]">
                        Up and running in under 10 minutes.<br />
                        Delivering results in under 10 days.
                    </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 relative isolate">
                    {/* Desktop Connector Line */}
                    <div className="hidden lg:block absolute top-[2.5rem] left-12 right-12 h-[2px] bg-gradient-to-r from-[#2a7a6f]/10 via-[#2a7a6f]/40 to-[#2a7a6f]/10 -z-10"></div>

                    {/* Step 01 */}
                    <div className="bg-white p-8 md:p-10 border border-[#ddd] shadow-sm relative group hover:-translate-y-1 transition-transform">
                        <div className="w-[5rem] h-[5rem] rounded-full border-4 border-[#f4ebe1] bg-[#111] text-white flex items-center justify-center font-mono font-bold text-xl mb-8 shadow-md">
                            01
                        </div>
                        <h3 className="font-sans font-bold text-2xl mb-4 text-[#111]">Connect your accounts</h3>
                        <p className="text-[15px] text-[#555] leading-relaxed mb-6 flex-grow">
                            You connect your website, Google Business Profile, and ad accounts (if you have them). Seleste reads everything &mdash; your rankings, your traffic, your ad performance, your competitor positions. The onboarding flow takes less than 10 minutes.
                        </p>
                        <div className="mt-auto pt-4 border-t border-[#eee]">
                            <p className="font-body text-[13px] text-[#888] italic">
                                <strong className="font-sans not-italic text-[#555]">Small note:</strong> No technical setup required. If something's hard to find, we walk you through it.
                            </p>
                        </div>
                    </div>

                    {/* Step 02 */}
                    <div className="bg-white p-8 md:p-10 border border-[#ddd] shadow-sm relative group hover:-translate-y-1 transition-transform">
                        <div className="w-[5rem] h-[5rem] rounded-full border-4 border-[#f4ebe1] bg-[#2a7a6f] text-white flex items-center justify-center font-mono font-bold text-xl mb-8 shadow-md">
                            02
                        </div>
                        <h3 className="font-sans font-bold text-2xl mb-4 text-[#111]">Seleste builds your picture</h3>
                        <p className="text-[15px] text-[#555] leading-relaxed mb-6 flex-grow">
                            Within 24 hours, Seleste runs a full audit across six areas: your website health, your Google presence, your conversion performance, your tracking setup, your competitor positioning, and your paid media readiness. It scores each one and produces your first Quality Score &mdash; a number from 0 to 100 that tells you exactly where you stand.
                        </p>
                        <div className="mt-auto pt-4 border-t border-[#eee]">
                            <p className="font-body text-[13px] text-[#888] italic">
                                <strong className="font-sans not-italic text-[#555]">Small note:</strong> Your score comes with a plain-English explanation of what's dragging it down and what fixing it would mean for your leads.
                            </p>
                        </div>
                    </div>

                    {/* Step 03 */}
                    <div className="bg-white p-8 md:p-10 border border-[#ddd] shadow-sm relative group hover:-translate-y-1 transition-transform">
                        <div className="w-[5rem] h-[5rem] rounded-full border-4 border-[#f4ebe1] bg-[#111] text-white flex items-center justify-center font-mono font-bold text-xl mb-8 shadow-md">
                            03
                        </div>
                        <h3 className="font-sans font-bold text-2xl mb-4 text-[#111]">Your agents start working</h3>
                        <p className="text-[15px] text-[#555] leading-relaxed mb-6 flex-grow">
                            From week one, your agents are active. The Audit Agent monitors your digital health weekly. The Opportunity Agent scans for gaps. On Grow and above, the Campaign Agent and Budget Agent begin executing &mdash; launching campaigns, managing spend, and bringing recommendations to your approval queue.
                        </p>
                        <div className="mt-auto pt-4 border-t border-[#eee]">
                            <p className="font-body text-[13px] text-[#888] italic">
                                <strong className="font-sans not-italic text-[#555]">Small note:</strong> You always stay in control. Every significant action is reviewed before it goes live.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5 — MEET THE AGENTS */}
            <section className="py-32 px-8 bg-[#111] text-white border-t border-b border-[#333]">
                <div className="max-w-[85rem] mx-auto">

                    <div className="mb-20 max-w-3xl">
                        <span className="font-mono text-[10px] text-[#2a7a6f] tracking-[0.2em] font-bold uppercase mb-4 block">The Agents</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.1] mb-6">
                            Five specialists. One system.<br />
                            <span className="text-[#2a7a6f] italic font-normal">Always working.</span>
                        </h2>
                        <p className="font-sans text-lg text-[#aaa] leading-[1.8] mb-6">
                            Each Seleste agent is built for a specific job. They share information, brief each other, and escalate to you when a decision matters. Think of them less like software features and more like a team of specialists who've been briefed on your business and never clock off.
                        </p>
                        <p className="font-mono text-[11px] text-[#777] tracking-widest uppercase border-l-2 border-[#333] pl-4 py-2">
                            All plans include the Audit Agent and Opportunity Agent. Campaign and Budget Agents unlock on <Link href="/pricing" className="text-white hover:underline">Grow</Link>. Creative Agent unlocks on <Link href="/pricing" className="text-white hover:underline">Dominate</Link>.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* 1. Audit Agent */}
                        <div className="bg-[#1a1a1a] border border-[#333] p-8 lg:p-10 flex flex-col group">
                            <div className="w-12 h-12 bg-[#2a7a6f]/20 rounded-xl flex items-center justify-center text-[#2a7a6f] mb-8 border border-[#2a7a6f]/30">
                                <Search size={22} />
                            </div>
                            <h3 className="font-sans font-bold text-2xl mb-2 text-white">Audit Agent</h3>
                            <div className="font-mono text-[10px] text-[#2a7a6f] tracking-widest uppercase mb-6 font-bold">Role: Your weekly digital health check</div>

                            <p className="text-[14px] text-[#888] leading-relaxed mb-6">
                                <strong className="text-white font-sans">What it does:</strong> Every Monday, the Audit Agent runs a full review of your digital presence &mdash; website speed, Google Business Profile completeness, search rankings, conversion performance, competitor movements, and tracking accuracy. It scores six areas from 0 to 100 and produces your Quality Score.
                            </p>
                            <p className="text-[14px] text-[#888] leading-relaxed mb-8">
                                If something drops, you hear about it immediately. If something needs fixing the system can handle automatically, it handles it. If it needs your input, it lands in your approval queue with a clear explanation and a recommended action.
                            </p>

                            <div className="bg-[#0f0f0f] border border-[#222] p-6 mb-8 mt-auto">
                                <div className="font-sans font-bold text-white text-sm mb-3">What it catches that most businesses miss:</div>
                                <ul className="space-y-3 font-sans text-[13px] text-[#999]">
                                    <li className="flex gap-2 items-start"><span className="text-[#2a7a6f]">_</span> A Google Business Profile missing a category that competitors have &mdash; costing map pack visibility</li>
                                    <li className="flex gap-2 items-start"><span className="text-[#2a7a6f]">_</span> A website loading 3 seconds slower than your top competitor &mdash; losing you calls every day</li>
                                    <li className="flex gap-2 items-start"><span className="text-[#2a7a6f]">_</span> Tracking that stopped firing after a site update &mdash; meaning ad spend data is completely blind</li>
                                </ul>
                            </div>

                            <div className="font-mono text-[10px] text-white tracking-widest uppercase pt-4 border-t border-[#333] flex items-center gap-2">
                                <Check size={14} className="text-[#2a7a6f]" /> Active on all plans.
                            </div>
                        </div>

                        {/* 2. Opportunity Agent */}
                        <div className="bg-[#1a1a1a] border border-[#333] p-8 lg:p-10 flex flex-col group">
                            <div className="w-12 h-12 bg-[#eab308]/20 rounded-xl flex items-center justify-center text-[#eab308] mb-8 border border-[#eab308]/30">
                                <Zap size={22} />
                            </div>
                            <h3 className="font-sans font-bold text-2xl mb-2 text-white">Opportunity Agent</h3>
                            <div className="font-mono text-[10px] text-[#eab308] tracking-widest uppercase mb-6 font-bold">Role: The growth spotter that never stops scanning</div>

                            <p className="text-[14px] text-[#888] leading-relaxed mb-6">
                                <strong className="text-white font-sans">What it does:</strong> Every Wednesday, the Opportunity Agent scans for things your business could be doing &mdash; but isn't. It looks at keywords you almost rank for (positions 11-30), seasonal demand windows coming in the next 3-4 weeks, competitors who've dropped their ad spend or lost rankings, and channels your industry performs well in that you're not using.
                            </p>
                            <p className="text-[14px] text-[#888] leading-relaxed mb-8">
                                Every opportunity comes with three things: why it exists right now, what it's worth in estimated monthly revenue, and exactly what action would capture it. It never surfaces the same opportunity twice if you've already declined it. It remembers.
                            </p>

                            <div className="bg-[#0f0f0f] border border-[#222] p-6 mb-8 mt-auto">
                                <div className="font-sans font-bold text-white text-sm mb-3">Examples of what it finds:</div>
                                <ul className="space-y-4 font-sans text-[13px] text-[#999] italic">
                                    <li className="pl-3 border-l-2 border-[#333]">"Your top competitor just stopped running Google Ads. There's a window in the next 2-3 weeks to capture their search traffic."</li>
                                    <li className="pl-3 border-l-2 border-[#333]">"Roofing demand historically spikes in your service area in 5 weeks. Now is the time to build the campaign &mdash; not when it peaks."</li>
                                    <li className="pl-3 border-l-2 border-[#333]">"You rank position 14 for 'emergency plumber [city]' &mdash; 3 spots outside the map pack. A focused push could move you in."</li>
                                </ul>
                            </div>

                            <div className="font-mono text-[10px] text-white tracking-widest uppercase pt-4 border-t border-[#333] flex items-center gap-2">
                                <Check size={14} className="text-[#eab308]" /> Active on all plans.
                            </div>
                        </div>

                        {/* 3. Campaign Agent */}
                        <div className="bg-[#1a1a1a] border border-[#333] p-8 lg:p-10 flex flex-col group relative overflow-hidden">
                            <div className="w-12 h-12 bg-[#3b82f6]/20 rounded-xl flex items-center justify-center text-[#3b82f6] mb-8 border border-[#3b82f6]/30">
                                <Rocket size={22} />
                            </div>
                            <h3 className="font-sans font-bold text-2xl mb-2 text-white">Campaign Agent</h3>
                            <div className="font-mono text-[10px] text-[#3b82f6] tracking-widest uppercase mb-6 font-bold">Role: Launches and manages your Google and Meta ads</div>

                            <p className="text-[14px] text-[#888] leading-relaxed mb-6">
                                <strong className="text-white font-sans">What it does:</strong> When the Opportunity Agent spots a gap worth acting on, the Campaign Agent builds the response. It drafts campaigns, structures ad sets, sets targeting, and brings the complete draft to your approval queue. You review, approve, and it goes live.
                            </p>
                            <p className="text-[14px] text-[#888] leading-relaxed mb-8">
                                Once campaigns are running, it monitors performance daily. If a campaign is underperforming, it pauses it and tells you why. It never spends beyond your budget. Never enters a channel you haven't approved. Never launches without your sign-off.
                            </p>

                            <div className="bg-[#0f0f0f] border border-[#222] p-6 mb-8 mt-auto">
                                <div className="space-y-4">
                                    <div>
                                        <div className="font-sans font-bold text-white text-xs mb-2">Handles automatically (no approval needed):</div>
                                        <div className="font-sans text-[12.5px] text-[#999]">Bid adjustments within &plusmn;20%, pausing underperforming ad sets after 14 days, keyword match type adjustments.</div>
                                    </div>
                                    <div className="border-t border-[#333] pt-4">
                                        <div className="font-sans font-bold text-white text-xs mb-2 flex items-center gap-1.5"><ShieldCheck size={12} /> Always needs your approval:</div>
                                        <div className="font-sans text-[12.5px] text-[#999]">New campaign creation, new channels or audiences, budget changes above 25%.</div>
                                    </div>
                                </div>
                            </div>

                            <div className="font-mono text-[10px] text-[#aaa] tracking-widest uppercase pt-4 border-t border-[#333] flex items-center gap-2">
                                Unlocks on <Link href="/pricing" className="text-white hover:underline underline-offset-4 decoration-[#333] ml-1 flex items-center gap-1">Grow ($297/mo) <ArrowRight size={10} /></Link>
                            </div>
                        </div>

                        {/* 4. Budget Agent */}
                        <div className="bg-[#1a1a1a] border border-[#333] p-8 lg:p-10 flex flex-col group lg:col-start-1 lg:col-end-auto md:col-start-1 md:col-end-3">
                            <div className="w-12 h-12 bg-[#10b981]/20 rounded-xl flex items-center justify-center text-[#10b981] mb-8 border border-[#10b981]/30">
                                <PieChart size={22} />
                            </div>
                            <h3 className="font-sans font-bold text-2xl mb-2 text-white">Budget Agent</h3>
                            <div className="font-mono text-[10px] text-[#10b981] tracking-widest uppercase mb-6 font-bold">Role: Makes sure every pound of your ad spend is working</div>

                            <p className="text-[14px] text-[#888] leading-relaxed mb-6">
                                <strong className="text-white font-sans">What it does:</strong> The Budget Agent watches your spend pacing every day. If one channel is delivering strong results and another is underperforming, it rebalances &mdash; moving budget toward what's working, within the limits you've set. It runs checks at 6am daily and flags anything unusual before it has a chance to drain your budget.
                            </p>
                            <p className="text-[14px] text-[#888] leading-relaxed mb-8">
                                Your monthly spend cap is a hard ceiling &mdash; nothing can override it. Rebalancing above 25% of any channel's budget requires your approval. Every action is logged.
                            </p>

                            <div className="bg-[#0f0f0f] border border-[#222] p-6 mb-8 mt-auto italic">
                                <p className="font-sans text-[13.5px] text-[#999] leading-relaxed">
                                    In plain terms: it's the difference between checking your ad spend once a week and hoping for the best, and having someone actively watching it every morning.
                                </p>
                            </div>

                            <div className="font-mono text-[10px] text-[#aaa] tracking-widest uppercase pt-4 border-t border-[#333] flex items-center gap-2">
                                Unlocks on <Link href="/pricing" className="text-white hover:underline underline-offset-4 decoration-[#333] ml-1 flex items-center gap-1">Grow ($297/mo) <ArrowRight size={10} /></Link>
                            </div>
                        </div>

                        {/* 5. Creative Agent */}
                        <div className="bg-[#1a1a1a] border border-[#333] p-8 lg:p-10 flex flex-col group lg:col-start-2 lg:col-end-4 md:col-span-1">
                            <div className="w-12 h-12 bg-[#ec4899]/20 rounded-xl flex items-center justify-center text-[#ec4899] mb-8 border border-[#ec4899]/30">
                                <PenTool size={22} />
                            </div>
                            <h3 className="font-sans font-bold text-2xl mb-2 text-white">Creative Agent</h3>
                            <div className="font-mono text-[10px] text-[#ec4899] tracking-widest uppercase mb-6 font-bold">Role: Writes your ads and tests what actually converts</div>

                            <div className="grid lg:grid-cols-2 gap-8 mb-8 flex-grow">
                                <div>
                                    <p className="text-[14px] text-[#888] leading-relaxed mb-6">
                                        <strong className="text-white font-sans">What it does:</strong> The Creative Agent generates ad copy &mdash; headlines, descriptions, calls to action &mdash; tailored to your business, your service area, and the specific campaign it's supporting. It builds a brand voice library over time, learning what language converts for your customers and what your competitors are saying (so it can say it better).
                                    </p>
                                </div>
                                <div className="bg-[#0f0f0f] border border-[#222] p-6">
                                    <p className="text-[13px] text-[#999] leading-relaxed mb-4">
                                        Every piece of copy comes to your approval queue before going live. Once you approve, it runs A/B tests automatically &mdash; tracking which variants win, retiring the losers, and scaling the winners.
                                    </p>
                                    <p className="text-[13px] text-[#999] leading-relaxed mb-4">
                                        It also watches landing pages. If a page is costing you conversions, it drafts an improved version and brings it to you with the data.
                                    </p>
                                    <p className="text-[12px] text-white font-bold leading-relaxed border-t border-[#333] pt-4 flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-[#ec4899]" /> It never publishes anything without your explicit approval.
                                    </p>
                                </div>
                            </div>

                            <div className="font-mono text-[10px] text-[#aaa] tracking-widest uppercase pt-4 border-t border-[#333] flex items-center gap-2 mt-auto">
                                Unlocks on <Link href="/pricing" className="text-white hover:underline underline-offset-4 decoration-[#333] ml-1 flex items-center gap-1">Dominate ($597/mo) <ArrowRight size={10} /></Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 6 — REAL OUTCOMES */}
            <section className="py-32 px-8 max-w-[85rem] mx-auto bg-[#f4ebe1]">
                <div className="mb-24 text-center max-w-4xl mx-auto">
                    <span className="font-mono text-[10px] text-[#2a7a6f] tracking-[0.2em] font-bold uppercase mb-4 block">What Changes</span>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.1] text-[#111] mb-8">
                        This is what your business looks like 90 days in.
                    </h2>
                    <p className="font-sans text-lg text-[#555] leading-[1.8] max-w-3xl mx-auto">
                        We're not promising you'll rank number one overnight or triple your revenue by Tuesday. What we're promising is a business that has a clearer picture of where it stands, stops wasting money on things that don't work, and has an AI system actively looking for the next move.
                    </p>
                </div>

                {/* Top Statements */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    <div className="border border-[#2a7a6f] bg-white p-8 lg:p-10 shadow-sm border-t-4 text-center flex flex-col justify-center items-center">
                        <p className="font-serif italic text-2xl text-[#111] leading-relaxed">
                            "Most businesses using Seleste identify at least 3 critical issues in their first audit that were quietly costing them leads."
                        </p>
                    </div>
                    <div className="border border-[#111] bg-white p-8 lg:p-10 shadow-sm border-t-4 text-center flex flex-col justify-center items-center">
                        <p className="font-serif italic text-2xl text-[#111] leading-relaxed">
                            "The average Quality Score after 90 days is 22 points higher than on signup day."
                        </p>
                    </div>
                    <div className="border border-[#3b82f6] bg-white p-8 lg:p-10 shadow-sm border-t-4 text-center flex flex-col justify-center items-center">
                        <p className="font-serif italic text-2xl text-[#111] leading-relaxed">
                            "Customers on the Grow plan typically have their first AI-managed campaign live within 7 days of signup."
                        </p>
                    </div>
                </div>

                {/* Before / After Columns */}
                <div className="grid md:grid-cols-2 bg-white border border-[#ddd] shadow-sm overflow-hidden">
                    {/* Before Column */}
                    <div className="p-10 lg:p-16 bg-[#fafafa] border-r border-[#ddd]">
                        <h4 className="font-mono text-[10px] text-[#999] tracking-[0.2em] font-bold uppercase mb-8 flex items-center gap-2"><X size={14} className="text-[#999]" /> Before Seleste</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ccc] mt-2 block flex-shrink-0"></span>
                                <span className="font-sans text-[15px] text-[#777] leading-relaxed">You don't know your Quality Score or what it means for your leads</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ccc] mt-2 block flex-shrink-0"></span>
                                <span className="font-sans text-[15px] text-[#777] leading-relaxed">Ad spend goes out every month &mdash; you're not sure what it's generating</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ccc] mt-2 block flex-shrink-0"></span>
                                <span className="font-sans text-[15px] text-[#777] leading-relaxed">You find out about website problems when a customer mentions it</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ccc] mt-2 block flex-shrink-0"></span>
                                <span className="font-sans text-[15px] text-[#777] leading-relaxed">Competitors are stealing your search traffic and you can't see it happening</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ccc] mt-2 block flex-shrink-0"></span>
                                <span className="font-sans text-[15px] text-[#777] leading-relaxed">Monthly agency report arrives. You read it. Nothing changes.</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ccc] mt-2 block flex-shrink-0"></span>
                                <span className="font-sans text-[15px] font-bold text-[#555] leading-relaxed uppercase tracking-wide text-xs">Marketing is a cost you tolerate, not an investment you understand</span>
                            </li>
                        </ul>
                    </div>

                    {/* After Column */}
                    <div className="p-10 lg:p-16 bg-[#eefaf8]">
                        <h4 className="font-mono text-[10px] text-[#2a7a6f] tracking-[0.2em] font-bold uppercase mb-8 flex items-center gap-2"><Check size={14} className="text-[#2a7a6f]" /> After Seleste</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2a7a6f] mt-2 block flex-shrink-0"></span>
                                <span className="font-sans text-[15px] text-[#022c22] leading-relaxed">You have a live Quality Score with a plain-English explanation updated every week</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2a7a6f] mt-2 block flex-shrink-0"></span>
                                <span className="font-sans text-[15px] text-[#022c22] leading-relaxed">Every dollar of ad spend is tracked to a channel, a campaign, and an estimated lead value</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2a7a6f] mt-2 block flex-shrink-0"></span>
                                <span className="font-sans text-[15px] text-[#022c22] leading-relaxed">The Audit Agent catches technical problems before they affect your calls</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2a7a6f] mt-2 block flex-shrink-0"></span>
                                <span className="font-sans text-[15px] text-[#022c22] leading-relaxed">The Opportunity Agent alerts you when a competitor weakens &mdash; and has a draft response ready</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2a7a6f] mt-2 block flex-shrink-0"></span>
                                <span className="font-sans text-[15px] text-[#022c22] leading-relaxed">Every Monday you have a clear view of what changed, why, and what's next</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2a7a6f] mt-2 block flex-shrink-0"></span>
                                <span className="font-sans text-[15px] font-bold text-[#2a7a6f] leading-relaxed uppercase tracking-wide text-xs">You know what your marketing is generating. You can see it.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* SECTION 7 — CLOSING CTA */}
            <section className="bg-[#111] text-[#f4ebe1] pt-32 pb-40 px-8 text-center relative max-w-[85rem] mx-auto xl:rounded-3xl shadow-lg border border-[#333]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a7a6f]/10 to-transparent pointer-events-none xl:rounded-3xl"></div>

                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="font-serif text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-8">
                        Ready to see what Seleste finds in your first audit?
                    </h2>
                    <p className="font-sans text-lg text-[#aaa] leading-[1.8] mb-12">
                        Your first Quality Score is ready within 24 hours of connecting your accounts. Most businesses find something worth fixing immediately &mdash; and something worth acting on before the month is out.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                        <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 bg-[#2a7a6f] text-white font-mono text-[11px] font-bold tracking-widest uppercase hover:bg-white hover:text-[#111] transition-colors">
                            See Plans & Pricing
                        </Link>
                        <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#333] text-[#f4ebe1] font-mono text-[11px] font-bold tracking-widest uppercase hover:border-[#f4ebe1] transition-colors">
                            Book a 20-minute walkthrough
                        </Link>
                    </div>

                    <p className="font-sans text-[13px] text-[#777] italic">
                        No long-term contract. Cancel any time. Setup takes under 10 minutes.
                    </p>
                </div>
            </section>

            {/* Footer placeholder */}
            <div className="mt-32">
            </div>

        </div>
    );
}
