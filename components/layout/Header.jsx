"use client";

import Link from 'next/link';

export default function Header() {
    return (
        <nav className="w-full border-b border-[#222]/10 bg-[#f4ebe1] relative z-50">
            <div className="max-w-[85rem] mx-auto px-8 h-24 flex items-center justify-between">
                <div className="flex items-center">
                    <Link href="/" className="font-mono font-bold text-xl tracking-[0.3em] uppercase text-[#111]">SELESTE</Link>
                </div>
                <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono tracking-widest text-[#555]">
                    <Link href="/#goal" className="px-5 py-2.5 border border-[#ccc] hover:border-[#111] hover:text-[#111] transition-colors uppercase">Our Goal</Link>
                    <Link href="/how-it-works" className="px-5 py-2.5 border border-[#ccc] hover:border-[#111] hover:text-[#111] transition-colors uppercase">How It Works</Link>
                    <Link href="/products" className="px-5 py-2.5 border border-[#ccc] hover:border-[#111] hover:text-[#111] transition-colors uppercase">Our Products</Link>
                    <Link href="/#pricing" className="px-5 py-2.5 border border-[#ccc] hover:border-[#111] hover:text-[#111] transition-colors uppercase">Pricing</Link>
                    <Link href="/login" className="px-8 py-2.5 bg-[#111] text-[#f4ebe1] hover:bg-transparent hover:text-[#111] border border-[#111] transition-colors uppercase ml-4">Login</Link>
                </div>
            </div>
        </nav>
    );
}
