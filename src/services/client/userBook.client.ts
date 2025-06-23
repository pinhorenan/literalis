// src/services/client/userBook.client.ts
import type {
  UserBookDTO,
  UserBookCreateDTO,
  UserBookUpdateDTO,
  UserBookOptionDTO,
} from '@models/userBook.dto';
import { ShelfStatus } from '@prisma/client';

const BASE = '/api/bookshelf';

export const UserBookClientService = {
  // GET /api/bookshelf → estante do viewer
  async list(): Promise<UserBookDTO[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Erro ao buscar estante do usuário');
    return res.json();
  },

  // GET /api/bookshelf/[username] → estante pública de outro usuário
  async listPublic(username: string): Promise<UserBookDTO[]> {
    const res = await fetch(`${BASE}/${username}`);
    if (!res.ok) throw new Error('Erro ao buscar estante pública');
    return res.json();
  },

  // GET /api/bookshelf/options → autocomplete para livros ativos
  async options(): Promise<UserBookOptionDTO[]> {
    const res = await fetch(`${BASE}/options`);
    if (!res.ok) throw new Error('Erro ao buscar opções de estante');
    return res.json();
  },

  // POST /api/bookshelf → adicionar novo livro
  async add(data: UserBookCreateDTO): Promise<UserBookDTO> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao adicionar livro na estante');
    return res.json();
  },

  // PATCH /api/bookshelf/[isbn] → atualizar campos
  async update(isbn: string, data: UserBookUpdateDTO): Promise<UserBookDTO> {
    const res = await fetch(`${BASE}/${isbn}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao atualizar livro da estante');
    return res.json();
  },

  // PATCH simplificado para progresso
  async updateProgress(isbn: string, currentPage: number): Promise<UserBookDTO> {
    return this.update(isbn, { currentPage });
  },

  // PATCH simplificado para status
  async updateStatus(isbn: string, status: ShelfStatus): Promise<UserBookDTO> {
    return this.update(isbn, { status });
  },

  // DELETE (soft) /api/bookshelf/[isbn]
  async remove(isbn: string): Promise<UserBookDTO> {
    const res = await fetch(`${BASE}/${isbn}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao remover livro da estante');
    return res.json();
  },

  // DELETE (hard) /api/bookshelf/[isbn]?hard=1
  async hardDelete(isbn: string): Promise<UserBookDTO> {
    const res = await fetch(`${BASE}/${isbn}?hard=1`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao deletar livro permanentemente');
    return res.json();
  },
};
