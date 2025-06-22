import type { PostDTO } from '@models/post.dto';
import type { Post, Comment, User, Book, PostLike, } from '@prisma/client';

export function mapPostToDTO(post: any, viewerUsername: string | null): PostDTO {
  return {
    id: post.id,
    content: post.content ?? '',
    progress: post.progress ?? 0,
    createdAt: post.createdAt?.toISOString?.() ?? '',
    updatedAt: post.updatedAt?.toISOString?.() ?? '',
    likeCount: post._count?.likes ?? 0,
    commentCount: post._count?.comments ?? 0,
    likedByMe: viewerUsername ? post.likes?.some((like: PostLike) => like.userUsername === viewerUsername) : false,
    isFollowingAuthor: !!post.author?.followers?.length,
    isInMyBookshelf: false,

    author: {
      username: post.author?.username ?? 'desconhecido',
      name: post.author?.name ?? '',
      avatarUrl: post.author?.avatarUrl ?? '/images/avatars/default.jpg',
      bio: post.author?.bio ?? '',
      createdAt: post.author?.createdAt?.toISOString?.() ?? '',
      updatedAt: post.author?.updatedAt?.toISOString?.() ?? '',
      postCount: post.author?._count?.posts ?? 0,
      bookCount: post.author?._count?.books ?? 0,
      isMe: viewerUsername === post.author?.username,
      isFollower: post.author?.followers?.some((f: User) => f.username === viewerUsername) ?? false,
      isFollowing: post.author?.following?.some((f: User) => f.username === viewerUsername) ?? false,
      followerCount: post.author?._count?.followers ?? 0,
      followingCount: post.author?._count?.following ?? 0,
      followerUsernames: post.author?.followers?.map((f: User) => f.username) ?? [],
      followingUsernames: post.author?.following?.map((f: User) => f.username) ?? [],
    },

    book: {
      isbn: post.book?.isbn ?? 'sem-isbn',
      title: post.book?.title ?? '',
      author: post.book?.author ?? '',
      coverUrl: post.book?.coverUrl ?? '/images/covers/default.jpg',
      publisher: post.book?.publisher ?? undefined,
      edition: post.book?.edition ?? undefined,
      pages: post.book?.pages ?? undefined,
      language: post.book?.language ?? undefined,
      publicationDate: post.book?.publicationDate?.toISOString?.(),
      external: false,
    },

    comments: post.comments?.map((c: any) => ({
      id: c.id,
      content: c.content ?? '',
      createdAt: c.createdAt?.toISOString?.() ?? '',
      updatedAt: c.updatedAt?.toISOString?.() ?? '',
      likeCount: 0,
      likedByMe: false,
      author: {
        username: c.author?.username ?? '',
        name: c.author?.name ?? '',
        avatarUrl: c.author?.avatarUrl ?? '',
        bio: c.author?.bio ?? '',
      },
    })) ?? [],

    likedBy: post.likes?.map((like: any) => ({
      username: like.user?.username ?? '',
      name: like.user?.name ?? '',
      avatarUrl: like.user?.avatarUrl ?? '',
    })) ?? [],
  };
}
