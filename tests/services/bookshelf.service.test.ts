// tests/services/bookshelf.service.test.ts
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { BookshelfService } from '@services/bookshelf.service';
import { bookRepository } from '@repositories/book.repository';
import { bookshelfRepository } from '@repositories/bookshelf.repository';
import { ReadingStatus } from '@prisma/client';

vi.mock('@repositories/book.repository', () => ({
  bookRepository: { findByIsbn: vi.fn() },
}));
vi.mock('@repositories/bookshelf.repository', () => ({
  bookshelfRepository: {
    addEntry: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
    findPublicByOwner: vi.fn(),
    findAllByOwner: vi.fn(),
  },
}));

describe('BookshelfService', () => {
  let svc: BookshelfService;
  const user = 'alice';
  const isbn = '1234567890';
  const now = new Date();
  const book = { isbn, title: 'Foo', author: 'Bar', pages: 100 } as any;
  const entry = {
    owner: user,
    bookIsbn: isbn,
    currentPage: 5,
    status: ReadingStatus.READING,
    isPrivate: false,
    addedAt: now,
  } as any;

  beforeEach(() => {
    svc = new BookshelfService();
    vi.clearAllMocks();
  });

  describe('addEntry', () => {
    it('cria entrada com status TO_READ e página 0', async () => {
      (bookRepository.findByIsbn as Mock).mockResolvedValueOnce(book);
      (bookshelfRepository.addEntry as Mock).mockResolvedValueOnce({
        ownerUsername: user,
        bookIsbn: isbn,
        currentPage: 0,
        status: ReadingStatus.TO_READ,
        isPrivate: false,
        addedAt: now,
        updatedAt: now,
        removedAt: null,
        rating: null,
      });

      await expect(svc.addEntry(user, isbn)).resolves.toMatchObject({
        ownerUsername: user,
        book: { isbn },
        currentPage: 0,
        totalPages: book.pages,
        progress: 0,
        status: ReadingStatus.TO_READ,
        isPrivate: false,
      });
      expect(bookshelfRepository.addEntry).toHaveBeenCalledWith({
        owner: { connect: { username: user } },
        book: { connect: { isbn } },
      });
    });
  });

  describe('listEntries', () => {
    it('lista só públicos', async () => {
      (bookshelfRepository.findPublicByOwner as Mock).mockResolvedValueOnce([entry]);
      (bookRepository.findByIsbn as Mock).mockResolvedValueOnce(book);

      const out = await svc.listEntries(user, false);
      expect(out).toHaveLength(1);
      expect(bookshelfRepository.findPublicByOwner).toHaveBeenCalledWith(user);
    });

    it('lista privados quando solicitado', async () => {
      (bookshelfRepository.findAllByOwner as Mock).mockResolvedValueOnce([entry]);
      (bookRepository.findByIsbn as Mock).mockResolvedValueOnce(book);

      const out = await svc.listEntries(user, true);
      expect(out).toHaveLength(1);
      expect(bookshelfRepository.findAllByOwner).toHaveBeenCalledWith(user);
    });
  });

  describe('updateEntry', () => {
    it('atualiza progresso e status', async () => {
      // 1️⃣ mock do livro para passar a checagem de pages
      (bookRepository.findByIsbn as Mock).mockResolvedValueOnce(book);
      // 2️⃣ mock do update
      (bookshelfRepository.update as Mock).mockResolvedValueOnce({ ...entry, currentPage: 10 });

      const dto = { currentPage: 10, status: ReadingStatus.READING };
      await expect(svc.updateEntry(user, isbn, dto)).resolves.toMatchObject(dto);
      expect(bookshelfRepository.update).toHaveBeenCalledWith(user, isbn, dto);
    });
  });

  describe('removeEntry', () => {
    it('soft delete', async () => {
      (bookshelfRepository.softDelete as Mock).mockResolvedValueOnce(entry);

      // o serviço é void, então esperamos undefined
      await expect(svc.removeEntry(user, isbn)).resolves.toBeUndefined();
      expect(bookshelfRepository.softDelete).toHaveBeenCalledWith(user, isbn);
    });
  });
});
