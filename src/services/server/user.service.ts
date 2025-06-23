// src/services/server/user.service.ts
import { UserRepository } from '@repositories/user.repository';
import type {
    CreateUserDTO,
    UpdateUserDTO,
    UserDTO,
    PublicUserDTO,
} from '@models/user.dto';

export const UserService = {
    /** Retorna perfil público simples (sem viewer) */
    async getPublicByUsername(username: string): Promise<PublicUserDTO | null> {
        return await UserRepository.findPublicByUsername(username);
    },

    /** Retorna perfil completo como UserDTO com base no viewer */
    async getByUsername(viewerUsername: string | null, targetUsername: string): Promise<UserDTO | null> {
        const user = await UserRepository.findByUsername(targetUsername);
        if (!user) return null;

        const isMe = viewerUsername === targetUsername;

        let isFollowing = false;
        let isFollower = false;

        if (viewerUsername && !isMe) {
            const follow = await UserRepository.isFollowedBy(targetUsername, viewerUsername);
            const followedBy = await UserRepository.isFollowedBy(viewerUsername, targetUsername);

            isFollowing = !!follow;
            isFollower = !!followedBy;
        }
        
        const dto: UserDTO = {
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),

            postCount: user._count.posts,
            bookCount: user._count.bookshelf,
            followerCount: user._count.followers,
            followingCount: user._count.following,

            followerUsernames: user.followers.map(f => f.followerUsername),
            followingUsernames: user.following.map(f => f.followedUsername),

            isMe,
            isFollowing,
            isFollower,
        };

        return dto;
    },

    /** Busca usuários públicos por nome ou username */
    async search(query: string, limit = 10): Promise<PublicUserDTO[]> {
        return await UserRepository.search(query, limit);
    },

    /** Lista todos os usuários públicos (admin/sugestão) */
    async listAll(): Promise<PublicUserDTO[]> {
        return await UserRepository.listAllPublic();
    },

    /** Cria um novo usuário */
    async create(data: CreateUserDTO) {
        return await UserRepository.create(data);
    },

    /** Atualiza perfil do próprio usuário */
    async update(username: string, data: UpdateUserDTO) {
        return await UserRepository.update(username, data);
    },

    /** Exclui o próprio usuário */
    async delete(username: string) {
        return await UserRepository.delete(username);
    },
};