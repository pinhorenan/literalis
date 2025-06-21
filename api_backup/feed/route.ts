// File: src/app/api/feed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { feedPostInclude } from '@lib/api';
import { authOptions } from '@/src/lib/auth/auth';
import { db } from '@/src/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode      = searchParams.get('mode') as 'discover' | 'friends' | null;
  const username  = searchParams.get('user');
  const cursor    = searchParams.get('cursor');
  const limit     = Number(searchParams.get('limit') ?? 20);

  const session        = await getServerSession(authOptions);
  const viewerUsername = session?.user?.username ?? null;

  const where: any = {};

  if (username) {
    where.authorUsername = username;
  } else if (mode === 'friends' && viewerUsername) {
    where.author = {
      followers: {
        some: { followerUsername: viewerUsername },
      },
    };
  } else if (mode === 'discover' && viewerUsername) {
    where.author = {
      AND: [
        { username: { not: viewerUsername } },
        {
          followers: {
            none: { followerUsername: viewerUsername },
          },
        },
      ],
    };
  }

  const posts = await db.post.findMany({
    where,
    include: feedPostInclude(viewerUsername),
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  const nextCursor = posts.length > limit ? posts.pop()!.id : undefined;
  return NextResponse.json({ posts, cursor: nextCursor });
}