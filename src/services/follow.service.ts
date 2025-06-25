// src/services/follow.service.ts
import { MinimalUserDTO, mapUserToMinimalDTO } from '@models/user.model';
import { Prisma } from '@prisma/client';
import { followRepository } from '@repositories/follow.repository';
import { userRepository } from '@repositories/user.repository';

export class FollowService {
  /**
   * POST /api/follow/:targetUsername
   * Auth required
   */
  async toggleFollow(
    followerUsername: string,
    targetUsername: string,
  ): Promise<{ following: boolean }> {
    const exists = await followRepository.exists(followerUsername, targetUsername);
    if (exists) {
      await followRepository.delete(followerUsername, targetUsername);
      return { following: false };
    } else {
      const data: Prisma.FollowCreateInput = {
        follower: { connect: { username: followerUsername } },
        followed: { connect: { username: targetUsername } },
      };
      await followRepository.create(data);
      return { following: true };
    }
  }

  /**
   * GET /api/follow/:username/followers
   * Retorna lista de quem segue o usuário
   */
  async listFollowers(username: string): Promise<MinimalUserDTO[]> {
    const follows = await followRepository.findFollowers(username);
    const followers = await Promise.all(
      follows.map(async (f) => {
        const user = await userRepository.findByUsername(f.followerUsername);
        if (!user) throw new Error(`Seguidor ${f.followerUsername} não encontrado`);
        return mapUserToMinimalDTO(user);
      }),
    );
    return followers;
  }

  /**
   * GET /api/follow/:username/following
   * Retorna lista de quem o usuário segue
   */
  async listFollowing(username: string): Promise<MinimalUserDTO[]> {
    const follows = await followRepository.findFollowing(username);
    const following = await Promise.all(
      follows.map(async (f) => {
        const user = await userRepository.findByUsername(f.followedUsername);
        if (!user) throw new Error(`Seguindo ${f.followedUsername} não encontrado`);
        return mapUserToMinimalDTO(user);
      }),
    );
    return following;
  }
}
