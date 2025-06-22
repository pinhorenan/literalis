// src/repository/follow.repository.ts
import { db } from '@lib/db';
import { publicUserSelect } from '@includes/user.include';
import type { FollowDTO, FullFollowDTO } from '@models/follow.dto';

export const FollowRepository = {
  /** Cria relação de follow */
  follow: (followerUsername: string, followedUsername: string) => {
    return db.follow.create({
      data: { followerUsername, followedUsername },
    });
  },

  /** Remove relação de follow */
  unfollow: (followerUsername: string, followedUsername: string) => {
    return db.follow.delete({
      where: {
        followerUsername_followedUsername: {
          followerUsername,
          followedUsername,
        },
      },
    });
  },

  /** Verifica se existe relação de follow */
  isFollowing: (followerUsername: string, followedUsername: string) => {
    return db.follow.findUnique({
      where: {
        followerUsername_followedUsername: {
          followerUsername,
          followedUsername,
        },
      },
    });
  },

  /** Lista seguidores de um usuário */
  getFollowers: async (username: string): Promise<FollowDTO[]> => {
    const follows = await db.follow.findMany({
      where: { followedUsername: username },
      orderBy: { createdAt: 'desc' },
      include: {
        follower: { select: publicUserSelect },
      },
    });

    return follows.map(f => ({
      user: f.follower,
      createdAt: f.createdAt.toISOString(),
    }));
  },

  /** Lista quem um usuário está seguindo */
  getFollowing: async (username: string): Promise<FollowDTO[]> => {
    const follows = await db.follow.findMany({
      where: { followerUsername: username },
      orderBy: { createdAt: 'desc' },
      include: {
        followed: { select: publicUserSelect },
      },
    });

    return follows.map(f => ({
      user: f.followed,
      createdAt: f.createdAt.toISOString(),
    }));
  },

  /** Lista seguidores em comum entre dois usuários */
  getMutualFollowers: async (
    userA: string,
    userB: string
  ): Promise<FollowDTO[]> => {
    const mutuals = await db.follow.findMany({
      where: {
        AND: [
          { followedUsername: userA },
          {
            follower: {
              following: {
                some: { followedUsername: userB },
              },
            },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        follower: { select: publicUserSelect },
      },
    });

    return mutuals.map(f => ({
      user: f.follower,
      createdAt: f.createdAt.toISOString(),
    }));
  },

  /** Lista completa com follower e followed (para debug, admin, exportações) */
  getFullFollows: async (): Promise<FullFollowDTO[]> => {
    const data = await db.follow.findMany({
      include: {
        follower: { select: publicUserSelect },
        followed: { select: publicUserSelect },
      },
    });

    return data.map(f => ({
      follower: f.follower,
      followed: f.followed,
      createdAt: f.createdAt.toISOString(),
    }));
  },
};
