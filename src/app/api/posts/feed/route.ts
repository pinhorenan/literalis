import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { MINIMAL_BOOK_SELECT } from '@/lib/includes/book';
import { mapBook } from '@/services/book.service';

/* ---------- selects ---------- */
const userSelect = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
} as const;
const bookSelect = MINIMAL_BOOK_SELECT;

/* ---------- handler ---------- */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });

  /* paginação */
  const { searchParams } = req.nextUrl;
  const cursor = searchParams.get('cursor') ?? undefined;
  const take = Number(searchParams.get('take') ?? 20);

  /* ids que o usuário segue + o próprio */
  const following = await prisma.follow.findMany({
    where: { followerId: session.user.id },
    select: { followedId: true },
  });
  const authorIds = [session.user.id, ...following.map((f) => f.followedId)];

  /* busca posts */
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
      author: { select: userSelect },
      book: { select: bookSelect },
      _count: { select: { comments: true, likes: true } },
      likes: {
        where: { userId: session.user.id },
        select: { userId: true },
      },
    },
  });

  /* mapeia para shape do front */
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
    book: mapBook(p.book), // ← autores achatos
    commentsCount: p._count.comments,
    likesCount: p._count.likes,
    likedByMe: p.likes.length > 0,
  }));

  return NextResponse.json({
    items,
    nextCursor: raw.length > take ? raw[take].id : null,
  });
}
