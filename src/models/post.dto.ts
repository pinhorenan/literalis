import type { MinimalUserDTO } from './user.dto';
import type { MinimalBookDTO } from './book.dto';
import type { CommentDTO } from './comment.dto';

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