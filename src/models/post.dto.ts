// src/models/post.dto.ts
import type { CommentDTO } from '@models/comment.dto';
import type { BookshelfDTO } from '@models/bookshelf.dto';

export type PostDTO = {
  id: string;
  content: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  isFollowingAuthor: boolean;
  userBook: BookshelfDTO;
  likedBy: string[];
  comments: CommentDTO[];
};

export type CreatePostDTO = {
  bookshelf: BookshelfDTO;
  content: string;
  progress: number;
};

export type UpdatePostDTO = {
  content?: string;
  progress?: number;
};
