// File: src/lib/includes/commentIncludes.ts
import type { Prisma } from '@prisma/client';
import { publicUserSelect } from '@/src/includes/user.include';

export function commentWithViewerInclude(
  viewerUsername?: string | null,
): { select: Prisma.CommentSelect } {
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
