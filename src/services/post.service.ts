// src/services/post.service.ts
import { prisma } from '@/lib/prisma';
import type { Paginated, ReadingStatus } from '@/types/common';
import type { Post, Comment, Like } from '@/types/post';
import type { MinimalUser } from '@/types/user';

const userSelect = { id: true, username: true, avatarUrl: true } as const;
const bookSelect = { isbn: true, title: true, coverUrl: true } as const;

/* ---- helpers ---- */
function mapLike(l: any): Like {
  return { user: l.user, createdAt: l.createdAt };
}

function mapComment(c: any): Comment {
  return {
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    author: c.author as MinimalUser,
    likesCount: c._count?.likes ?? 0,
    likedByMe: false, // TODO: calcular likedByMe se necessário
  };
}

async function mapPost(p: any, currentUserId?: string): Promise<Post> {
  const likedByMe = !!p.likes?.length;

  const shelf = currentUserId
    ? await prisma.bookshelfItem.findUnique({
        where: { userId_bookIsbn: { userId: currentUserId, bookIsbn: p.book.isbn } },
        select: { status: true },
      })
    : null;

  return {
    id: p.id,
    content: p.content,
    progress: p.progress ?? undefined,
    currentPage: p.currentPage ?? undefined,
    totalPages: p.totalPages ?? undefined,
    rating: p.rating ?? undefined,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    author: p.author,
    book: p.book,
    likesCount: p._count.likes,
    commentsCount: p._count.comments,
    likedByMe,
  };
}

/* ---- queries ---- */
export async function getPostById(id: string, viewerId?: string): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: { id },
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
      likes: viewerId ? { where: { userId: viewerId }, select: { user: true } } : false,
      _count: { select: { likes: true, comments: true } },
    },
  });
  return post ? mapPost(post, viewerId) : null;
}

export async function listUserPosts(
  userId: string,
  viewerId?: string,
  take = 20,
  cursor?: string, // agora cursor é string contendo o ID
): Promise<Paginated<Post>> {
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    take: take + 1, // busca um a mais para saber se há próximo cursor
    ...(cursor
      ? { cursor: { id: cursor } } // cursor único no campo `id` :contentReference[oaicite:8]{index=8}
      : {}),
    orderBy: { createdAt: 'desc' },
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
      likes: viewerId ? { where: { userId: viewerId }, select: { user: true } } : false,
      _count: { select: { likes: true, comments: true } },
    },
  });

  const items = await Promise.all(posts.slice(0, take).map((p) => mapPost(p, viewerId)));
  const nextCursor = posts.length > take ? posts[take].id : null; // devolve string ID :contentReference[oaicite:9]{index=9}
  return { items, nextCursor };
}

/* ---- mutations ---- */
export async function createPost(input: {
  authorId: string; // deve corresponder ao campo authorId do schema :contentReference[oaicite:10]{index=10}
  bookIsbn: string;
  content: string;
  progress?: number;
  currentPage?: number;
  totalPages?: number;
  rating?: number;
}): Promise<Post> {
  const post = await prisma.post.create({
    data: {
      authorId: input.authorId, // campo obrigatório
      bookIsbn: input.bookIsbn,
      content: input.content,
      progress: input.progress,
      currentPage: input.currentPage,
      totalPages: input.totalPages,
      rating: input.rating,
    },
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
      likes: false,
      _count: { select: { likes: true, comments: true } },
    },
  });
  return mapPost(post, input.authorId);
}

export async function toggleLike(postId: string, userId: string): Promise<Post | null> {
  const where = { userId_postId: { userId, postId } } as const;
  const existing = await prisma.postLike.findUnique({ where });

  if (existing) {
    await prisma.postLike.delete({ where });
  } else {
    await prisma.postLike.create({ data: where.userId_postId });
  }
  return getPostById(postId, userId);
}

export async function addComment(postId: string, userId: string, content: string): Promise<void> {
  await prisma.comment.create({ data: { postId, authorId: userId, content } });
}
