// File: src/lib/repository/commentRepository.ts
import { db } from '@lib/db';
import { commentWithViewerInclude } from '@includes/comment';

export async function findCommentById(
  id: string,
  viewerUsername: string | null = null,
) {
  return db.comment.findUnique({
    where: { id },
    ...commentWithViewerInclude(viewerUsername),
  });
}

export async function findCommentsByPostId(
  postId: string,
  viewerUsername: string | null = null,
) {
  return db.comment.findMany({
    where:  { postId },
    orderBy:{ createdAt: 'asc' },
    ...commentWithViewerInclude(viewerUsername),
  });
}
