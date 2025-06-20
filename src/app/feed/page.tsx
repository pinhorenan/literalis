// File: src/app/feed/page.tsx
import FeedClient                   from '@components/feed/FeedClient';
import { prisma }                   from '@server/prisma';
import { getServerSession }         from 'next-auth';
import { authOptions }              from '@server/auth';
import { mapRawToClientPost }       from '@lib/mapPost';
import type { RawPost, ClientPost } from '@/src/types/posts';

export default async function PageFeed() {
  const session = await getServerSession(authOptions);
  const meUsername = session?.user.username;

  const rawPosts = await prisma.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      author:   { select: { username: true, name: true, avatarUrl: true } },
      book:     { select: { isbn: true, title: true, author: true, coverUrl: true } },
      comments: { include: { author: { select: { username: true, name: true, avatarUrl: true } } } },
      likes:    { select: { userUsername: true } },
    },
  }) as RawPost[]

  const uniqueAuthors = [...new Set(rawPosts.map(post => post.author.username))];

  const followings = await prisma.follow.findMany({
    where: {
      followerId: meUsername,
      followedId: { in: uniqueAuthors, }
    },
    select: { followedId: true },
  });

  const followingUsernames = new Set(followings.map(f => f.followedId));

  const initialPosts: ClientPost[] = rawPosts.map(post => {
    const likedByMe = post.likes.some(like => like.userUsername === meUsername)
    const isFollowingAuthor = followingUsernames.has(post.author.username);

      return {
        ...mapRawToClientPost(post),
        likedByMe,
        isFollowingAuthor,
      }
  });



  return (
    <>
      <FeedClient 
        initialPosts={initialPosts} 
        initialTab="discover" />
    </>
  );
}
