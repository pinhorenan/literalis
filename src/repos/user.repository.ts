// src/repos/user.repository.ts
import { PrismaClient, Prisma } from '@prisma/client';
import BaseRepository from './base.repository';

/**
 * Repositório de usuários, com CRUD genérico herdado de BaseRepository
 * e métodos específicos de domínio.
 */
export class UserRepository extends BaseRepository<
  PrismaClient['user'],
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  /**
   * Construtor público — chama o super() do BaseRepository
   * e garante que não teremos erro de construtor protegido.
   */
  public constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /** Aponta para `client.user` no PrismaClient */
  protected delegate(client: PrismaClient): PrismaClient['user'] {
    return client.user;
  }

  /* ---------- Consultas customizadas ---------- */

  /** Buscar usuário por username */
  findByUsername(username: string, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findUnique({
      where: { username },
    });
  }

  /** Retorna usuário + prateleira pública e cada livro relacionado */
  findByUsernameWithBookshelf(username: string, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findUnique({
      where: { username },
      include: {
        bookshelf: {
          where: { isPrivate: false },
          include: { book: true },
        },
      },
    });
  }

  /** Lista seguidores públicos (perfil básico) */
  findFollowers(userId: string, tx?: PrismaClient) {
    return this.client(tx).follow.findMany({
      where: { followedId: userId },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }
}

// Instância singleton exportada
import { prisma } from '@/lib/prisma';
export const userRepository = new UserRepository(prisma);
export default userRepository;
