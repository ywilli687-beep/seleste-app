"use client";

import { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Globe, MapPin, Briefcase, DollarSign, Search, Mail, User, Target, BarChart, AlertCircle, Megaphone, ImagePlus, Lock } from 'lucide-react';

const LOADING_STEPS = [
    "Scanning website performance & load times...",
    "Evaluating SEO signals & meta tags...",
    "Analyzing conversion pathways...",
    "Reviewing local competitor positioning...",
    "Evaluating digital marketing readiness...",
    "Compiling Growth Strategy..."
];

export default function OnboardingWizard() {
    const router = useRouter();
    const { businessData, updateBusinessData, setAuditResults } = useStore();
    const [loading, setLoading] = useState(false);
    const [loadingStepIndex, setLoadingStepIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        let interval;
        if (loading) {
            interval = setInterval(() => {
                setLoadingStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleSubmitAudit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mocked out goals and budget to bypass the removed form steps but satisfy the API
            const enrichedData = {
                ...businessData,
                goals: ['leads', 'visibility', 'conversion'],
                budget: businessData.revenue || 'Not specified'
            };

            const res = await fetch('/api/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ businessData: enrichedData })
            });

            const result = await res.json();

            if (result.success) {
                setAuditResults(result.data, result.businessId, result.auditId);
                router.push(`/report/${result.businessId}`);
            } else {
                alert('Error parsing audit: ' + result.error);
                setLoading(false);
            }
        } catch (e) {
            alert('Network Error: Failed to run audit.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-xl mx-auto py-24 px-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="relative w-24 h-24 mb-12">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 rounded-full border-t-2 border-teal border-r-2 border-transparent animate-spin" />
                    {/* Inner pulsating ring */}
                    <div className="absolute inset-2 rounded-full border-2 border-dark-s3 animate-ping opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center text-teal">
                        <Search size={32} className="animate-pulse" />
                    </div>
                </div>

                <h2 className="font-display text-2xl font-bold mb-4 animate-in fade-in duration-500">
                    Analyzing {businessData.businessName || 'Your Business'}
                </h2>

                <div className="h-8 overflow-hidden relative w-full max-w-sm mx-auto">
                    {LOADING_STEPS.map((step, idx) => (
                        <p
                            key={idx}
                            className={`absolute w-full font-mono text-sm text-dim transition-all duration-500 ${idx === loadingStepIndex
                                ? 'opacity-100 translate-y-0'
                                : idx < loadingStepIndex
                                    ? 'opacity-0 -translate-y-8'
                                    : 'opacity-0 translate-y-8'
                                }`}
                        >
                            {step}
                        </p>
                    ))}
                </div>

                <div className="w-full max-w-sm mt-8 bg-dark-s2 rounded-full h-1.5 overflow-hidden mx-auto">
                    <div
                        className="h-full bg-teal transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(((loadingStepIndex + 1) / LOADING_STEPS.length) * 100, 95)}%` }}
                    />
                </div>
            </div>
        );
    }

    if (!isMounted) return null;

    return (
        <div className="max-w-2xl mx-auto py-16 px-6">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal/10 border border-teal/20 text-teal font-mono text-xs uppercase tracking-widest rounded-full mb-6">
                    Free Tool
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                    Digital Preparedness <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-blue-400">Audit</span>
                </h2>
                <p className="text-dim text-lg max-w-lg mx-auto leading-relaxed">
                    See exactly how your business compares to top local competitors and uncover your biggest revenue bottlenecks instantly.
                </p>
            </div>

            <div className="bg-dark-s1 border border-dark-s3 rounded-2xl p-8 shadow-2xl">
                <form onSubmit={handleSubmitAudit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-mono text-dim uppercase tracking-wide flex items-center gap-2">
                                <Building2 size={14} /> Business Name
                            </label>
                            <input
                                required
                                className="w-full bg-dark-bg border border-dark-s3 rounded-xl px-4 py-3.5 text-white focus:border-teal outline-none transition-colors"
                                placeholder="e.g. Acme Plumbing Co."
                                value={businessData.businessName || ''}
                                onChange={(e) => updateBusinessData('businessName', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-mono text-dim uppercase tracking-wide flex items-center gap-2">
                                <Globe size={14} /> Website URL <span className="lowercase text-dark-s3 normal-case">(Required for deep scanning)</span>
                            </label>
                            <input
                                required
                                type="url"
                                className="w-full bg-dark-bg border border-dark-s3 rounded-xl px-4 py-3.5 text-white focus:border-teal outline-none transition-colors"
                                placeholder="https://www.yourdomain.com"
                                value={businessData.website || ''}
                                onChange={(e) => updateBusinessData('website', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-dim uppercase tracking-wide flex items-center gap-2">
                                <Briefcase size={14} /> Industry
                            </label>
                            <select
                                required
                                className="w-full bg-dark-bg border border-dark-s3 rounded-xl px-4 py-3.5 text-white focus:border-teal outline-none appearance-none"
                                value={businessData.industry || ''}
                                onChange={(e) => updateBusinessData('industry', e.target.value)}
                            >
                                <option value="" disabled>Select Industry...</option>
                                <option value="Home Services">Home Services</option>
                                <option value="Health & Beauty">Health & Beauty</option>
                                <option value="Legal & Finance">Legal & Finance</option>
                                <option value="Real Estate">Real Estate</option>
                                <option value="Local Retail">Local Retail / Restaurant</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-dim uppercase tracking-wide flex items-center gap-2">
                                <MapPin size={14} /> City / Market
                            </label>
                            <input
                                required
                                className="w-full bg-dark-bg border border-dark-s3 rounded-xl px-4 py-3.5 text-white focus:border-teal outline-none transition-colors"
                                placeholder="e.g. Austin, TX"
                                value={businessData.location || ''}
                                onChange={(e) => updateBusinessData('location', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-mono text-dim uppercase tracking-wide flex items-center gap-2">
                                <DollarSign size={14} /> Monthly Revenue Range <span className="lowercase text-dark-s3 normal-case">(Optional, helps benchmarking)</span>
                            </label>
                            <select
                                className="w-full bg-dark-bg border border-dark-s3 rounded-xl px-4 py-3.5 text-white focus:border-teal outline-none appearance-none"
                                value={businessData.revenue || ''}
                                onChange={(e) => updateBusinessData('revenue', e.target.value)}
                            >
                                <option value="" disabled>Select Range...</option>
                                <option value="Pre-revenue">Pre-revenue / Just starting</option>
                                <option value="$1k - $10k">$1k - $10k / month</option>
                                <option value="$10k - $50k">$10k - $50k / month</option>
                                <option value="$50k+">$50k+ / month</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-dim uppercase tracking-wide flex items-center gap-2">
                                <Target size={14} /> Primary Goal
                            </label>
                            <select
                                required
                                className="w-full bg-dark-bg border border-dark-s3 rounded-xl px-4 py-3.5 text-white focus:border-teal outline-none appearance-none"
                                value={businessData.primaryGoal || ''}
                                onChange={(e) => updateBusinessData('primaryGoal', e.target.value)}
                            >
                                <option value="" disabled>Select your main focus...</option>
                                <option value="More total leads">More total leads</option>
                                <option value="Higher quality/ticket clients">Higher quality/ticket clients</option>
                                <option value="Better local visibility">Better local visibility</option>
                                <option value="Improve conversion rate">Improve conversion rate</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-dim uppercase tracking-wide flex items-center gap-2">
                                <AlertCircle size={14} /> Biggest Challenge
                            </label>
                            <select
                                required
                                className="w-full bg-dark-bg border border-dark-s3 rounded-xl px-4 py-3.5 text-white focus:border-teal outline-none appearance-none"
                                value={businessData.biggestChallenge || ''}
                                onChange={(e) => updateBusinessData('biggestChallenge', e.target.value)}
                            >
                                <option value="" disabled>What's holding you back?</option>
                                <option value="Not enough traffic to website">Not enough traffic to website</option>
                                <option value="Traffic doesn't convert to leads">Traffic doesn't convert to leads</option>
                                <option value="Inconsistent lead flow">Inconsistent lead flow</option>
                                <option value="Relying too much on referrals">Relying too much on referrals</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-dim uppercase tracking-wide flex items-center gap-2">
                                <Megaphone size={14} /> Current Marketing
                            </label>
                            <select
                                required
                                className="w-full bg-dark-bg border border-dark-s3 rounded-xl px-4 py-3.5 text-white focus:border-teal outline-none appearance-none"
                                value={businessData.currentMarketing || ''}
                                onChange={(e) => updateBusinessData('currentMarketing', e.target.value)}
                            >
                                <option value="" disabled>Select current efforts...</option>
                                <option value="Nothing currently">Nothing currently</option>
                                <option value="Occasional social media">Occasional social media</option>
                                <option value="Running some ads (Google/FB)">Running some ads (Google/FB)</option>
                                <option value="Working with an agency/freelancer">Working with an agency/freelancer</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-dim uppercase tracking-wide flex items-center gap-2">
                                <BarChart size={14} /> Ad Spend
                            </label>
                            <select
                                required
                                className="w-full bg-dark-bg border border-dark-s3 rounded-xl px-4 py-3.5 text-white focus:border-teal outline-none appearance-none"
                                value={businessData.adSpend || ''}
                                onChange={(e) => updateBusinessData('adSpend', e.target.value)}
                            >
                                <option value="" disabled>Monthly budget...</option>
                                <option value="$0">$0</option>
                                <option value="Under $1,000">Under $1,000</option>
                                <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                                <option value="$3,000+">$3,000+</option>
                            </select>
                        </div>
                        <div className="space-y-3 md:col-span-2 pt-4 border-t border-dark-s3 mt-2">
                            <label className="text-xs font-mono text-dim uppercase tracking-wide flex items-center gap-2">
                                <ImagePlus size={14} /> Add Visual Context <span className="lowercase text-dark-s3 normal-case">(Screenshots of socials, offline flyers, ad managers, etc. Optional)</span>
                            </label>

                            <div className="relative border-2 border-dashed border-dark-s3 rounded-xl bg-dark-bg/50 p-8 text-center hover:border-teal hover:bg-dark-bg transition-colors group cursor-pointer">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,.pdf"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={(e) => {
                                        // Fake handler for UI purposes, could be expanded to upload to a blob store
                                        const files = Array.from(e.target.files);
                                        updateBusinessData('uploadedAssets', files.map(f => f.name));
                                    }}
                                />
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <div className="w-12 h-12 bg-dark-s2 rounded-full flex items-center justify-center text-dim group-hover:text-teal group-hover:bg-teal/10 transition-colors">
                                        <ImagePlus size={20} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                                        <p className="text-xs text-dim">SVG, PNG, JPG or PDF (max. 800x400px)</p>
                                    </div>

                                    {businessData.uploadedAssets && businessData.uploadedAssets.length > 0 && (
                                        <div className="flex flex-wrap gap-2 justify-center mt-4">
                                            {businessData.uploadedAssets.map((name, i) => (
                                                <span key={i} className="text-[10px] font-mono px-2 py-1 bg-teal/10 text-teal border border-teal/20 rounded">
                                                    Attached: {name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2 pt-4 border-t border-dark-s3 mt-4">
                            <p className="text-white font-bold mb-2">Where should we send your results?</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-dim uppercase tracking-wide flex items-center gap-2">
                                <User size={14} /> First Name
                            </label>
                            <input
                                required
                                className="w-full bg-dark-bg border border-dark-s3 rounded-xl px-4 py-3.5 text-white focus:border-teal outline-none transition-colors"
                                placeholder="Your Name"
                                value={businessData.firstName || ''}
                                onChange={(e) => updateBusinessData('firstName', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-dim uppercase tracking-wide flex items-center gap-2">
                                <Mail size={14} /> Work Email
                            </label>
                            <input
                                required
                                type="email"
                                className="w-full bg-dark-bg border border-dark-s3 rounded-xl px-4 py-3.5 text-white focus:border-teal outline-none transition-colors"
                                placeholder="you@company.com"
                                value={businessData.email || ''}
                                onChange={(e) => updateBusinessData('email', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-mono text-dim uppercase tracking-wide flex items-center gap-2">
                                <Lock size={14} /> Create Password <span className="lowercase text-dark-s3 normal-case">(To access your live dashboard later)</span>
                            </label>
                            <input
                                required
                                type="password"
                                className="w-full bg-dark-bg border border-dark-s3 rounded-xl px-4 py-3.5 text-white focus:border-teal outline-none transition-colors"
                                placeholder="••••••••"
                                value={businessData.password || ''}
                                onChange={(e) => updateBusinessData('password', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-dark-s3 mt-8">
                        <button
                            type="submit"
                            className="w-full px-8 py-4 bg-teal text-dark-bg font-bold font-mono text-sm tracking-widest uppercase rounded-xl hover:bg-teal-glow transition-all shadow-[0_0_20px_rgba(0,229,199,0.2)] hover:shadow-[0_0_30px_rgba(0,229,199,0.4)] hover:-translate-y-1"
                        >
                            Analyze My Business →
                        </button>
                        <p className="text-center font-mono text-[10px] text-dim mt-4 max-w-sm mx-auto leading-relaxed">
                            By generating this audit, you agree to our <Link href="/terms" className="text-teal hover:underline" target="_blank">Terms of Service</Link> and authorize Seleste to collect and analyze this data to improve our AIMemoryBank models.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
