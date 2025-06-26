import { vi, describe, it, expect, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

vi.mock('@repositories/user.repository', () => ({
  userRepository: {
    findByUsername: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));
vi.mock('bcryptjs', () => {
  const hash = vi.fn();
  const compare = vi.fn();
  return {
    default: { hash, compare },
    hash,
    compare,
  };
});

import { AuthService } from '@services/auth.service';
import { userRepository } from '@repositories/user.repository';

describe('AuthService', () => {
  let service: AuthService;
  const mockUser = {
    username: 'alice',
    passwordHash: 'hashed',
    name: 'Alice',
    avatarUrl: '',
    bio: '',
    email: 'a@a.com',
  } as any;

  const uRepo = vi.mocked(userRepository, true);

  beforeEach(() => {
    service = new AuthService();
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('deve hashear a senha e criar usuário', async () => {
      (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValueOnce('hpass');
      uRepo.create.mockResolvedValueOnce(mockUser);

      const dto = await service.register({
        username: 'alice',
        password: 'pass',
        name: 'Alice',
        email: 'a@a.com',
        avatarUrl: '/uploads/avatars/default.jpg',
        bio: 'test bio',
      });

      expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
      expect(uRepo.create).toHaveBeenCalledWith({
        username: 'alice',
        passwordHash: 'hpass',
        name: 'Alice',
        email: 'a@a.com',
        avatarUrl: '/uploads/avatars/default.jpg',
        bio: 'test bio',
      });
      expect(dto).toMatchObject({ username: 'alice', name: 'Alice' });
    });

    it('deve propagar erro se bcrypt.hash falhar', async () => {
      (bcrypt.hash as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('hash-fail'));

      await expect(
        service.register({
          username: 'u',
          password: 'p',
          name: 'N',
          email: 'n@n.com',
          avatarUrl: '/uploads/avatars/default.jpg',
          bio: 'test bio',
        }),
      ).rejects.toThrow('hash-fail');

      expect(uRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('validateCredentials', () => {
    it('deve retornar usuário se credenciais válidas', async () => {
      uRepo.findByUsername.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);

      const out = await service.validateCredentials('alice', 'pass');
      expect(out).toBe(mockUser);
    });

    it('deve retornar null se usuário não existir', async () => {
      uRepo.findByUsername.mockResolvedValueOnce(null);
      const out = await service.validateCredentials('bob', 'pass');
      expect(out).toBeNull();
    });

    it('deve retornar null se senha inválida', async () => {
      uRepo.findByUsername.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValueOnce(false);
      const out = await service.validateCredentials('alice', 'wrong');
      expect(out).toBeNull();
    });
  });

  describe('changePassword', () => {
    it('deve atualizar senha se atual correta', async () => {
      uRepo.findByUsername.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValueOnce(true);
      (bcrypt.hash as ReturnType<typeof vi.fn>).mockResolvedValueOnce('newhash');
      uRepo.update.mockResolvedValueOnce({ ...mockUser, passwordHash: 'newhash' });

      await expect(service.changePassword('alice', 'old', 'new')).resolves.not.toThrow();

      expect(bcrypt.compare).toHaveBeenCalledWith('old', mockUser.passwordHash);
      expect(uRepo.update).toHaveBeenCalledWith('alice', { passwordHash: 'newhash' });
    });

    it('deve lançar erro se usuário não encontrado', async () => {
      uRepo.findByUsername.mockResolvedValueOnce(null);
      await expect(service.changePassword('bob', 'old', 'new')).rejects.toThrow(
        'Usuário não encontrado',
      );
    });

    it('deve lançar erro se senha atual incorreta', async () => {
      uRepo.findByUsername.mockResolvedValueOnce(mockUser);
      (bcrypt.compare as ReturnType<typeof vi.fn>).mockResolvedValueOnce(false);
      await expect(service.changePassword('alice', 'wrong', 'new')).rejects.toThrow(
        'Senha atual incorreta',
      );
    });
  });
});
