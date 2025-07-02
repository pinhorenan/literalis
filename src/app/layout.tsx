import type { Metadata } from 'next';
import { ThemeProvider } from '@/src/components/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Literalis',
  description: 'Nova rede social literária',
  applicationName: 'Literalis',
  authors: [{ url: 'github.com/pinhorenan', name: 'Renan Pinho' }],
  icons: '/icons/favicon.svg',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="antialiased" suppressHydrationWarning>
      <head />
      <body className="flex h-svh w-svw">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
