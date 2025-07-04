import { type MinimalUserDTO } from './user.type';
import { type BookDataResponse } from '@/src/api/books';
export interface PostDTO {
  postID: string;
  content: string;
  progress: number;
  currentPage: number;
  totalPages: number;
  rating?: number;
  createdAt: Date;
  updatedAt?: Date;

  book: BookDataResponse;
  author: MinimalUserDTO;
  comments: PostCommentDTO[];
  likeUserList: MinimalUserDTO[];
}

export interface PostCommentDTO {
  id: string;
  author: MinimalUserDTO;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
}
