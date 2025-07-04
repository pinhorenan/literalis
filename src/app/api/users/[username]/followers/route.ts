// app/api/users/[username]/followers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserByUsername } from '@/services/user.service';

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const { cursor } = Object.fromEntries(req.nextUrl.searchParams);
  const take = 20;

  const user = await getUserByUsername(username);
  if (!user) {
    return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
  }

  const followers = await prisma.follow.findMany({
    where: { followedId: user.id },
    orderBy: [{ createdAt: 'desc' }, { followerId: 'asc' }],
    take,
    ...(cursor
      ? {
          cursor: {
            followerId_followedId: {
              followerId: cursor as string,
              followedId: user.id,
            },
          },
          skip: 1,
        }
      : {}),
    include: {
      follower: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  const nextCursor = followers.length === take ? followers[followers.length - 1].followerId : null;

  return NextResponse.json({
    followers: followers.map((f) => f.follower),
    nextCursor,
  });
}
