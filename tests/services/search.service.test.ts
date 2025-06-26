import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';

vi.mock('@repositories/search.repository', () => ({
  searchRepository: { search: vi.fn() },
}));

import { SearchService } from '@services/search.service';
import { searchRepository } from '@repositories/search.repository';

describe('SearchService', () => {
  let svc: SearchService;
  const now = new Date();
  const user = {
    username: 'u',
    name: 'U',
    avatarUrl: '',
    bio: 'b',
    createdAt: now,
    updatedAt: now,
  } as any;
  const book = {
    isbn: 'i',
    title: 'T',
    pages: 10,
    coverUrl: '',
    author: 'A',
    publisher: '',
    edition: 1,
    language: '',
    publicationDate: now,
    external: false,
  } as any;

  beforeEach(() => {
    svc = new SearchService();
    vi.clearAllMocks();
  });

  it('returns empty when query is blank', async () => {
    await expect(svc.search('   ')).resolves.toEqual({ users: [], books: [] });
  });

  it('calls repo and maps results', async () => {
    (searchRepository.search as Mock).mockResolvedValueOnce({ users: [user], books: [book] });

    const res = await svc.search('foo', 2, 3);
    expect(searchRepository.search).toHaveBeenCalledWith('foo', 2, 3);
    expect(res.users[0]).toMatchObject({ username: 'u', bio: 'b' });
    expect(res.books[0]).toMatchObject({ isbn: 'i', title: 'T' });
  });
});
