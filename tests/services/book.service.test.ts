// tests/services/book.service.test.ts
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { bookRepository } from '@repositories/book.repository';
import { BookService } from '@services/book.service';

vi.mock('@repositories/book.repository', () => ({
  bookRepository: {
    searchByTitleOrAuthor: vi.fn(),
    findByIsbn: vi.fn(),
  },
}));

describe('BookService', () => {
  let svc: BookService;
  const mockBook = { isbn: '123', title: 'Foo Title', author: 'Bar Author' } as any;

  beforeEach(() => {
    svc = new BookService();
    vi.clearAllMocks();
  });

  describe('searchBooks', () => {
    it('usa o “take” padrão', async () => {
      (bookRepository.searchByTitleOrAuthor as Mock).mockResolvedValueOnce([mockBook]);

      await expect(svc.searchBooks('foo')).resolves.toEqual([mockBook]);
      expect(bookRepository.searchByTitleOrAuthor).toHaveBeenCalledWith('foo', 10);
    });

    it('aceita “take” customizado', async () => {
      (bookRepository.searchByTitleOrAuthor as Mock).mockResolvedValueOnce([mockBook]);

      await expect(svc.searchBooks('bar', 5)).resolves.toEqual([mockBook]);
      expect(bookRepository.searchByTitleOrAuthor).toHaveBeenCalledWith('bar', 5);
    });
  });

  describe('getBookByIsbn', () => {
    it('retorna livro existente', async () => {
      (bookRepository.findByIsbn as Mock).mockResolvedValueOnce(mockBook);

      await expect(svc.getBookByIsbn('123')).resolves.toBe(mockBook);
      expect(bookRepository.findByIsbn).toHaveBeenCalledWith('123');
    });

    it('retorna null quando não existe', async () => {
      (bookRepository.findByIsbn as Mock).mockResolvedValueOnce(null);

      await expect(svc.getBookByIsbn('999')).resolves.toBeNull();
      expect(bookRepository.findByIsbn).toHaveBeenCalledWith('999');
    });
  });
});
