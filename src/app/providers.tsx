// File: src/app/providers.tsx
'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

export default function Providers({ children, session }: { children: ReactNode; session: any }) {
    return (
        <SessionProvider session={session} refetchInterval={60} refetchOnWindowFocus>
            <ThemeProvider attribute="class" defaultTheme="system">
                {children}
            </ThemeProvider>
        </SessionProvider>
    );
}