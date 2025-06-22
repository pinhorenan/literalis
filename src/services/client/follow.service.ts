// rc/services/client/follow.service.ts

export async function getFollowStatus(username: string): Promise<{ isFollowing: boolean; followerCount: number; followingCount: number }> {
    const res = await fetch(`/api/users/${username}/follow/status`);
    
    if (!res.ok) {
        throw new Error('Erro ao verificar status de follow.');
    }
    
    return res.json();
}

export async function followRequest(username: string): Promise<void> {
    const res = await fetch(`/api/users/${username}/follow`, { method: 'PUT' });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao seguir usuário.');
    }
}

export async function unfollowRequest(username: string): Promise<void> {
    const res = await fetch(`/api/users/${username}/follow`, { method: 'DELETE' });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao deixar de seguir usuário.');
    }
}

export async function toggleFollowRequest(username: string): Promise<{ followed: boolean }> {
    const res = await fetch(`/api/users/${username}/follow`, { method: 'PATCH'});
    
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao seguir usuário.');
    }

    return res.json();
}

export const FollowService = {
    getFollowStatus,
    followRequest,
    unfollowRequest,
    toggleFollowRequest,
};