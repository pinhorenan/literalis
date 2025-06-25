// src/services/like.service.ts
import { MinimalUserDTO, mapUserToMinimalDTO } from '@models/user.model';
import { CommentLike, PostLike } from '@prisma/client';
import { commentLikeRepository } from '@repositories/commentLike.repository';
import { postLikeRepository } from '@repositories/postLike.repository';
import { userRepository } from '@repositories/user.repository';

export class LikeService {
  /**
   * POST /api/posts/:postId/like
   */
  async likePost(username: string, postId: string): Promise<void> {
    if (!(await postLikeRepository.exists(username, postId))) {
      await postLikeRepository.create({
        user: { connect: { username } },
        post: { connect: { id: postId } },
      });
    }
  }

  /**
   * DELETE /api/posts/:postId/like
   */
  async unlikePost(username: string, postId: string): Promise<void> {
    if (await postLikeRepository.exists(username, postId)) {
      await postLikeRepository.delete(username, postId);
    }
  }

  /**
   * GET /api/posts/:postId/likes
   */
  async listPostLikes(postId: string, take = 10): Promise<MinimalUserDTO[]> {
    const likes = await postLikeRepository.findByPost(postId, take);
    const users = await Promise.all(
      likes.map(async (l: PostLike) => {
        const user = await userRepository.findByUsername(l.userUsername);
        if (!user) throw new Error(`Usuário ${l.userUsername} não encontrado`);
        return mapUserToMinimalDTO(user);
      }),
    );
    return users;
  }

  /**
   * GET /api/posts/:postId/isLiked
   */
  async isPostLikedByUser(username: string, postId: string): Promise<boolean> {
    return postLikeRepository.exists(username, postId);
  }

  /**
   * POST /api/comments/:commentId/like
   */
  async likeComment(username: string, commentId: string): Promise<void> {
    if (!(await commentLikeRepository.exists(username, commentId))) {
      await commentLikeRepository.create({
        user: { connect: { username } },
        comment: { connect: { id: commentId } },
      });
    }
  }

  /**
   * DELETE /api/comments/:commentId/like
   */
  async unlikeComment(username: string, commentId: string): Promise<void> {
    if (await commentLikeRepository.exists(username, commentId)) {
      await commentLikeRepository.delete(username, commentId);
    }
  }

  /**
   * GET /api/comments/:commentId/likes
   */
  async listCommentLikes(commentId: string, take = 10): Promise<MinimalUserDTO[]> {
    const likes = await commentLikeRepository.findByComment(commentId, take);
    const users = await Promise.all(
      likes.map(async (l: CommentLike) => {
        const user = await userRepository.findByUsername(l.userUsername);
        if (!user) throw new Error(`Usuário ${l.userUsername} não encontrado`);
        return mapUserToMinimalDTO(user);
      }),
    );
    return users;
  }

  /**
   * GET /api/comments/:commentId/isLiked
   */
  async isCommentLikedByUser(username: string, commentId: string): Promise<boolean> {
    return commentLikeRepository.exists(username, commentId);
  }
}
