"use client";

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, Key, Command } from 'lucide-react';

export default function AppSidebar() {
    const pathname = usePathname();
    const params = useParams();

    // Fallback ID if params.id isn't available (e.g. if we are on a generic route)
    const businessId = params?.id || 'demo';

    const navItems = [
        {
            name: 'Dashboard Hub',
            href: `/dashboard/${businessId}`,
            icon: <LayoutDashboard size={18} />,
            match: '/dashboard'
        },
        {
            name: 'Audit Report',
            href: `/report/${businessId}`,
            icon: <FileText size={18} />,
            match: '/report'
        },
        {
            name: 'API Keys (Soon)',
            href: '#',
            icon: <Key size={18} />,
            match: '/keys'
        },
        {
            name: 'Settings (Soon)',
            href: '#',
            icon: <Settings size={18} />,
            match: '/settings'
        }
    ];

    return (
        <aside className="w-64 min-h-screen bg-[#f4ebe1] border-r-[2px] border-[#111] flex flex-col font-serif shrink-0 sticky top-0 h-screen overflow-y-auto">
            <div className="p-6 border-b-[2px] border-[#111] bg-white text-[#111]">
                <Link href="/" className="font-mono font-bold text-xl tracking-[0.3em] uppercase flex items-center gap-2">
                    <Command size={20} />
                    SELESTE
                </Link>
                <div className="mt-2 text-[10px] font-mono text-[#777] uppercase tracking-widest">
                    AI Growth OS
                </div>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.match);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 border-[2px] transition-all
                                ${isActive
                                    ? 'bg-[#111] text-[#f4ebe1] border-[#111] font-bold shadow-[2px_2px_0px_#ccc]'
                                    : 'bg-white text-[#555] border-transparent hover:border-[#111] hover:text-[#111] hover:shadow-[2px_2px_0px_#111]'
                                }
                            `}
                        >
                            <span className={isActive ? "text-teal" : ""}>{item.icon}</span>
                            <span className="font-sans text-sm tracking-wide">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 border-t-[2px] border-[#111] bg-[#fffcf8]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#2a7a6f] text-[#fffcf8] flex items-center justify-center font-mono font-bold text-xs uppercase border border-[#111]">
                        ME
                    </div>
                    <div className="flex flex-col">
                        <span className="font-sans text-sm font-bold text-[#111]">My Account</span>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#777]">Log out</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
