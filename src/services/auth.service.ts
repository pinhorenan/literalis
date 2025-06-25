// src/services/auth.service.ts
import { UserCreateDTO } from '@models/user.model';
import { User } from '@prisma/client';
import { userRepository } from '@repositories/user.repository';
import bcrypt from 'bcryptjs';

export class AuthService {
  /**
   * POST /api/auth/register
   * Body: UserCreateDTO
   */
  async register(data: UserCreateDTO): Promise<User> {
    const hashed = await bcrypt.hash(data.password, 10);
    return userRepository.create({
      username: data.username,
      name: data.name,
      email: data.email,
      passwordHash: hashed,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    });
  }

  /**
   * POST /api/auth/login
   * Body: { username: string, password: string }
   *
   * (Usado pelo NextAuth CredentialsProvider)
   */
  async validateCredentials(username: string, password: string): Promise<User | null> {
    const user = await userRepository.findByUsername(username);
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.passwordHash);
    return isValid ? user : null;
  }

  /**
   * PATCH /api/auth/change-password
   * Auth required
   * Body: { currentPassword: string, newPassword: string }
   */
  async changePassword(
    username: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await userRepository.findByUsername(username);
    if (!user) throw new Error('Usuário não encontrado');
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) throw new Error('Senha atual incorreta');
    const newHash = await bcrypt.hash(newPassword, 10);
    await userRepository.update(username, { passwordHash: newHash });
  }
}
