// src/repos/bookshelfItem.repository.ts
import { PrismaClient, Prisma } from '@prisma/client';
import BaseRepository from './base.repository';

/**
 * Repositório de itens da estante, com CRUD genérico herdado de BaseRepository
 * e métodos específicos de domínio.
 */
export class BookshelfItemRepository extends BaseRepository<
  PrismaClient['bookshelfItem'],
  Prisma.BookshelfItemCreateInput,
  Prisma.BookshelfItemUpdateInput
> {
  /**
   * Construtor público — chama o super() do BaseRepository
   */
  public constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /** Aponta para `client.bookshelfItem` no PrismaClient */
  protected delegate(client: PrismaClient): PrismaClient['bookshelfItem'] {
    return client.bookshelfItem;
  }

  /** Todos os itens da prateleira de um usuário, com livro carregado */
  findByUser(userId: string, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findMany({
      where: { userId },
      include: { book: true },
    });
  }
}

// Instância singleton exportada
import { prisma } from '@/lib/prisma';
export const bookshelfItemRepository = new BookshelfItemRepository(prisma);
export default bookshelfItemRepository;
