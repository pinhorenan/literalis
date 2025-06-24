import {
  publicUserSelect,
  userProfileInclude,
  type RawUserPrivateProfile,
  type RawUserProfile,
} from '@includes/user.include';
import { db } from '@libs/db';
import type { Prisma } from '@prisma/client';

export const UserRepository = {
  /** Perfil público (sem enamil nem passwordHash) */
  async findProfile(username: string, includePrivate = false): Promise<RawUserProfile | null> {
    return db.user.findUnique({
      where: { username },
      include: userProfileInclude(includePrivate),
    });
  },

  /** Perfil privado (com email) */
  async findPrivateProfile(username: string): Promise<RawUserPrivateProfile | null> {
    return db.user.findUnique({
      where: { username },
      include: userProfileInclude(true),
    });
  },

  /** Minimal - para "follow toggle", etc. */
  async findMinimal(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<{ username: string; name: string; avatarUrl: string } | null> {
    return db.user.findUnique({
      where,
      select: publicUserSelect,
    });
  },

  async search(term: string, limit = 20) {
    return db.user.findMany({
      where: {
        OR: [
          { username: { contains: term, mode: 'insensitive' } },
          { name: { contains: term, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: publicUserSelect,
    });
  },

  async update(username: string, data: Prisma.UserUpdateInput) {
    return db.user.update({
      where: { username },
      data,
      select: publicUserSelect,
    });
  },

  async toggleFollow(followerUsername: string, followedUsername: string) {
    const existing = await db.follow.findUnique({
      where: { followerUsername_followedUsername: { followerUsername, followedUsername } },
    });
    if (existing) {
      await db.follow.delete({
        where: {
          followerUsername_followedUsername: {
            followerUsername: existing.followerUsername,
            followedUsername: existing.followedUsername,
          },
        },
      });
      return false;
    }
    await db.follow.create({ data: { followerUsername, followedUsername } });
    return true;
  },

  async listFollowers(
    username: string,
    limit = 20,
    cursor?: { followerUsername: string; createdAt: Date },
  ) {
    return db.follow.findMany({
      where: { followedUsername: username },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor
        ? {
            skip: 1,
            cursor: {
              followerUsername_followedUsername: {
                followerUsername: cursor.followerUsername,
                followedUsername: username,
              },
            },
          }
        : {}),
      include: { follower: { select: publicUserSelect } },
    });
  },

  async listFollowing(
    username: string,
    limit = 20,
    cursor?: { followedUsername: string; createdAt: Date },
  ) {
    return db.follow.findMany({
      where: { followerUsername: username },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor
        ? {
            skip: 1,
            cursor: {
              followerUsername_followedUsername: {
                followerUsername: username,
                followedUsername: cursor.followedUsername,
              },
            },
          }
        : {}),
      include: { followed: { select: publicUserSelect } },
    });
  },
};
