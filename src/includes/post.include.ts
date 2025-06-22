// src/includes/post.include.ts
import { publicUserSelect } from '@includes/user.include';

export function feedPostInclude(viewerUsername?: string | null) {
  return {
    author: {
      select: {
        ...publicUserSelect,
        followers: viewerUsername
          ? {
              where: { followerUsername: viewerUsername },
              select: { followerUsername: true },
            }
          : undefined,
      },
    },
    book: true,
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
    likes: viewerUsername
      ? {
          where: { userUsername: viewerUsername },
          select: { userUsername: true },
        }
      : undefined,
  };
}
