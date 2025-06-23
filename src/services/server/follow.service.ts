// src/services/server/follow.service.ts
import { FollowRepository } from '@repositories/follow.repository';
import type { FollowDTO } from '@models/follow.dto';

export const FollowService = {
  /** Segue um usuário. Retorna `true` se passou a seguir, `false` se deixou de seguir. */
  async toggle(followerUsername: string, followedUsername: string): Promise<{ followed: boolean }> {
    if (followerUsername === followedUsername) {
      throw new Error('Operação inválida');
    }

    const existing = await FollowRepository.isFollowing(
      followerUsername,
      followedUsername
    );

    if (existing) {
      await FollowRepository.unfollow(followerUsername, followedUsername);
      return { followed: false };
    } else {
      await FollowRepository.follow(followerUsername, followedUsername);
      return { followed: true };
    }
  },

  /** Lista seguidores de um usuário (DTO enxuto) */
  async getFollowers(username: string): Promise<FollowDTO[]> {
    return FollowRepository.getFollowers(username);
  },

  /** Lista quem o usuário está seguindo */
  async getFollowing(username: string): Promise<FollowDTO[]> {
    return FollowRepository.getFollowing(username);
  },

  // Verifica se o usuário está seguindo outro
  async isFollowing(followerUsername: string | null, followedUsername: string): Promise<boolean> {
    if (!followerUsername) return false;
    const follow = await FollowRepository.isFollowing(followerUsername, followedUsername);
    return !!follow; // Retorna se o usuário está seguindo ou não
  },
};
