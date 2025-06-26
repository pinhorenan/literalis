// tests/services/user.service.test.ts
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { userRepository } from '@repositories/user.repository';
import { UserService } from '@services/user.service';

vi.mock('@repositories/user.repository', () => ({
  userRepository: {
    findByUsername: vi.fn(),
    update: vi.fn(),
  },
}));

describe('UserService', () => {
  let svc: UserService;
  const mockUser = {
    username: 'alice',
    name: 'Alice',
    email: 'alice@example.com',
    bio: 'Bio de Alice',
    avatar: null,
  } as any;

  beforeEach(() => {
    svc = new UserService();
    vi.clearAllMocks();
  });

  describe('getByUsername', () => {
    it('retorna usuário existente', async () => {
      (userRepository.findByUsername as Mock).mockResolvedValueOnce(mockUser);

      await expect(svc.getByUsername('alice')).resolves.toBe(mockUser);
      expect(userRepository.findByUsername).toHaveBeenCalledWith('alice');
    });

    it('retorna null quando não encontra', async () => {
      (userRepository.findByUsername as Mock).mockResolvedValueOnce(null);

      await expect(svc.getByUsername('bob')).resolves.toBeNull();
      expect(userRepository.findByUsername).toHaveBeenCalledWith('bob');
    });
  });

  describe('update', () => {
    it('atualiza e retorna usuário', async () => {
      const dto = { name: 'Novo Nome', bio: 'Nova bio' } as any;
      (userRepository.update as Mock).mockResolvedValueOnce({ ...mockUser, ...dto });

      await expect(svc.update('alice', dto)).resolves.toMatchObject(dto);
      expect(userRepository.update).toHaveBeenCalledWith('alice', dto);
    });
  });
});
