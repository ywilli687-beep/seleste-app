"use strict";
// Client-safe constants — no Prisma or server imports.
// ResultsView and other client components import from here, not from @/lib/engine.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PILLARS = void 0;
exports.PILLARS = [
    { id: 'conversion', name: 'Conversion System', weight: 0.25, icon: '🎯' },
    { id: 'trust', name: 'Trust & Credibility', weight: 0.15, icon: '🛡️' },
    { id: 'performance', name: 'Performance', weight: 0.15, icon: '⚡' },
    { id: 'ux', name: 'UX & Experience', weight: 0.10, icon: '✨' },
    { id: 'discoverability', name: 'Discoverability', weight: 0.10, icon: '🔍' },
    { id: 'content', name: 'Content & Messaging', weight: 0.08, icon: '📝' },
    { id: 'data', name: 'Data & Tracking', weight: 0.07, icon: '📊' },
    { id: 'technical', name: 'Technical Infrastructure', weight: 0.05, icon: '⚙️' },
    { id: 'brand', name: 'Brand & Differentiation', weight: 0.03, icon: '💎' },
    { id: 'scalability', name: 'Scalability', weight: 0.02, icon: '📈' },
];
