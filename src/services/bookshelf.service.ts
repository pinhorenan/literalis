// src/services/bookshelf.service.ts
import { BookshelfItem as PrismaShelfItem } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import type { Paginated } from '@/types/common';
import type { ShelfItem } from '@/types/bookshelf';
import type { ShelfItemInput } from '@/src/validators/bookshelf';
import { ShelfItemInputSchema } from '@/src/validators/bookshelf';

/* ---- helper que converte null → undefined ---- */
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
  cursor?: string, // agora o cursor é o bookIsbn do último item
): Promise<Paginated<ShelfItem>> {
  const rows = await prisma.bookshelfItem.findMany({
    where: { userId, removedAt: null },
    take: pageSize + 1, // over-fetch
    ...(cursor
      ? {
          cursor: {
            // usa a composite PK existente
            userId_bookIsbn: { userId, bookIsbn: cursor },
          },
          skip: 1,
        }
      : {}),
    orderBy: [
      { addedAt: 'desc' }, // ordena por data
      { bookIsbn: 'asc' }, // tie-breaker; parte da PK
    ],
  });

  const items = rows.slice(0, pageSize).map(normalize);
  const nextCursor = rows.length > pageSize ? rows[pageSize].bookIsbn : null;

  return { items, nextCursor };
}

export async function countBooksInShelf(userId: string) {
  return prisma.bookshelfItem.count({ where: { userId, removedAt: null } });
}

/* ---------- MUTATIONS ---------- */
export async function upsertShelfItem(input: ShelfItemInput): Promise<ShelfItem> {
  const data = ShelfItemInputSchema.parse(input); // valida
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
