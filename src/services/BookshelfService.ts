// File: src/services/BookshelfService.ts

import { httpClient } from '@services/HTTPClient';
import type { UserBookDTO } from '@dto/userBook.dto';

export const BookshelfService = {
  /** Complete list of books in user's shelf. */
  list: () => httpClient.get<UserBookDTO[]>('/api/bookshelf'),

  /** Retrieve a single book entry (throws 404 if not found). */
  get: (isbn: string) => httpClient.get<UserBookDTO>(`/api/bookshelf/${isbn}`),

  /** Add a new book to the shelf. */
  add: (isbn: string) => httpClient.post<UserBookDTO>('/api/bookshelf', { isbn }),

  /** Remove book from shelf. */
  remove: (isbn: string) => httpClient.del<{ removed: boolean }>(`/api/bookshelf/${isbn}`),

  /** Update reading progress or extra metadata on a shelf entry. */
  update: (isbn: string, data: Partial<Pick<UserBookDTO, 'progressPages' | 'progressPct' | 'status' | 'isPrivate'>>) =>  // TODO: add 'notes', 'tags', and 'rating' when implemented
    httpClient.patch<UserBookDTO>(`/api/bookshelf/${isbn}`, data),

  /** Shorthand toggle when you only care about added/removed. */
  toggle: (isbn: string) => httpClient.post<{ added: boolean }>('/api/bookshelf/toggle', { isbn }),

  /** True if the book is currently in the shelf. */
  isInShelf: (isbn: string) =>
    httpClient.get<{ added: boolean }>(`/api/bookshelf/${isbn}/status`).then((r) => r.added),

  /** Lightweight list for form selects / autocomplete. */
  getOptions: () => httpClient.get<UserBookDTO[]>('/api/bookshelf/options'),
};
