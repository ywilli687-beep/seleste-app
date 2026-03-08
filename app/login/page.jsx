"use client";

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            alert(res.error);
            setIsLoading(false);
        } else {
            // Success, securely get redirected to the dashboard
            router.push('/dashboard/ops');
        }
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-[calc(100vh-96px)] bg-[#f4ebe1] flex flex-col items-center justify-center font-serif px-6 py-12">

            <div className="w-full max-w-md bg-[#fffcf8] border-[2px] border-[#111] p-10 shadow-[8px_8px_0px_#111] relative">
                {/* Decorative Top Bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[#2a7a6f] border-b-[2px] border-[#111]"></div>

                <div className="text-center mb-10 mt-4">
                    <h1 className="font-sans text-3xl font-bold text-[#111] tracking-tight mb-2">Welcome back</h1>
                    <p className="font-mono text-[11px] text-[#555] uppercase tracking-widest">Sign in to Seleste OS</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-[#111] font-bold uppercase tracking-widest block">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#f4ebe1] border-[2px] border-[#111] px-4 py-3 font-mono text-sm text-[#111] focus:outline-none focus:ring-0 focus:border-[#2a7a6f] transition-colors"
                            placeholder="you@company.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-mono text-[#111] font-bold uppercase tracking-widest block">Password</label>
                            <a href="#" className="text-[10px] font-mono text-[#2a7a6f] uppercase tracking-widest hover:underline">Forgot?</a>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#f4ebe1] border-[2px] border-[#111] px-4 py-3 font-mono text-sm text-[#111] focus:outline-none focus:ring-0 focus:border-[#2a7a6f] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#111] text-[#f4ebe1] border-[2px] border-[#111] px-6 py-4 font-mono text-[12px] font-bold uppercase tracking-widest transition-all hover:bg-transparent hover:text-[#111] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Authenticating...</span>
                        ) : (
                            <>Sign In <span className="text-[10px]">▶</span></>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t-[2px] border-[#111]/10 text-center">
                    <p className="font-serif italic text-sm text-[#555]">
                        Don't have an account? <Link href="/onboarding" className="font-mono text-[10px] text-[#111] font-bold uppercase tracking-widest ml-2 hover:underline">Start Audit</Link>
                    </p>
                </div>
            </div>

        </div>
    );
}
