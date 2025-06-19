// File: src/context/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider   } from 'next-themes';

export function Providers({ children, session }: any ) {
    return (
        <SessionProvider session={session}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </SessionProvider>
    );
}