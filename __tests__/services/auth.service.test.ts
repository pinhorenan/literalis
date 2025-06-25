// src/services/auth/__tests__/auth.service.test.ts
import { userRepository } from '@repositories/user.repository';
import { AuthService } from '@services/auth.service';
import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('bcryptjs', () => ({ hash: vi.fn(), compare: vi.fn() }));
vi.mock('@repositories/user.repository', () => ({
  userRepository: { create: vi.fn(), findByUsername: vi.fn(), update: vi.fn() },
}));

describe('AuthService', () => {
  let service: AuthService;
  const mockUser = {
    username: 'alice',
    passwordHash: 'hashed',
    name: 'Alice',
    email: 'a@a.com',
    bio: '',
    avatarUrl: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuthService();
  });

  describe('register', () => {
    it('should hash password and create user', async () => {
      (bcrypt.hash as vi.Mock).mockResolvedValue('newhash');
      (userRepository.create as vi.Mock).mockResolvedValue(mockUser as any);
      const result = await service.register({
        username: 'alice',
        name: 'Alice',
        email: 'a@a.com',
        password: 'pass',
        bio: '',
        avatarUrl: '',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ passwordHash: 'newhash' }),
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw if hash fails', async () => {
      (bcrypt.hash as vi.Mock).mockRejectedValue(new Error('fail'));
      await expect(
        service.register({
          username: 'alice',
          name: 'Alice',
          email: 'a@a.com',
          password: 'pass',
          bio: '',
          avatarUrl: '',
        }),
      ).rejects.toThrow();
    });
  });

  describe('validateCredentials', () => {
    it('should return user if credentials valid', async () => {
      (userRepository.findByUsername as vi.Mock).mockResolvedValue(mockUser as any);
      (bcrypt.compare as vi.Mock).mockResolvedValue(true);
      await expect(service.validateCredentials('alice', 'pass')).resolves.toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      (userRepository.findByUsername as vi.Mock).mockResolvedValue(null);
      await expect(service.validateCredentials('bob', 'pass')).resolves.toBeNull();
    });

    it('should return null if password invalid', async () => {
      (userRepository.findByUsername as vi.Mock).mockResolvedValue(mockUser as any);
      (bcrypt.compare as vi.Mock).mockResolvedValue(false);
      await expect(service.validateCredentials('alice', 'wrong')).resolves.toBeNull();
    });
  });

  describe('changePassword', () => {
    it('should update password if current matches', async () => {
      (userRepository.findByUsername as vi.Mock).mockResolvedValue(mockUser as any);
      (bcrypt.compare as vi.Mock).mockResolvedValue(true);
      (bcrypt.hash as vi.Mock).mockResolvedValue('newhash');
      await service.changePassword('alice', 'old', 'new');
      expect(bcrypt.hash).toHaveBeenCalledWith('new', 10);
      expect(userRepository.update).toHaveBeenCalledWith('alice', { passwordHash: 'newhash' });
    });

    it('should throw if user not found', async () => {
      (userRepository.findByUsername as vi.Mock).mockResolvedValue(null);
      await expect(service.changePassword('bob', 'old', 'new')).rejects.toThrow(
        'Usuário não encontrado',
      );
    });

    it('should throw if current password invalid', async () => {
      (userRepository.findByUsername as vi.Mock).mockResolvedValue(mockUser as any);
      (bcrypt.compare as vi.Mock).mockResolvedValue(false);
      await expect(service.changePassword('alice', 'wrong', 'new')).rejects.toThrow(
        'Senha atual incorreta',
      );
    });
  });
});
