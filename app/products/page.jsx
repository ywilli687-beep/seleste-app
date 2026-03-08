import Link from 'next/link';
import { ArrowLeft, Rocket, Search, Megaphone, Workflow, Briefcase } from 'lucide-react';

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-[#111] text-[#f4ebe1] font-sans selection:bg-[#2a7a6f] selection:text-white">

            {/* Header Area */}
            <div className="pt-32 pb-20 px-8 max-w-[85rem] mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-[2px] bg-[#2a7a6f]"></div>
                    <span className="font-mono text-xs font-bold text-[#2a7a6f] tracking-[0.25em] uppercase">The Seleste Arsenal</span>
                </div>

                <h1 className="font-serif text-5xl md:text-7xl font-bold mb-8 leading-[1.05] tracking-tight">
                    An AI workforce,<br />
                    <span className="font-serif italic text-[#2a7a6f] font-normal tracking-normal">purpose-built for local execution.</span>
                </h1>

                <p className="text-xl text-[#aaa] font-serif italic max-w-2xl leading-relaxed mb-10">
                    Most SaaS tools just give you a dashboard and wish you good luck. Seleste provides specialized AI Agents that actually do the work. Explore the core product suite below.
                </p>
            </div>

            {/* Product Grid */}
            <div className="border-t border-[#333] bg-[#0d0d0d]">
                <div className="max-w-[85rem] mx-auto px-8 py-24">

                    <div className="grid lg:grid-cols-2 gap-16">

                        {/* Product 1 */}
                        <div className="flex flex-col border border-[#222] bg-[#111] p-10 hover:border-[#2a7a6f]/50 transition-colors group">
                            <div className="w-14 h-14 bg-[#1a1a1a] border border-[#333] rounded-xl flex items-center justify-center text-[#2a7a6f] mb-8 group-hover:scale-110 transition-transform">
                                <Search size={24} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">1. The Audit Engine</h2>
                            <p className="text-[#888] text-base leading-relaxed mb-8 flex-grow">
                                Stop guessing why your phone isn't ringing. Our proprietary crawler analyzes your website, Google Business Profile, and local competitors to identify exact friction points. It scores your digital presence out of 100, showing you the mathematical reality of your market positioning.
                            </p>
                            <ul className="space-y-3 font-mono text-xs text-[#666] mb-8 list-none">
                                <li className="flex gap-2 items-center"><span className="text-[#2a7a6f]">&bull;</span> Live DOM & SEO extraction</li>
                                <li className="flex gap-2 items-center"><span className="text-[#2a7a6f]">&bull;</span> Google PageSpeed Integration</li>
                                <li className="flex gap-2 items-center"><span className="text-[#2a7a6f]">&bull;</span> Local Competitor Gap Analysis</li>
                            </ul>
                            <Link href="/onboarding" className="font-mono text-[10px] text-[#f4ebe1] uppercase tracking-[0.2em] hover:text-[#2a7a6f] transition-colors border-b border-[#333] pb-1 w-max">Run Free Audit &rarr;</Link>
                        </div>

                        {/* Product 2 */}
                        <div className="flex flex-col border border-[#222] bg-[#111] p-10 hover:border-[#eab308]/50 transition-colors group">
                            <div className="w-14 h-14 bg-[#1a1a1a] border border-[#333] rounded-xl flex items-center justify-center text-[#eab308] mb-8 group-hover:scale-110 transition-transform">
                                <Workflow size={24} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">2. The Strategic Orchestrator</h2>
                            <p className="text-[#888] text-base leading-relaxed mb-8 flex-grow">
                                Data is useless without direction. The Orchestrator ingests your audit data and generates a deterministic 90-Day Roadmap. It acts as your fractional CMO, prioritizing tasks strictly by ROI, assigning effort scores, and determining exactly which AI specialist should handle each job.
                            </p>
                            <ul className="space-y-3 font-mono text-xs text-[#666] mb-8 list-none">
                                <li className="flex gap-2 items-center"><span className="text-[#eab308]">&bull;</span> Claude 3.5 Sonnet Integration</li>
                                <li className="flex gap-2 items-center"><span className="text-[#eab308]">&bull;</span> 3-Phase structured playbook</li>
                                <li className="flex gap-2 items-center"><span className="text-[#eab308]">&bull;</span> Weekly asynchronous check-ins</li>
                            </ul>
                            <span className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em] border-b border-[#222] pb-1 w-max">Included in Starter</span>
                        </div>

                        {/* Product 3 */}
                        <div className="flex flex-col border border-[#222] bg-[#111] p-10 hover:border-[#3b82f6]/50 transition-colors group">
                            <div className="w-14 h-14 bg-[#1a1a1a] border border-[#333] rounded-xl flex items-center justify-center text-[#3b82f6] mb-8 group-hover:scale-110 transition-transform">
                                <Rocket size={24} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">3. SEO & Content Agents</h2>
                            <p className="text-[#888] text-base leading-relaxed mb-8 flex-grow">
                                Fully autonomous copywriters that never sleep. These agents rewrite your local landing pages to hit specific keyword densities, automatically respond to Google reviews to boost local trust, and draft email sequences designed exclusively to reactivate dead CRM leads.
                            </p>
                            <ul className="space-y-3 font-mono text-xs text-[#666] mb-8 list-none">
                                <li className="flex gap-2 items-center"><span className="text-[#3b82f6]">&bull;</span> Multi-step reasoning models</li>
                                <li className="flex gap-2 items-center"><span className="text-[#3b82f6]">&bull;</span> SEO semantic clustering</li>
                                <li className="flex gap-2 items-center"><span className="text-[#3b82f6]">&bull;</span> Direct GBP review responses</li>
                            </ul>
                            <span className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em] border-b border-[#222] pb-1 w-max">Included in Growth</span>
                        </div>

                        {/* Product 4 */}
                        <div className="flex flex-col border border-[#222] bg-[#111] p-10 hover:border-[#ec4899]/50 transition-colors group">
                            <div className="w-14 h-14 bg-[#1a1a1a] border border-[#333] rounded-xl flex items-center justify-center text-[#ec4899] mb-8 group-hover:scale-110 transition-transform">
                                <Megaphone size={24} />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">4. Paid Media Agent</h2>
                            <p className="text-[#888] text-base leading-relaxed mb-8 flex-grow">
                                Eliminate wasted ad spend. The Paid Media Agent acts as your dedicated media buyer, monitoring Google and Meta campaign performance 24/7. It cuts losing ads automatically, scales winners, and generates fresh hook formulas for new ad creative using live market data.
                            </p>
                            <ul className="space-y-3 font-mono text-xs text-[#666] mb-8 list-none">
                                <li className="flex gap-2 items-center"><span className="text-[#ec4899]">&bull;</span> Real-time budget reallocation</li>
                                <li className="flex gap-2 items-center"><span className="text-[#ec4899]">&bull;</span> A/B split test automation</li>
                                <li className="flex gap-2 items-center"><span className="text-[#ec4899]">&bull;</span> CAC & ROAS optimization targets</li>
                            </ul>
                            <span className="font-mono text-[10px] text-[#555] uppercase tracking-[0.2em] border-b border-[#222] pb-1 w-max">Included in Scale</span>
                        </div>

                    </div>
                </div>
            </div>

            {/* The 13 Agents Section */}
            <div className="border-t border-[#333] bg-[#111] py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#2a7a6f]/5 blur-[150px] pointer-events-none"></div>

                <div className="max-w-[85rem] mx-auto px-8 relative z-10">
                    <div className="mb-16">
                        <span className="font-mono text-[11px] font-bold text-[#2a7a6f] tracking-[0.25em] uppercase mb-4 block">Meet The Swarm</span>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white">
                            13 Agents. One Shared Brain.
                        </h2>
                        <p className="text-[#888] font-sans text-lg max-w-2xl leading-relaxed">
                            Unlike isolated AI tools, Seleste operates as a synchronized agency. Every agent reads from the same proprietary data lake, meaning your Google Ads agent knows exactly what your SEO agent just published.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {/* Leadership */}
                        <div className="border border-[#222] bg-[#0a0a0a] p-8 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#2a7a6f]"></span> Leadership & Strategy
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="font-mono text-[11px] text-[#2a7a6f] tracking-widest uppercase mb-1">01. Ops Orchestrator</div>
                                    <p className="text-sm text-[#777] leading-relaxed">The acting CMO. Sets the 90-day sprints, delegates tasks, and synthesizes cross-channel KPIs.</p>
                                </div>
                                <div>
                                    <div className="font-mono text-[11px] font-bold text-white tracking-widest uppercase mb-1">02. Market Intel Analyst</div>
                                    <p className="text-sm text-[#777] leading-relaxed">Scrapes competitor pricing, maps keyword gaps, and flags seasonal demand spikes.</p>
                                </div>
                                <div>
                                    <div className="font-mono text-[11px] font-bold text-white tracking-widest uppercase mb-1">03. Offer Architect</div>
                                    <p className="text-sm text-[#777] leading-relaxed">Designs high-ticket local packages and "Godfather Offers" based on scraped competitor gaps.</p>
                                </div>
                            </div>
                        </div>

                        {/* Traffic Generation */}
                        <div className="border border-[#222] bg-[#0a0a0a] p-8 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#eab308]"></span> Traffic & Acquisition
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="font-mono text-[11px] text-[#eab308] tracking-widest uppercase mb-1">04. Paid Media Manager</div>
                                    <p className="text-sm text-[#777] leading-relaxed">Runs Google LSA, Search, and Meta ads. Automatically cuts losers and scales winning creatives.</p>
                                </div>
                                <div>
                                    <div className="font-mono text-[11px] font-bold text-white tracking-widest uppercase mb-1">05. Local SEO Specialist</div>
                                    <p className="text-sm text-[#777] leading-relaxed">Hyper-optimizes your Google Business Profile, manages local citations, and targets map pack rankings.</p>
                                </div>
                                <div>
                                    <div className="font-mono text-[11px] font-bold text-white tracking-widest uppercase mb-1">06. Content SEO Writer</div>
                                    <p className="text-sm text-[#777] leading-relaxed">Writes long-form blogs and city-specific landing pages designed strictly to rank on page one.</p>
                                </div>
                                <div>
                                    <div className="font-mono text-[11px] font-bold text-white tracking-widest uppercase mb-1">07. Social Growth Agent</div>
                                    <p className="text-sm text-[#777] leading-relaxed">Repurposes content across Instagram, TikTok, and LinkedIn to build local brand awareness.</p>
                                </div>
                            </div>
                        </div>

                        {/* Conversion & Retention */}
                        <div className="border border-[#222] bg-[#0a0a0a] p-8 rounded-xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span> Conversion & Retention
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="font-mono text-[11px] text-[#3b82f6] tracking-widest uppercase mb-1">08. Conversion Optimizer</div>
                                    <p className="text-sm text-[#777] leading-relaxed">A/B tests landing page above-the-fold elements to squeeze more leads out of existing traffic.</p>
                                </div>
                                <div>
                                    <div className="font-mono text-[11px] font-bold text-white tracking-widest uppercase mb-1">09. Direct Response Copywriter</div>
                                    <p className="text-sm text-[#777] leading-relaxed">Writes the actual hook-driven sales copy for landing pages, SMS scripts, and email blasts.</p>
                                </div>
                                <div>
                                    <div className="font-mono text-[11px] font-bold text-white tracking-widest uppercase mb-1">10. Lifecycle Specialist</div>
                                    <p className="text-sm text-[#777] leading-relaxed">Builds drip sequences to nurture cold leads and reactivation campaigns to wake up dead pipelines.</p>
                                </div>
                                <div>
                                    <div className="font-mono text-[11px] font-bold text-white tracking-widest uppercase mb-1">11. Reputation Manager</div>
                                    <p className="text-sm text-[#777] leading-relaxed">Sends automated review requests to happy customers and drafts polite NLP-driven review replies.</p>
                                </div>
                            </div>
                        </div>

                        {/* Infrastructure */}
                        <div className="border border-[#222] bg-[#0a0a0a] p-8 rounded-xl md:col-span-2 lg:col-span-3">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-[#ec4899]"></span> Infrastructure & Data
                            </h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <div className="font-mono text-[11px] text-[#ec4899] tracking-widest uppercase mb-1">12. Data Scientist (GA4 & CRM)</div>
                                    <p className="text-sm text-[#777] leading-relaxed">Monitors live web traffic, tracks pixel attribution, and alerts the Ops Orchestrator of sudden metric drops.</p>
                                </div>
                                <div>
                                    <div className="font-mono text-[11px] text-[#ec4899] tracking-widest uppercase mb-1">13. Integration Engineer</div>
                                    <p className="text-sm text-[#777] leading-relaxed">Silently manages the actual API handshakes between Seleste and external tools like GoHighLevel or Mailchimp.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Scale Section */}
            <div className="bg-[#2a7a6f] text-white py-24">
                <div className="max-w-[85rem] mx-auto px-8 text-center flex flex-col items-center">
                    <Briefcase size={40} className="mb-6 opacity-80" />
                    <h2 className="font-serif text-4xl mb-6 font-bold">The Agency White-Label OS</h2>
                    <p className="text-[#eefaf8] opacity-80 max-w-2xl font-sans text-lg leading-relaxed mb-8">
                        Are you a marketing agency? Seleste is available as a headless infrastructure. License our AI orchestrator and agents to run under your own domain, giving you impossible margins and instantly scaling your fulfillment capacity.
                    </p>
                    <Link href="/onboarding" className="px-8 py-4 bg-white text-[#2a7a6f] font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-[#111] hover:text-white transition-colors">
                        Deploy Infrastructure
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#222] py-10 text-center">
                <Link href="/" className="inline-flex items-center gap-2 font-mono text-[10px] text-[#888] uppercase tracking-[0.2em] hover:text-white transition-colors">
                    <ArrowLeft size={14} /> Back to Home
                </Link>
            </div>
        </div>
    );
}
