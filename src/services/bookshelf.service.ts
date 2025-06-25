// src/services/bookshelf.service.ts
import { BookshelfEntryDTO, mapEntryToDTO } from '@models/bookshelf-entry.model';
import { Prisma, ReadingStatus } from '@prisma/client';
import { bookRepository } from '@repositories/book.repository';
import { bookshelfRepository } from '@repositories/bookshelf.repository';

export class BookshelfService {
  /**
   * POST /api/bookshelf
   * Body: { bookIsbn: string }
   */
  async addEntry(ownerUsername: string, bookIsbn: string): Promise<BookshelfEntryDTO> {
    const book = await bookRepository.findByIsbn(bookIsbn);
    if (!book) throw new Error('Livro não encontrado');

    const entry = await bookshelfRepository.addEntry({
      owner: { connect: { username: ownerUsername } },
      book: { connect: { isbn: bookIsbn } },
    } as Prisma.BookshelfEntryCreateInput);

    return mapEntryToDTO(entry, book);
  }

  /**
   * PATCH /api/bookshelf/:bookIsbn
   * Body: { currentPage?, status?, rating?, isPrivate? }
   */
  async updateEntry(
    ownerUsername: string,
    bookIsbn: string,
    data: {
      currentPage?: number;
      status?: ReadingStatus;
      rating?: number;
      isPrivate?: boolean;
    },
  ): Promise<BookshelfEntryDTO> {
    const book = await bookRepository.findByIsbn(bookIsbn);
    if (!book) throw new Error('Livro não encontrado');
    if (data.currentPage !== undefined && data.currentPage > book.pages) {
      throw new Error('Página atual não pode exceder total de páginas');
    }

    const entry = await bookshelfRepository.update(ownerUsername, bookIsbn, {
      currentPage: data.currentPage,
      status: data.status,
      rating: data.rating,
      isPrivate: data.isPrivate,
    });

    return mapEntryToDTO(entry, book);
  }

  /**
   * DELETE /api/bookshelf/:bookIsbn
   * Soft delete
   */
  async removeEntry(ownerUsername: string, bookIsbn: string): Promise<void> {
    await bookshelfRepository.softDelete(ownerUsername, bookIsbn);
  }

  /**
   * GET /api/bookshelf[?private=true]
   */
  async listEntries(ownerUsername: string, includePrivate = false): Promise<BookshelfEntryDTO[]> {
    const raw = includePrivate
      ? await bookshelfRepository.findAllByOwner(ownerUsername)
      : await bookshelfRepository.findPublicByOwner(ownerUsername);

    return Promise.all(
      raw.map(async (entry) => {
        const book = await bookRepository.findByIsbn(entry.bookIsbn);
        if (!book) throw new Error('Livro não encontrado');
        return mapEntryToDTO(entry, book);
      }),
    );
  }
}
