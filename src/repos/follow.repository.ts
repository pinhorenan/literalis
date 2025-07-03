// src/repos/follow.repository.ts
import { PrismaClient, Prisma } from '@prisma/client';
import BaseRepository from './base.repository';

/**
 * Repositório de Follow, com CRUD genérico herdado de BaseRepository
 * e métodos específicos de domínio.
 */
export class FollowRepository extends BaseRepository<
  PrismaClient['follow'],
  Prisma.FollowCreateInput,
  Prisma.FollowUpdateInput
> {
  /**
   * Construtor público — chama o super() do BaseRepository
   */
  public constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /** Aponta para `client.follow` no PrismaClient */
  protected delegate(client: PrismaClient): PrismaClient['follow'] {
    return client.follow;
  }

  /** Pessoas que este usuário está seguindo */
  findFollowing(userId: string, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findMany({
      where: { followerId: userId },
      include: {
        followed: {
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

  /** Seguidores deste usuário */
  findFollowers(userId: string, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findMany({
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
export const followRepository = new FollowRepository(prisma);
export default followRepository;
