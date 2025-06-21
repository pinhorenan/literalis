// File: src/services/SearchService.ts

import { httpClient } from '@services/HTTPClient';
import type { UserDTO } from '@dto/user.dto';
import type { BookDTO } from '@dto/book.dto';

export const SearchService = {
  searchUsers: (query: string, limit = 20) =>
    query ? httpClient.get<UserDTO[]>('/api/search', { params: { tab: 'users', q: query, limit } }) : Promise.resolve([]),

  searchBooks: (query: string, limit = 20) =>
    query
      ? httpClient.get<BookDTO[]>('/api/openlibrary', { params: { q: query, limit } })
      : Promise.resolve([]),

  /** Helper that delegates to the correct tab according to caller. */
  search: (query: string, tab: 'books' | 'users', limit = 20) =>
    tab === 'users' ? SearchService.searchUsers(query, limit) : SearchService.searchBooks(query, limit),
};