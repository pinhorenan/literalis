// src/services/user/__tests__/user.service.test.ts
import { userRepository } from '@repositories/user.repository';
import { UserService } from '@services/user.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@repositories/user.repository', () => ({
  userRepository: { findByUsername: vi.fn(), update: vi.fn() },
}));

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new UserService();
  });

  describe('getByUsername', () => {
    it('should return user when found', async () => {
      const user = { username: 'alice' };
      (userRepository.findByUsername as vi.Mock).mockResolvedValue(user);
      expect(await service.getByUsername('alice')).toEqual(user);
    });

    it('should return null when not found', async () => {
      (userRepository.findByUsername as vi.Mock).mockResolvedValue(null);
      expect(await service.getByUsername('bob')).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return user', async () => {
      const data = { name: 'New Name' };
      const updated = { username: 'alice', name: 'New Name' };
      (userRepository.update as vi.Mock).mockResolvedValue(updated);
      expect(await service.update('alice', data as any)).toEqual(updated);
    });
  });
});
