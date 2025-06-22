// src/repository/comment.repository.ts
import { db } from '@lib/db';
import { commentInclude, commentWithLikesInclude } from '@includes/comment.include';
import type { CreateCommentDTO, UpdateCommentDTO } from '@models/comment.dto';

export const CommentRepository = {
  findById: (id: string, viewerUsername: string | null = null) => {
    return db.comment.findUnique({
      where: { id },
      include: commentWithLikesInclude(viewerUsername),
    });
  },

  findByPost: (postId: string, viewerUsername: string | null = null) => {
    return db.comment.findMany({
      where: { postId },
      include: commentWithLikesInclude(viewerUsername),
      orderBy: { createdAt: 'asc' }, // exibe na ordem cronológica normal
    });
  },

  create: (postId: string, authorUsername: string, data: CreateCommentDTO) => {
    return db.comment.create({
      data: {
        ...data,
        postId,
        authorUsername,
      },
      include: commentInclude, // não precisa verificar likes ainda
    });
  },

  update: (commentId: string, data: UpdateCommentDTO) => {
    return db.comment.update({
      where: { id: commentId },
      data,
      include: commentInclude,
    });
  },

  delete: (commentId: string) => {
    return db.comment.delete({
      where: { id: commentId },
    });
  },
};
