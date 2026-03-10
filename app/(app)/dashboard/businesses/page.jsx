"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BusinessesPage() {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBusinesses() {
            try {
                const res = await fetch('/api/businesses');
                const result = await res.json();
                if (result.success) {
                    setBusinesses(result.data);
                }
            } catch (e) {
                console.error('Error fetching businesses');
            } finally {
                setLoading(false);
            }
        }
        fetchBusinesses();
    }, []);

    return (
        <div className="min-h-screen bg-dark-bg text-dark-text p-12 max-w-5xl mx-auto">
            <header className="mb-12 border-b border-dark-s3 pb-6 flex justify-between items-center">
                <div>
                    <h1 className="font-display text-2xl font-bold mb-1 border-b-2 border-teal pb-1 inline-block">My Businesses</h1>
                    <p className="font-mono text-xs text-dim mt-2">Saved Audits & Generative Roadmaps</p>
                </div>
                <Link href="/onboarding" className="px-6 py-2.5 bg-teal text-white font-mono text-xs tracking-widest uppercase rounded hover:bg-teal-glow transition">
                    + New Audit
                </Link>
            </header>

            {loading ? (
                <div className="text-dim italic">Loading saved businesses...</div>
            ) : businesses.length === 0 ? (
                <div className="text-dim italic">No businesses saved yet. Run an audit first!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {businesses.map(b => (
                        <Link href={`/dashboard/${b.id}`} key={b.id} className="block group">
                            <div className="bg-dark-s1 border border-dark-s3 rounded-xl p-6 hover:border-teal transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-display font-medium text-lg">{b.name}</h3>
                                    {b.audits?.[0] && (
                                        <div className="bg-dark-s2 border border-dark-s3 rounded-full px-3 py-1 font-mono text-xs text-gold">
                                            Score: {b.audits[0].preparedness_score}/100
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 font-mono text-xs text-dim">
                                    <div className="flex justify-between">
                                        <span>Industry:</span> <span className="text-dark-text">{b.industry}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Generated:</span> <span className="text-dark-text">{new Date(b.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Roadmap Status:</span>
                                        <span className="text-teal">{b.marketing_plans?.length > 0 ? 'Active' : 'Pending Generation'}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
