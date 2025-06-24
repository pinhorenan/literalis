import { Book, Post, User } from '@prisma/client';
import { z } from 'zod';
import { type MinimalBookDTO, mapBookToMinimalDTO } from './book.model';
import { CommentDTO } from './comment.model';
import { type MinimalUserDTO, mapUserToMinimalDTO } from './user.model';

export interface PostDTO {
  id: string;
  content: string;

  progress: number;
  currentPage: number;
  totalPages: number;
  rating?: number;

  createdAt: Date;
  updatedAt: Date;

  author: MinimalUserDTO;
  book: MinimalBookDTO;
  likes: MinimalUserDTO[];
  comments: CommentDTO[];
}

export const postCreateSchema = z.object({
  content: z.string().min(1),
  bookIsbn: z.string().min(1),
  currentPage: z.number().int().min(0),
  rating: z.number().int().min(1).max(5).optional(),
});
export type PostCreateDTO = z.infer<typeof postCreateSchema>;

export const postUpdateSchema = z.object({
  content: z.string().min(1).optional(),
  currentPage: z.number().int().min(0).optional(),
  rating: z.number().int().min(1).max(5).optional(),
});
export type PostUpdateDTO = z.infer<typeof postUpdateSchema>;

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
  comments: CommentDTO[],
): PostDTO {
  const totalPages = book.pages;
  const progress = totalPages > 0 ? Math.floor((post.currentPage / totalPages) * 100) : 0;

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
