// src/services/like/__tests__/like.service.test.ts
import { mapUserToMinimalDTO } from '@models/user.model';
import { commentLikeRepository } from '@repositories/commentLike.repository';
import { postLikeRepository } from '@repositories/postLike.repository';
import { userRepository } from '@repositories/user.repository';
import { LikeService } from '@services/like.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@repositories/postLike.repository', () => ({
  postLikeRepository: { exists: vi.fn(), create: vi.fn(), delete: vi.fn(), findByPost: vi.fn() },
}));
vi.mock('@repositories/commentLike.repository', () => ({
  commentLikeRepository: {
    exists: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    findByComment: vi.fn(),
  },
}));
vi.mock('@repositories/user.repository', () => ({
  userRepository: { findByUsername: vi.fn() },
}));

describe('LikeService', () => {
  let service: LikeService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new LikeService();
  });

  describe('likePost', () => {
    it('should create like if not exists', async () => {
      (postLikeRepository.exists as vi.Mock).mockResolvedValue(false);
      await service.likePost('alice', 'post1');
      expect(postLikeRepository.create).toHaveBeenCalledWith({
        user: { connect: { username: 'alice' } },
        post: { connect: { id: 'post1' } },
      });
    });

    it('should not create like if already exists', async () => {
      (postLikeRepository.exists as vi.Mock).mockResolvedValue(true);
      await service.likePost('alice', 'post1');
      expect(postLikeRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('unlikePost', () => {
    it('should delete like if exists', async () => {
      (postLikeRepository.exists as vi.Mock).mockResolvedValue(true);
      await service.unlikePost('alice', 'post1');
      expect(postLikeRepository.delete).toHaveBeenCalledWith('alice', 'post1');
    });

    it('should not delete if not exists', async () => {
      (postLikeRepository.exists as vi.Mock).mockResolvedValue(false);
      await service.unlikePost('alice', 'post1');
      expect(postLikeRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('listPostLikes', () => {
    it('should return empty array when no likes', async () => {
      (postLikeRepository.findByPost as vi.Mock).mockResolvedValue([]);
      const result = await service.listPostLikes('post1');
      expect(result).toEqual([]);
    });

    it('should map and return users', async () => {
      const likes = [{ userUsername: 'bob' }];
      (postLikeRepository.findByPost as vi.Mock).mockResolvedValue(likes as any);
      (userRepository.findByUsername as vi.Mock).mockResolvedValue({
        username: 'bob',
        name: 'Bob',
        avatarUrl: '/bob.jpg',
      });
      const result = await service.listPostLikes('post1');
      expect(result).toEqual([
        mapUserToMinimalDTO({ username: 'bob', name: 'Bob', avatarUrl: '/bob.jpg' } as any),
      ]);
    });

    it('should throw if user not found', async () => {
      (postLikeRepository.findByPost as vi.Mock).mockResolvedValue([
        { userUsername: 'bob' },
      ] as any);
      (userRepository.findByUsername as vi.Mock).mockResolvedValue(null);
      await expect(service.listPostLikes('post1')).rejects.toThrow('Usuário bob não encontrado');
    });
  });

  describe('isPostLikedByUser', () => {
    it('should return true/false based on exists', async () => {
      (postLikeRepository.exists as vi.Mock).mockResolvedValue(true);
      expect(await service.isPostLikedByUser('alice', 'post1')).toBe(true);
      (postLikeRepository.exists as vi.Mock).mockResolvedValue(false);
      expect(await service.isPostLikedByUser('alice', 'post1')).toBe(false);
    });
  });

  describe('comment likes', () => {
    describe('likeComment', () => {
      it('should create like if not exists', async () => {
        (commentLikeRepository.exists as vi.Mock).mockResolvedValue(false);
        await service.likeComment('alice', 'comment1');
        expect(commentLikeRepository.create).toHaveBeenCalledWith({
          user: { connect: { username: 'alice' } },
          comment: { connect: { id: 'comment1' } },
        });
      });

      it('should not create if exists', async () => {
        (commentLikeRepository.exists as vi.Mock).mockResolvedValue(true);
        await service.likeComment('alice', 'comment1');
        expect(commentLikeRepository.create).not.toHaveBeenCalled();
      });
    });

    describe('unlikeComment', () => {
      it('should delete like if exists', async () => {
        (commentLikeRepository.exists as vi.Mock).mockResolvedValue(true);
        await service.unlikeComment('alice', 'comment1');
        expect(commentLikeRepository.delete).toHaveBeenCalledWith('alice', 'comment1');
      });

      it('should not delete if not exists', async () => {
        (commentLikeRepository.exists as vi.Mock).mockResolvedValue(false);
        await service.unlikeComment('alice', 'comment1');
        expect(commentLikeRepository.delete).not.toHaveBeenCalled();
      });
    });

    describe('listCommentLikes', () => {
      it('should return empty array when no likes', async () => {
        (commentLikeRepository.findByComment as vi.Mock).mockResolvedValue([]);
        const result = await service.listCommentLikes('comment1');
        expect(result).toEqual([]);
      });

      it('should map and return users', async () => {
        (commentLikeRepository.findByComment as vi.Mock).mockResolvedValue([
          { userUsername: 'bob' },
        ] as any);
        (userRepository.findByUsername as vi.Mock).mockResolvedValue({
          username: 'bob',
          name: 'Bob',
          avatarUrl: '/bob.jpg',
        });
        const result = await service.listCommentLikes('comment1');
        expect(result).toEqual([
          mapUserToMinimalDTO({ username: 'bob', name: 'Bob', avatarUrl: '/bob.jpg' } as any),
        ]);
      });

      it('should throw if user not found', async () => {
        (commentLikeRepository.findByComment as vi.Mock).mockResolvedValue([
          { userUsername: 'bob' },
        ] as any);
        (userRepository.findByUsername as vi.Mock).mockResolvedValue(null);
        await expect(service.listCommentLikes('comment1')).rejects.toThrow(
          'Usuário bob não encontrado',
        );
      });
    });

    describe('isCommentLikedByUser', () => {
      it('should return true/false based on exists', async () => {
        (commentLikeRepository.exists as vi.Mock).mockResolvedValue(true);
        expect(await service.isCommentLikedByUser('alice', 'comment1')).toBe(true);
        (commentLikeRepository.exists as vi.Mock).mockResolvedValue(false);
        expect(await service.isCommentLikedByUser('alice', 'comment1')).toBe(false);
      });
    });
  });
});
