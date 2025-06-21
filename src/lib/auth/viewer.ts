// File: src/lib/auth/viewer.ts
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@lib/auth/auth';

/**
 * getViewer
 * - retorna o objeto 'session.user' (que contém username, name, email, avatarUrl e bio)
 * - se 'required' for true e não houver sessão, lança um NextResponse JSON(401)
 * - se 'required' for false e não houver sessão, retorna 'null' silenciosamente
 */
export async function getViewer(required = true): Promise<{ username: string; name: string; email: string; avatarUrl: string; bio?: string; } | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user?.username) {
    if (required) {
      throw NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    return null
  }
  return user
}