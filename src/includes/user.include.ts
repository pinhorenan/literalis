// src/lib/api/user.include.ts
import type { Prisma } from '@prisma/client';

/**
 * Campos mínimos – MinimalUserDTO :contentReference[oaicite:0]{index=0}
 */
export const publicUserSelect = {
  username: true,
  name: true,
  avatarUrl: true,
} as const;

/**
 * Seleção de perfil.  
 * Se `includePrivateShelf` = true o filtro por isPrivate é removido
 * (viewer === owner).  Atende SHELF-003 :contentReference[oaicite:1]{index=1}
 */
export function userProfileSelect(
  includePrivateShelf = false,
): Prisma.UserSelect {
  return {
    username: true,
    name: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    updatedAt: true,

    // seguidores / seguindo – ordered desc (FOL-002)
    followers: {
      orderBy: { createdAt: 'desc' },
      select: {
        follower: { select: publicUserSelect },
        createdAt: true,
      },
    },
    following: {
      orderBy: { createdAt: 'desc' },
      select: {
        followed: { select: publicUserSelect },
        createdAt: true,
      },
    },

    // estante
    bookshelf: {
      ...(includePrivateShelf ? {} : { where: { isPrivate: false } }),
      orderBy: { addedAt: 'desc' },
      select: {
        currentPage: true,
        status: true,
        isPrivate: true,
        addedAt: true,
        updatedAt: true,
        removedAt: true,
        rating: true,
        book: {
          select: {
            isbn: true,
            title: true,
            coverUrl: true,
            pages: true,
            author: true,
            publisher: true,
            edition: true,
            language: true,
            publicationDate: true,
            external: true,
          },
        },
      },
    },

    // IDs dos posts mais recentes (para feed rápido)
    posts: {
      orderBy: { createdAt: 'desc' },
      take: 3,                            // POST-004
      select: { id: true },
    },
  };
}
