// src/services/client/bookshelf.client.ts
import type {
  BookshelfEntryDTO,
  CreateBookshelfEntryDTO,
  BookshelfUpdateDTO,
  BookshelfOptionDTO,
} from '@models/bookshelf.dto';
import { ShelfStatus } from '@prisma/client';

const BASE = '/api/bookshelf';

export const BookshelfClient = {
  async list(): Promise<BookshelfEntryDTO[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Erro ao buscar estante do usuário');
    return res.json();
  },

  async listPublic(username: string): Promise<BookshelfEntryDTO[]> {
    const res = await fetch(`/api/users/${username}/bookshelf`);
    if (!res.ok) throw new Error('Erro ao buscar estante pública');
    return res.json();
  },

  async options(): Promise<BookshelfOptionDTO[]> {
    const res = await fetch(`${BASE}/options`);
    if (!res.ok) throw new Error('Erro ao buscar opções de estante');
    return res.json();
  },

  async get(isbn: string): Promise<BookshelfEntryDTO> {
    const res = await fetch(`${BASE}/${isbn}`);
    if (!res.ok) throw new Error('Erro ao buscar entrada da estante');
    return res.json();
  },

  async add(data: CreateBookshelfEntryDTO): Promise<BookshelfEntryDTO> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao adicionar livro na estante');
    return res.json();
  },

  async update(isbn: string, data: BookshelfUpdateDTO): Promise<BookshelfEntryDTO> {
    const res = await fetch(`${BASE}/${isbn}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao atualizar livro da estante');
    return res.json();
  },

  async updateProgress(isbn: string, currentPage: number): Promise<BookshelfEntryDTO> {
    const res = await fetch(`${BASE}/${isbn}/progress`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPage }),
    });
    if (!res.ok) throw new Error('Erro ao atualizar progresso');
    return res.json();
  },

  async updateStatus(isbn: string, status: ShelfStatus): Promise<BookshelfEntryDTO> {
    const res = await fetch(`${BASE}/${isbn}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Erro ao atualizar status');
    return res.json();
  },

  async remove(isbn: string): Promise<BookshelfEntryDTO> {
    const res = await fetch(`${BASE}/${isbn}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao remover livro da estante');
    return res.json();
  },
};
