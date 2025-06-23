// src/services/client/book.client.ts

import { httpClient } from '@lib/httpClient';
import type { BookDTO, CreateBookDTO, UpdateBookDTO } from '@models/book.dto';

export const BookClient = {
  async getByIsbn(isbn: string): Promise<BookDTO> {
    const res = await httpClient.get(`/api/books/${isbn}`);
    if (!res.ok) throw new Error('Erro ao buscar livro');
    return res.json();
  },

  async search(query: string, limit = 10, skip = 0, orderBy: 'title' | 'author' = 'title'): Promise<BookDTO[]> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      skip: skip.toString(),
      orderBy,
    });
    const res = await httpClient.get(`/api/books?${params.toString()}`);
    if (!res.ok) throw new Error('Erro ao buscar livros');
    return res.json();
  },

  async create(data: CreateBookDTO): Promise<BookDTO> {
    const res = await httpClient.post(`/api/books`, data);
    if (!res.ok) throw new Error('Erro ao criar livro');
    return res.json();
  },

  async update(isbn: string, data: UpdateBookDTO): Promise<BookDTO> {
    const res = await httpClient.patch(`/api/books/${isbn}`, data);
    if (!res.ok) throw new Error('Erro ao atualizar livro');
    return res.json();
  },

  async delete(isbn: string): Promise<BookDTO> {
    const res = await httpClient.delete(`/api/books/${isbn}`);
    if (!res.ok) throw new Error('Erro ao deletar livro');
    return res.json();
  },
};
