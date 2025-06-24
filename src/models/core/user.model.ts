import { User } from '@prisma/client';
import { z } from 'zod';

export const userCreateSchema = z.object({
  username: z.string().min(3).max(30),
  name: z.string().min(3).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  avatarUrl: z.string().url().default('/uploads/avatars/default-avatar.jpg'),
  bio: z.string().max(360).default('Este usuário ainda não escreveu uma biografia.'),
});
export type UserCreateDTO = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(360).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});
export type UserUpdateDTO = z.infer<typeof userUpdateSchema>;

export interface MinimalUserDTO {
  username: string;
  name: string;
  avatarUrl: string;
}

export interface UserDTO extends MinimalUserDTO {
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

export function mapUserToMinimalDTO(user: User): MinimalUserDTO {
  return {
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };
}

export function mapUserToDTO(user: User): UserDTO {
  return {
    ...mapUserToMinimalDTO(user),
    bio: user.bio,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
