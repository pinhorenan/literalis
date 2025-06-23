// src/lib/mappers/comment.mapper.ts
import type { Comment, User } from '@prisma/client';
import type { CommentDTO } from '@models/comment.dto';
import { mapUserToMinimalDTO } from '@mappers/user.mapper';

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
