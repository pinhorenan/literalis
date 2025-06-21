// File: src/app/profile/[username]/page.tsx
import { notFound }                    from 'next/navigation';
import { getViewer }                   from '@lib/auth/viewer';
import { db }                          from '@lib/db';
import ProfileShell                    from '@components/client/profile/ProfileShell';

import type { PostDTO }                from '@models/post.dto';
import type { UserDTO }                from '@models/user.dto';

export default async function Profile({ params }: { params: { username: string } }) {
  const viewer = await getViewer(false);
  const me = viewer?.username;
  const username = await params.username;

  // 2) Carrega o usuário com contagens de seguidores e seguindo
  const userRaw = await db.user.findUnique({
    where: { username },
    select: {
      username:  true,
      name:      true,
      avatarUrl: true,
      bio:       true,
      _count: {
        select: { followers: true, following: true },
      },
    },
  });
  if (!userRaw) notFound();

  // 3) Constrói o UserDTO já com followerCount e followingCount
  const initialUser: UserDTO = {
    username:       userRaw.username,
    name:           userRaw.name,
    avatarUrl:      userRaw.avatarUrl,
    bio:            userRaw.bio ?? undefined,
    followerCount:  userRaw._count.followers,
    followingCount: userRaw._count.following,
  };

  // 4) Puxa os posts, incluindo preview de comentários, likes e contagens
  const rawPosts = await db.post.findMany({
    where: { authorUsername: username },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      author: {
        select: { username: true, name: true, avatarUrl: true, bio: true },
      },
      book: {
        select: {
          isbn:            true,
          title:           true,
          author:          true,
          coverUrl:        true,
          publisher:       true,
          edition:         true,
          pages:           true,
          language:        true,
          publicationDate: true,
        },
      },
      _count: {
        select: { likes: true, comments: true },
      },
      likes: {
        where:  { userUsername: me },
        select: { userUsername: true },
      },
      comments: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          author: {
            select: {
              username:  true,
              name:      true,
              avatarUrl: true,
              bio:       true,
            },
          },
        },
      },
    },
  });

  // 5) Mapeia tudo para o PostDTO
  const initialPosts: PostDTO[] = rawPosts.map((post) => ({
    id:                 post.id,
    content:            post.content,
    progress:           post.progress,
    createdAt:          post.createdAt.toISOString(),
    updatedAt:          post.updatedAt.toISOString(),
    likeCount:          post._count.likes,
    commentCount:       post._count.comments,
    likedByMe:          post.likes.length > 0,
    isFollowingAuthor:  false, // se quiser, calcule usando seu serviço de follow
    isInMyBookshelf:    false, // idem

    author: {
      username:  post.author.username,
      name:      post.author.name,
      avatarUrl: post.author.avatarUrl,
      bio:       post.author.bio ?? undefined,
    },

    book: {
      isbn:            post.book.isbn,
      title:           post.book.title,
      author:          post.book.author,
      coverUrl:        post.book.coverUrl,
      publisher:       post.book.publisher ?? undefined,
      edition:         post.book.edition   ?? undefined,
      pages:           post.book.pages     ?? undefined,
      language:        post.book.language  ?? undefined,
      publicationDate: post.book.publicationDate
        ? post.book.publicationDate.toISOString()
        : undefined,
      external:        false,
    },

    comments: post.comments.map((c) => ({
      id:         c.id,
      content:    c.content,
      createdAt:  c.createdAt.toISOString(),
      updatedAt:  c.updatedAt.toISOString(),
      likeCount:  0,    // sem include de likes em comentário
      likedByMe:  false, // idem
      author:     {
        username:  c.author.username,
        name:      c.author.name,
        avatarUrl: c.author.avatarUrl,
        bio:       c.author.bio ?? undefined,
      },
    })),
  }));

  return (
    <ProfileShell
      initialUser={initialUser}
      initialPosts={initialPosts}
    />
  );
}
