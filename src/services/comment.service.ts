// src/services/comment.service.ts
import { commentRepository } from '@repositories/comment.repository';
import { commentLikeRepository } from '@repositories/commentLike.repository';
import { postRepository } from '@repositories/post.repository';
import { userRepository } from '@repositories/user.repository';

import { CommentDTO, mapCommentToDTO } from '@models/comment.model';
import { NotificationService } from '@services/notification.service';

export class CommentService {
  private notificationService = new NotificationService();

  /**
   * POST /api/posts/:postId/comments   (COM-001)
   */
  async addComment(postId: string, authorUsername: string, content: string): Promise<CommentDTO> {
    const post = await postRepository.findById(postId);
    if (!post) throw new Error('Post não encontrado');

    const comment = await commentRepository.create({
      post: { connect: { id: postId } },
      author: { connect: { username: authorUsername } },
      content,
    });

    await this.notificationService.notifyComment(post.authorUsername, authorUsername, postId);

    const author = await userRepository.findByUsername(authorUsername);
    return mapCommentToDTO(comment, author!, []);
  }

  /**
   * PATCH /api/comments/:commentId  (COM-002)
   */
  async editComment(
    commentId: string,
    authorUsername: string,
    content: string,
  ): Promise<CommentDTO> {
    const comment = await commentRepository.findById(commentId);
    if (!comment || comment.authorUsername !== authorUsername) {
      throw new Error('Comentário não encontrado');
    }
    const updated = await commentRepository.update(commentId, { content });
    const author = await userRepository.findByUsername(authorUsername);
    return mapCommentToDTO(updated, author!, []);
  }

  /**
   * DELETE /api/comments/:commentId  (COM-002 & POST-006)
   */
  async deleteComment(commentId: string, requesterUsername: string): Promise<void> {
    const comment = await commentRepository.findById(commentId);
    if (!comment) throw new Error('Comentário não encontrado');

    const post = await postRepository.findById(comment.postId);
    if (!post) throw new Error('Post não encontrado');

    if (requesterUsername !== comment.authorUsername && requesterUsername !== post.authorUsername) {
      throw new Error('Sem permissão para excluir');
    }

    await commentRepository.delete(commentId);
  }

  /**
   * GET /api/posts/:postId/comments?cursor=&take=   (COM-004)
   */
  async listComments(postId: string, take = 20, cursor?: string): Promise<CommentDTO[]> {
    const raw = await commentRepository.findByPost(postId, take, cursor);
    raw.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return Promise.all(
      raw.map(async (c) => {
        const author = await userRepository.findByUsername(c.authorUsername);

        const likeRecords = await commentLikeRepository.findByComment(c.id, 20);
        const likeUsers = await Promise.all(
          likeRecords.map((r) => userRepository.findByUsername(r.userUsername)),
        );

        return mapCommentToDTO(
          c,
          author!,
          likeUsers.filter((u): u is NonNullable<typeof u> => !!u),
        );
      }),
    );
  }
}
