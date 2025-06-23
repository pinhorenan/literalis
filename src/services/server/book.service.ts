// src/services/server/book.service.ts

import { BookRepository } from '@repositories/book.repository';
import { toBookDTO } from '@mappers/book.mapper';
import type { BookDTO, CreateBookDTO, UpdateBookDTO } from '@models/book.dto';

export const BookService = {
  async getByIsbn(isbn: string): Promise<BookDTO | null> {
    const book = await BookRepository.findByIsbn(isbn);
    return book ? toBookDTO(book) : null;
  },

  async search(
    query: string,
    limit?: number,
    skip?: number,
    orderBy: 'title' | 'author' = 'title'
  ): Promise<BookDTO[]> {
    const books = await BookRepository.searchByTitleOrAuthor(query, limit, skip, orderBy);
    return books.map(toBookDTO);
  },

  async create(data: CreateBookDTO): Promise<BookDTO> {
    const book = await BookRepository.create(data);
    return toBookDTO(book);
  },

  async createIfNotExists(data: CreateBookDTO): Promise<BookDTO> {
    const book = await BookRepository.createIfNotExists(data);
    return toBookDTO(book);
  },

  async update(isbn: string, data: UpdateBookDTO): Promise<BookDTO> {
    const book = await BookRepository.update(isbn, data);
    return toBookDTO(book);
  },

  async delete(isbn: string): Promise<BookDTO> {
    const book = await BookRepository.delete(isbn);
    return toBookDTO(book);
  },
};
