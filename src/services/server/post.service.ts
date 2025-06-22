// src/services/server/post.service.ts
import { db } from '@lib/db';
import { feedPostInclude } from '@includes/post.include';
import { mapPostToDTO } from '@lib/mappers/post.mapper';
import { mapCommentToDTO } from '@lib/mappers/comment.mapper';
import type { PostDTO, UpdatePostDTO, CreatePostDTO } from '@models/post.dto';

export async function getMany({
    viewerUsername,
    authorUsername,
    skip = 0,
    take = 20,
    orderBy = { createdAt: 'desc' as const },
    onlyFollowing = false,
  }: {
    viewerUsername?: string | null;
    authorUsername?: string;
    skip?: number;
    take?: number;
    orderBy?: { createdAt: 'asc' | 'desc' };
    onlyFollowing?: boolean;
  }): Promise<PostDTO[]> {
    return db.post
      .findMany({
        where: {
          authorUsername: authorUsername ?? undefined,
          ...(onlyFollowing && viewerUsername
            ? {
                author: {
                  followers: {
                    some: { followerUsername: viewerUsername },
                  },
                },
              }
            : {}),
        },
        orderBy,
        skip,
        take,
        include: feedPostInclude(viewerUsername),
      })
    .then(posts => posts.map(post => mapPostToDTO(post, viewerUsername ?? null)));
}

export async function createPost({ content, progress, bookIsbn, authorUsername }: CreatePostDTO & { authorUsername: string }) {
    return await db.post.create({
        data: {
            content,
            progress,
            bookIsbn,
            authorUsername,
        },
    });
}

export async function deletePost(postId: string, username: string) {
    const post = await db.post.findUnique({
        where: { id: postId },
        select: { authorUsername: true },
    });

    if (!post || post.authorUsername !== username) {
        throw new Error('Post não encontrado ou você não tem permissão para removê-lo');
    }

    await db.post.delete({
        where: { id: postId },
    });
}

export async function updatePost(postId: string, username: string, data: UpdatePostDTO) {
    const post = await db.post.findUnique({
        where: { id: postId },
        select: { authorUsername: true },
    });

    if (!post || post.authorUsername !== username) {
        throw new Error('Post não encontrado ou você não tem permissão para editá-lo');
    }

    return db.post.update({
        where: { id: postId },
        data,
    });
}

export async function toggleLike(username: string, postId: string) {
    const existing = await db.postLike.findUnique({
        where: { userUsername_postId: { userUsername: username, postId } },
    });
    if (existing) {
        await db.postLike.delete({
            where: { userUsername_postId: { userUsername: username, postId, } },
        });
    } else {
        await db.postLike.create({
            data: { userUsername: username, postId },
        });
    }
    const likeCount = await db.postLike.count({ where: { postId } });
    
    return { liked: !existing, likeCount };
}

export async function createComment(postId: string, authorUsername: string, content: string, viewerUsername?: string | null) {
  const comment = await db.comment.create({
    data: { postId, authorUsername, content },
    include: {
      author: { select: { username: true, name: true, avatarUrl: true } },
      likes: viewerUsername ? {
        where: { userUsername: viewerUsername },
        select: { userUsername: true },
      } : false,
      _count: { select: { likes: true } },
    },
  });

  return mapCommentToDTO(comment, viewerUsername);
}

export const PostService = {
    getMany,
    createPost,
    deletePost,    
    updatePost,
    toggleLike,
    createComment,
};
