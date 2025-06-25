// src/models/post.model.ts
import { Book, Post, User } from '@prisma/client';
import z from 'zod';
import { BookDTO, mapBookToDTO } from './book.model';
import { CommentDTO } from './comment.model';
import { mapUserToMinimalDTO, MinimalUserDTO } from './user.model';

export const postCreateSchema = z.object({
  content: z.string().max(1000),
  currentPage: z.number().int().nonnegative(),
  rating: z.number().min(0).max(10).optional(),
  bookIsbn: z.string(),
});
export type PostCreateDTO = z.infer<typeof postCreateSchema>;

export interface PostDTO {
  id: string;
  content: string;
  currentPage: number;
  totalPages: number;
  progress: number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
  author: MinimalUserDTO;
  book: BookDTO;
  likes: MinimalUserDTO[];
  comments: CommentDTO[];
}

export function mapPostToDTO(
  post: Post,
  author: User,
  book: Book,
  likes: User[],
  comments: CommentDTO[],
): PostDTO {
  const totalPages = book.pages;
  const progress = (post.currentPage / totalPages) * 100;
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
    book: mapBookToDTO(book),
    likes: likes.map(mapUserToMinimalDTO),
    comments,
  };
}
