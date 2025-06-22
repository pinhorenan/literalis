// src/lib/mappers/comment.mapper.ts
import type { Comment } from '@prisma/client';
import type { CommentDTO } from '@models/comment.dto';

export function mapCommentToDTO(comment: any, viewerUsername?: string | null): CommentDTO {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    likeCount: comment._count?.likes ?? 0,
    likedByMe: !!comment.likes?.some((l: any) => l.userUsername === viewerUsername),
    author: {
      username: comment.author.username,
      name: comment.author.name,
      avatarUrl: comment.author.avatarUrl,
    },
  };
}
