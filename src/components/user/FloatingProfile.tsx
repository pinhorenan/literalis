// para debug
'use client';

import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSession, signIn } from 'next-auth/react';

export function FloatingProfile() {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;

  if (status !== 'authenticated') {
    return (
      <div className="fixed right-4 top-4 z-50 flex items-center space-x-2 rounded-full bg-white bg-opacity-80 p-2 shadow-lg backdrop-blur-md">
        <button
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
          onClick={() => signIn('github')}
        >
          Entrar
        </button>
      </div>
    );
  }

  const { username, avatarUrl } = session.user!;
  return (
    <div className="fixed right-4 top-4 z-50 flex items-center space-x-2 rounded-full bg-white bg-opacity-80 p-2 shadow-lg backdrop-blur-md">
      <Avatar>
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={username ? username : 'nao logado'} />
        ) : (
          <AvatarFallback>{username?.toUpperCase()}</AvatarFallback>
        )}
      </Avatar>
      <span className="text-sm font-medium text-gray-800">@{username}</span>
    </div>
  );
}
