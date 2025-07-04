// src/types/post.ts
import type { Paginated } from '@/types/common';
import type { MinimalUser } from '@/types/user';
import type { MinimalBook } from '@/types/book';

export interface Comment {
  id: string;
  content: string;
  author: MinimalUser;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  likedByMe: boolean;
}

export interface Like {
  user: MinimalUser;
  createdAt: Date;
}

export interface Post {
  id: string;
  content: string;
  progress?: number;
  currentPage?: number;
  totalPages?: number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
  author: MinimalUser;
  book: MinimalBook;
  commentsCount: number;
  likesCount: number;
  likedByMe: boolean;
}

export type CommentsPage = Paginated<Comment>;
export type LikesPage = Paginated<Like>;
