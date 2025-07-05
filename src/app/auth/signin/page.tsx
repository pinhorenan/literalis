// src/app/auth/signin/page.tsx
'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Se já está logado, redireciona para home
  if (session) {
    router.replace('/');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-2xl font-bold">Entrar</h1>
      <button className="bg-info text-primary rounded px-4 py-2" onClick={() => signIn('github')}>
        Entrar com GitHub
      </button>
    </div>
  );
}
