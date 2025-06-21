// File: src/app/profile/[username]/page.tsx
import ProfileShell         from '@/src/components/client/profile/ProfileShell';
import { notFound }         from 'next/navigation';
import { getServerSession } from 'next-auth';
import { prisma }           from '@server/prisma';
import { authOptions }      from '@server/auth';

import type { ClientPost }  from '@/src/types/posts';
import type { ClientUser }  from '@/src/types/users';

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  const meUsername = session?.user.username;

  const user = await prisma.user.findUnique({
    where:    { username },
    include:  {
      followers: { select: { follower: { select: { username: true } } } },
      following: { select: { followed: { select: { username: true } } } },
    },
  });
  if (!user) return notFound();

  // monta initialUser
  const initialUser: ClientUser = {
    username:           user.username,
    name:               user.name,
    avatarUrl:          user.avatarUrl,
    bio:                user.bio ?? '',
    email:              user.email ?? '',
    followerCount:      user.followers.length,
    followingCount:     user.following.length,
    followerUsernames:  user.followers.map((f) => f.follower.username),
    followingUsernames: user.following.map((f) => f.followed.username),
  }

  // busca posts do user
  const rawPosts = await prisma.post.findMany({
    where:    { authorUsername: username },
    include:  {
      
      author:   { select: { username: true, name: true, avatarUrl: true } },
      book:     { select: { isbn: true, title: true, author: true, coverUrl: true, pages: true, language: true, publisher: true, edition: true } },
      likes:    { select: { userUsername: true } },
      comments: { 
        include: { author: { select: { username: true, name: true, avatarUrl: true } } }
      },
    },
    orderBy:    { createdAt: 'desc' },
  });

  const initialPosts: ClientPost[] = rawPosts.map(post => {
    const likedByMe = meUsername
      ? post.likes.some(like => like.userUsername === meUsername)
      : false;

    const isFollowingAuthor = !!(
      meUsername &&
      initialUser.followerUsernames.includes(meUsername)
    );

    return {
      id:                 post.id,
      excerpt:            post.excerpt,
      progress:           post.progress,
      createdAt:          post.createdAt.toISOString(),
      updatedAt:          post.updatedAt.toISOString(),
      likeCount:          post.likes.length,
      commentCount:       post.comments.length,
      likedByMe,
      isFollowingAuthor,

      author: {
        username:         post.author.username,
        name:             post.author.name,
        avatarUrl:        post.author.avatarUrl,
      },

      book: {
        isbn:             post.book.isbn,
        title:            post.book.title,
        author:           post.book.author,
        coverUrl:         post.book.coverUrl,
        publisher:        post.book.publisher,
        edition:          post.book.edition,
        pages:            post.book.pages,
        language:         post.book.language,
      },

      comments: post.comments.map(comment => ({
        id:          comment.id,
        content:     comment.content,
        createdAt:   comment.createdAt.toISOString(),
        author: {
          username:   comment.author.username,
          name:       comment.author.name,
          avatarUrl:  comment.author.avatarUrl,
        }
      })),
    }
  });

  return (
    <ProfileShell
      initialUser={initialUser}
      initialPosts={initialPosts}
    />
  );
}
