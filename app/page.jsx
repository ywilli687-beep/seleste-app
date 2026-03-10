import Link from 'next/link';
import { ArrowRight, BarChart3, Bot, Zap, ShieldCheck, Key } from 'lucide-react';
import PricingSection from '../components/layout/PricingSection';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#f4ebe1] text-[#111] font-serif selection:bg-[#2a7a6f] selection:text-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden bg-[#f4ebe1]">
                <div className="max-w-[85rem] mx-auto px-8 relative z-10 flex flex-col lg:flex-row items-center gap-20">

                    {/* Left Column: Copy & CTA */}
                    <div className="flex-1 text-left w-full pl-0 lg:pl-4">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-[2px] bg-[#2a7a6f]"></div>
                            <span className="font-mono text-xs font-bold text-[#2a7a6f] tracking-[0.25em] uppercase">Built for Local Business Owners</span>
                        </div>

                        <h1 className="font-serif text-6xl md:text-7xl lg:text-[5.5rem] font-bold mb-6 leading-[1.05] tracking-tight text-[#111]">
                            More customers.<br />
                            <span className="font-serif italic text-[#2a7a6f] font-normal tracking-normal">Less guessing.</span>
                        </h1>

                        <p className="text-xl md:text-[22px] text-[#555] font-serif italic mb-12 leading-relaxed max-w-lg">
                            Seleste looks at your business online, gives you a clear score, and shows you exactly what's stopping people from finding and contacting you &mdash; then helps you fix it.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <a
                                href="/onboarding"
                                className="w-full sm:w-auto px-8 py-4 bg-[#2a7a6f] text-white font-bold font-mono text-[13px] tracking-widest uppercase transition-colors hover:bg-[#1e584f] text-center flex justify-center items-center h-14"
                            >
                                Get Your Free Audit <span className="ml-3 font-mono text-[10px]">▶</span>
                            </a>
                            <a
                                href="/products"
                                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#111] text-[#111] font-bold font-mono text-[13px] tracking-widest uppercase hover:bg-[#111] hover:text-[#f4ebe1] transition-all text-center flex justify-center items-center h-14"
                            >
                                Explore Product Suite &rarr;
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Audit Score Card UI */}
                    <div className="flex-1 w-full max-w-lg mx-auto lg:max-w-none relative z-20 group animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
                        {/* Glowing backdrop */}
                        <div className="absolute -inset-4 bg-teal/10 rounded-2xl blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>

                        {/* The Application Shell */}
                        <div className="relative rounded-xl overflow-hidden border border-dark-s3 shadow-[0_20px_80px_-15px_rgba(0,0,0,0.8)] bg-[#0d0d0d] flex flex-col">
                            {/* Browser Header */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-dark-s3 bg-[#111]">
                                <div className="w-2.5 h-2.5 rounded-full bg-rust" />
                                <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                                <div className="w-2.5 h-2.5 rounded-full bg-teal" />
                                <div className="mx-auto font-mono text-[9px] text-dark-s3 tracking-widest uppercase">
                                    seleste.app - audit results
                                </div>
                            </div>

                            {/* Audit Content */}
                            <div className="p-8 flex flex-col gap-8 text-left">
                                {/* Header */}
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#00e5c7]" />
                                    <span className="font-mono font-bold text-[#00e5c7] tracking-[0.2em] text-[11px] uppercase">Seleste</span>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start gap-8 border-b-2 border-[#121212] pb-10">
                                    <div className="relative w-20 h-20 rounded-full border-[5px] border-[#18181b] flex items-center justify-center flex-shrink-0">
                                        <div className="absolute inset-0 rounded-full border-[5px] border-[#eab308] border-r-transparent border-t-transparent origin-center -rotate-45" />
                                        <span className="font-mono font-bold text-2xl text-[#f4ebe1]">42</span>
                                    </div>
                                    <div className="pt-1">
                                        <div className="font-mono text-[9px] text-[#71717a] tracking-[0.2em] uppercase mb-2">Smith's Plumbing &bull; Digital Audit</div>
                                        <div className="font-mono text-[10px] font-bold text-[#eab308] tracking-[0.2em] uppercase mb-3">Fair</div>
                                        <p className="text-[#a1a1aa] font-mono text-xs leading-[1.8] italic">
                                            "Hard to find online &mdash; 3 things are stopping customers from calling you."
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Win block */}
                                <div className="border border-[#064e3b] bg-[#022c22]/50 p-5">
                                    <div className="font-mono text-[10px] text-[#34d399] font-bold tracking-[0.2em] uppercase mb-3">This Week's Quick Win</div>
                                    <p className="text-[#a1a1aa] font-mono text-xs leading-[1.8]">Claim and complete your Google Business Profile &mdash; 40% of local searches show map results before websites.</p>
                                </div>

                                {/* Task List */}
                                <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 py-3.5 px-5 border border-[#18181b] bg-[#121212] text-xs font-mono">
                                        <span className="flex-shrink-0 px-2 py-1 bg-[#ef4444]/10 text-[#ef4444] font-bold tracking-widest text-[9px] uppercase"><span className="text-[10px] mr-1.5">•</span> Urgent</span>
                                        <span className="text-[#a1a1aa]">You can't see where your leads are coming from</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 py-3.5 px-5 border border-[#18181b] bg-[#121212] text-xs font-mono">
                                        <span className="flex-shrink-0 px-2 py-1 bg-[#ef4444]/10 text-[#ef4444] font-bold tracking-widest text-[9px] uppercase"><span className="text-[10px] mr-1.5">•</span> Urgent</span>
                                        <span className="text-[#a1a1aa]">Your Google listing is missing photos and info</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 py-3.5 px-5 border border-[#18181b] bg-[#121212] text-xs font-mono">
                                        <span className="flex-shrink-0 px-2 py-1 bg-[#eab308]/10 text-[#eab308] font-bold tracking-widest text-[9px] uppercase"><span className="text-[10px] mr-1.5">•</span> Worth Fixing</span>
                                        <span className="text-[#a1a1aa]">Phone calls aren't being tracked as enquiries</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 py-3.5 px-5 border border-[#18181b] bg-[#121212] text-xs font-mono">
                                        <span className="flex-shrink-0 px-2 py-1 bg-[#eab308]/10 text-[#eab308] font-bold tracking-widest text-[9px] uppercase"><span className="text-[10px] mr-1.5">•</span> Worth Fixing</span>
                                        <span className="text-[#a1a1aa]">No clear "call us" button when people land on your site</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 py-3.5 px-5 border border-[#18181b] bg-[#121212] text-xs font-mono">
                                        <span className="flex-shrink-0 px-2 py-1 bg-[#10b981]/10 text-[#10b981] font-bold tracking-widest text-[9px] uppercase"><span className="text-[12px] mr-1.5">✓</span> Going Well</span>
                                        <span className="text-[#a1a1aa]">Your site loads fast on phones</span>
                                    </div>
                                </div>

                                {/* Bottom Agents */}
                                <div className="pt-8 mt-2">
                                    <div className="font-mono text-[9px] text-[#52525b] tracking-[0.2em] uppercase mb-4">13 Agents Ready</div>
                                    <div className="flex flex-wrap gap-2.5">
                                        {['Director', 'Paid Media', 'GA4', 'Copy', 'Intel', 'Offer', 'Loop', 'Social'].map((agent, i) => (
                                            <span key={agent} className={`px-2.5 py-1.5 border border-[#18181b] bg-[#121212] text-[9px] font-mono tracking-widest uppercase flex items-center gap-2 ${i <= 1 ? 'text-[#00e5c7]' : 'text-[#71717a]'}`}>
                                                {(i === 0 || i === 1) && <div className="w-1.5 h-1.5 rounded-full bg-[#00e5c7]" />}
                                                {agent}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Our Goal Section */}
            <section id="goal" className="py-24 bg-[#f4ebe1] relative z-20">
                <div className="max-w-[85rem] mx-auto px-8">

                    <div className="mb-20 mt-10">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="font-mono text-[11px] font-bold text-[#2a7a6f] tracking-[0.25em] uppercase">Our Goal</span>
                        </div>

                        <h2 className="font-sans text-4xl md:text-[2.5rem] lg:text-[3rem] font-bold mb-8 leading-[1.2] tracking-tight text-[#111]">
                            Every local business deserves a <span className="font-serif italic text-[#2a7a6f] font-normal tracking-normal">great marketing team</span>
                        </h2>

                        <p className="text-[17px] text-[#555] font-serif mb-12 leading-[1.8] max-w-2xl">
                            A marketing agency charges $5,000&ndash;15,000 a month to do what Seleste does in minutes. We think that's unfair. Good advice shouldn't only be available to businesses with deep pockets.
                        </p>
                    </div>

                    {/* 3 Column Grid */}
                    <div className="grid md:grid-cols-3 border-[2px] border-[#111] bg-[#f4ebe1]">

                        {/* Column 1 */}
                        <div className="p-10 border-b-[2px] md:border-b-0 md:border-r-[2px] border-[#111] flex flex-col">
                            <div className="font-serif italic text-[5rem] text-[#ddd] mb-8 leading-none">01</div>
                            <h3 className="font-sans font-bold text-lg mb-4 text-[#111]">See what's really going on</h3>
                            <p className="font-serif italic text-[#666] text-[15px] leading-relaxed">
                                We give you an honest score &mdash; not a flattering one. Most local businesses have 3&ndash;5 things working against them. We find every one.
                            </p>
                        </div>

                        {/* Column 2 */}
                        <div className="p-10 border-b-[2px] md:border-b-0 md:border-r-[2px] border-[#111] flex flex-col">
                            <div className="font-serif italic text-[5rem] text-[#ddd] mb-8 leading-none">02</div>
                            <h3 className="font-sans font-bold text-lg mb-4 text-[#111]">Get a team working on it</h3>
                            <p className="font-serif italic text-[#666] text-[15px] leading-relaxed">
                                13 specialists tackle your business together &mdash; each one knows what the others are doing, so nothing falls through the cracks.
                            </p>
                        </div>

                        {/* Column 3 */}
                        <div className="p-10 flex flex-col">
                            <div className="font-serif italic text-[5rem] text-[#ddd] mb-8 leading-none">03</div>
                            <h3 className="font-sans font-bold text-lg mb-4 text-[#111]">Keep improving week by week</h3>
                            <p className="font-serif italic text-[#666] text-[15px] leading-relaxed">
                                Seleste checks in every week, looks at what's working, and figures out what to focus on next. It never stops working for you.
                            </p>
                        </div>

                    </div>

                    {/* CTA below grid */}
                    <div className="mt-20 text-center pb-20 border-b-[0.5px] border-[#222]/20">
                        <a
                            href="/onboarding"
                            className="inline-flex px-10 py-5 bg-[#111] text-[#f4ebe1] font-bold font-mono text-[13px] tracking-widest uppercase transition-colors hover:bg-transparent hover:text-[#111] border-2 border-[#111] items-center justify-center text-center mx-auto"
                        >
                            Build Your Growth Team &rarr;
                        </a>
                    </div>
                </div>
            </section>

            {/* Who We Are Section */}
            <section id="who" className="py-24 bg-[#f4ebe1] relative z-20">
                <div className="max-w-[85rem] mx-auto px-8">
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                        {/* Left Column: Copy & Quote */}
                        <div className="flex-1 lg:max-w-2xl">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="font-mono text-[11px] font-bold text-[#2a7a6f] tracking-[0.25em] uppercase">Who We Are</span>
                            </div>

                            <h2 className="font-sans text-4xl md:text-[3.25rem] font-bold mb-10 leading-[1.1] tracking-tight text-[#111]">
                                We are <span className="font-serif italic text-[#2a7a6f] font-normal tracking-normal">people who use AI</span><br />&mdash; not just AI
                            </h2>

                            <div className="border-l-[3px] border-[#2a7a6f] pl-8 mb-12">
                                <p className="text-[22px] md:text-[26px] text-[#333] font-serif italic mb-8 leading-[1.5]">
                                    "Seleste gives you the same thinking a good marketing team would &mdash; but without the agency price tag. The AI does the heavy lifting. <span className="font-bold text-[#2a7a6f]">People make the calls.</span>"
                                </p>
                                <span className="font-mono text-[10px] font-bold text-[#777] tracking-[0.2em] uppercase">
                                    &mdash; The Seleste Philosophy
                                </span>
                            </div>

                            <div className="space-y-6 text-[#555] font-serif text-[17px] leading-[1.8] pr-0 lg:pr-12">
                                <p>
                                    We've spent years helping local businesses grow &mdash; working on ads, websites, and marketing strategy. Seleste is the tool we always wished existed. Now any business owner can access it, not just the ones with big budgets.
                                </p>
                                <p>
                                    AI makes us faster. Experience means we know what actually works.
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Values Cards */}
                        <div className="flex-1 flex flex-col gap-6 lg:mt-6">

                            {/* Card 1 */}
                            <div className="bg-white border-[0.5px] border-[#ddd] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex gap-6">
                                <span className="text-xl mt-0.5 opacity-80" role="img" aria-label="brain">🧠</span>
                                <div>
                                    <h4 className="font-sans font-bold text-[#111] text-[17px] mb-2 leading-tight">Built on real expertise</h4>
                                    <p className="font-serif italic text-[#666] text-[14px] leading-relaxed">
                                        Every AI assistant runs on advice developed by experienced marketers &mdash; not just whatever a chatbot guesses.
                                    </p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white border-[0.5px] border-[#ddd] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex gap-6">
                                <span className="text-xl mt-0.5 opacity-80" role="img" aria-label="search">🔍</span>
                                <div>
                                    <h4 className="font-sans font-bold text-[#111] text-[17px] mb-2 leading-tight">We tell you the truth</h4>
                                    <p className="font-serif italic text-[#666] text-[14px] leading-relaxed">
                                        We show you what's actually broken, not a watered-down version. Most local businesses have 3&ndash;5 real problems costing them customers. We find them.
                                    </p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white border-[0.5px] border-[#ddd] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex gap-6">
                                <span className="text-xl mt-0.5 opacity-80" role="img" aria-label="lightning">⚡</span>
                                <div>
                                    <h4 className="font-sans font-bold text-[#111] text-[17px] mb-2 leading-tight">Fast, but not reckless</h4>
                                    <p className="font-serif italic text-[#666] text-[14px] leading-relaxed">
                                        We move quickly, but we don't change everything at once. Too many changes at the same time makes it impossible to know what's working.
                                    </p>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-white border-[0.5px] border-[#ddd] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex gap-6">
                                <span className="text-xl mt-0.5 opacity-80" role="img" aria-label="handshake">🤝</span>
                                <div>
                                    <h4 className="font-sans font-bold text-[#111] text-[17px] mb-2 leading-tight">You're always in charge</h4>
                                    <p className="font-serif italic text-[#666] text-[14px] leading-relaxed">
                                        Seleste shows you the plan and explains the thinking. You decide what to act on. Nothing happens without you.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mt-24 border-b-[0.5px] border-[#222]/20"></div>

                </div>
            </section>

            {/* The Problem / Agitation Section */}
            <section className="py-32 bg-[#121212] border-t border-[#1a1a1a] relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                            <span className="text-[#333333]">Running a local business is hard.</span> <br />
                            <span className="text-[#e2583e]">Marketing it shouldn't be a black box.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-[#566573] font-serif italic max-w-3xl mx-auto">
                            Most owners are stuck in a cycle of guessing, paying agencies that over-promise, and staring at metrics that don't make sense.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-20">
                        {/* Pain Point 1 */}
                        <div className="p-8 md:p-10 border border-[#1c1c1c] rounded-2xl bg-[#0a0a0a] flex flex-col sm:flex-row items-start gap-6 hover:border-[#e2583e]/50 transition-colors">
                            <div className="min-w-12 h-12 rounded-full bg-[#2a1411] text-[#e2583e] flex items-center justify-center font-bold font-mono text-sm">01</div>
                            <div>
                                <h4 className="font-display font-bold text-2xl mb-3 text-[#444444]">Invisibility</h4>
                                <p className="text-[#777777] text-sm leading-[1.8]">You don't know what's actually stopping customers from finding you online or why competitors rank higher.</p>
                            </div>
                        </div>

                        {/* Pain Point 2 */}
                        <div className="p-8 md:p-10 border border-[#1c1c1c] rounded-2xl bg-[#0a0a0a] flex flex-col sm:flex-row items-start gap-6 hover:border-[#e2583e]/50 transition-colors">
                            <div className="min-w-12 h-12 rounded-full bg-[#2a1411] text-[#e2583e] flex items-center justify-center font-bold font-mono text-sm">02</div>
                            <div>
                                <h4 className="font-display font-bold text-2xl mb-3 text-[#444444]">Disconnected Efforts</h4>
                                <p className="text-[#777777] text-sm leading-[1.8]">Your website, social media, and ads don't talk to each other. Your marketing efforts simply don't connect.</p>
                            </div>
                        </div>

                        {/* Pain Point 3 */}
                        <div className="p-8 md:p-10 border border-[#1c1c1c] rounded-2xl bg-[#0a0a0a] flex flex-col sm:flex-row items-start gap-6 hover:border-[#e2583e]/50 transition-colors">
                            <div className="min-w-12 h-12 rounded-full bg-[#2a1411] text-[#e2583e] flex items-center justify-center font-bold font-mono text-sm">03</div>
                            <div>
                                <h4 className="font-display font-bold text-2xl mb-3 text-[#444444]">Zero Clarity</h4>
                                <p className="text-[#777777] text-sm leading-[1.8]">You're spending money, but you can't see whether anything is actually working or driving real revenue.</p>
                            </div>
                        </div>

                        {/* Pain Point 4 */}
                        <div className="p-8 md:p-10 border border-[#1c1c1c] rounded-2xl bg-[#0a0a0a] flex flex-col sm:flex-row items-start gap-6 hover:border-[#e2583e]/50 transition-colors">
                            <div className="min-w-12 h-12 rounded-full bg-[#2a1411] text-[#e2583e] flex items-center justify-center font-bold font-mono text-sm">04</div>
                            <div>
                                <h4 className="font-display font-bold text-2xl mb-3 text-[#444444]">Analysis Paralysis</h4>
                                <p className="text-[#777777] text-sm leading-[1.8]">Even if you have the data, you don't know what to do next to actually fix the bottlenecks.</p>
                            </div>
                        </div>
                    </div>

                    {/* Mid-page Capability CTA */}
                    <div className="bg-dark-bg border border-dark-s3 p-10 md:p-14 rounded-2xl text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rust via-gold to-teal" />
                        <h3 className="text-3xl font-display font-bold mb-6">Seleste solves the data, the strategy, and the execution.</h3>
                        <p className="text-dim max-w-3xl mx-auto mb-10 text-base leading-relaxed">
                            From instant technical audits and generative <i>Next-Best-Action</i> roadmaps, to fully autonomous AI agents that rewrite your SEO and manage your paid media—all tracked in one proprietary intelligence dashboard.
                        </p>
                        <a
                            href="/onboarding"
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-bold font-mono text-sm tracking-widest uppercase rounded hover:bg-teal hover:text-white transition-all transform hover:scale-105"
                        >
                            Run Free Growth Audit <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </section>

            {/* THE FULL SUITE SECTION (PART B) */}
            <section className="py-32 bg-[#fffcf8] border-b border-[#222]/10 relative">
                <div className="max-w-[85rem] mx-auto px-8">
                    <div className="text-center mb-16">
                        <span className="font-mono text-[11px] font-bold text-[#2a7a6f] tracking-[0.25em] uppercase block mb-4">The Full Suite</span>
                        <h2 className="font-sans text-4xl md:text-5xl font-bold mb-4 text-[#111]">Every product your business needs. <span className="italic font-serif text-[#2a7a6f] tracking-normal">Built to work as one system.</span></h2>
                        <p className="text-[#555] font-serif text-xl italic max-w-3xl mx-auto">
                            From weekly audits to live ad campaigns — Seleste covers every part of your digital growth. Here's what's inside.
                        </p>
                    </div>

                    <div className="flex flex-col gap-16">
                        {/* ROW 1 — CORE PLATFORM (4 Cards) */}
                        <div>
                            <h3 className="font-mono text-[10px] font-bold text-[#111] tracking-widest uppercase mb-6 border-b-2 border-[#111] pb-2 inline-block">Core Platform</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Card 1 */}
                                <div className="bg-white border-[2px] border-[#111] p-6 shadow-[4px_4px_0px_#111] flex flex-col hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl">🔍</span>
                                        <span className="px-2 py-0.5 bg-[#111] text-[#fffcf8] text-[8px] font-mono tracking-widest uppercase font-bold">All Plans</span>
                                    </div>
                                    <h4 className="font-sans font-bold text-[#111] text-lg mb-2">Digital Presence Audit</h4>
                                    <p className="text-[#555] text-sm font-serif leading-relaxed flex-1">Weekly Quality Score across 6 domains. Plain-English findings, ranked by impact.</p>
                                </div>
                                {/* Card 2 */}
                                <div className="bg-white border-[2px] border-[#111] p-6 shadow-[4px_4px_0px_#111] flex flex-col hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl">🗺️</span>
                                        <span className="px-2 py-0.5 bg-[#111] text-[#fffcf8] text-[8px] font-mono tracking-widest uppercase font-bold">All Plans</span>
                                    </div>
                                    <h4 className="font-sans font-bold text-[#111] text-lg mb-2">90-Day Roadmap</h4>
                                    <p className="text-[#555] text-sm font-serif leading-relaxed flex-1">A personalised, live action plan built from your audit and updated as you grow.</p>
                                </div>
                                {/* Card 3 */}
                                <div className="bg-white border-[2px] border-[#111] p-6 shadow-[4px_4px_0px_#111] flex flex-col hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl">✅</span>
                                        <span className="px-2 py-0.5 bg-[#111] text-[#fffcf8] text-[8px] font-mono tracking-widest uppercase font-bold">All Plans</span>
                                    </div>
                                    <h4 className="font-sans font-bold text-[#111] text-lg mb-2">Approval Queue & Dashboard</h4>
                                    <p className="text-[#555] text-sm font-serif leading-relaxed flex-1">Every agent action reviewed by you before it goes live. Full visibility, always.</p>
                                </div>
                                {/* Card 4 */}
                                <div className="bg-white border-[2px] border-[#111] p-6 shadow-[4px_4px_0px_#111] flex flex-col hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl">🧠</span>
                                        <span className="px-2 py-0.5 bg-[#111] text-[#fffcf8] text-[8px] font-mono tracking-widest uppercase font-bold">All Plans</span>
                                    </div>
                                    <h4 className="font-sans font-bold text-[#111] text-lg mb-2">Living Memory Bank</h4>
                                    <p className="text-[#555] text-sm font-serif leading-relaxed flex-1">Seleste learns your business continuously — and never asks for the same thing twice.</p>
                                </div>
                            </div>
                        </div>

                        {/* ROW 2 — THE AI AGENTS (5 Cards) */}
                        <div>
                            <h3 className="font-mono text-[10px] font-bold text-[#d97706] tracking-widest uppercase mb-6 border-b-2 border-[#d97706] pb-2 inline-block">The AI Agents</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                                {/* Agent 1 */}
                                <div className="bg-[#f0f9f8] border-[2px] border-[#111] p-6 shadow-[4px_4px_0px_#111] flex flex-col hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl">🔍</span>
                                        <span className="px-2 py-0.5 border border-[#ccc] text-[#555] text-[8px] font-mono tracking-widest uppercase font-bold">All Plans</span>
                                    </div>
                                    <h4 className="font-sans font-bold text-[#111] text-lg mb-2">Audit Agent</h4>
                                    <p className="text-[#555] text-sm font-serif leading-relaxed flex-1">Runs every Monday. Catches problems before they cost you calls.</p>
                                </div>
                                {/* Agent 2 */}
                                <div className="bg-[#fff8f0] border-[2px] border-[#111] p-6 shadow-[4px_4px_0px_#111] flex flex-col hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl">🎯</span>
                                        <span className="px-2 py-0.5 border border-[#ccc] text-[#555] text-[8px] font-mono tracking-widest uppercase font-bold">All Plans</span>
                                    </div>
                                    <h4 className="font-sans font-bold text-[#111] text-lg mb-2">Opportunity Agent</h4>
                                    <p className="text-[#555] text-sm font-serif leading-relaxed flex-1">Scans every Wednesday for gaps your competitors are missing.</p>
                                </div>
                                {/* Agent 3 */}
                                <div className="bg-[#f5eeff] border-[2px] border-[#111] p-6 shadow-[4px_4px_0px_#111] flex flex-col hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl">📡</span>
                                        <span className="px-2 py-0.5 bg-[#111] text-[#00e5c7] text-[8px] font-mono tracking-widest uppercase font-bold flex items-center gap-1"><Key size={10} /> Grow+</span>
                                    </div>
                                    <h4 className="font-sans font-bold text-[#111] text-lg mb-2">Campaign Agent</h4>
                                    <p className="text-[#555] text-sm font-serif leading-relaxed flex-1">Drafts and launches Google & Meta campaigns. Waits for your approval first.</p>
                                </div>
                                {/* Agent 4 */}
                                <div className="bg-[#fdf0ed] border-[2px] border-[#111] p-6 shadow-[4px_4px_0px_#111] flex flex-col hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl">💰</span>
                                        <span className="px-2 py-0.5 bg-[#111] text-[#00e5c7] text-[8px] font-mono tracking-widest uppercase font-bold flex items-center gap-1"><Key size={10} /> Grow+</span>
                                    </div>
                                    <h4 className="font-sans font-bold text-[#111] text-lg mb-2">Budget Agent</h4>
                                    <p className="text-[#555] text-sm font-serif leading-relaxed flex-1">Watches your ad spend every morning. Rebalances before it becomes a problem.</p>
                                </div>
                                {/* Agent 5 */}
                                <div className="bg-[#eff6ff] border-[2px] border-[#111] p-6 shadow-[4px_4px_0px_#111] flex flex-col hover:-translate-y-1 transition-transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl">🎨</span>
                                        <span className="px-2 py-0.5 bg-[#111] text-[#3b82f6] text-[8px] font-mono tracking-widest uppercase font-bold flex items-center gap-1"><Key size={10} /> Dominate</span>
                                    </div>
                                    <h4 className="font-sans font-bold text-[#111] text-lg mb-2">Creative Agent</h4>
                                    <p className="text-[#555] text-sm font-serif leading-relaxed flex-1">Writes your ads, runs A/B tests, and scales what converts.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/products" className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-[2px] border-[#111] text-[#111] font-bold font-mono text-[11px] tracking-widest uppercase hover:bg-[#111] hover:text-[#f4ebe1] hover:shadow-[4px_4px_0px_#111] transition-all">
                            See everything that's included <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Path to Value - Process Section */}
            <section id="features" className="py-32 bg-dark-s1 border-y border-dark-s3 relative">
                {/* Decorative Connection Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-teal/0 via-teal/20 to-teal/0 hidden md:block" />

                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 relative">
                        <div className="inline-flex py-1 px-3 border border-dark-s3 rounded-full text-xs font-mono tracking-widest text-teal uppercase mb-4 bg-dark-bg">
                            The Value Loop
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">From Blindspots to <span className="text-teal">Bottom Line</span></h2>
                        <p className="text-dim font-serif text-xl max-w-2xl mx-auto italic">A deterministic process designed to capture lost revenue in exactly 90 days.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Step 1 */}
                        <div className="bg-dark-bg border border-dark-s3 rounded-2xl p-8 hover:border-teal/50 transition-colors relative group">
                            <div className="w-12 h-12 bg-dark-s2 rounded-xl flex items-center justify-center mb-6 text-gold group-hover:scale-110 transition-transform">
                                <BarChart3 size={24} />
                            </div>
                            <h3 className="font-display font-bold text-xl mb-3">1. The Immediate Audit</h3>
                            <p className="text-dim text-sm leading-relaxed mb-6">
                                Provide your URL. Our crawlers instantly analyze your technical SEO, competitive positioning, and conversion friction to quantify exactly how many sales you are losing to rivals.
                            </p>
                            <div className="pt-6 border-t border-dark-s3 mt-auto">
                                <span className="text-[10px] font-bold font-mono text-teal uppercase tracking-widest">Payoff: Absolute Clarity</span>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-dark-bg border border-dark-s3 rounded-2xl p-8 hover:border-teal/50 transition-colors relative group">
                            <div className="absolute -top-3 -right-3">
                                <span className="bg-rust text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-widest">Crucial</span>
                            </div>
                            <div className="w-12 h-12 bg-dark-s2 rounded-xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="font-display font-bold text-xl mb-3">2. The 90-Day Roadmap</h3>
                            <p className="text-dim text-sm leading-relaxed mb-6">
                                We map every major bottleneck discovered into a prioritized, 90-day task pipeline sorted by mathematical ROI. No fluff. Just the actions statistically proven to move the needle.
                            </p>
                            <div className="pt-6 border-t border-dark-s3 mt-auto">
                                <span className="text-[10px] font-bold font-mono text-blue-400 uppercase tracking-widest">Payoff: A Strategic Blueprint</span>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-dark-bg border border-dark-s3 rounded-2xl p-8 hover:border-teal/50 transition-colors relative group">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal to-blue-400" />
                            <div className="w-12 h-12 bg-dark-s2 rounded-xl flex items-center justify-center mb-6 text-teal group-hover:scale-110 transition-transform">
                                <Bot size={24} />
                            </div>
                            <h3 className="font-display font-bold text-xl mb-3">3. Autonomous Execution</h3>
                            <p className="text-dim text-sm leading-relaxed mb-6">
                                Stop struggling to hire freelancers. Click "Deploy" and the Seleste Specialist Agents will execute the SEO, write the configurations, and deploy the code straight to your connected platforms.
                            </p>
                            <div className="pt-6 border-t border-dark-s3 mt-auto">
                                <span className="text-[10px] font-bold font-mono text-teal uppercase tracking-widest">Payoff: Done-For-You Growth</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Agent Preview Section */}
            <section id="agents" className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="font-display text-4xl font-bold mb-6">Meet Your New <br /><span className="text-teal">Marketing Team</span></h2>
                            <p className="text-dim mb-8 text-lg">
                                Seleste isn't just an analytics dashboard. It's a suite of 13 specialized AI models working together in a shared context window.
                            </p>

                            <ul className="space-y-4 font-mono text-sm text-dim">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-teal" />
                                    <strong className="text-white">Ops Orchestrator</strong> - Your acting CMO. Maps out sprints.
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    <strong className="text-white">Paid Media Agent</strong> - Optimizes CAC and manages budgets.
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                                    <strong className="text-white">SEO & Content Agent</strong> - Ranks your local landing pages.
                                </li>
                            </ul>
                        </div>

                        <div className="flex-1 w-full bg-dark-s1 border border-dark-s3 rounded-2xl p-8 shadow-2xl relative">
                            <div className="absolute -top-4 -right-4 bg-rust text-white text-xs font-bold px-3 py-1 rounded shadow-lg uppercase tracking-wider">
                                Paywall Protected
                            </div>
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dark-s3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00e5c7] to-[#00b89e] flex items-center justify-center text-xl">
                                    ⚙️
                                </div>
                                <div>
                                    <h4 className="font-display font-bold text-white">Ops Orchestrator</h4>
                                    <p className="text-xs font-mono text-teal">Online • Analyzing Audit</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-dark-s2 p-4 rounded-xl rounded-tl-sm w-5/6 text-sm text-dim leading-relaxed border border-dark-s3">
                                    "I've analyzed your 45/100 audit score. Your biggest blocker is lack of local GBP reviews. Shall I generate a 30-day reactivation email sequence to your past 100 customers to capture reviews?"
                                </div>
                                <div className="bg-teal text-dark-bg font-medium p-4 rounded-xl rounded-br-sm w-3/4 ml-auto text-sm leading-relaxed">
                                    Yes, draft the sequence and show me before sending.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <PricingSection />

            {/* Retro CTA Footer */}
            <footer className="py-24 bg-[#111] border-t-4 border-[#2a7a6f]">
                <div className="max-w-[85rem] mx-auto px-8 text-center flex flex-col items-center">
                    <h2 className="font-sans text-4xl md:text-5xl font-bold mb-6 text-[#f4ebe1]">Stop guessing. Start growing.</h2>
                    <p className="text-[#aaa] font-serif italic mb-10 text-[18px]">Get your baseline score for free today. Upgrade when you are ready to execute.</p>
                    <a
                        href="/onboarding"
                        className="inline-block px-12 py-5 bg-[#f4ebe1] text-[#111] font-bold font-mono text-[13px] tracking-widest uppercase transition-colors hover:bg-transparent hover:text-[#f4ebe1] border-2 border-[#f4ebe1]"
                    >
                        Start Free Audit
                    </a>
                </div>
            </footer>
        </div>
    );
}
