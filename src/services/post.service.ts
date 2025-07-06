// src/services/post.service.ts
import { MINIMAL_BOOK_SELECT, MINIMAL_USER_SELECT } from '@/lib/constants/selects';
import { mapComment, mapPost } from '@/lib/mappings/mappers';
import { prisma } from '@/lib/prisma';
import type { Paginated, Post, Comment } from '@/types/index';

export async function getPostById(id: string, viewerId?: string): Promise<Post | null> {
  const row = await prisma.post.findUnique({
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
      author: { select: MINIMAL_USER_SELECT },
      book: { select: MINIMAL_BOOK_SELECT },
      likes: viewerId ? { where: { userId: viewerId }, select: { userId: true } } : false,
      _count: { select: { likes: true, comments: true } },
      comments: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: { select: MINIMAL_USER_SELECT },
          likes: viewerId ? { where: { userId: viewerId }, select: { userId: true } } : false,
          _count: { select: { likes: true } },
        },
      },
    },
  });

  return row ? mapPost(row, viewerId) : null;
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
      likes: viewerId ? { where: { userId: viewerId }, select: { userId: true } } : false,
      _count: { select: { likes: true, comments: true } },
    },
  });

  const items = await Promise.all(rows.slice(0, take).map((r) => mapPost(r, viewerId)));
  const total = 0;
  return { items, nextCursor: rows.length > take ? rows[take].id : null, total };
}

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
      author: { select: MINIMAL_USER_SELECT },
      book: { select: MINIMAL_BOOK_SELECT },
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
      author: { select: MINIMAL_USER_SELECT },
      likes: false,
      _count: { select: { likes: true } },
    },
  });
  return mapComment(raw, userId);
}
