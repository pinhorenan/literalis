// src/app/layout.tsx
import { type Metadata    } from  'next';
import { ReactNode        } from  'react';
import { getViewerSession } from  '@services/viewer.service';
import { Providers        } from  '@context/providers';
import { Toaster } from 'react-hot-toast';
import '@styles/globals.css';

export const metadata: Metadata = {
  title: 'Literalis',
  description: 'Rede social literária',
  icons: { icon: '/assets/icons/favicon.svg', shortcut: '/assets/icons/favicon.svg' },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getViewerSession();

  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen min-w-screen font-sans antialiased">
        <Providers session={session}>
          <main className="flex-1">
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'bg-white text-gray-800 dark:bg-gray-800 dark:text-white',
                style: {
                  borderRadius: '8px',
                  padding: '16px',
                },
              }}
              containerStyle={{
                top: '80px',
                right: '20px',
              }}
            />
          </main>
        </Providers>
      </body>
    </html>
  );
}
