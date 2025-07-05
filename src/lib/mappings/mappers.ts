// src/lib/utils/mappers.ts
import { prisma } from '@/lib/prisma';
import type { ReadingStatus } from '@/types/common';
import type { Book, MinimalAuthor, MinimalGenre } from '@/types/book';
import type { Post } from '@/types/post';
import type { Comment } from '@/types/post';
import type { MinimalUser } from '@/types/user';

export function mapBook(b: any): Book {
  return {
    isbn: b.isbn,
    title: b.title,
    totalPages: b.pages,
    language: b.language,
    coverUrl: b.coverUrl,
    publicationDate: b.publicationDate,
    averageRating: b.rating ?? undefined,
    ratingsCount: undefined,
    publisher: b.publisher,
    authors: b.authors.map((a: { author: MinimalAuthor }) => a.author),
    genres: b.genres?.map?.((g: { genre: MinimalGenre }) => g.genre) ?? [],
  };
}

export function mapComment(c: any, viewerId?: string): Comment {
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
    book: mapBook(p.book),
    comments: p.comments ? p.comments.map((c: any) => mapComment(c, viewerId)) : [],
    likes: p.likes ? p.likes.map((l: any) => ({ user: l.user, createdAt: l.createdAt })) : [],
    likesCount: p._count.likes,
    commentsCount: p._count.comments,
    likedByMe: !!p.likes?.length,
    ...(shelf && { inShelfStatus: shelf.status as ReadingStatus }),
  };
}
