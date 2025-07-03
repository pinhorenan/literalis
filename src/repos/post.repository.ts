// src/repos/post.repository.ts
import { PrismaClient, Prisma } from '@prisma/client';
import BaseRepository from './base.repository';

/**
 * Repositório de posts, com CRUD genérico herdado de BaseRepository
 * e métodos específicos de domínio.
 */
export class PostRepository extends BaseRepository<
  PrismaClient['post'],
  Prisma.PostCreateInput,
  Prisma.PostUpdateInput
> {
  /**
   * Construtor público — chama o super() do BaseRepository
   */
  public constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /** Aponta para `client.post` no PrismaClient */
  protected delegate(client: PrismaClient): PrismaClient['post'] {
    return client.post;
  }

  /** Busca todos os posts de um livro, incluindo autor */
  findByBook(bookIsbn: string, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findMany({
      where: { bookIsbn },
      include: { author: true },
    });
  }

  /** Busca um post pelo ID, incluindo autor, likes e livro */
  findWithAuthorAndLikes(postId: string, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findUnique({
      where: { id: postId },
      include: {
        author: true,
        likes: { include: { user: true } },
        book: true,
      },
    });
  }
}

// Instância singleton exportada
import { prisma } from '@/lib/prisma';
export const postRepository = new PostRepository(prisma);
export default postRepository;
