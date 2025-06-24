import { BookshelfEntryDTO } from '@models/bookshelf-entry.model';
import { PostDTO } from '@models/post.model';
import { User } from '@prisma/client';
import { z } from 'zod';

/** DTOs públicos */
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
export interface UserProfileDTO extends UserDTO {
  posts: PostDTO[];
  followers: MinimalUserDTO[];
  following: MinimalUserDTO[];
  bookshelfEntries: BookshelfEntryDTO[];
}
export interface UserPrivateDTO extends UserProfileDTO {
  email: string;
}

/** Schemas de validação */
export const userCreateSchema = z.object({
  username: z.string().min(3),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(160).optional(),
});
export type UserCreateDTO = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(160).optional(),
});
export type UserUpdateDTO = z.infer<typeof userUpdateSchema>;

/** Campos públicos usados nos mapeamentos */
type PublicUserFields = Pick<
  User,
  'username' | 'name' | 'avatarUrl' | 'bio' | 'createdAt' | 'updatedAt'
>;

/** Mappers */
export function mapUserToMinimalDTO(user: PublicUserFields): MinimalUserDTO {
  return {
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };
}

export function mapUserToDTO(user: PublicUserFields): UserDTO {
  return {
    ...mapUserToMinimalDTO(user),
    bio: user.bio,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function mapUserToProfileDTO(
  user: PublicUserFields,
  posts: PostDTO[],
  followers: MinimalUserDTO[],
  following: MinimalUserDTO[],
  entries: BookshelfEntryDTO[],
): UserProfileDTO {
  return {
    ...mapUserToDTO(user),
    posts,
    followers,
    following,
    bookshelfEntries: entries,
  };
}

export function mapUserToPrivateDTO(profile: UserProfileDTO, email: string): UserPrivateDTO {
  return {
    ...profile,
    email,
  };
}
