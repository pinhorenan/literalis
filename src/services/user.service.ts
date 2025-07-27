import { prisma } from '@/lib/prisma';
import { MINIMAL_USER_SELECT } from '@/lib/constants/selects';
import type { User } from '@prisma/client';
import type { Paginated, MinimalUser, UserProfile } from '@/types/index';

/* ---------- helpers ---------- */
function mapMinimal(user: Pick<User, 'id' | 'username' | 'name' | 'avatarUrl'>): MinimalUser {
  return {
    id: user.id,
    username: user.username!,
    name: user.name ?? undefined,
    avatarUrl: user.avatarUrl,
  };
}

/* ---------- queries ---------- */
export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
    select: MINIMAL_USER_SELECT,
  });
}

export async function getUserProfile(
  username: string,
  viewerId?: string,
): Promise<UserProfile | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      ...MINIMAL_USER_SELECT,
      bio: true,
      _count: { select: { followers: true, following: true, posts: true } },
      followers: viewerId
        ? { where: { followerId: viewerId }, select: { followerId: true } }
        : false,
    },
  });

  if (!user) return null;

  return {
    user: { ...mapMinimal(user), bio: user.bio },
    counts: {
      followers: user._count.followers,
      following: user._count.following,
      posts: user._count.posts,
    },
    isFollowing: viewerId ? user.followers.length > 0 : false,
    isMe: viewerId ? user.id === viewerId : false,
  };
}

export async function listFollowers(
  userId: string,
  pageSize = 20,
  cursor?: string,
): Promise<Paginated<MinimalUser>> {
  const followers = await prisma.follow.findMany({
    where: { followedId: userId },
    take: pageSize + 1,
    ...(cursor
      ? {
          cursor: {
            followerId_followedId: {
              followerId: cursor,
              followedId: userId,
            },
          },
        }
      : {}),
    select: { follower: { select: MINIMAL_USER_SELECT } },
    orderBy: [{ createdAt: 'desc' }, { followerId: 'asc' }],
  });

  const total = await prisma.follow.count({
    where: { followedId: userId },
  });

  const items = followers.slice(0, pageSize).map((f) => mapMinimal(f.follower));
  const nextCursor = followers.length > pageSize ? followers[pageSize].follower.id : null;

  return { items, nextCursor, total };
}

export async function countBooksInShelf(userId: string) {
  const books = await prisma.bookshelfItem.count({ where: { userId } });
  return books;
}

/* ---------- mutations ---------- */
export async function toggleFollow(
  targetUserId: string,
  actorUserId: string,
): Promise<{ isFollowing: boolean; followersCount: number }> {
  const where = {
    followerId_followedId: { followerId: actorUserId, followedId: targetUserId },
  } as const;

  const existing = await prisma.follow.findUnique({ where });

  if (existing) {
    await prisma.follow.delete({ where });
  } else {
    await prisma.follow.create({ data: where.followerId_followedId });
  }

  const followersCount = await prisma.follow.count({ where: { followedId: targetUserId } });

  return { isFollowing: !existing, followersCount };
}
