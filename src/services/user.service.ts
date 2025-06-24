import bcrypt from 'bcryptjs';

import { db } from '@libs/db';
import { getViewerSession } from '@services/viewer.service';

import { mapEntryToDTO, type BookshelfEntryDTO } from '@models/bookshelf-entry.model';
import {
  mapUserToDTO,
  mapUserToPrivateDTO,
  mapUserToProfileDTO,
  userCreateSchema,
  userUpdateSchema,
  type MinimalUserDTO,
  type UserCreateDTO,
  type UserDTO,
  type UserPrivateDTO,
  type UserProfileDTO,
  type UserUpdateDTO,
} from '@models/user.model';
import { PostRepository } from '@repositories/post.repository';
import { UserRepository } from '@repositories/user.repository';

export class UserService {
  // ─────────────────────────────────────────  CRUD  ──────────────────────────────────────────
  static async create(dto: UserCreateDTO): Promise<UserDTO> {
    const data = userCreateSchema.parse(dto);
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await db.user.create({
      data: {
        username: data.username,
        name: data.name,
        email: data.email,
        passwordHash,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
      },
    });
    return mapUserToDTO(user);
  }

  static async update(dto: UserUpdateDTO): Promise<UserDTO> {
    const viewer = await getViewerSession(true);
    const data = userUpdateSchema.parse(dto);

    await UserRepository.update(viewer!.username, data);

    const full = await db.user.findUniqueOrThrow({
      where: { username: viewer!.username },
      select: {
        username: true,
        name: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return mapUserToDTO(full);
  }

  // ───────────────────────────────────────  PERFIL  ──────────────────────────────────────────
  static async getProfile(
    username: string,
    viewerUsername?: string | null,
  ): Promise<UserProfileDTO | UserPrivateDTO> {
    const isOwner = viewerUsername === username;
    const record = isOwner
      ? await UserRepository.findPrivateProfile(username)
      : await UserRepository.findProfile(username, false);

    if (!record) throw new Error('Usuário não encontrado');

    // ▸ Posts completos (até 3 mais recentes)
    const posts = await PostRepository.listByAuthor(username, viewerUsername ?? null);

    // ▸ Followers & following
    const followers = record.followers.map((f) => f.followerUsername);
    const following = record.following.map((f) => f.followedUsername);

    // ▸ Bookshelf
    const bookshelfEntries: BookshelfEntryDTO[] = record.bookshelf.map((e) =>
      mapEntryToDTO(
        {
          ...e,
          ownerUsername: username,
          bookIsb: e.bookIsbn,
        } as any, // cast – temos todas as props necessárias
        e.book as any,
      ),
    );

    const baseProfile = mapUserToProfileDTO(record, posts, followers, following, bookshelfEntries);

    return isOwner ? mapUserToPrivateDTO(baseProfile, record.email) : baseProfile;
  }

  // ──────────────────────────────────────  FOLLOW  ───────────────────────────────────────────
  static async toggleFollow(targetUsername: string) {
    const viewer = await getViewerSession(true);
    if (viewer!.username === targetUsername) throw new Error('Não é possível seguir a si mesmo');

    const following = await UserRepository.toggleFollow(viewer!.username, targetUsername);
    return { following };
  }

  // ───────────────────────────────────────  SEARCH  ──────────────────────────────────────────
  static async search(term: string): Promise<MinimalUserDTO[]> {
    const q = term.trim();
    if (!q) return [];
    return UserRepository.search(q);
  }
}
