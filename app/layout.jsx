import './globals.css';

export const metadata = {
    title: 'Seleste — AI Growth OS',
    description: 'AI-powered Digital Growth OS for local service businesses.',
};

import Header from '../components/layout/Header';
import GlobalFeedbackWidget from '../components/layout/GlobalFeedbackWidget';
import Providers from '../components/layout/Providers';

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,300;1,9..144,400&display=swap" rel="stylesheet" />
            </head>
            <body suppressHydrationWarning>
                <Header />
                <Providers>
                    <main className="min-h-screen bg-paper">
                        {children}
                    </main>
                    <GlobalFeedbackWidget />
                </Providers>
            </body>
        </html>
    );
}
