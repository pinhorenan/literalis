// src/services/bookshelf.service.ts
import { BookshelfItem as PrismaShelfItem } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { Paginated, ShelfItem } from '@/types/index';
import { ShelfItemInputSchema, type ShelfItemInput } from '@/lib/validators/bookshelf';

function normalize(item: PrismaShelfItem): ShelfItem {
  return {
    ...item,
    removedAt: item.removedAt ?? undefined,
    rating: item.rating ?? undefined,
  };
}

/* ---------- QUERIES ---------- */
export async function getUserShelf(
  userId: string,
  pageSize = 20,
  cursor?: string,
  isOwner = false,
): Promise<Paginated<ShelfItem>> {
  const where: any = {
    userId,
    removedAt: null,
    ...(isOwner ? {} : { isPrivate: false }),
  };

  const countPromise = prisma.bookshelfItem.count({ where });

  const findManyArgs: any = {
    where,
    take: pageSize + 1,
    orderBy: [{ addedAt: 'desc' }, { bookIsbn: 'asc' }],
  };

  if (cursor) {
    findManyArgs.cursor = { userId_bookIsbn: { userId, bookIsbn: cursor } };
    findManyArgs.skip = 1;
  }

  const findPromise = prisma.bookshelfItem.findMany(findManyArgs);

  const [total, rows] = await prisma.$transaction([countPromise, findPromise]);

  const items = rows.slice(0, pageSize).map(normalize);
  const nextCursor = rows.length > pageSize ? rows[pageSize].bookIsbn : null;

  return { items, nextCursor, total };
}

export async function getShelfItem(
  userId: string,
  isbn: string,
  isOwner = false,
): Promise<ShelfItem | null> {
  const raw = await prisma.bookshelfItem.findUnique({
    where: { userId_bookIsbn: { userId, bookIsbn: isbn } },
  });
  if (!raw || (!isOwner && raw.isPrivate)) return null;
  return normalize(raw);
}

export async function countBooksInShelf(userId: string) {
  return prisma.bookshelfItem.count({ where: { userId, removedAt: null } });
}

/* ---------- MUTATIONS ---------- */
export async function upsertShelfItem(input: ShelfItemInput): Promise<ShelfItem> {
  const data = ShelfItemInputSchema.parse(input);
  const [item] = await prisma.$transaction([
    prisma.bookshelfItem.upsert({
      where: { userId_bookIsbn: { userId: data.userId, bookIsbn: data.bookIsbn } },
      update: {
        status: data.status,
        currentPage: data.currentPage,
        isPrivate: data.isPrivate,
        rating: data.rating,
        removedAt: null,
      },
      create: { ...data },
    }),
  ]);
  return normalize(item);
}

export async function softRemoveShelfItem(userId: string, bookIsbn: string) {
  await prisma.bookshelfItem.update({
    where: { userId_bookIsbn: { userId, bookIsbn } },
    data: { removedAt: new Date() },
  });
}
