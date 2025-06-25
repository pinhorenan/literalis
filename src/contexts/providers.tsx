// File: src/contexts/providers.tsx
'use client';

import { FollowProvider } from '@/src/contexts/followContext';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

export function Providers({ children, session }: { children: React.ReactNode; session: any }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <FollowProvider>{children}</FollowProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
