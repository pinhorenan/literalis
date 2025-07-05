// app/api/users/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/services/user.service';
import { auth } from '@/lib/auth';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const session = await auth();
  const viewerId = session?.user?.id;

  const profile = await getUserProfile(username, viewerId);
  if (!profile) {
    return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
  }
  return NextResponse.json(profile);
}
