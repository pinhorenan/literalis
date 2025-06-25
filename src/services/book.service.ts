// src/services/book.service.ts
import { Book } from '@prisma/client';
import { bookRepository } from '@repositories/book.repository';

export class BookService {
  /**
   * GET /api/books?query=...
   */
  async searchBooks(query: string, take = 10): Promise<Book[]> {
    return bookRepository.searchByTitleOrAuthor(query, take);
  }

  /**
   * GET /api/books/:isbn
   */
  async getBookByIsbn(isbn: string): Promise<Book | null> {
    return bookRepository.findByIsbn(isbn);
  }
}
