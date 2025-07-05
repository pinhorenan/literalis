// app/api/users/[username]/follow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername, toggleFollow } from '@/services/user.service';
import { auth } from '@/lib/auth';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const session = await auth();
  const actorId = session?.user?.id;
  if (!actorId) {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  const target = await getUserByUsername(username);
  if (!target) {
    return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
  }

  const result = await toggleFollow(target.id, actorId);
  return NextResponse.json(result);
}
