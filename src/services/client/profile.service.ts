// src/services/client/profile.service.ts
import type { PostDTO } from '@models/post.dto';
import type { UserDTO, PublicUserDTO,UpdateUserDTO } from '@models/user.dto';

export async function getUserProfileRequest(username: string): Promise<PublicUserDTO| null> {
    const res = await fetch(`/api/users/${username}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Erro ao buscar perfil.');
    return res.json();
}

export async function getUserPostsRequest(username: string): Promise<PostDTO[]> {
    const res = await fetch(`/api/users/${username}/posts`);
    if (!res.ok) throw new Error('Erro ao buscar posts do usuário.');
    return res.json();
}

export async function updateProfileRequest(username: string, data: UpdateUserDTO): Promise<UserDTO> {
    const res = await fetch(`/api/users/${username}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao atualizar perfil.');
    }

    return res.json();
}

export const ProfileService =  {
    getUserProfileRequest,
    getUserPostsRequest,
    updateProfileRequest,
}