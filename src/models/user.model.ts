import { User } from '@prisma/client';
import { PostDTO } from './post.model';
import { BookshelfEntryDTO } from './bookshelf-entry.model';
import { z } from 'zod';

export interface MinimalUserDTO {
    username: string;
    name: string;
    avatarUrl: string;
};

export interface UserDTO extends MinimalUserDTO {
    bio: string;
    createdAt: Date;
    updatedAt: Date;
};

export interface UserProfileDTO extends UserDTO {
    posts: PostDTO[];
    followers: MinimalUserDTO[];
    following: MinimalUserDTO[];
    bookshelfEntries: BookshelfEntryDTO[];
};

export interface UserPrivateDTO extends UserProfileDTO {
    email: string;
};

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

/**
 * Map a Prisma User to MinimalUserDTO
 */
export function mapUserToMinimalDTO(user: User): MinimalUserDTO {
    return {
        username: user.username,
        name: user.name,
        avatarUrl: user.avatarUrl,
    };
}

/**
 * Map a Prisma User to UserDTO (public view)
 */
export function mapUserToDTO(user: User): UserDTO {
    return {
        ...mapUserToMinimalDTO(user),
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

/**
 * Map Prisma User and related data to UserProfileDTO
 * @param user       - Prisma User record
 * @param posts      - Array of PostDTO (nested posts)
 * @param followers  - Array of MinimalUserDTO
 * @param following  - Array of MinimalUserDTO
 * @param entries    - Array of BookshelfEntryDTO
 */
export function mapUserToProfileDTO(
    user: User,
    posts: PostDTO[],
    followers: MinimalUserDTO[],
    following: MinimalUserDTO[],
    entries: BookshelfEntryDTO[]
): UserProfileDTO {
    return {
        ...mapUserToDTO(user),
        posts,
        followers,
        following,
        bookshelfEntries: entries,
    };
}

/**
 * Map to UserPrivateDTO by extending profile
 */
export function mapUserToPrivateDTO(
    profile: UserProfileDTO,
    email: string
): UserPrivateDTO {
    return {
        ...profile,
        email,
    };
}
