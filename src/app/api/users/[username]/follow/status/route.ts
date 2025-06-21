// File: src/app/api/users/[username]/follow/status/route.ts
import { NextResponse } from 'next/server';
import { getViewer } from '@lib/api';
import { prisma } from '@lib/prisma';

export async function GET(_: Request, { params }: { params: Promise<{ username: string }> }) {
  const viewer = await getViewer(false);
  const { username } = await params;
  if (!viewer) return NextResponse.json({ isFollowing: false });

  const count = await prisma.follow.count({
    where: {
      followerUsername: viewer.username,
      followedUsername: username,
    },
  });

  return NextResponse.json({ isFollowing: count > 0 });
}
