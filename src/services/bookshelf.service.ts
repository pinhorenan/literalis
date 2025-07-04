// src/services/bookshelf.service.ts
import { prisma } from '@/lib/prisma';
import type { ShelfItem } from '@/types/bookshelf';

/* ---- queries ---- */
export async function getUserShelf(userId: string): Promise<ShelfItem[]> {
  const items = await prisma.bookshelfItem.findMany({
    where: { userId, removedAt: null },
    orderBy: { addedAt: 'desc' },
  });

  // converte removedAt:null → undefined para satisfazer ShelfItem.removedAt?: Date
  return items.map((item) => ({
    ...item,
    removedAt: item.removedAt ?? undefined,
    rating: item.rating ?? undefined,
  }));
}

/* ---- mutations ---- */
export async function upsertShelfItem(
  input: Omit<ShelfItem, 'addedAt' | 'updatedAt' | 'removedAt'>,
): Promise<ShelfItem> {
  const item = await prisma.bookshelfItem.upsert({
    where: {
      userId_bookIsbn: {
        userId: input.userId,
        bookIsbn: input.bookIsbn,
      },
    },
    update: {
      status: input.status,
      currentPage: input.currentPage,
      isPrivate: input.isPrivate,
      rating: input.rating,
      removedAt: null, // “restaura” caso estivesse removido
    },
    create: {
      ...input,
    },
  });

  return {
    ...item,
    removedAt: item.removedAt ?? undefined,
    rating: item.rating ?? undefined,
  };
}

export async function softRemoveShelfItem(userId: string, bookIsbn: string): Promise<void> {
  await prisma.bookshelfItem.update({
    where: { userId_bookIsbn: { userId, bookIsbn } },
    data: { removedAt: new Date() },
  });
}
