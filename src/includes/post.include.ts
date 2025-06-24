import { minimalBookSelect } from '@includes/book.include';
import { publicUserSelect } from '@includes/user.include';

/** Seleção para feed / perfil – counts + flags (POST-004/005) */
export function feedPostInclude(viewerUsername?: string | null) {
  const base = {
    author: { select: publicUserSelect },
    book: { select: minimalBookSelect },
    _count: {
      select: { likes: true, comments: true },
    },
  } as const;

  if (!viewerUsername) return base;

  return {
    ...base,
    likes: {
      where: { userUsername: viewerUsername },
      select: { userUsername: true }, // likedByMe flag
    },
    author: {
      select: {
        ...publicUserSelect,
        followers: {
          where: { followerUsername: viewerUsername },
          select: { followerUsername: true }, // isFollowingAuthor
        },
      },
    },
  } as const;
}

/**
 * Inclui os 3 comentários mais recentes com autor mínimo.
 */
export function feedPostIncludeWithComments(viewerUsername?: string | null) {
  return {
    ...feedPostInclude(viewerUsername),
    comments: {
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        author: { select: publicUserSelect },
      },
    },
  } as const;
}
