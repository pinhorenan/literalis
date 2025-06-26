// 💡 mocks precisam vir ANTES dos imports que usam o módulo
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';

vi.mock('@repositories/follow.repository', () => ({
  followRepository: {
    exists: vi.fn(),
    delete: vi.fn(),
    create: vi.fn(),
    findFollowers: vi.fn(),
    findFollowing: vi.fn(),
  },
}));
vi.mock('@repositories/user.repository', () => ({
  userRepository: { findByUsername: vi.fn() },
}));

import { FollowService } from '@services/follow.service';
import { followRepository } from '@repositories/follow.repository';
import { userRepository } from '@repositories/user.repository';

describe('FollowService', () => {
  let svc: FollowService;
  const me = 'alice';
  const you = 'bob';

  beforeEach(() => {
    svc = new FollowService();
    vi.clearAllMocks();
  });

  describe('toggleFollow', () => {
    it('desfaz follow existente', async () => {
      (followRepository.exists as Mock).mockResolvedValueOnce(true);
      (followRepository.delete as Mock).mockResolvedValueOnce(undefined);

      await expect(svc.toggleFollow(me, you)).resolves.toEqual({ following: false });
      expect(followRepository.exists).toHaveBeenCalledWith(me, you);
      expect(followRepository.delete).toHaveBeenCalledWith(me, you);
    });

    it('cria follow quando não existe', async () => {
      (followRepository.exists as Mock).mockResolvedValueOnce(false);
      (followRepository.create as Mock).mockResolvedValueOnce(undefined);

      await expect(svc.toggleFollow(me, you)).resolves.toEqual({ following: true });
      expect(followRepository.create).toHaveBeenCalledWith({
        follower: { connect: { username: me } },
        followed: { connect: { username: you } },
      });
    });
  });

  describe('listFollowers', () => {
    it('mapeia e retorna lista', async () => {
      (followRepository.findFollowers as Mock).mockResolvedValueOnce([{ followerUsername: 'x' }]);
      (userRepository.findByUsername as Mock).mockResolvedValueOnce({
        username: 'x',
        name: 'X',
        avatarUrl: 'u',
      });

      const out = await svc.listFollowers(you);
      expect(out).toEqual([{ username: 'x', name: 'X', avatarUrl: 'u' }]);
    });

    it('erro se follower não existir', async () => {
      (followRepository.findFollowers as Mock).mockResolvedValueOnce([{ followerUsername: 'x' }]);
      (userRepository.findByUsername as Mock).mockResolvedValueOnce(null);

      await expect(svc.listFollowers(you)).rejects.toThrow('Seguidor x não encontrado');
    });
  });

  describe('listFollowing', () => {
    it('mapeia e retorna lista', async () => {
      (followRepository.findFollowing as Mock).mockResolvedValueOnce([{ followedUsername: 'y' }]);
      (userRepository.findByUsername as Mock).mockResolvedValueOnce({
        username: 'y',
        name: 'Y',
        avatarUrl: 'v',
      });

      const out = await svc.listFollowing(me);
      expect(out).toEqual([{ username: 'y', name: 'Y', avatarUrl: 'v' }]);
    });

    it('erro se following não existir', async () => {
      (followRepository.findFollowing as Mock).mockResolvedValueOnce([{ followedUsername: 'z' }]);
      (userRepository.findByUsername as Mock).mockResolvedValueOnce(null);

      await expect(svc.listFollowing(me)).rejects.toThrow('Seguindo z não encontrado');
    });
  });
});
