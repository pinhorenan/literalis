import { PrismaClient } from '@prisma/client';

/**
 * Base genérico de repositório.
 *
 * DelegateType deve ser algo como PrismaClient['user'], PrismaClient['book'], etc.
 * CreateDto/UpdateDto são os tipos de input do Prisma (ex.: Prisma.BookCreateInput).
 */
export abstract class BaseRepository<
  DelegateType extends {
    findUnique: (...args: any[]) => any;
    findMany: (...args: any[]) => any;
    create: (...args: any[]) => any;
    update: (...args: any[]) => any;
    delete: (...args: any[]) => any;
  },
  CreateDto,
  UpdateDto,
> {
  /** Construtor público para permitir `new SubRepository(prisma)` externamente */
  public constructor(protected readonly prisma: PrismaClient) {}

  /** Cada sub­classe implementa como acessar seu delegate no client */
  protected abstract delegate(client: PrismaClient): DelegateType;

  /** Seleciona client transacional ou singleton */
  protected client(tx?: PrismaClient) {
    return tx ?? this.prisma;
  }

  findUnique(args: Parameters<DelegateType['findUnique']>[0], tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findUnique(args);
  }

  findMany(args: Parameters<DelegateType['findMany']>[0] = {} as any, tx?: PrismaClient) {
    return this.delegate(this.client(tx)).findMany(args);
  }

  create(args: Parameters<DelegateType['create']>[0], tx?: PrismaClient) {
    return this.delegate(this.client(tx)).create(args);
  }

  update(args: Parameters<DelegateType['update']>[0], tx?: PrismaClient) {
    return this.delegate(this.client(tx)).update(args);
  }

  delete(args: Parameters<DelegateType['delete']>[0], tx?: PrismaClient) {
    return this.delegate(this.client(tx)).delete(args);
  }
}

export default BaseRepository;
