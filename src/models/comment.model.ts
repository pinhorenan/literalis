import { Comment, User } from '@prisma/client';
import { type MinimalUserDTO, mapUserToMinimalDTO } from '@models/user.model';
import { z } from 'zod';

export interface CommentDTO {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: MinimalUserDTO;
  postId: string;        
  likes: MinimalUserDTO[];
};

export const commentCreateSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1).max(1000),
});
export type CommentCreateDTO = z.infer<typeof commentCreateSchema>;

export const commentUpdateSchema = z.object({
  content: z.string().min(1).max(1000),
});
export type CommentUpdateDTO = z.infer<typeof commentUpdateSchema>;

export function mapCommentToDTO(
  comment: Comment,
  author: User,
  likes: User[]
): CommentDTO {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    author: mapUserToMinimalDTO(author),
    postId: comment.postId,
    likes: likes.map(mapUserToMinimalDTO),
  };
}
