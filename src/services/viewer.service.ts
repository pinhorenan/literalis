import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@libs/authOptions';

export async function getViewerSession(required = true): Promise<{ username: string; name: string; email: string; avatarUrl: string; bio?: string; } | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user?.username) {
    if (required) {
      throw NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    return null;
  }
  return user;
}
