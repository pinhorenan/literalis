// app/api/users/[username]/follow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername, toggleFollow } from '@/services/user.service';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: { username: string } }) {
  const session = await auth();
  const actorId = session?.user?.id;
  if (!actorId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const target = await getUserByUsername(params.username);
  if (!target) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const result = await toggleFollow(target.id, actorId);
  return NextResponse.json(result);
}
