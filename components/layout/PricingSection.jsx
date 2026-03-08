import Link from 'next/link';

export default function PricingSection() {
    return (
        <section id="pricing" className="py-32 bg-[#f4ebe1] relative z-20 border-t border-[#222]/10">
            <div className="max-w-[85rem] mx-auto px-8">

                {/* Header */}
                <div className="mb-16 text-center max-w-4xl mx-auto flex flex-col items-center">
                    <span className="font-mono text-[11px] font-bold text-[#2a7a6f] tracking-[0.25em] uppercase mb-4 block">SIMPLE, HONEST PRICING</span>
                    <h2 className="font-sans text-4xl md:text-5xl lg:text-[3.5rem] font-bold mb-6 leading-[1.1] tracking-tight text-[#111]">
                        Your AI marketing team.<br />
                        <span className="font-serif italic text-[#2a7a6f] font-normal tracking-normal">Start small. Grow when you're ready.</span>
                    </h2>
                    <p className="text-[17px] text-[#555] font-serif leading-[1.8] max-w-3xl mx-auto">
                        Seleste runs in the background &mdash; auditing your digital presence, spotting opportunities, launching campaigns, and optimising your budget. Each plan gives you the right agents for where your business is right now.
                    </p>

                    <div className="mt-8 flex items-center justify-center gap-4 bg-white border border-[#ddd] p-1.5 rounded-full shadow-sm text-sm font-sans font-medium">
                        <div className="px-6 py-2 bg-[#111] text-white rounded-full">Monthly</div>
                        <div className="px-6 py-2 text-[#555]">Annual &mdash; <span className="text-[#2a7a6f] font-bold">Save 20% annually</span></div>
                    </div>
                </div>

                {/* Pricing Tiers Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#f4ebe1] mb-24 relative isolate">

                    {/* TIER 1 — DIAGNOSE */}
                    <div className="p-8 border border-[#111] bg-white flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                        <div className="mb-4">
                            <h3 className="font-mono text-[10px] text-[#2a7a6f] tracking-[0.2em] uppercase font-bold mb-2">Tier 1 &mdash; Diagnose</h3>
                            <div className="font-sans font-bold text-4xl text-[#111]">$97<span className="text-xl text-[#777] font-normal">/mo</span></div>
                        </div>
                        <p className="font-serif text-[#111] text-sm leading-relaxed font-bold mb-2">Find out exactly what's holding your business back online &mdash; and get a clear plan to fix it.</p>
                        <p className="font-sans text-[11px] text-[#666] italic mb-6">Best for businesses that want a clear picture before committing to paid advertising.</p>

                        <div className="mb-6 border-y border-[#eee] py-4 bg-[#fafafa] -mx-8 px-8">
                            <div className="font-mono text-[10px] text-[#999] tracking-widest uppercase mb-3 font-bold">Agents Included</div>
                            <ul className="space-y-2 font-mono text-[11px]">
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> Audit Agent</li>
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> Opportunity Agent</li>
                                <li className="flex items-center gap-2 text-[#999] opacity-70"><span className="text-[#999] text-sm grayscale">🔒</span> Campaign Agent</li>
                                <li className="flex items-center gap-2 text-[#999] opacity-70"><span className="text-[#999] text-sm grayscale">🔒</span> Budget Agent</li>
                                <li className="flex items-center gap-2 text-[#999] opacity-70"><span className="text-[#999] text-sm grayscale">🔒</span> Creative Agent</li>
                            </ul>
                        </div>

                        <div className="flex-grow">
                            <ul className="space-y-3 font-sans text-[13px] text-[#555]">
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> Weekly Quality Score audit</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> 90-day personalised growth roadmap</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> Weekly opportunity alerts</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> Live performance dashboard</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> Downloadable PDF reports</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> DIY task checklist with guided steps</li>
                            </ul>
                        </div>

                        <a href="/onboarding" className="mt-8 block w-full text-center py-3 border border-[#ccc] hover:border-[#111] font-mono text-[10px] font-bold tracking-widest text-[#555] hover:text-[#111] uppercase transition-colors">
                            Get Started
                        </a>
                    </div>

                    {/* TIER 2 — GROW */}
                    <div className="p-8 border-2 border-[#2a7a6f] bg-[#eefaf8] flex flex-col relative shadow-[0_4px_30px_rgba(42,122,111,0.15)] group hover:-translate-y-1 transition-transform duration-300">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#2a7a6f] text-white px-4 py-1 flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.2em] uppercase whitespace-nowrap shadow-sm">
                            ⭐ Most Popular
                        </div>
                        <div className="mb-4 mt-2">
                            <h3 className="font-mono text-[10px] text-[#2a7a6f] tracking-[0.2em] uppercase font-bold mb-2">Tier 2 &mdash; Grow</h3>
                            <div className="font-sans font-bold text-4xl text-[#111]">$297<span className="text-xl text-[#777] font-normal">/mo</span></div>
                        </div>
                        <p className="font-serif text-[#111] text-sm leading-relaxed font-bold mb-2">Your AI marketing team starts executing &mdash; campaigns launched, budget optimised, opportunities actioned.</p>
                        <p className="font-sans text-[11px] text-[#666] italic mb-6">Best for businesses ready to run paid ads and want them managed automatically.</p>

                        <div className="mb-6 border-y border-[#2a7a6f]/20 py-4 bg-white/60 -mx-8 px-8">
                            <div className="font-mono text-[10px] text-[#2a7a6f] tracking-widest uppercase mb-3 font-bold">Agents Included</div>
                            <ul className="space-y-2 font-mono text-[11px]">
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> Audit Agent</li>
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> Opportunity Agent</li>
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> Campaign Agent</li>
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> Budget Agent</li>
                                <li className="flex items-center gap-2 text-[#999] opacity-70"><span className="text-[#999] text-sm grayscale">🔒</span> Creative Agent</li>
                            </ul>
                        </div>

                        <div className="flex-grow">
                            <ul className="space-y-3 font-sans text-[13px] text-[#022c22]">
                                <li className="flex justify-start items-start gap-2"><span className="text-[#2a7a6f]">&bull;</span> <span className="font-bold underline decoration-[#2a7a6f]/30 underline-offset-2">Everything in Diagnose</span></li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#2a7a6f]">&bull;</span> Google & Meta ad campaign management</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#2a7a6f]">&bull;</span> Automatic daily budget rebalancing</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#2a7a6f]">&bull;</span> Campaign approval dashboard</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#2a7a6f]">&bull;</span> Weekly performance digest email</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#2a7a6f]">&bull;</span> ROAS and lead tracking by channel</li>
                            </ul>
                        </div>

                        <a href="/onboarding" className="mt-8 block w-full text-center py-3 border-2 border-[#2a7a6f] bg-[#2a7a6f] text-white font-mono text-[10px] font-bold tracking-widest uppercase transition-colors hover:bg-transparent hover:text-[#2a7a6f]">
                            Start Growing
                        </a>
                    </div>

                    {/* TIER 3 — DOMINATE */}
                    <div className="p-8 border border-[#111] bg-white flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                        <div className="mb-4">
                            <h3 className="font-mono text-[10px] text-[#2a7a6f] tracking-[0.2em] uppercase font-bold mb-2">Tier 3 &mdash; Dominate</h3>
                            <div className="font-sans font-bold text-4xl text-[#111]">$597<span className="text-xl text-[#777] font-normal">/mo</span></div>
                        </div>
                        <p className="font-serif text-[#111] text-sm leading-relaxed font-bold mb-2">All five AI agents fully active &mdash; testing, optimising, and outwriting your competitors around the clock.</p>
                        <p className="font-sans text-[11px] text-[#666] italic mb-6">Best for businesses already running ads that want to pull ahead of the competition fast.</p>

                        <div className="mb-6 border-y border-[#eee] py-4 bg-[#fafafa] -mx-8 px-8">
                            <div className="font-mono text-[10px] text-[#999] tracking-widest uppercase mb-3 font-bold">Agents Included</div>
                            <ul className="space-y-2 font-mono text-[11px]">
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> Audit Agent</li>
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> Opportunity Agent</li>
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> Campaign Agent</li>
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> Budget Agent</li>
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> Creative Agent</li>
                            </ul>
                        </div>

                        <div className="flex-grow">
                            <ul className="space-y-3 font-sans text-[13px] text-[#555]">
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> <span className="font-bold text-[#111] underline decoration-[#ccc] underline-offset-2">Everything in Grow</span></li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> AI-generated ad copy & headlines</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> Automated A/B creative testing</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> Brand voice library (learns your tone)</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> Competitor counter-campaign drafting</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> Priority support</li>
                            </ul>
                        </div>

                        <a href="/onboarding" className="mt-8 block w-full text-center py-3 border-2 border-[#111] bg-[#111] text-white hover:bg-transparent hover:text-[#111] font-mono text-[10px] font-bold tracking-widest uppercase transition-colors">
                            Unlock All Agents
                        </a>
                    </div>

                    {/* TIER 4 — AGENCY */}
                    <div className="p-8 border border-[#ddd] bg-[#fbfbfb] flex flex-col group hover:-translate-y-1 transition-transform duration-300">
                        <div className="mb-4">
                            <h3 className="font-mono text-[10px] text-[#777] tracking-[0.2em] uppercase font-bold mb-2">Tier 4 &mdash; Agency</h3>
                            <div className="font-sans font-bold text-4xl text-[#111]">Custom<span className="block text-sm text-[#777] font-normal mt-1">from $1,497/mo</span></div>
                        </div>
                        <p className="font-serif text-[#111] text-sm leading-relaxed font-bold mb-2">White-label Seleste for your agency. Run it for all your clients from one dashboard.</p>
                        <p className="font-sans text-[11px] text-[#666] italic mb-6">For marketing agencies managing 5+ local business clients.</p>

                        <div className="mb-6 border-y border-[#eee] py-4 bg-[#f4f4f4] -mx-8 px-8">
                            <div className="font-mono text-[10px] text-[#999] tracking-widest uppercase mb-3 font-bold">Access Includes</div>
                            <ul className="space-y-2 font-mono text-[11px]">
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> All 5 Agents</li>
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> White-label UI</li>
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> Multi-client dashboard</li>
                                <li className="flex items-center gap-2 text-[#111]"><span className="text-[#2a7a6f] text-sm">✅</span> API Access</li>
                            </ul>
                        </div>

                        <div className="flex-grow">
                            <ul className="space-y-3 font-sans text-[13px] text-[#555]">
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> <span className="font-bold text-[#111] underline decoration-[#ccc] underline-offset-2">Everything in Dominate</span></li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> Multi-location client dashboard</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> White-label PDF reports</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> API & webhook access</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> Dedicated success manager</li>
                                <li className="flex justify-start items-start gap-2"><span className="text-[#ccc]">&bull;</span> Custom onboarding for your team</li>
                            </ul>
                        </div>

                        <a href="/agencies" className="mt-8 block w-full text-center py-3 border border-[#ccc] hover:border-[#111] font-mono text-[10px] font-bold tracking-widest text-[#555] hover:text-[#111] uppercase transition-colors">
                            Talk to Sales
                        </a>
                    </div>
                </div>

                {/* Add-Ons Section */}
                <div className="mb-32">
                    <div className="text-center mb-10">
                        <h3 className="font-sans text-[2rem] font-bold text-[#111]">Boost any plan with add-ons</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-8 border border-[#ddd] shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                            <div className="font-sans font-bold text-xl mb-1 text-[#111]">Fast-Track Onboarding</div>
                            <div className="font-mono text-xs text-[#2a7a6f] font-bold mb-4 border-b border-[#eee] pb-4">$299 one-time</div>
                            <p className="text-sm text-[#666] leading-relaxed flex-grow">White-glove setup &mdash; we configure your integrations, run your first audit, and walk you through your 90-day plan on a live call.</p>
                        </div>
                        <div className="bg-white p-8 border border-[#ddd] shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                            <div className="font-sans font-bold text-xl mb-1 text-[#111]">Ad Management Fee</div>
                            <div className="font-mono text-xs text-[#2a7a6f] font-bold mb-4 border-b border-[#eee] pb-4">12% of ad spend/month</div>
                            <p className="text-sm text-[#666] leading-relaxed flex-grow">Let Seleste fully manage your ad budget on your behalf. Applied on top of your plan. Requires Grow tier or above. Minimum $200/month ad spend.</p>
                        </div>
                        <div className="bg-white p-8 border border-[#ddd] shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                            <div className="font-sans font-bold text-xl mb-1 text-[#111]">Stakeholder Reports</div>
                            <div className="font-mono text-xs text-[#2a7a6f] font-bold mb-4 border-b border-[#eee] pb-4">$49/month</div>
                            <p className="text-sm text-[#666] leading-relaxed flex-grow">Monthly branded PDF reports formatted for sharing with partners, investors, or franchise networks. Includes before/after score comparison and ROI summary. Available on all tiers.</p>
                        </div>
                    </div>
                </div>

                {/* Upgrade Journey Section */}
                <div className="mb-32 border-t border-[#222]/10 pt-24 relative">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h3 className="font-sans text-3xl font-bold text-[#111] mb-5">Most customers upgrade themselves &mdash; here's why</h3>
                        <p className="text-[#666] italic font-serif leading-[1.8] text-lg">
                            Seleste is designed so you feel the value at every stage before spending more. Each upgrade is triggered by results &mdash; not a sales call.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 relative isolate">
                        {/* Horizontal Line connector (Desktop) */}
                        <div className="hidden lg:block absolute top-[110px] left-0 right-0 h-0.5 bg-gradient-to-r from-[#2a7a6f]/10 via-[#2a7a6f]/40 to-[#2a7a6f]/10 -z-10"></div>

                        {/* Stage 1 */}
                        <div className="flex-1 flex flex-col">
                            <div className="w-[4.5rem] h-[4.5rem] rounded-full border-4 border-[#f4ebe1] bg-[#2a7a6f] text-white flex items-center justify-center font-mono font-bold text-lg mx-auto mb-6 shadow-md relative z-10 transition-transform hover:scale-105">
                                01
                            </div>
                            <div className="bg-white p-6 md:p-8 border border-[#ddd] rounded-xl flex-grow flex flex-col shadow-sm">
                                <div className="font-mono text-[10px] text-[#2a7a6f] tracking-[0.2em] font-bold uppercase mb-3">Stage 1 &bull; Signup</div>
                                <h4 className="font-sans font-bold text-lg mb-3 text-[#111]">Starts on Diagnose ($97)</h4>
                                <p className="text-[13px] text-[#666] leading-relaxed mb-8 flex-grow">Low commitment entry. Audit Agent and Opportunity Agent activate immediately. First Quality Score delivered within 24 hours. Most customers see a quick win in the first 7 days.</p>

                                <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-r-2xl rounded-bl-2xl rounded-tl-sm p-4 relative mt-auto shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-5 h-5 bg-[#2a7a6f] rounded flex items-center justify-center text-[10px] text-white font-bold">S</div>
                                        <span className="font-mono text-[10px] font-bold text-[#111] tracking-widest uppercase text-opacity-80">Seleste AI</span>
                                    </div>
                                    <p className="font-sans text-[13.5px] text-[#333] leading-relaxed italic">"Your score jumped from 42 to 61 this month. Here's what moved the needle."</p>
                                </div>
                            </div>
                        </div>

                        {/* Stage 2 */}
                        <div className="flex-1 flex flex-col mt-8 lg:mt-0">
                            <div className="w-[4.5rem] h-[4.5rem] rounded-full border-4 border-[#f4ebe1] bg-[#2a7a6f] text-white flex items-center justify-center font-mono font-bold text-lg mx-auto mb-6 shadow-md relative z-10 transition-transform hover:scale-105">
                                02
                            </div>
                            <div className="bg-white p-6 md:p-8 border border-[#ddd] rounded-xl flex-grow flex flex-col shadow-sm">
                                <div className="font-mono text-[10px] text-[#2a7a6f] tracking-[0.2em] font-bold uppercase mb-3">Stage 2 &bull; Day 14-30</div>
                                <h4 className="font-sans font-bold text-lg mb-3 text-[#111]">Natural pull toward Grow ($297)</h4>
                                <p className="text-[13px] text-[#666] leading-relaxed mb-8 flex-grow">The Opportunity Agent spots a Google Ads gap a competitor isn't covering. It drafts the campaign &mdash; but needs the Campaign Agent to launch it. The owner sees exactly what they're missing.</p>

                                <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-r-2xl rounded-bl-2xl rounded-tl-sm p-4 relative mt-auto shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-5 h-5 bg-[#2a7a6f] rounded flex items-center justify-center text-[10px] text-white font-bold">S</div>
                                        <span className="font-mono text-[10px] font-bold text-[#111] tracking-widest uppercase text-opacity-80">Seleste AI</span>
                                    </div>
                                    <p className="font-sans text-[13.5px] text-[#333] leading-relaxed italic">"I've drafted a campaign targeting emergency HVAC calls in your area. Upgrade to Grow and I'll launch it today."</p>
                                </div>
                            </div>
                        </div>

                        {/* Stage 3 */}
                        <div className="flex-1 flex flex-col mt-8 lg:mt-0">
                            <div className="w-[4.5rem] h-[4.5rem] rounded-full border-4 border-[#f4ebe1] bg-[#2a7a6f] text-white flex items-center justify-center font-mono font-bold text-lg mx-auto mb-6 shadow-md relative z-10 transition-transform hover:scale-105">
                                03
                            </div>
                            <div className="bg-white p-6 md:p-8 border border-[#ddd] rounded-xl flex-grow flex flex-col shadow-sm">
                                <div className="font-mono text-[10px] text-[#2a7a6f] tracking-[0.2em] font-bold uppercase mb-3">Stage 3 &bull; Day 60-90</div>
                                <h4 className="font-sans font-bold text-lg mb-3 text-[#111]">Natural pull toward Dominate ($597)</h4>
                                <p className="text-[13px] text-[#666] leading-relaxed mb-8 flex-grow">Campaigns are running and ROAS is positive. The Creative Agent generates a sample ad &mdash; better copy, a competitor counter-offer &mdash; and shows it as a preview. The gap is visible.</p>

                                <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-r-2xl rounded-bl-2xl rounded-tl-sm p-4 relative mt-auto shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-5 h-5 bg-[#2a7a6f] rounded flex items-center justify-center text-[10px] text-white font-bold">S</div>
                                        <span className="font-mono text-[10px] font-bold text-[#111] tracking-widest uppercase text-opacity-80">Seleste AI</span>
                                    </div>
                                    <p className="font-sans text-[13.5px] text-[#333] leading-relaxed italic">"Your ads have run for 6 weeks. I've written 3 alternatives that should outperform them. Unlock Creative Agent to test them."</p>
                                </div>
                            </div>
                        </div>

                        {/* Stage 4 */}
                        <div className="flex-1 flex flex-col mt-8 lg:mt-0">
                            <div className="w-[4.5rem] h-[4.5rem] rounded-full border-4 border-[#f4ebe1] bg-[#2a7a6f] text-white flex items-center justify-center font-mono font-bold text-lg mx-auto mb-6 shadow-md relative z-10 transition-transform hover:scale-105">
                                04
                            </div>
                            <div className="bg-white p-6 md:p-8 border border-[#ddd] rounded-xl flex-grow flex flex-col shadow-sm">
                                <div className="font-mono text-[10px] text-[#2a7a6f] tracking-[0.2em] font-bold uppercase mb-3">Stage 4 &bull; Month 6+</div>
                                <h4 className="font-sans font-bold text-lg mb-3 text-[#111]">Renewal or Agency expansion</h4>
                                <p className="text-[13px] text-[#666] leading-relaxed mb-8 flex-grow">Seleste delivers a report with estimated pipeline value generated. The ROI case for renewal is built in. Growing businesses expand to Agency.</p>

                                <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-r-2xl rounded-bl-2xl rounded-tl-sm p-4 relative mt-auto shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-5 h-5 bg-[#2a7a6f] rounded flex items-center justify-center text-[10px] text-white font-bold">S</div>
                                        <span className="font-mono text-[10px] font-bold text-[#111] tracking-widest uppercase text-opacity-80">Seleste AI</span>
                                    </div>
                                    <p className="font-sans text-[13.5px] text-[#333] leading-relaxed italic">"In 90 days, your campaigns generated an estimated $28,400 in pipeline from $3,600 in ad spend. Here's the next 90-day plan."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto border-t border-[#222]/10 pt-24 pb-12">
                    <h3 className="font-sans text-4xl font-bold text-[#111] mb-12 text-center tracking-tight">Frequently Asked Questions</h3>

                    <div className="space-y-10">
                        <div className="border-b border-[#ddd] pb-10">
                            <h4 className="font-sans font-bold text-xl mb-4 text-[#111]">Can I choose which agents I want?</h4>
                            <p className="text-[#555] font-serif leading-[1.8] text-[17px]">
                                No &mdash; and that's intentional. Seleste assigns the right agents for each stage of your business. Giving you a list of agents to pick from would be like a doctor asking you to choose your own prescription. We've designed each plan to work as a complete system. Start where you are, and the right agents will always be active for your current goals.
                            </p>
                        </div>

                        <div className="border-b border-[#ddd] pb-10">
                            <h4 className="font-sans font-bold text-xl mb-4 text-[#111]">What's an AI agent, exactly?</h4>
                            <p className="text-[#555] font-serif leading-[1.8] text-[17px]">
                                Think of each agent as a specialist on your marketing team who works in the background 24/7. The Audit Agent watches your website and digital presence for problems. The Opportunity Agent spots gaps your competitors are missing. The Campaign Agent launches and manages your ads. They all work together automatically &mdash; you just review and approve the important decisions.
                            </p>
                        </div>

                        <div className="border-b border-[#ddd] pb-10">
                            <h4 className="font-sans font-bold text-xl mb-4 text-[#111]">What happens if I want to upgrade later?</h4>
                            <p className="text-[#555] font-serif leading-[1.8] text-[17px]">
                                You can upgrade at any time &mdash; mid-month changes are prorated. Most customers upgrade naturally when Seleste surfaces an opportunity that requires the next tier to execute. You'll never be pushed to upgrade; you'll see exactly what you're missing and decide when it makes sense.
                            </p>
                        </div>

                        <div className="pb-10">
                            <h4 className="font-sans font-bold text-xl mb-4 text-[#111]">Do I need to connect my ad accounts?</h4>
                            <p className="text-[#555] font-serif leading-[1.8] text-[17px]">
                                On Diagnose ($97), no ad accounts needed &mdash; Seleste audits your website, Google Business Profile, and online presence without them. On Grow ($297) and above, connecting Google Ads and Meta Ads unlocks the Campaign and Budget Agents. The onboarding flow walks you through connecting everything in under 10 minutes.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
