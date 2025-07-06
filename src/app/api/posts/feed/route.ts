// src/app/api/posts/feed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MINIMAL_BOOK_SELECT, MINIMAL_USER_SELECT } from '@/lib/constants/selects';
import { mapBook } from '@/lib/mappings/mappers';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get('cursor') ?? undefined;
  const take = Number(searchParams.get('take') ?? 20);

  const following = await prisma.follow.findMany({
    where: { followerId: session.user.id },
    select: { followedId: true },
  });
  const authorIds = [session.user.id, ...following.map((f) => f.followedId)];

  const raw = await prisma.post.findMany({
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
      author: { select: MINIMAL_USER_SELECT },
      book: { select: MINIMAL_BOOK_SELECT },
      likes: {
        where: { userId: session.user.id },
        select: { userId: true },
      },
      _count: { select: { comments: true, likes: true } },
      comments: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: { select: MINIMAL_USER_SELECT },
          likes: session.user.id
            ? { where: { userId: session.user.id }, select: { userId: true } }
            : false,
          _count: { select: { likes: true } },
        },
      },
    },
  });

  const items = raw.slice(0, take).map((p) => ({
    id: p.id,
    content: p.content,
    progress: p.progress ?? undefined,
    currentPage: p.currentPage ?? undefined,
    totalPages: p.totalPages ?? undefined,
    rating: p.rating ?? undefined,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    author: p.author,
    book: mapBook(p.book),
    commentsCount: p._count.comments,
    likesCount: p._count.likes,
    likedByMe: p.likes.length > 0,
    comments: p.comments,
  }));

  return NextResponse.json({
    items,
    nextCursor: raw.length > take ? raw[take].id : null,
  });
}
