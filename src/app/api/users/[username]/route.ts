// app/api/users/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/src/services/user.service';
import { auth } from '@/src/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const session = await auth();
  const viewerId = session?.user?.id;

  const profile = await getUserProfile(username, viewerId);
  if (!profile) {
    return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
  }
  return NextResponse.json(profile);
}
