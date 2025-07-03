// src/repos/comment.repository.ts
import { PrismaClient, Prisma } from '@prisma/client';
import BaseRepository from './base.repository';

/**
 * Repositório de comentários, com CRUD genérico herdado de BaseRepository
 * e métodos específicos de domínio.
 */
export class CommentRepository extends BaseRepository<
  PrismaClient['comment'],
  Prisma.CommentCreateInput,
  Prisma.CommentUpdateInput
> {
  /**
   * Construtor público — chama o super() do BaseRepository
   */
  public constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /** Aponta para `client.comment` no PrismaClient */
  protected delegate(client: PrismaClient): PrismaClient['comment'] {
    return client.comment;
  }

  /** Busca todos os comentários de um post, com autor e likes */
  findByPost(postId: string, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findMany({
      where: { postId },
      include: {
        author: true,
        likes: { include: { user: true } },
      },
    });
  }

  /** Busca um comentário pelo ID, incluindo autor */
  findWithAuthor(commentId: string, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findUnique({
      where: { id: commentId },
      include: { author: true },
    });
  }
}

// Instância singleton exportada
import { prisma } from '@/lib/prisma';
export const commentRepository = new CommentRepository(prisma);
export default commentRepository;
