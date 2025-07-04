// app/api/users/[username]/following/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserByUsername } from '@/src/services/user.service';

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const { cursor } = Object.fromEntries(req.nextUrl.searchParams);
  const take = 20;

  const user = await getUserByUsername(username);
  if (!user) {
    return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 404 });
  }

  const following = await prisma.follow.findMany({
    where: { followerId: user.id },
    orderBy: [{ createdAt: 'desc' }, { followedId: 'asc' }],
    take,
    ...(cursor
      ? {
          cursor: {
            followerId_followedId: {
              followerId: user.id,
              followedId: cursor as string,
            },
          },
          skip: 1,
        }
      : {}),
    include: {
      followed: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  const nextCursor = following.length === take ? following[following.length - 1].followedId : null;

  return NextResponse.json({
    following: following.map((f) => f.followed),
    nextCursor,
  });
}
