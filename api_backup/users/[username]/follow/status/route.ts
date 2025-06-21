// File: src/app/api/users/[username]/follow/status/route.ts
import { NextResponse } from 'next/server';
import { getViewer } from '@lib/api';
import { db } from '@/src/lib/db';

export async function GET(_: Request, { params }: { params: Promise<{ username: string }> }) {
  const viewer = await getViewer(false);
  const { username } = await params;
  if (!viewer) return NextResponse.json({ isFollowing: false });

  const count = await db.follow.count({
    where: {
      followerUsername: viewer.username,
      followedUsername: username,
    },
  });

  return NextResponse.json({ isFollowing: count > 0 });
}
