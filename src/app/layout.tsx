// src/app/layout.tsx
import './globals.css';
import Providers from '@/providers/providers';
import { auth } from '@/lib/auth';

export const metadata = {
  title: 'Literalis',
  description: 'Nova rede social literária',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="pt-BR" className="antialiased" suppressHydrationWarning>
      <head />
      <body className="relative h-screen w-full">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
