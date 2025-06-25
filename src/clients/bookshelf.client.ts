// src/clients/bookshelfClient.ts
import { BookshelfEntryDTO } from '@models/bookshelf-entry.model';
const SHELF_BASE = '/api/bookshelf';

/**
 * Lista as entradas da estante do usuário autenticado.
 * GET /api/bookshelf?private=true|false
 */
export async function listEntries(includePrivate = false): Promise<BookshelfEntryDTO[]> {
  const params = new URLSearchParams();
  if (includePrivate) params.set('private', 'true');

  const res = await fetch(`${SHELF_BASE}?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao listar estante');
  }
  return res.json();
}

/**
 * Adiciona um livro à estante com progresso 0 e status “TO_READ”.
 * POST /api/bookshelf
 */
export async function addEntry(bookIsbn: string): Promise<BookshelfEntryDTO> {
  const res = await fetch(SHELF_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookIsbn }),
  });
  if (res.status === 400) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao adicionar à estante');
  }
  if (!res.ok) {
    throw new Error('Erro inesperado ao adicionar à estante');
  }
  return res.json();
}

/**
 * Atualiza progresso, status, nota ou visibilidade de uma entrada.
 * PATCH /api/bookshelf/:bookIsbn
 */
export async function updateEntry(
  bookIsbn: string,
  data: {
    currentPage?: number;
    status?: 'TO_READ' | 'READING' | 'READ' | 'ABANDONED';
    rating?: number;
    isPrivate?: boolean;
  },
): Promise<BookshelfEntryDTO> {
  const res = await fetch(`${SHELF_BASE}/${encodeURIComponent(bookIsbn)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao atualizar entrada');
  }
  return res.json();
}

/**
 * Remove (soft-delete) um livro da estante.
 * DELETE /api/bookshelf/:bookIsbn
 */
export async function removeEntry(bookIsbn: string): Promise<void> {
  const res = await fetch(`${SHELF_BASE}/${encodeURIComponent(bookIsbn)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao remover entrada');
  }
}
