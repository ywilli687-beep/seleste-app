import React from 'react';

export default function ScoreRing({ score, size = 100, labelText = "/100" }) {
    const r = size / 2 - 7;
    const c = 2 * Math.PI * r;

    // Decide color logic based on score
    const col = score >= 70 ? "#00e5c7" : score >= 40 ? "#f5c842" : "#ff5e3a";

    return (
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke="#1e1e2e"
                    strokeWidth="7"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke={col}
                    strokeWidth="7"
                    strokeDasharray={`${(score / 100) * c} ${c - (score / 100) * c}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1.1s cubic-bezier(.4,0,.2,1)" }}
                />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span className="font-display font-bold" style={{ fontSize: size * .19, color: col, lineHeight: 1 }}>
                    {score}
                </span>
                <span className="font-mono text-dim tracking-wider" style={{ fontSize: size * .09 }}>
                    {labelText}
                </span>
            </div>
        </div>
    );
}
