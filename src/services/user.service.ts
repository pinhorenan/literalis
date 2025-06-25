// src/services/user.service.ts
import { UserUpdateDTO } from '@models/user.model';
import { User } from '@prisma/client';
import { userRepository } from '@repositories/user.repository';

export class UserService {
  /**
   * GET /api/users/:username
   * Path: username
   */
  async getByUsername(username: string): Promise<User | null> {
    return userRepository.findByUsername(username);
  }

  /**
   * PATCH /api/users/:username
   * Auth required (only self)
   * Body: UserUpdateDTO
   */
  async update(username: string, data: UserUpdateDTO): Promise<User> {
    return userRepository.update(username, data);
  }
}
