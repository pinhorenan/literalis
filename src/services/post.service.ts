// src/services/post.service.ts
import { prisma } from '@/lib/prisma';
import type { Paginated } from '@/types/common';
import type { ReadingStatus } from '@/types/common';
import type { Post, Comment, Like } from '@/types/post';
import type { MinimalUser } from '@/types/user';

/* ---------- selects compartilhados ---------- */
const userSelect = { id: true, username: true, avatarUrl: true } as const;
const bookSelect = { isbn: true, title: true, coverUrl: true } as const;

/* ---------- helpers ---------- */
function mapLike(l: { user: MinimalUser; createdAt: Date }): Like {
  return { user: l.user, createdAt: l.createdAt };
}

function mapComment(c: any, viewerId?: string): Comment {
  return {
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    author: c.author as MinimalUser,
    likesCount: c._count.likes,
    likedByMe: viewerId ? c.likes.length > 0 : false,
  };
}

export async function mapPost(p: any, viewerId?: string): Promise<Post> {
  const likedByMe = !!p.likes?.length;

  // status do livro na estante do viewer (opcional)
  const shelf = viewerId
    ? await prisma.bookshelfItem.findUnique({
        where: { userId_bookIsbn: { userId: viewerId, bookIsbn: p.book.isbn } },
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
    ...(shelf ? { inShelfStatus: shelf.status as ReadingStatus } : {}),
  };
}

/* ---------- queries ---------- */
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
  cursor?: string,
): Promise<Paginated<Post>> {
  const rows = await prisma.post.findMany({
    where: { authorId: userId },
    take: take + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: [
      { createdAt: 'desc' },
      { id: 'desc' }, // tie-breaker para ordem consistente
    ],
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

  const items = await Promise.all(rows.slice(0, take).map((p) => mapPost(p, viewerId)));
  const nextCursor = rows.length > take ? rows[take].id : null;

  return { items, nextCursor };
}

/* ---------- mutations ---------- */
export async function createPost(input: {
  authorId: string;
  bookIsbn: string;
  content: string;
  progress?: number;
  currentPage?: number;
  totalPages?: number;
  rating?: number;
}): Promise<Post> {
  const post = await prisma.post.create({
    data: {
      authorId: input.authorId,
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
      _count: { select: { likes: true, comments: true } },
    },
  });

  // viewerId = undefined => likedByMe false
  return mapPost(post, undefined);
}

export async function toggleLike(postId: string, userId: string): Promise<Post | null> {
  const where = { userId_postId: { userId, postId } } as const;

  await prisma.$transaction(async (tx) => {
    const existing = await tx.postLike.findUnique({ where });
    if (existing) {
      await tx.postLike.delete({ where });
    } else {
      await tx.postLike.create({ data: where.userId_postId });
    }
  });

  return getPostById(postId, userId);
}

export async function addComment(
  postId: string,
  userId: string,
  content: string,
): Promise<Comment> {
  const raw = await prisma.comment.create({
    data: { postId, authorId: userId, content },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      author: { select: userSelect },
      likes: false,
      _count: { select: { likes: true } },
    },
  });
  return mapComment(raw, userId);
}
