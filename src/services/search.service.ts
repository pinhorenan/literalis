// src/services/search.service.ts
import { searchRepository } from '@repositories/search.repository';

import { mapBookToDTO } from '@models/book.model';
import { SearchResultDTO } from '@models/search-result.model';
import { mapUserToDTO } from '@models/user.model';

export class SearchService {
  /**
   * GET /api/search?query=
   */
  async search(query: string, userLimit = 20, bookLimit = 20): Promise<SearchResultDTO> {
    if (!query.trim()) return { users: [], books: [] };

    const { users, books } = await searchRepository.search(query, userLimit, bookLimit);

    return {
      users: users.map(mapUserToDTO),
      books: books.map(mapBookToDTO),
    };
  }
}
