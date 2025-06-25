// src/services/follow/__tests__/follow.service.test.ts
import { mapUserToMinimalDTO } from '@models/user.model';
import { followRepository } from '@repositories/follow.repository';
import { userRepository } from '@repositories/user.repository';
import { FollowService } from '@services/follow.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@repositories/follow.repository', () => ({
  followRepository: {
    exists: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    findFollowers: vi.fn(),
    findFollowing: vi.fn(),
  },
}));
vi.mock('@repositories/user.repository', () => ({
  userRepository: {
    findByUsername: vi.fn(),
  },
}));

describe('FollowService', () => {
  let service: FollowService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new FollowService();
  });

  describe('toggleFollow', () => {
    it('should follow when not following', async () => {
      (followRepository.exists as vi.Mock).mockResolvedValue(false);
      const result = await service.toggleFollow('alice', 'bob');
      expect(followRepository.create).toHaveBeenCalledWith({
        follower: { connect: { username: 'alice' } },
        followed: { connect: { username: 'bob' } },
      });
      expect(result).toEqual({ following: true });
    });

    it('should unfollow when already following', async () => {
      (followRepository.exists as vi.Mock).mockResolvedValue(true);
      const result = await service.toggleFollow('alice', 'bob');
      expect(followRepository.delete).toHaveBeenCalledWith('alice', 'bob');
      expect(result).toEqual({ following: false });
    });
  });

  describe('listFollowers', () => {
    it('should return empty array when no followers', async () => {
      (followRepository.findFollowers as vi.Mock).mockResolvedValue([]);
      const result = await service.listFollowers('alice');
      expect(result).toEqual([]);
    });

    it('should return followers when they exist', async () => {
      const follows = [{ followerUsername: 'bob' }];
      (followRepository.findFollowers as vi.Mock).mockResolvedValue(follows as any);
      (userRepository.findByUsername as vi.Mock).mockResolvedValue({
        username: 'bob',
        name: 'Bob',
        avatarUrl: '/bob.jpg',
      });
      const result = await service.listFollowers('alice');
      expect(result).toEqual([
        mapUserToMinimalDTO({ username: 'bob', name: 'Bob', avatarUrl: '/bob.jpg' } as any),
      ]);
    });

    it('should throw if a follower user is not found', async () => {
      (followRepository.findFollowers as vi.Mock).mockResolvedValue([
        { followerUsername: 'bob' },
      ] as any);
      (userRepository.findByUsername as vi.Mock).mockResolvedValue(null);
      await expect(service.listFollowers('alice')).rejects.toThrow('Seguidor bob não encontrado');
    });
  });

  describe('listFollowing', () => {
    it('should return empty array when not following anyone', async () => {
      (followRepository.findFollowing as vi.Mock).mockResolvedValue([]);
      const result = await service.listFollowing('alice');
      expect(result).toEqual([]);
    });

    it('should return following when they exist', async () => {
      const follows = [{ followedUsername: 'charlie' }];
      (followRepository.findFollowing as vi.Mock).mockResolvedValue(follows as any);
      (userRepository.findByUsername as vi.Mock).mockResolvedValue({
        username: 'charlie',
        name: 'Charlie',
        avatarUrl: '/charlie.jpg',
      });
      const result = await service.listFollowing('alice');
      expect(result).toEqual([
        mapUserToMinimalDTO({
          username: 'charlie',
          name: 'Charlie',
          avatarUrl: '/charlie.jpg',
        } as any),
      ]);
    });

    it('should throw if a following user is not found', async () => {
      (followRepository.findFollowing as vi.Mock).mockResolvedValue([
        { followedUsername: 'charlie' },
      ] as any);
      (userRepository.findByUsername as vi.Mock).mockResolvedValue(null);
      await expect(service.listFollowing('alice')).rejects.toThrow(
        'Seguindo charlie não encontrado',
      );
    });
  });
});
