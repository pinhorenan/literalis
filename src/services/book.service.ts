// src/lib/service/book.service.ts

import { NotFoundError } from '@lib/utils/errors'
import { BookRepository } from '@/src/repository/book.repository'
import {
  BookDTO,
  MinimalBookDTO,
  mapBookToDTO,
  mapBookToMinimalDTO,
} from '@models/book.model'

export const BookService = {
  /** Retorna um BookDTO completo. (BOOK-003) */
  async get(isbn: string): Promise<BookDTO> {
    const book = await BookRepository.find(isbn)
    if (!book) throw new NotFoundError('Livro não encontrado')
    return mapBookToDTO(book)
  },

  /** Autocomplete – BOOK-002 */
  async search(term: string, limit = 10): Promise<MinimalBookDTO[]> {
    const books = await BookRepository.search(term, limit)
    return books.map(mapBookToMinimalDTO)
  },

  /** Lista completa paginada (admin/seed) */
  async list(skip = 0, take = 50): Promise<BookDTO[]> {
    const books = await BookRepository.list(skip, take)
    return books.map(mapBookToDTO)
  },
}
