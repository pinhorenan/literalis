// src/repositories/follow.repository.ts
import { db } from '@libs/db';
import { Follow, Prisma } from '@prisma/client';

export const followRepository = {
  async create(data: Prisma.FollowCreateInput): Promise<Follow> {
    return db.follow.create({ data });
  },

  async delete(followerUsername: string, followedUsername: string): Promise<Follow> {
    return db.follow.delete({
      where: {
        followerUsername_followedUsername: {
          followerUsername,
          followedUsername,
        },
      },
    });
  },

  async exists(followerUsername: string, followedUsername: string): Promise<boolean> {
    const count = await db.follow.count({
      where: { followerUsername, followedUsername },
    });
    return count > 0;
  },

  async findFollowers(username: string): Promise<Follow[]> {
    return db.follow.findMany({
      where: { followedUsername: username },
      include: { follower: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findFollowing(username: string): Promise<Follow[]> {
    return db.follow.findMany({
      where: { followerUsername: username },
      include: { followed: true },
      orderBy: { createdAt: 'desc' },
    });
  },
};
