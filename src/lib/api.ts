import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@lib/auth';

/**
 * Retorna o usuário autenticado (username, name, email, avatarUrl, bio) ou lança 401 se não houver sessão.
 * Se `required=false`, devolve `null` silenciosamente.
 */
export async function getViewer(required = true) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.username) {
    if (required) {
      throw NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }
    return null;
  }

  // Session.user deve conter pelo menos { username }
  return session.user;
}

/**
 * Seleção de campos públicos de usuário.
 * Remove `id` porque o PK é `username`.
 */
export const publicUserSelect = {
  username: true,
  name: true,
  avatarUrl: true,
  bio: true,
};

/**
 * Seleciona campos de usuário + contagens e estado de follow.
 * @param viewerUsername Usuario visualizador (string) ou null
 */
export const userWithCounts = (viewerUsername?: string | null) => ({
  ...publicUserSelect,
  _count: {
    select: {
      followers: true,
      following: true,
    },
  },
  isFollowing: viewerUsername
    ? {
        select: {
          followers: {
            where: { followerUsername: viewerUsername },
            select: { followerUsername: true },
          },
        },
      }
    : false,
});

/**
 * Inclui dados básicos de post no feed.
 * @param viewerUsername Nome de usuário do viewer (string)
 */
export const feedPostInclude = (viewerUsername?: string | null) => ({
  author: { select: publicUserSelect },
  book: true,
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
  ...(viewerUsername && {
    likes: {
      where: { userUsername: viewerUsername },
      select: { userUsername: true },
    },
    author: {
      select: {
        ...publicUserSelect,
        followers: {
          where: { followerUsername: viewerUsername },
          select: { followerUsername: true },
        },
      },
    },
  }),
});

/**
 * Inclui também um preview de comentários.
 */
export const fullPostInclude = (viewerUsername?: string | null) => ({
  ...feedPostInclude(viewerUsername),
  comments: {
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { author: { select: publicUserSelect } },
  },
});
