// src/api/bookshelf.ts
import type { BookshelfItemData } from '@/types/bookshelf';

export async function fetchUserShelf(userId: string): Promise<BookshelfItemData[]> {
  const res = await fetch(`/api/bookshelf?userId=${userId}`);
  if (!res.ok) throw new Error('Erro ao buscar estante');
  return res.json();
}

export async function fetchShelfItem(userId: string, isbn: string): Promise<BookshelfItemData> {
  const res = await fetch(`/api/bookshelf/${isbn}?userId=${userId}`);
  if (!res.ok) throw new Error('Erro ao buscar item da estante');
  return res.json();
}

export async function deleteShelfItemClient(userId: string, isbn: string): Promise<void> {
  const res = await fetch(`/api/bookshelf/${isbn}?userId=${userId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao remover item da estante');
}

export async function upsertShelfItemClient(
  item: Omit<BookshelfItemData, 'addedAt' | 'updatedAt'>,
): Promise<BookshelfItemData> {
  const res = await fetch('/api/bookshelf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Erro ao salvar item da estante');
  return res.json();
}
