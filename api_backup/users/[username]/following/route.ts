// File: src/app/api/users/[username]/following/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { publicUserSelect } from '@lib/api';
import { db } from '@/src/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const isFollowers = req.nextUrl.pathname.endsWith('/followers');
  const { username } = await params;
  const { searchParams } = new URL(req.url);
  const page  = Number(searchParams.get('page')  ?? 1);
  const limit = Number(searchParams.get('limit') ?? 20);
  const skip  = (page - 1) * limit;

  const users = await db.user.findMany({
    where: isFollowers
      ? { following: { some: { followedUsername: username } } }
      : { followers: { some: { followerUsername: username } } },
    select: publicUserSelect,
    skip,
    take: limit,
  });

  return NextResponse.json(users);
}
