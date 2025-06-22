// src/client/services/bookshelf.service.ts
import type { UserBookDTO } from '@models/userBook.dto';

export const BookshelfService = {
  async getMyBooks(): Promise<UserBookDTO[]> {
    const res = await fetch('/api/bookshelf');
    if (!res.ok) throw new Error('Erro ao buscar estante');
    return await res.json();
  },

  async updateProgress(isbn: string, page: number): Promise<void> {
    const res = await fetch(`/api/bookshelf/${isbn}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPage: page }),
    });
    if (!res.ok) throw new Error('Erro ao atualizar progresso');
  },
};
