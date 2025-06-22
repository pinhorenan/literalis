// File: src/context/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider   } from 'next-themes';
import { FollowProvider } from '@/src/contexts/followContext';

export function Providers({ children, session }: { children: React.ReactNode; session: any } ) {
    return (
        <SessionProvider session={session}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <FollowProvider>
                    {children}
                </FollowProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}