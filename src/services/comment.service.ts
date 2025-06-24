import { getViewerSession } from '@services/viewer.service';
import { z } from 'zod';

import { CommentRepository } from '@repositories/comment.repository';
import { PostRepository } from '@repositories/post.repository';
import { NotificationService } from '@services/notification.service';

import { type MinimalUserDTO, mapUserToMinimalDTO } from '@models/user.model';

/** --- modelos locais (faltavam nos arquivos) --------------------------------- */
export interface CommentDTO {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: MinimalUserDTO;
  likes: MinimalUserDTO[];
}

const commentCreateSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1).max(1000),
});
type CommentCreateDTO = z.infer<typeof commentCreateSchema>;

const commentUpdateSchema = z.object({
  content: z.string().min(1).max(1000),
});
type CommentUpdateDTO = z.infer<typeof commentUpdateSchema>;
/* --------------------------------------------------------------------------- */

export class CommentService {
  /** Converte registro Prisma em DTO */
  static mapRecordToDTO = (c: any): CommentDTO => ({
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    author: mapUserToMinimalDTO(c.author),
    likes: c.likes.map((l: any) => mapUserToMinimalDTO(l.user)),
  });

  static async listByPost(postId: string) {
    const rows = await CommentRepository.listByPost(postId);
    return rows.map(this.mapRecordToDTO);
  }

  static async create(dto: CommentCreateDTO): Promise<CommentDTO> {
    const viewer = await getViewerSession(true);
    const data = commentCreateSchema.parse(dto);

    // garante post
    const post = await PostRepository.findFull(data.postId);
    if (!post) throw new Error('Post inexistente');

    const created = await CommentRepository.create({
      content: data.content,
      postId: data.postId,
      authorUsername: viewer!.username,
    });
    await NotificationService.create({
      recipientUsername: post.author.username,
      actorUsername: viewer!.username,
      notifType: 'COMMENT',
      postId: data.postId,
    });
    return this.mapRecordToDTO(created);
  }

  static async update(id: string, dto: CommentUpdateDTO) {
    const viewer = await getViewerSession(true);
    const current = await CommentRepository.find(id);
    if (!current || current.author.username !== viewer!.username) throw new Error('Proibido');

    const data = commentUpdateSchema.parse(dto);
    const updated = await CommentRepository.update(id, data);
    return this.mapRecordToDTO(updated);
  }

  static async remove(id: string) {
    const viewer = await getViewerSession(true);
    const current = await CommentRepository.find(id);
    if (!current || current.author.username !== viewer!.username) throw new Error('Proibido');
    await CommentRepository.delete(id);
    return { removed: true };
  }

  static async toggleLike(id: string) {
    const viewer = await getViewerSession(true);
    const liked = await CommentRepository.toggleLike(viewer!.username, id);
    if (liked) {
      const comment = await CommentRepository.find(id);
      if (comment) {
        await NotificationService.create({
          recipientUsername: comment.author.username,
          actorUsername: viewer!.username,
          notifType: 'LIKE',
          commentId: id,
        });
      }
    }
    return { liked };
  }
}
