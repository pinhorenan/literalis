// File: src/lib/includes/commentIncludes.ts
import type { db } from '@prisma/client';
import { publicUserSelect } from '@includes/user';

export function commentWithViewerInclude(
  viewerUsername?: string | null,
): { select: db.commentSelect } {
  return {
    select: {
      id:        true,
      content:   true,
      createdAt: true,
      updatedAt: true,

      author: { select: publicUserSelect },

      _count: { select: { likes: true } },

      // usado para likedByMe
      likes: viewerUsername
        ? {
            where:  { userUsername: viewerUsername },
            select: { userUsername: true },
          }
        : false,
    },
  };
}
