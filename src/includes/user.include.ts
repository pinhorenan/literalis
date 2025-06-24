import type { Prisma } from '@prisma/client';

/**
 * Campos mínimos – MinimalUserDTO
 */
export const publicUserSelect = {
  username: true,
  name: true,
  avatarUrl: true,
} as const;

/**
 * Include para montar o perfil completo:
 * - followers -> follower { username, name, avatarUrl }
 * - following -> followed { username, name, avatarUrl }
 * - bookshelf -> book { todos os campos necessários }
 *
 * Se includePrivateShelf = false, filtra isPrivate
 */
export function userProfileInclude(includePrivateShelf = false): Prisma.UserInclude {
  return {
    followers: {
      orderBy: { createdAt: 'desc' },
      include: { follower: { select: publicUserSelect } },
    },
    following: {
      orderBy: { createdAt: 'desc' },
      include: { followed: { select: publicUserSelect } },
    },
    bookshelf: {
      ...(includePrivateShelf ? {} : { where: { isPrivate: false } }),
      orderBy: { addedAt: 'desc' },
      include: {
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
    posts: {
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    },
  };
}

/**
 * Tipagem bruta do perfil público (RawUserProfile).
 * Usamos include, então este payload traz todos os scalars + as relações acim.
 */
export type RawUserProfile = Prisma.UserGetPayload<{
  include: ReturnType<typeof userProfileInclude>;
}>;

/**
 * Para o perfil privado, basta reaproveitar RawUserProfile:
 * o objetoretornado já traz, via include padrão, todos os scalars (incluindo email).
 * Existe para evitar confusão e extensibilidade futura.
 */
export type RawUserPrivateProfile = RawUserProfile;
