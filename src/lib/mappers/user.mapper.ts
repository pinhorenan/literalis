import type { User } from '@prisma/client';
import { MinimalUserDTO, UserDTO, UserProfileDTO, UserPrivateDTO } from '@models/user.dto';
import type { PostDTO } from '@models/post.dto';
import type { BookshelfEntryDTO } from '@/src/models/bookshelf-entry.dto';

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
