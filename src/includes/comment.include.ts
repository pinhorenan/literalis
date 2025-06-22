// src/includes/comment.include.ts
import { publicUserSelect } from './user.include';

export const commentInclude = {
  author: { select: publicUserSelect },
  _count: {
    select: {
      likes: true,
    },
  },
} as const;

export const commentWithLikesInclude = (viewerUsername: string | null) => {
  const base = { ...commentInclude };

  if (!viewerUsername) return base;

  return {
    ...base,
    likes: {
      where: { userUsername: viewerUsername },
      select: { userUsername: true },
    },
  } as const;
};
