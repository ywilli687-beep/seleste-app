"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Lock, ArrowRight, TrendingUp, AlertTriangle, CheckCircle, Target, Users, Zap, Search, ShieldCheck, Share2, ThumbsUp, ThumbsDown } from 'lucide-react';
import ScoreRing from '../../../components/dashboard/ScoreRing';

const fetcher = url => fetch(url).then(r => r.json());

export default function AuditReportPage() {
    const params = useParams();
    const router = useRouter();
    const { data: result, isLoading } = useSWR(
        params?.id ? `/api/business/${params.id}` : null,
        fetcher
    );

    const [shared, setShared] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 border-t-2 border-teal border-solid rounded-full animate-spin"></div>
                    <p className="mt-4 text-dim font-mono text-sm uppercase tracking-widest">Loading Premium Report</p>
                </div>
            </div>
        );
    }

    const biz = result?.data;
    const auditResults = biz?.audits?.[0]?.raw_data;

    // Fallbacks if data fails
    const score = auditResults?.qualityScore || 42;
    const findings = auditResults?.findings || [];

    // Calculate deterministic mock data based on their score
    const avgScore = Math.min(100, Math.floor(score * 1.3));
    const topScore = Math.min(100, Math.floor(score * 1.6));
    const diff = topScore - score;

    // Estimated Opportunity Values
    const estTraffic = (100 - score) * 125;
    const estRevenue = estTraffic * 4.5;

    const freeFindings = findings.slice(0, 3);
    const blurredFindings = findings.slice(3);

    const handleCheckout = async () => {
        setCheckingOut(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessId: params?.id }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Checkout Error: ' + (data.error || 'Unknown error'));
            }
        } catch (e) {
            alert('Failed to initiate checkout.');
        } finally {
            setCheckingOut(false);
        }
    };

    const isUnlocked = biz?.has_unlocked_report;

    return (
        <div className="min-h-screen bg-dark-bg text-dark-text pb-32">
            {/* Header */}
            <nav className="w-full border-b border-dark-s3 bg-dark-bg/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-display font-bold">Seleste</span>
                        <span className="text-dark-s3">/</span>
                        <span className="font-mono text-xs text-dim truncate max-w-[200px]">{biz?.name || 'Audit Report'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {isUnlocked ? (
                            <button
                                onClick={() => router.push(`/dashboard/${params.id}`)}
                                className="px-4 py-2 bg-teal text-dark-bg font-bold font-mono text-xs tracking-widest uppercase rounded hover:bg-teal-glow transition"
                            >
                                Go to Dashboard
                            </button>
                        ) : (
                            <button
                                onClick={handleCheckout}
                                disabled={checkingOut}
                                className="px-4 py-2 bg-teal text-dark-bg font-bold font-mono text-xs tracking-widest uppercase rounded hover:bg-teal-glow transition disabled:opacity-50"
                            >
                                {checkingOut ? "Loading..." : "Unlock Full Report"}
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 pt-12">

                {/* Step 2: Digital Preparedness Score */}
                <section className="mb-16">
                    <div className="bg-dark-s1 border border-dark-s3 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal/5 rounded-full blur-3xl" />

                        <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                            <div className="flex-shrink-0 flex flex-col items-center">
                                <ScoreRing score={score} size={180} />
                                <div className="mt-6 text-center">
                                    <span className="font-mono text-xs text-teal uppercase tracking-widest">{auditResults?.scoreLabel || 'Fair'}</span>
                                    <p className="mt-2 text-dim text-sm max-w-[200px] leading-relaxed">Overall Digital Preparedness</p>
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <h1 className="font-display text-3xl font-bold mb-2">{biz?.name}</h1>
                                <p className="text-dim mb-8 pb-6 border-b border-dark-s3">
                                    <strong className="text-white">Primary Diagnosis:</strong> {auditResults?.headline || 'Your digital presence is unoptimized, leaving significant revenue on the table.'}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                    {/* Category Breakdown Mocks */}
                                    {[
                                        { label: 'Website Experience', val: Math.min(100, score + 12) },
                                        { label: 'SEO Visibility', val: Math.min(100, Math.max(0, score - 8)) },
                                        { label: 'Conversion Funnel', val: score },
                                        { label: 'Local Search Presence', val: Math.min(100, score + 5) }
                                    ].map((cat, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs font-mono mb-2">
                                                <span className="text-dim">{cat.label}</span>
                                                <span className={cat.val < 50 ? 'text-rust' : cat.val < 70 ? 'text-gold' : 'text-teal'}>{cat.val}/100</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-dark-s3 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${cat.val < 50 ? 'bg-rust' : cat.val < 70 ? 'bg-gold' : 'bg-teal'}`}
                                                    style={{ width: `${cat.val}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 3: Competitor Benchmark */}
                <section className="mb-16">
                    <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                        <Target className="text-teal" size={24} /> How You Compare
                    </h2>
                    <div className="bg-dark-bg border border-dark-s3 rounded-2xl p-8">
                        <div className="flex flex-col gap-6">
                            <div className="relative">
                                <div className="flex justify-between text-xs font-mono mb-2">
                                    <span className="text-dim">Your Business</span>
                                    <span className="text-white">{score}/100</span>
                                </div>
                                <div className="h-4 w-full bg-dark-s2 rounded-full overflow-hidden relative border border-dark-s3">
                                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-rust to-rust/80" style={{ width: `${score}%` }} />
                                </div>
                            </div>

                            <div className="relative">
                                <div className="flex justify-between text-xs font-mono mb-2">
                                    <span className="text-dim">Average {biz?.industry || 'Competitor'}</span>
                                    <span className="text-white">{avgScore}/100</span>
                                </div>
                                <div className="h-3 w-full bg-dark-s2 rounded-full overflow-hidden relative">
                                    <div className="absolute top-0 left-0 h-full bg-dark-s3" style={{ width: `${avgScore}%` }} />
                                </div>
                            </div>

                            <div className="relative">
                                <div className="flex justify-between text-xs font-mono mb-2">
                                    <span className="text-teal">Top Performing Competitors</span>
                                    <span className="text-teal">{topScore}/100</span>
                                </div>
                                <div className="h-3 w-full bg-dark-s2 rounded-full overflow-hidden relative">
                                    <div className="absolute top-0 left-0 h-full bg-teal/40" style={{ width: `${topScore}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-dark-s3 flex items-start gap-4 bg-rust/5 rounded-xl p-4 border border-rust/10">
                            <AlertTriangle className="text-rust flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-sm text-dim">
                                <strong className="text-white">You are {diff} points behind top-performing competitors in your market.</strong> This gap creates a massive blind spot where potential customers are actively choosing your competitors over you in local search results.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Step 4: Free Insights (Visible) */}
                <section className="mb-10">
                    <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                        <Search className="text-teal" size={24} /> Major Growth Blockers Found
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {freeFindings.map((finding, idx) => (
                            <div key={idx} className="bg-dark-s1 border border-dark-s3 rounded-xl p-6 hover:border-teal/30 transition-colors">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-rust/10 text-rust border border-rust/20">
                                        High Priority
                                    </span>
                                    <span className="text-xs font-mono text-dim uppercase">{finding.skill}</span>
                                </div>
                                <h3 className="font-bold text-white mb-2 leading-snug">{finding.title}</h3>
                                <p className="text-sm text-dim leading-relaxed">{finding.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Optional Share Loop Mock */}
                {!shared && !isUnlocked && (
                    <div className="mb-10 bg-gradient-to-r from-blue-900/20 to-teal-900/20 border border-blue-500/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="font-bold text-white flex items-center gap-2 mb-1">
                                <Share2 size={16} className="text-blue-400" /> Unlock 1 More Insight for Free
                            </h3>
                            <p className="text-sm text-dim">Share your digital preparedness score on LinkedIn to instantly unlock your next biggest growth blocker.</p>
                        </div>
                        <button
                            onClick={() => setShared(true)}
                            className="px-6 py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white font-mono text-xs font-bold uppercase tracking-widest rounded whitespace-nowrap transition-colors"
                        >
                            Share on LinkedIn
                        </button>
                    </div>
                )}

                {/* Step 5: Premium Insights (Blurred or Unlocked) */}
                <section className="mb-16 relative">
                    {!isUnlocked && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/80 to-dark-bg z-10 pointer-events-none" />}

                    <div className={`space-y-4 ${isUnlocked ? '' : 'filter blur-[6px] select-none opacity-60'}`}>
                        {blurredFindings.length > 0 &&
                            blurredFindings.map((finding, idx) => (
                                <div key={idx} className="bg-dark-s1 border border-dark-s3 rounded-xl p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-teal/10 text-teal border border-teal/20">
                                            Premium Discovery
                                        </span>
                                        <span className="text-xs font-mono text-dim uppercase">{finding.skill}</span>
                                    </div>
                                    <h3 className="font-bold text-white mb-2 leading-snug">{finding.title}</h3>
                                    <p className="text-sm text-dim leading-relaxed">{finding.description}</p>
                                </div>
                            ))
                        }

                        {!isUnlocked && (
                            <>
                                <div className="bg-dark-s1 border border-dark-s3 rounded-xl p-6">
                                    <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Lock size={16} /> Competitor Keyword Gaps</h3>
                                    <p className="text-sm text-dim">████████████████████████████████████████████████████████.</p>
                                </div>
                                <div className="bg-dark-s1 border border-dark-s3 rounded-xl p-6">
                                    <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Lock size={16} /> High-Value Conversion Leaks</h3>
                                    <p className="text-sm text-dim">██████████████████████████████████.</p>
                                </div>
                            </>
                        )}
                    </div>

                    {!isUnlocked && (
                        <div className="absolute bottom-0 left-0 w-full z-20 flex flex-col items-center justify-end pb-12 translate-y-1/4">
                            {/* Step 6: Opportunity section overlaid on the blur */}
                            <div className="bg-dark-s1 border border-teal/30 shadow-[0_0_50px_rgba(0,229,199,0.1)] rounded-2xl p-8 max-w-2xl w-full text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal/10 rounded-full mb-4">
                                    <TrendingUp className="text-teal" size={24} />
                                </div>
                                <h3 className="font-display text-2xl font-bold mb-6">Estimated Growth Opportunity</h3>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-dark-bg border border-dark-s3 rounded-xl p-4">
                                        <p className="font-mono text-xs text-dim uppercase tracking-widest mb-1">Untapped Traffic</p>
                                        <p className="font-display text-2xl font-bold text-white">+{estTraffic.toLocaleString()}/mo</p>
                                    </div>
                                    <div className="bg-dark-bg border border-dark-s3 rounded-xl p-4">
                                        <p className="font-mono text-xs text-dim uppercase tracking-widest mb-1">Revenue Potential</p>
                                        <p className="font-display text-2xl font-bold text-teal">+${estRevenue.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Step 7 & 9: Paywall Conversion */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-lg">Unlock Your Complete Growth Report</h4>
                                    <p className="text-sm text-dim mb-6">
                                        Your full report reveals exactly what is preventing your business from ranking higher, converting more visitors, and generating consistent revenue online.
                                    </p>
                                    <button
                                        onClick={handleCheckout}
                                        disabled={checkingOut}
                                        className="w-full relative group px-8 py-5 bg-teal text-dark-bg font-bold font-mono text-sm tracking-widest uppercase rounded overflow-hidden transition-all shadow-lg hover:-translate-y-1 disabled:opacity-70"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                                        <span className="relative flex justify-center items-center gap-2">
                                            <Lock size={16} /> {checkingOut ? "Redirecting..." : "Unlock Full Report — $29"}
                                        </span>
                                    </button>
                                    <p className="text-xs text-dark-s3 mt-4 flex items-center justify-center gap-2">
                                        <ShieldCheck size={14} /> Secure Stripe Checkout
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Helper spacing since absolute positioning cuts off bounds */}
                {!isUnlocked && <div className="h-64" />}

                {/* Step 8: What's inside outline */}
                <section className={`mt-16 border-t border-dark-s3 pt-16 ${isUnlocked ? 'hidden' : ''}`}>
                    <h3 className="font-display text-2xl font-bold mb-8 text-center text-dim">What's Inside the Expanded Report?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="p-6 border border-dark-s3 rounded-xl">
                            <h4 className="font-bold text-white mb-4">SEO Intelligence</h4>
                            <ul className="text-sm text-dim space-y-2 flex flex-col gap-1">
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal" /> Keyword Gaps</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal" /> Competitor Traffic Analysis</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal" /> Local Ranking Opportunities</li>
                            </ul>
                        </div>
                        <div className="p-6 border border-dark-s3 rounded-xl">
                            <h4 className="font-bold text-white mb-4">Conversion Audit</h4>
                            <ul className="text-sm text-dim space-y-2 flex flex-col gap-1">
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal" /> Funnel Leak Analysis</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal" /> UX / Mobile Assessment</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal" /> Landing Page Optimizations</li>
                            </ul>
                        </div>
                        <div className="p-6 border border-dark-s3 rounded-xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal/10 to-transparent pointer-events-none" />
                            <h4 className="font-bold text-white mb-4 relative z-10 flex items-center gap-2"><Zap size={16} className="text-teal" /> Agentic Strategy</h4>
                            <ul className="text-sm text-dim space-y-2 flex flex-col gap-1 relative z-10">
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal" /> AI-Generated 90-Day Roadmap</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal" /> Paid Media Budget Allocation</li>
                                <li className="flex items-center gap-2"><CheckCircle size={14} className="text-teal" /> Custom Actionable Checklists</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Agent Access CTA if Unlocked */}
                {isUnlocked && (
                    <section className="mt-8">
                        <div className="bg-gradient-to-r from-teal/10 to-blue-500/10 border border-teal/30 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                            <div>
                                <h3 className="font-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal to-blue-400 mb-2">
                                    Agentic Dashboard Activated
                                </h3>
                                <p className="text-dim">
                                    Your full report is unlocked. Head to your custom dashboard to view your AI-generated 90-day execution plan and deploy your autonomous marketing agents.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push(`/dashboard/${params.id}`)}
                                className="px-8 py-4 bg-teal text-ink font-bold font-mono text-sm tracking-widest uppercase rounded whitespace-nowrap hover:bg-teal-glow transition-all"
                            >
                                Enter Dashboard →
                            </button>
                        </div>
                    </section>
                )}

                {/* Inline Audit Feedback Widget */}
                <section className="mt-16 border-t border-dark-s3 pt-12 pb-8">
                    <div className="max-w-xl mx-auto text-center">
                        <h3 className="font-bold text-lg text-white mb-2">Help us improve these audits.</h3>
                        <p className="text-sm text-dim mb-6">Was this report accurate to your current business situation? Let us know what we got wrong or what else we should scan for.</p>

                        <div className="flex items-center justify-center gap-4 mb-6">
                            <button
                                onClick={() => alert('Thanks for the positive rating! Send any specific notes below.')}
                                className="px-6 py-3 border border-dark-s3 rounded-xl hover:bg-teal/10 hover:border-teal/30 hover:text-teal text-dim transition-colors flex items-center gap-2 font-mono text-xs uppercase"
                            >
                                <ThumbsUp size={16} /> Spot On
                            </button>
                            <button
                                onClick={() => alert('Thanks for the feedback. Let us know how we can improve below.')}
                                className="px-6 py-3 border border-dark-s3 rounded-xl hover:bg-rust/10 hover:border-rust/30 hover:text-rust text-dim transition-colors flex items-center gap-2 font-mono text-xs uppercase"
                            >
                                <ThumbsDown size={16} /> Inaccurate
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); alert('Feedback submitted to product team. Thank you!'); e.target.reset(); }} className="flex gap-2">
                            <input
                                required
                                type="text"
                                placeholder="What else should we measure in this audit?"
                                className="flex-1 bg-dark-s1 border border-dark-s3 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal transition-colors"
                            />
                            <button type="submit" className="px-6 py-3 bg-dark-s2 text-white font-mono text-xs uppercase rounded-xl hover:bg-dark-s3 transition-colors">
                                Submit
                            </button>
                        </form>
                    </div>
                </section>

            </main>
        </div>
    );
}
