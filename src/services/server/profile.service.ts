// src/services/profile.service.ts
import { db } from '@lib/db';
import { getViewerSession } from '@/src/services/viewer.service';
import { feedPostInclude } from '@includes/post.include';
import { mapPostToDTO } from '@lib/mappers/post.mapper';
import type { UserDTO, UpdateUserDTO } from '@models/user.dto';
import type { PostDTO } from '@models/post.dto';

export const ProfileService ={ 
    async getUserProfile(username: string): Promise<UserDTO | null> {
       const session = await getViewerSession();
       const viewerUsername = session?.user?.username;

       const user = await db.user.findUnique({
           where: { username },
           include: {
               _count: {
                   select: {
                       followers: true,
                       following: true,
                       posts: true,
                       bookshelf: true,
                   },
               },
               followers: {
                   select: { followerUsername: true },
               },
               following: {
                   select: { followedUsername: true },
               },
           },
       });

       if (!user) return null;

       return {
           username: user.username,
           name: user.name,
           avatarUrl: user.avatarUrl,
           bio: user.bio ?? '',
           createdAt: user.createdAt.toISOString(),
           updatedAt: user.updatedAt.toISOString(),
           postCount: user._count.posts,
           bookCount: user._count.bookshelf,
           isMe: viewerUsername === user.username,
           isFollower: user.followers.some(f => f.followerUsername === viewerUsername),
           isFollowing: user.following.some(f => f.followedUsername === viewerUsername),
           followerCount: user._count.followers,
           followingCount: user._count.following,
           followerUsernames: user.followers.map(f => f.followerUsername),
           followingUsernames: user.following.map(f => f.followedUsername),
       };
    },   

    async getUserPosts(username: string, viewerUsername: string | null): Promise<PostDTO[]> {
        const posts = await db.post.findMany({
            where: { authorUsername: username },
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: feedPostInclude(viewerUsername),
        });

        return posts.map(post => mapPostToDTO(post, viewerUsername)); // TODO: Implement mapPostToDTO
    },

    async updateProfile(username: string, data: UpdateUserDTO) {
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
}
    