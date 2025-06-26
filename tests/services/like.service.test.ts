import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';

vi.mock('@repositories/postLike.repository', () => ({
  postLikeRepository: {
    exists: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    findByPost: vi.fn(),
  },
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

import { LikeService } from '@services/like.service';
import { postLikeRepository } from '@repositories/postLike.repository';
import { commentLikeRepository } from '@repositories/commentLike.repository';
import { userRepository } from '@repositories/user.repository';

describe('LikeService', () => {
  let svc: LikeService;
  const user = 'alice';
  const postId = 'p1';
  const commentId = 'c1';
  const fakeUser = { username: 'x', name: 'X', avatarUrl: '' } as any;

  beforeEach(() => {
    svc = new LikeService();
    vi.clearAllMocks();
  });

  // -- POST likes -------------------------------------------------
  describe('likePost / unlikePost', () => {
    it('should create a post like when none exists', async () => {
      (postLikeRepository.exists as Mock).mockResolvedValueOnce(false);

      await svc.likePost(user, postId);
      expect(postLikeRepository.create).toHaveBeenCalledWith({
        user: { connect: { username: user } },
        post: { connect: { id: postId } },
      });
    });

    it('should do nothing if post already liked', async () => {
      (postLikeRepository.exists as Mock).mockResolvedValueOnce(true);

      await svc.likePost(user, postId);
      expect(postLikeRepository.create).not.toHaveBeenCalled();
    });

    it('should remove a like if exists', async () => {
      (postLikeRepository.exists as Mock).mockResolvedValueOnce(true);

      await svc.unlikePost(user, postId);
      expect(postLikeRepository.delete).toHaveBeenCalledWith(user, postId);
    });

    it('should do nothing if not liked', async () => {
      (postLikeRepository.exists as Mock).mockResolvedValueOnce(false);

      await svc.unlikePost(user, postId);
      expect(postLikeRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('listPostLikes & isPostLikedByUser', () => {
    it('lists users who liked post', async () => {
      (postLikeRepository.findByPost as Mock).mockResolvedValueOnce([{ userUsername: 'x' }]);
      (userRepository.findByUsername as Mock).mockResolvedValueOnce(fakeUser);

      const out = await svc.listPostLikes(postId, 5);
      expect(out).toEqual([{ username: 'x', name: 'X', avatarUrl: '' }]);
      expect(postLikeRepository.findByPost).toHaveBeenCalledWith(postId, 5);
    });

    it('throws if a liker user not found', async () => {
      (postLikeRepository.findByPost as Mock).mockResolvedValueOnce([{ userUsername: 'z' }]);
      (userRepository.findByUsername as Mock).mockResolvedValueOnce(null);

      await expect(svc.listPostLikes(postId, 2)).rejects.toThrow('Usuário z não encontrado');
    });

    it('returns whether a post is liked by user', async () => {
      (postLikeRepository.exists as Mock).mockResolvedValueOnce(true);
      await expect(svc.isPostLikedByUser(user, postId)).resolves.toBe(true);

      (postLikeRepository.exists as Mock).mockResolvedValueOnce(false);
      await expect(svc.isPostLikedByUser(user, postId)).resolves.toBe(false);
    });
  });

  // -- COMMENT likes ---------------------------------------------
  describe('comment-like flow', () => {
    it('creates a comment like when none exists', async () => {
      (commentLikeRepository.exists as Mock).mockResolvedValueOnce(false);

      await svc.likeComment(user, commentId);
      expect(commentLikeRepository.create).toHaveBeenCalledWith({
        user: { connect: { username: user } },
        comment: { connect: { id: commentId } },
      });
    });

    it('does nothing if comment already liked', async () => {
      (commentLikeRepository.exists as Mock).mockResolvedValueOnce(true);

      await svc.likeComment(user, commentId);
      expect(commentLikeRepository.create).not.toHaveBeenCalled();
    });

    it('removes a comment like if exists', async () => {
      (commentLikeRepository.exists as Mock).mockResolvedValueOnce(true);

      await svc.unlikeComment(user, commentId);
      expect(commentLikeRepository.delete).toHaveBeenCalledWith(user, commentId);
    });

    it('does nothing if comment not liked', async () => {
      (commentLikeRepository.exists as Mock).mockResolvedValueOnce(false);

      await svc.unlikeComment(user, commentId);
      expect(commentLikeRepository.delete).not.toHaveBeenCalled();
    });

    it('lists users who liked a comment', async () => {
      (commentLikeRepository.findByComment as Mock).mockResolvedValueOnce([{ userUsername: 'x' }]);
      (userRepository.findByUsername as Mock).mockResolvedValueOnce(fakeUser);

      const out = await svc.listCommentLikes(commentId, 3);
      expect(out).toEqual([{ username: 'x', name: 'X', avatarUrl: '' }]);
      expect(commentLikeRepository.findByComment).toHaveBeenCalledWith(commentId, 3);
    });

    it('throws if liker user not found', async () => {
      (commentLikeRepository.findByComment as Mock).mockResolvedValueOnce([{ userUsername: 'y' }]);
      (userRepository.findByUsername as Mock).mockResolvedValueOnce(null);

      await expect(svc.listCommentLikes(commentId, 1)).rejects.toThrow('Usuário y não encontrado');
    });

    it('returns whether a comment is liked by user', async () => {
      (commentLikeRepository.exists as Mock).mockResolvedValueOnce(true);
      await expect(svc.isCommentLikedByUser(user, commentId)).resolves.toBe(true);

      (commentLikeRepository.exists as Mock).mockResolvedValueOnce(false);
      await expect(svc.isCommentLikedByUser(user, commentId)).resolves.toBe(false);
    });
  });
});
