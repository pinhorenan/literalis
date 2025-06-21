// src/lib/mappers/comment.mapper.ts
import type { Comment, CommentLike, User, Follow } from '@prisma/client';
import type { CommentDTO } from '../../types/dto/comment.dto';
import { toUserDTO } from './user.mapper';

// O Comment deve vir com include: { author: { followers: true, following: true }, likes: true }
type CommentWithRelations = Comment & {
  author: User & { followers?: Follow[], following?: Follow[] };
  likes?: CommentLike[];
};

/**
 * @param comment 
 * @param meUsername username do usuário autenticado para cálculo do likedByMe
 */
export function toCommentDTO(comment: CommentWithRelations, meUsername?: string): CommentDTO {
  const likeCount = comment.likes ? comment.likes.length : 0;
  const likedByMe = !!(meUsername && comment.likes?.some(like => like.userUsername === meUsername));

  return {
    id:         comment.id,
    content:    comment.content,
    createdAt:  comment.createdAt.toISOString(),
    updatedAt:  comment.updatedAt.toISOString(),
    likeCount,
    likedByMe,
    author:     toUserDTO(comment.author),
  };
}
