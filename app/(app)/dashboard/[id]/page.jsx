"use client";

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import ScoreRing from '../../../../components/dashboard/ScoreRing';
import AgentChatWindow from '../../../../components/chat/AgentChatWindow';

const fetcher = url => fetch(url).then(r => r.json());

export default function BusinessDashboardPage() {
    const params = useParams();
    const chatRef = useRef(null);
    const [generatingPlan, setGeneratingPlan] = useState(false);
    const [isLightMode, setIsLightMode] = useState(true); // Defaulting to the requested light retro view

    const { data: result, error, isLoading: loading, mutate } = useSWR(
        params?.id ? `/api/business/${params.id}` : null,
        fetcher
    );

    const mockAgent = {
        id: 'ops',
        label: 'Ops Orchestrator',
        emoji: '⚙️',
        tagline: 'Turns audit findings into sprint plans and execution checklists.',
        color: '#00e5c7',
        grad: 'linear-gradient(135deg, #00e5c7, #00b89e)',
        darkText: true
    };

    const biz = result?.data;
    const benchmarkData = biz?.benchmark;
    const businessData = biz ? { businessName: biz.name, industry: biz.industry, website: biz.website_url } : null;
    const auditResults = biz?.audits?.[0]?.raw_data || null;
    const recommendations = biz?.recommendations || [];
    const competitors = biz?.competitors || [];
    const marketingPlans = biz?.marketing_plans?.length > 0
        ? biz.marketing_plans.map(p => ({ phase: p.timeframe, tasks: p.action_items }))
        : [];



    const generatePlan = async () => {
        setGeneratingPlan(true);
        try {
            const res = await fetch('/api/marketing-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessData, auditResults, businessId: params.id })
            });
            const result = await res.json();
            if (result.success) {
                // Trigger SWR to re-fetch the business from the DB, which will now include the generated plans
                mutate();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (e) {
            alert('Network error');
        } finally {
            setGeneratingPlan(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-dark-bg text-dim p-12 italic">Loading business context...</div>;

    const score = auditResults?.qualityScore || 0;
    const headline = auditResults?.headline || "Audit Data Missing";
    const label = auditResults?.scoreLabel || "N/A";

    return (
        <div className="min-h-screen bg-[#f4ebe1] text-[#111] p-12 flex flex-col font-serif">

            <header className="mb-12 flex flex-col gap-6">
                {/* Top Nav Line */}
                <div className="flex justify-between items-end w-full border-b border-[#111] pb-6">
                    <div>
                        <h2 className="font-sans font-bold text-2xl mb-1 flex items-center gap-2 tracking-tight">
                            My Business Hub
                        </h2>
                        <p className="font-mono text-[11px] text-[#777] uppercase tracking-[0.15em]">
                            {businessData?.businessName} · {biz?.location || 'LOCAL'} · LAST AUDIT RECENTLY
                        </p>
                    </div>

                    <div className="flex gap-4 items-stretch">
                        <div className="px-4 py-2 text-[10px] font-mono tracking-widest uppercase border border-[#ccc] text-[#555] bg-transparent flex items-center">
                            <span>Growth Plan<br />Active</span>
                        </div>
                        <div className="px-4 py-2 text-[10px] font-mono tracking-widest uppercase border border-[#2a7a6f] text-[#2a7a6f] bg-transparent flex items-center gap-3">
                            <span className="w-1.5 h-1.5 bg-[#2a7a6f]" style={{ borderRadius: 0 }} />
                            <span>Weekly Check-in<br />Running</span>
                        </div>
                        <button
                            onClick={generatePlan}
                            disabled={generatingPlan || !auditResults}
                            className="px-6 py-3 bg-[#111] text-[#f4ebe1] font-mono text-[10px] tracking-widest uppercase font-bold flex items-center gap-3 hover:bg-transparent hover:text-[#111] border-2 border-[#111] transition-colors"
                        >
                            ★ Open Agents <span className="text-[12px] ml-4">▶</span>
                        </button>
                    </div>
                </div>

                {/* Greeting Line */}
                <div className="mt-8">
                    <div className="font-mono text-[11px] text-[#2a7a6f] tracking-[0.2em] uppercase mb-4 font-bold">
                        MY BUSINESS HUB
                    </div>
                    <h1 className="font-sans text-4xl md:text-[3rem] font-bold mb-4 tracking-tight">
                        Good evening, <span className="text-[#2a7a6f] italic font-serif font-normal">{businessData?.businessName || "Your Business"}</span>
                    </h1>
                    <p className="font-serif italic text-[#555] text-lg mb-8 max-w-3xl leading-relaxed">
                        You have {recommendations.length} things working against you right now, costing an estimated {recommendations[0]?.est_revenue_impact || 'several enquiries'} a month. Here's where things stand.
                    </p>
                </div>
            </header>

            {/* Red Urgent Issues Banner */}
            {recommendations.length > 0 && (
                <div className="w-full border border-[#c64e32] bg-[#fbf2f0] p-4 mb-8 flex justify-between items-center">
                    <span className="text-[#c64e32] font-mono text-[11px] font-bold uppercase tracking-widest flex items-center gap-3">
                        <span className="text-xs">△</span> {recommendations.length} urgent issues still unresolved - you can't see where most of your enquiries are coming from yet.
                    </span>
                    <button className="px-6 py-1.5 border border-[#c64e32] text-[#c64e32] font-mono text-[10px] uppercase tracking-widest hover:bg-[#c64e32] hover:text-[#f4ebe1] transition-colors font-bold">
                        View →
                    </button>
                </div>
            )}

            <div className="flex gap-12 flex-1">
                <aside className="w-1/3 flex flex-col gap-8">
                    <div className="bg-[#fffcf8] border-[2px] border-[#111] p-8 flex flex-col items-center shadow-[4px_4px_0px_#111]">
                        <ScoreRing score={score} size={150} />

                        {benchmarkData && (
                            <div className="mt-8 w-full bg-[#f4ebe1] border border-[#111] p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono text-[10px] text-[#555] uppercase tracking-widest">Industry Avg</span>
                                    <span className="font-mono text-xs font-bold text-[#111]">{Math.round(benchmarkData.avg_preparedness)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#ddd] border border-[#111] overflow-hidden">
                                    <div className="h-full bg-[#111]" style={{ width: `${benchmarkData.avg_preparedness}%` }} />
                                </div>

                                <div className="flex justify-between items-center mt-3 mb-2">
                                    <span className="font-mono text-[10px] text-[#2a7a6f] uppercase tracking-widest">Top 10%</span>
                                    <span className="font-mono text-xs font-bold text-[#2a7a6f]">{Math.round(benchmarkData.top_10_percentile)}</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#ddd] border border-[#111] overflow-hidden relative">
                                    <div className="h-full bg-[#2a7a6f]" style={{ width: `${benchmarkData.top_10_percentile}%` }} />
                                </div>

                                <div className="mt-4 text-center">
                                    <p className="font-serif italic text-sm text-[#555]">
                                        You are <span className="text-[#111] font-bold">{Math.max(0, Math.round(benchmarkData.top_10_percentile - score))} points</span> behind market leaders.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <span className="font-mono text-[11px] font-bold text-[#d97706] uppercase tracking-[0.2em]">{label}</span>
                            <p className="mt-2 text-[15px] text-[#555] font-serif italic max-w-[200px] leading-relaxed">"{headline}"</p>
                        </div>
                    </div>

                    {marketingPlans?.length > 0 && (
                        <div className="bg-[#fffcf8] border-[2px] border-[#111] p-6 shadow-[4px_4px_0px_#111]">
                            <h3 className="font-sans font-bold text-lg mb-6 text-[#2a7a6f]">90-Day Roadmap</h3>
                            <div className="flex flex-col gap-6">
                                {marketingPlans.map((phase, i) => (
                                    <div key={i} className="border-l-[2px] border-[#222] pl-4">
                                        <span className="font-mono text-[11px] font-bold text-[#111] uppercase tracking-widest">{phase.phase.replace('_', ' ')}</span>
                                        <ul className="mt-3 flex flex-col gap-3">
                                            {phase.tasks?.map((t, idx) => {
                                                const isObj = typeof t === 'object' && t !== null;
                                                const title = isObj ? t.title : t;
                                                return (
                                                    <li key={idx} className="flex flex-col gap-1.5 pb-2">
                                                        <div className="text-[14.5px] text-[#555] font-serif italic flex gap-3 leading-relaxed">
                                                            <span className="text-[#2a7a6f] w-4 mt-1 leading-none">&rarr;</span>
                                                            <span className="flex-1 text-[#111] font-bold">{title}</span>
                                                        </div>
                                                        {isObj && (
                                                            <div className="ml-7 flex gap-2">
                                                                <span className="px-1.5 py-0.5 text-[9px] font-mono tracking-widest uppercase border border-[#ddd] text-[#777]">
                                                                    Effort: {t.effort}
                                                                </span>
                                                                <span className="px-1.5 py-0.5 text-[9px] font-mono tracking-widest uppercase border border-[#2a7a6f] text-[#2a7a6f] bg-[#2a7a6f]/5">
                                                                    Agent: {t.assignedAgent}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {biz?.agent_tasks?.length > 0 && (
                        <div className="bg-[#fffcf8] border-[2px] border-[#111] p-6 shadow-[4px_4px_0px_#111] flex flex-col gap-4">
                            <h3 className="font-sans font-bold text-lg text-[#111] flex items-center gap-3 border-b border-[#222]/10 pb-4 mb-2">
                                Approval Inbox
                            </h3>
                            <div className="flex flex-col gap-4">
                                {biz.agent_tasks.map((task) => (
                                    <div key={task.id} className="p-4 bg-[#f4ebe1] border border-[#111] flex flex-col gap-3">

                                        {/* Status Header */}
                                        <div className="flex justify-between items-start border-b border-[#222]/10 pb-3">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-mono text-[10px] font-bold uppercase text-[#111] tracking-widest mb-1">
                                                    {task.agent_type}
                                                </span>
                                                <span className="text-sm font-bold text-[#111] leading-snug font-sans">{task.action_description}</span>
                                            </div>

                                            <span className={`font-mono text-[10px] uppercase shrink-0 py-1 px-2 border border-[#111] font-bold ${task.status === 'COMPLETED' ? 'text-[#2a7a6f] bg-[#2a7a6f]/10' :
                                                task.status === 'AWAITING_APPROVAL' ? 'text-[#d97706] bg-[#d97706]/10' :
                                                    task.status === 'VALIDATION_FAILED' ? 'text-[#c64e32] bg-[#c64e32]/10' :
                                                        'text-[#777] bg-transparent'
                                                }`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        {/* Execution Payload */}
                                        {task.output_payload && task.status === 'AWAITING_APPROVAL' && (
                                            <div className="flex flex-col gap-3 mt-1">
                                                <div className="bg-white p-3 text-[#555] font-serif italic text-sm border-l-[3px] border-[#d97706] shadow-sm">
                                                    "{task.output_payload.summary}"
                                                </div>

                                                <div className="bg-[#111] p-4 font-mono text-[11px] text-[#2a7a6f] overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                                                    {JSON.stringify(task.output_payload.draft, null, 2)}
                                                </div>

                                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#222]/10">
                                                    <span className="text-[10px] font-mono text-[#555] tracking-widest">
                                                        Confidence: {task.confidence_score}/10
                                                    </span>
                                                    <button className="px-5 py-2 bg-[#d97706] text-white font-bold font-mono text-[10px] tracking-widest uppercase hover:opacity-90 transition-opacity border-[1px] border-[#d97706]">
                                                        Approve &rarr;
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Fallback for processing tasks */}
                                        {!task.output_payload && (
                                            <p className="text-sm text-[#777] font-serif italic pt-1">Waiting for agent execution...</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                <main className="flex-1 min-w-0 flex flex-col gap-8">
                    {/* Growth Recommendations Widget */}
                    {recommendations.length > 0 && (
                        <div className="bg-[#fffcf8] border-[2px] border-[#111] p-8 flex flex-col gap-8 shadow-[4px_4px_0px_#111]">
                            <h2 className="font-sans text-2xl font-bold flex items-center gap-3 tracking-tight border-b border-[#222]/10 pb-4">
                                <span className="text-[#d97706]">★</span> Growth Priorities
                            </h2>

                            {/* Next Best Action Card (Top Priority) */}
                            <div className="bg-[#eefaf8] border-[2px] border-[#2a7a6f] p-8 relative shadow-[0_4px_30px_rgba(42,122,111,0.15)] flex flex-col">
                                <div className="absolute top-0 right-0 py-2 px-3 bg-[#2a7a6f] text-[#fffcf8] font-mono text-[10px] uppercase tracking-widest font-bold">
                                    Next Best Action
                                </div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4 items-center">
                                        <span className="px-3 py-1 bg-[#c64e32]/10 text-[#c64e32] border border-[#c64e32] text-[10px] uppercase font-mono tracking-widest font-bold">
                                            Impact: {recommendations[0].impact_score}/10
                                        </span>
                                        <span className="text-[#2a7a6f] font-mono text-sm font-bold flex items-center gap-2">
                                            <span className="text-[#555]">Est. ROI:</span> {recommendations[0].est_revenue_impact}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="font-sans font-bold text-2xl text-[#111] mb-3 leading-tight tracking-tight">
                                    {recommendations[0].problem_detected}
                                </h3>
                                <p className="text-[#555] font-serif italic text-[16px] leading-relaxed mb-8 max-w-2xl">
                                    {recommendations[0].suggested_action}
                                </p>

                                <button
                                    onClick={() => chatRef.current?.triggerTask(`Deploy an agent to fix: ${recommendations[0].suggested_action}`)}
                                    className="px-6 py-4 bg-[#2a7a6f] text-white font-bold font-mono text-[11px] tracking-[0.2em] uppercase hover:bg-transparent hover:text-[#2a7a6f] border-2 border-[#2a7a6f] transition-all flex items-center gap-2 self-start"
                                >
                                    <span>Deploy Agent &rarr;</span>
                                </button>
                            </div>

                            {/* Remaining Priorities */}
                            {recommendations.length > 1 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    {recommendations.slice(1, 4).map((rec, idx) => (
                                        <div key={rec.id} className="bg-[#f4ebe1] border-[1px] border-[#111] p-6 hover:shadow-[4px_4px_0px_#111] transition-all relative">
                                            <span className="absolute -left-3 -top-3 w-6 h-6 bg-[#111] text-[#fffcf8] flex items-center justify-center text-[10px] font-bold font-mono">
                                                {idx + 2}
                                            </span>
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`px-2 py-1 text-[9px] uppercase font-mono font-bold tracking-widest border ${rec.impact_score >= 8 ? 'bg-[#c64e32]/10 text-[#c64e32] border-[#c64e32]' : 'bg-[#d97706]/10 text-[#d97706] border-[#d97706]'}`}>
                                                    Impact: {rec.impact_score}/10
                                                </span>
                                                <span className="text-[#2a7a6f] font-mono text-[11px] font-bold">{rec.est_revenue_impact}</span>
                                            </div>
                                            <h4 className="font-sans font-bold text-lg mb-3 text-[#111] tracking-tight leading-snug">{rec.problem_detected}</h4>

                                            <button
                                                onClick={() => chatRef.current?.triggerTask(`Deploy an agent to fix: ${rec.suggested_action}`)}
                                                className="mt-2 text-[10px] font-bold font-mono tracking-widest text-[#2a7a6f] uppercase hover:text-[#111] flex items-center gap-1 transition-colors"
                                            >
                                                Deploy &rarr;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Competitor Benchmark Widget */}
                    {competitors.length > 0 && (
                        <div className="bg-[#fffcf8] border-[2px] border-[#111] p-8 shadow-[4px_4px_0px_#111]">
                            <h2 className="font-sans text-2xl font-bold mb-6 flex items-center gap-3 tracking-tight border-b border-[#222]/10 pb-4">
                                <span className="text-[#2a7a6f]">⊕</span> Local Market Market Share
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-mono text-[#555] tracking-widest uppercase pb-2 px-4 shadow-[0_2px_0px_#eee]">
                                    <span>Domain</span>
                                    <div className="flex gap-16">
                                        <span>Est. Traffic</span>
                                        <span>Ads?</span>
                                    </div>
                                </div>

                                {/* The User's Business */}
                                <div className="flex justify-between items-center bg-[#f4ebe1] border border-[#111] p-4 font-mono shadow-[2px_2px_0px_#111]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-6 h-6 bg-[#2a7a6f] text-white flex items-center justify-center font-bold text-[10px]">You</div>
                                        <span className="font-bold text-[#111] text-[12px]">{businessData.website || businessData.businessName}</span>
                                    </div>
                                    <div className="flex gap-16 text-[12px]">
                                        <span>---</span>
                                        <span className="text-[#555]">No</span>
                                    </div>
                                </div>

                                {/* Rivals */}
                                {competitors.map((comp, idx) => (
                                    <div key={comp.id} className="flex justify-between items-center border-[1px] border-[#ddd] hover:border-[#111] p-4 transition-colors font-mono">
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 border border-[#ccc] text-[#777] flex items-center justify-center text-[10px]">{idx + 1}</div>
                                            <span className="font-bold text-[#111] text-[12px]">{comp.competitor_domain}</span>
                                        </div>
                                        <div className="flex gap-16 text-[12px]">
                                            <span className="text-[#2a7a6f]">~{comp.estimated_traffic.toLocaleString()}/mo</span>
                                            <span className={comp.ad_presence ? 'text-[#c64e32]' : 'text-[#777]'}>{comp.ad_presence ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <AgentChatWindow
                        ref={chatRef}
                        agent={mockAgent}
                        businessId={params.id}
                        businessData={businessData}
                        auditResults={auditResults}
                        marketingPlans={marketingPlans}
                    />
                </main>
            </div>
        </div>
    );
}
