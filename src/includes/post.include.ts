// src/includes/post.include.ts
import { commentInclude } from './comment.include';
import { userBookInclude } from './userBook.include';

export const postInclude = {
  userBook: { include: userBookInclude },
  comments: { include: commentInclude },
  likes: { select: { userUsername: true } },
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
} as const;

export const feedPostInclude = (viewerUsername: string | null) => {
  const base = { ...postInclude };

  if (!viewerUsername) return base;

  return {
    ...base,
    likes: {
      where: { userUsername: viewerUsername },
      select: { userUsername: true },
    },
    userBook: {
      include: {
        ...userBookInclude,
        user: {
          select: {
            ...userBookInclude.user.select,
            followers: {
              where: { followerUsername: viewerUsername },
              select: { followerUsername: true },
            },
          },
        },
      },
    },
  } as const;
};
