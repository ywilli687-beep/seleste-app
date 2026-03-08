/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                ink: "#04040a",
                paper: "#fcfefd",
                teal: {
                    DEFAULT: "#1a7a6e",
                    glow: "#00e5c7",
                },
                gold: "#f5c842",
                rust: "#d94f3b",
                dim: "#475569",
                mist: "#f8fafc",
                rule: "#e2e8f0",
                dark: {
                    bg: "#04040a",
                    s1: "#0d0d18",
                    s2: "#13131c",
                    s3: "#1e1e2e",
                    s4: "#334155",
                    text: "#f0ede8"
                }
            },
            fontFamily: {
                serif: ["'Fraunces'", "serif"],
                display: ["'Syne'", "sans-serif"],
                mono: ["'DM Mono'", "monospace"],
            }
        },
        keyframes: {
            scan: {
                '0%': { transform: 'translateY(0)' },
                '100%': { transform: 'translateY(400px)' },
            }
        },
        animation: {
            scan: 'scan 4s linear infinite',
        }
    },
    plugins: [],
}
