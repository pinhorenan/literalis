// src/api/bookshelf.ts
import type { ShelfItem } from '@/types/bookshelf';
import type { Paginated } from '@/types/common';

/* ---------------- LISTA COM CURSOR ---------------- */
export async function fetchUserShelf(
  userId: string,
  cursor?: string,
): Promise<Paginated<ShelfItem>> {
  const url = new URL('/api/bookshelf', window.location.origin);
  url.searchParams.set('userId', userId);
  if (cursor) url.searchParams.set('cursor', cursor);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar estante');
  return res.json();
}

/* ---------------- ITEM ÚNICO ---------------- */
export async function fetchShelfItem(userId: string, isbn: string): Promise<ShelfItem> {
  const url = new URL(`/api/bookshelf/${isbn}`, window.location.origin);
  url.searchParams.set('userId', userId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Erro ao buscar item da estante');
  return res.json();
}

/* ---------------- DELETE ---------------- */
export async function deleteShelfItemClient(userId: string, isbn: string): Promise<void> {
  const url = new URL(`/api/bookshelf/${isbn}`, window.location.origin);
  url.searchParams.set('userId', userId);
  const res = await fetch(url.toString(), { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao remover item da estante');
}

/* ---------------- UPSERT ---------------- */
export async function upsertShelfItemClient(
  item: Omit<ShelfItem, 'addedAt' | 'updatedAt' | 'removedAt'>,
): Promise<ShelfItem> {
  const res = await fetch('/api/bookshelf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Erro ao salvar item da estante');
  return res.json();
}
