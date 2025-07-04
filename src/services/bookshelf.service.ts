// src/services/bookshelf.service.ts
import { prisma } from '@/src/lib/prisma';
import { ReadingStatus } from '@prisma/client';

export interface BookshelfItemData {
  userId: string;
  bookIsbn: string;
  status: ReadingStatus;
  currentPage: number;
  isPrivate: boolean;
  rating: number | null;
  addedAt: Date;
  updatedAt: Date;
  removedAt: Date | null;
}

export async function getShelfByUser(userId: string): Promise<BookshelfItemData[]> {
  const items = await prisma.bookshelfItem.findMany({
    where: { userId },
    select: {
      userId: true,
      bookIsbn: true,
      status: true,
      currentPage: true,
      isPrivate: true,
      rating: true,
      addedAt: true,
      updatedAt: true,
      removedAt: true,
    },
    orderBy: { addedAt: 'desc' },
  });
  return items;
}

export async function getShelfItem(
  userId: string,
  bookIsbn: string,
): Promise<BookshelfItemData | null> {
  const item = await prisma.bookshelfItem.findUnique({
    where: { userId_bookIsbn: { userId, bookIsbn } },
    select: {
      userId: true,
      bookIsbn: true,
      status: true,
      currentPage: true,
      isPrivate: true,
      rating: true,
      addedAt: true,
      updatedAt: true,
      removedAt: true,
    },
  });
  return item;
}

export async function upsertShelfItem(
  data: Omit<BookshelfItemData, 'addedAt' | 'updatedAt'>,
): Promise<BookshelfItemData> {
  const { userId, bookIsbn, status, currentPage, isPrivate, rating } = data;
  const item = await prisma.bookshelfItem.upsert({
    where: { userId_bookIsbn: { userId, bookIsbn } },
    update: { status, currentPage, isPrivate, rating },
    create: { userId, bookIsbn, status, currentPage, isPrivate, rating },
    select: {
      userId: true,
      bookIsbn: true,
      status: true,
      currentPage: true,
      isPrivate: true,
      rating: true,
      addedAt: true,
      updatedAt: true,
      removedAt: true,
    },
  });
  return item;
}

export async function removeShelfItem(userId: string, bookIsbn: string): Promise<void> {
  await prisma.bookshelfItem.delete({
    // ?? todo: era pra ser soft delete
    where: { userId_bookIsbn: { userId, bookIsbn } },
  });
}
