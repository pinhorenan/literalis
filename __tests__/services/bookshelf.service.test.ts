// src/services/bookshelf/__tests__/bookshelf.service.test.ts
import { mapEntryToDTO } from '@models/bookshelf-entry.model';
import { bookRepository } from '@repositories/book.repository';
import { bookshelfRepository } from '@repositories/bookshelf.repository';
import { BookshelfService } from '@services/bookshelf.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@repositories/book.repository', () => ({ bookRepository: { findByIsbn: vi.fn() } }));
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
  let service: BookshelfService;
  const mockBook = { isbn: '1', pages: 100 };
  const mockEntry = {
    ownerUsername: 'alice',
    bookIsbn: '1',
    currentPage: 10,
    status: 'TO_READ',
    isPrivate: false,
    addedAt: new Date(),
    updatedAt: new Date(),
    removedAt: null,
    rating: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new BookshelfService();
  });

  describe('addEntry', () => {
    it('should add and return DTO when book exists', async () => {
      (bookRepository.findByIsbn as vi.Mock).mockResolvedValue(mockBook as any);
      (bookshelfRepository.addEntry as vi.Mock).mockResolvedValue(mockEntry as any);
      const result = await service.addEntry('alice', '1');
      expect(result).toEqual(mapEntryToDTO(mockEntry as any, mockBook as any));
    });

    it('should throw if book not found', async () => {
      (bookRepository.findByIsbn as vi.Mock).mockResolvedValue(null);
      await expect(service.addEntry('alice', '1')).rejects.toThrow('Livro não encontrado');
    });
  });

  describe('updateEntry', () => {
    it('should update and return DTO when valid', async () => {
      (bookRepository.findByIsbn as vi.Mock).mockResolvedValue(mockBook as any);
      (bookshelfRepository.update as vi.Mock).mockResolvedValue(mockEntry as any);
      const result = await service.updateEntry('alice', '1', { currentPage: 10 });
      expect(result).toEqual(mapEntryToDTO(mockEntry as any, mockBook as any));
    });

    it('should throw if currentPage exceeds total', async () => {
      (bookRepository.findByIsbn as vi.Mock).mockResolvedValue(mockBook as any);
      await expect(service.updateEntry('alice', '1', { currentPage: 200 })).rejects.toThrow(
        'Página atual não pode exceder total de páginas',
      );
    });

    it('should throw if book not found', async () => {
      (bookRepository.findByIsbn as vi.Mock).mockResolvedValue(null);
      await expect(service.updateEntry('alice', '1', {})).rejects.toThrow('Livro não encontrado');
    });
  });

  describe('removeEntry', () => {
    it('should call softDelete', async () => {
      await service.removeEntry('alice', '1');
      expect(bookshelfRepository.softDelete).toHaveBeenCalledWith('alice', '1');
    });
  });

  describe('listEntries', () => {
    it('should list public entries when includePrivate false', async () => {
      (bookshelfRepository.findPublicByOwner as vi.Mock).mockResolvedValue([mockEntry as any]);
      (bookRepository.findByIsbn as vi.Mock).mockResolvedValue(mockBook as any);
      const result = await service.listEntries('alice', false);
      expect(result).toEqual([mapEntryToDTO(mockEntry as any, mockBook as any)]);
    });

    it('should list all entries when includePrivate true', async () => {
      (bookshelfRepository.findAllByOwner as vi.Mock).mockResolvedValue([mockEntry as any]);
      (bookRepository.findByIsbn as vi.Mock).mockResolvedValue(mockBook as any);
      const result = await service.listEntries('alice', true);
      expect(result).toEqual([mapEntryToDTO(mockEntry as any, mockBook as any)]);
    });

    it('should throw if book not found in mapping', async () => {
      (bookshelfRepository.findPublicByOwner as vi.Mock).mockResolvedValue([mockEntry as any]);
      (bookRepository.findByIsbn as vi.Mock).mockResolvedValue(null);
      await expect(service.listEntries('alice', false)).rejects.toThrow('Livro não encontrado');
    });
  });
});
