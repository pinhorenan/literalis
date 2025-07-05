// app/api/posts/feed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { mapPost } from '@/services/post.service';

const userSelect = { id: true, username: true, avatarUrl: true } as const;
const bookSelect = { isbn: true, title: true, coverUrl: true } as const;

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get('cursor') ?? undefined;
  const take = Number(searchParams.get('take') ?? 20);

  const followingIds = await prisma.follow.findMany({
    where: { followerId: session.user.id },
    select: { followedId: true },
  });
  const authorIds = [session.user.id, ...followingIds.map((f) => f.followedId)];

  const rows = await prisma.post.findMany({
    where: { authorId: { in: authorIds } },
    take: take + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    select: {
      id: true,
      content: true,
      progress: true,
      currentPage: true,
      totalPages: true,
      rating: true,
      createdAt: true,
      updatedAt: true,
      author: { select: userSelect },
      book: { select: bookSelect },
      likes: { where: { userId: session.user.id }, select: { user: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  const items = await Promise.all(rows.slice(0, take).map((p) => mapPost(p, session.user.id)));
  const nextCursor = rows.length > take ? rows[take].id : null;

  return NextResponse.json({ items, nextCursor });
}
