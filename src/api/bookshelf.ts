// src/api/bookshelf.ts
import type { ShelfItem } from '@/types/bookshelf';
import type { Paginated } from '@/types/common';

/** GET /api/users/:username/bookshelf?cursor=&take= */
export async function fetchUserShelf(
  username: string,
  cursor?: string,
  take = 20,
): Promise<Paginated<ShelfItem>> {
  const url = new URL(`/api/users/${username}/bookshelf`, window.location.origin);
  url.searchParams.set('take', String(take));
  if (cursor) url.searchParams.set('cursor', cursor);

  const res = await fetch(url.toString(), { credentials: 'include' });
  if (!res.ok) throw new Error(`Erro ao buscar estante: ${res.status}`);
  return res.json();
}

/** GET /api/users/:username/bookshelf/:isbn */
export async function fetchShelfItem(username: string, isbn: string): Promise<ShelfItem> {
  const url = new URL(`/api/users/${username}/bookshelf/${isbn}`, window.location.origin);

  const res = await fetch(url.toString(), { credentials: 'include' });
  if (!res.ok) throw new Error(`Erro ao buscar item da estante: ${res.status}`);
  return res.json();
}

/** POST  /api/users/:username/bookshelf  – cria ou atualiza */
export async function upsertShelfItemClient(
  username: string,
  item: Omit<ShelfItem, 'addedAt' | 'updatedAt' | 'removedAt'>,
): Promise<ShelfItem> {
  const url = `/api/users/${username}/bookshelf`;
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error(`Erro ao salvar item: ${res.status}`);
  return res.json();
}

/** PUT /api/users/:username/bookshelf/:isbn  – atualiza item */
export async function updateShelfItemClient(
  username: string,
  isbn: string,
  item: Omit<ShelfItem, 'userId' | 'bookIsbn' | 'addedAt' | 'updatedAt' | 'removedAt'>,
): Promise<ShelfItem> {
  const url = `/api/users/${username}/bookshelf/${isbn}`;
  const res = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error(`Erro ao atualizar item: ${res.status}`);
  return res.json();
}

/** DELETE /api/users/:username/bookshelf/:isbn  – soft-delete */
export async function deleteShelfItemClient(username: string, isbn: string): Promise<void> {
  const url = `/api/users/${username}/bookshelf/${isbn}`;
  const res = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Erro ao remover item: ${res.status}`);
}
