// src/includes/post.include.ts
import { commentInclude } from './comment.include';
import { bookshelfInclude } from './bookshelf.include';

export const postInclude = {
  userBook: { include: bookshelfInclude },
  comments: {
    include: commentInclude,
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      authorUsername: true,
      postId: true,
      _count: { select: { likes: true } },  // Incluindo o contador de likes
      likedBy: {
        select: { username: true },  // Adicionando usuários que curtiram o comentário
      },
    },
  },
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
        ...bookshelfInclude,
        user: {
          select: {
            ...bookshelfInclude.user.select,
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
