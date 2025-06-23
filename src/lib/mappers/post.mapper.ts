// src/lib/mappers/post.mapper.ts
import type { Post, Book, User } from '@prisma/client';
import type { PostDTO } from '@models/post.dto';
import { mapUserToMinimalDTO } from '@mappers/user.mapper';
import { mapBookToMinimalDTO } from '@mappers/book.mapper';
import type { CommentDTO } from '@models/comment.dto';

/**
 * Map a Post record with related data to PostDTO
 * @param post      - Prisma Post record
 * @param author    - Prisma User record (author)
 * @param book      - Prisma Book record
 * @param likes     - Array of Users who liked
 * @param comments  - Array of CommentDTO
 */
export function mapPostToDTO(
  post: Post,
  author: User,
  book: Book,
  likes: User[],
  comments: CommentDTO[]
): PostDTO {
  const totalPages = book.pages;
  const progress = totalPages > 0
    ? Math.floor((post.currentPage / totalPages) * 100)
    : 0;

  return {
    id: post.id,
    content: post.content,
    currentPage: post.currentPage,
    totalPages,
    progress,
    rating: post.rating ?? undefined,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: mapUserToMinimalDTO(author),
    book: mapBookToMinimalDTO(book),
    likes: likes.map(mapUserToMinimalDTO),
    comments,
  };
}
