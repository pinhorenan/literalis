import { ReadingStatus } from '@prisma/client';
import { z } from 'zod';

import {
  bookshelfEntryCreateSchema,
  bookshelfEntryUpdateSchema,
  mapEntryToDTO,
  type BookshelfEntryCreateDTO,
  type BookshelfEntryUpdateDTO,
} from '@models/bookshelf-entry.model';
import { BookRepository } from '@repositories/book.repository';
import { BookshelfRepository } from '@repositories/bookshelf-repository';
import { getViewerSession } from '@services/viewer.service';

export class BookshelfService {
  // ─────────────────────────────────────  LISTA  ────────────────────────────────────────────
  static async list(ownerUsername: string, viewerUsername?: string | null) {
    const publicOnly = viewerUsername !== ownerUsername;
    const rows = await BookshelfRepository.listByOwner(ownerUsername, publicOnly);
    return rows.map((row) => mapEntryToDTO(row as any, row.book as any));
  }

  // ───────────────────────────────────  ADICIONA / EDITA  ────────────────────────────────────
  static async upsert(dto: BookshelfEntryCreateDTO | BookshelfEntryUpdateDTO) {
    const viewer = await getViewerSession(true);
    const data = (
      ('currentPage' in dto ? bookshelfEntryUpdateSchema : bookshelfEntryCreateSchema) as z.Schema<
        BookshelfEntryCreateDTO | BookshelfEntryUpdateDTO
      >
    ).parse(dto);

    const { bookIsbn } = data as any;
    const book = await BookRepository.find(bookIsbn);
    if (!book) throw new Error('Livro não encontrado');

    // regras SHELF-001/002
    const entry = await BookshelfRepository.upsert(viewer!.username, bookIsbn, {
      ownerUsername: viewer!.username,
      bookIsbn,
      currentPage: 'currentPage' in data ? data.currentPage : 0,
      status: (data as any).status ?? ReadingStatus.TO_READ,
      isPrivate: (data as any).isPrivate ?? false,
      rating: (data as any).rating,
    });

    return mapEntryToDTO(entry as any, book);
  }

  // ─────────────────────────────────────  REMOVE  ───────────────────────────────────────────
  static async remove(bookIsbn: string) {
    const viewer = await getViewerSession(true);
    await BookshelfRepository.softDelete(viewer!.username, bookIsbn);
    return { removed: true };
  }
}
