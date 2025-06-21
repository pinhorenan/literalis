// src/lib/mappers/post.mapper.ts
import type { Post, PostLike, User, Book, Comment, Follow, CommentLike } from '@prisma/client';
import type { PostDTO } from '../../types/dto/post.dto';
import { toUserDTO } from './user.mapper';
import { toBookDTO } from './book.mapper';
import { toCommentDTO } from './comment.mapper';

// O Post deve vir com include: { author: { followers: true, following: true }, book: true, likes: true, comments: { include: { author: { followers: true, following: true }, likes: true } } }
type PostWithRelations = Post & {
  author: User & { followers?: Follow[], following?: Follow[] };
  book: Book;
  likes?: PostLike[];
  comments?: (Comment & {
    author: User & { followers?: Follow[], following?: Follow[] };
    likes?: CommentLike[];
  })[];
};

/**
 * @param post objeto Prisma já carregado (veja acima)
 * @param meUsername username do usuário autenticado
 * @param isInMyBookshelf se já está na estante do usuário logado (traga em query, não calcule aqui)
 */
export function toPostDTO(
  post: PostWithRelations,
  meUsername?: string,
  isInMyBookshelf: boolean = false,
  commentsPreviewLimit: number = 3
): PostDTO {
  const likeCount = post.likes ? post.likes.length : 0;
  const likedByMe = !!(meUsername && post.likes?.some(like => like.userUsername === meUsername));
  const commentCount = post.comments ? post.comments.length : 0;

  const isFollowingAuthor = !!(
    meUsername &&
    post.author.followers?.some(f => f.followerUsername === meUsername)
  );

  return {
    id:                 post.id,
    content:            post.content,
    progress:           post.progress,
    createdAt:          post.createdAt.toISOString(),
    updatedAt:          post.updatedAt.toISOString(),

    likeCount,
    commentCount,
    likedByMe,
    isFollowingAuthor,
    isInMyBookshelf,

    author:             toUserDTO(post.author),
    book:               toBookDTO(post.book),
    commentsPreview:    (post.comments ?? [])
                          .slice(0, commentsPreviewLimit)
                          .map(comment => toCommentDTO(comment, meUsername)),
  };
}
