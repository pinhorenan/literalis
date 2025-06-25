// src/models/comment.model.ts
import { Comment, User } from '@prisma/client';
import { mapUserToMinimalDTO, MinimalUserDTO } from './user.model';

export interface CommentDTO {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: MinimalUserDTO;
  likes: MinimalUserDTO[];
}

export function mapCommentToDTO(comment: Comment, author: User, likes: User[]): CommentDTO {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    author: mapUserToMinimalDTO(author),
    likes: likes,
  };
}
