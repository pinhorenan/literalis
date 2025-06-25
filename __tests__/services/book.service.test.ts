// src/services/book/__tests__/book.service.test.ts
import { bookRepository } from '@repositories/book.repository';
import { BookService } from '@services/book.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@repositories/book.repository', () => ({
  bookRepository: { searchByTitleOrAuthor: vi.fn(), findByIsbn: vi.fn() },
}));

describe('BookService', () => {
  let service: BookService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new BookService();
  });

  describe('searchBooks', () => {
    it('should return books array', async () => {
      const books = [{ isbn: '1', title: 'A', pages: 10 }];
      (bookRepository.searchByTitleOrAuthor as vi.Mock).mockResolvedValue(books as any);
      const result = await service.searchBooks('A', 5);
      expect(result).toEqual(books);
    });

    it('should return empty array when no books', async () => {
      (bookRepository.searchByTitleOrAuthor as vi.Mock).mockResolvedValue([]);
      expect(await service.searchBooks('X', 5)).toEqual([]);
    });
  });

  describe('getBookByIsbn', () => {
    it('should return book when found', async () => {
      const book = { isbn: '1', title: 'A', pages: 10 };
      (bookRepository.findByIsbn as vi.Mock).mockResolvedValue(book as any);
      expect(await service.getBookByIsbn('1')).toEqual(book);
    });

    it('should return null when not found', async () => {
      (bookRepository.findByIsbn as vi.Mock).mockResolvedValue(null);
      expect(await service.getBookByIsbn('X')).toBeNull();
    });
  });
});
