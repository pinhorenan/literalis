// src/repos/book.repository.ts
import { PrismaClient, Prisma } from '@prisma/client';
import BaseRepository from './base.repository';

/**
 * Repositório de livros, com CRUD genérico herdado de BaseRepository
 * e métodos específicos de domínio.
 */
export class BookRepository extends BaseRepository<
  PrismaClient['book'],
  Prisma.BookCreateInput,
  Prisma.BookUpdateInput
> {
  /**
   * Construtor público — chama o super() do BaseRepository
   * e garante que não teremos erro de construtor protegido.
   */
  public constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /** Aponta para `client.book` no PrismaClient */
  protected delegate(client: PrismaClient): PrismaClient['book'] {
    return client.book;
  }

  /** Busca um livro incluindo autores, gêneros e publisher */
  findWithAuthorsAndGenres(isbn: string, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findUnique({
      where: { isbn },
      include: {
        authors: { include: { author: true } },
        genres: { include: { genre: true } },
        publisher: true,
      },
    });
  }

  /** Lista livros de um publisher específico */
  findByPublisher(publisherId: string, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findMany({
      where: { publisherId },
    });
  }
}

// Singleton export para uso direto
import { prisma } from '@/lib/prisma';
export const bookRepository = new BookRepository(prisma);
export default bookRepository;
