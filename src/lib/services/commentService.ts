// File: src/lib/services/commentService.ts
import type { CommentDTO } from '@models/comment.dto';
import { findCommentsByPostId, findCommentById } from '@repository/comment';

export function mapCommentToDTO(
  c: any,
  viewerUsername?: string | null,
): CommentDTO {
  return {
    id:         c.id,
    content:    c.content,
    createdAt:  c.createdAt.toISOString(),
    updatedAt:  c.updatedAt.toISOString(),
    likeCount:  c._count.likes,
    likedByMe:  viewerUsername ? c.likes.length > 0 : false,
    author:     c.author,
  };
}

export async function getCommentsForPost(
  postId: string,
  viewerUsername?: string | null,
): Promise<CommentDTO[]> {
  const list = await findCommentsByPostId(postId, viewerUsername ?? null);
  return list.map(c => mapCommentToDTO(c, viewerUsername));
}

export async function getComment(
  id: string,
  viewerUsername?: string | null,
): Promise<CommentDTO | null> {
  const c = await findCommentById(id, viewerUsername ?? null);
  return c ? mapCommentToDTO(c, viewerUsername) : null;
}
