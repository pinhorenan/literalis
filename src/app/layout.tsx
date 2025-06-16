// File: src/app/layout.tsx

import { type Metadata    } from  'next';
import { ReactNode        } from  'react';
import { getServerSession } from  'next-auth';
import { SessionProvider  } from  'next-auth/react';
import { ThemeProvider    } from  'next-themes';
import { authOptions      } from  '@server/auth';

import '@styles/globals.css';

export const metadata: Metadata = {
  title: 'Literalis',
  description: 'Rede social literária',
  icons: {
    icon: '/assets/icons/favicon.svg',
    shortcut: '/assets/favicon.svg',
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="min-h-screen min-w-screen font-sans antialiased">
        <SessionProvider session={session} refetchInterval={60} refetchOnWindowFocus>
          <ThemeProvider attribute="class" defaultTheme="sytem">
              <main className="flex-1">
                {children}
              </main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
