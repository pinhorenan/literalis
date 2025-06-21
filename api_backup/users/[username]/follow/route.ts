// File: src/app/api/users/[username]/follow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getViewer } from '@lib/api';
import { db } from '@/src/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const viewer = await getViewer();
  const { username } = await params;
  if (!viewer) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  if (viewer.username === username) {
    return NextResponse.json({ error: 'Você não pode se seguir' }, { status: 400 });
  }

  const target = await db.user.findUnique({
    where: { username: username },
  });
  if (!target) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
  }

  const compositeKey = {
    followerUsername_followedUsername: {
      followerUsername: viewer.username,
      followedUsername: target.username,
    },
  };

  const existing = await db.follow.findUnique({ where: compositeKey });
  let isFollowing: boolean;

  if (existing) {
    await db.follow.delete({ where: compositeKey });
    isFollowing = false;
  } else {
    await db.follow.create({
      data: {
        followerUsername: viewer.username,
        followedUsername: target.username,
      },
    });
    isFollowing = true;
  }

  const followerCount = await db.follow.count({
    where: { followedUsername: target.username },
  });

  return NextResponse.json({ isFollowing, followerCount });
}
