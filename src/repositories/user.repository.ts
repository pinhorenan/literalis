// src/repositories/user.repository.ts
import { db } from '@libs/db';
import { Prisma, User } from '@prisma/client';

export const userRepository = {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return db.user.create({ data });
  },

  async findByUsername(username: string): Promise<User | null> {
    return db.user.findUnique({ where: { username } });
  },

  async findByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({ where: { email } });
  },

  async update(username: string, data: Prisma.UserUpdateInput): Promise<User> {
    return db.user.update({
      where: { username },
      data,
    });
  },
};
