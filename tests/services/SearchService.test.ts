// File: tests/services/SearchService.test.ts
import { SearchService } from '@services/SearchService';
import type { UserDTO } from '@dto/user.dto';
import type { BookDTO } from '@dto/book.dto';

describe('SearchService', () => {
  const sampleUser: UserDTO = {
    username: 'bob',
    name: 'Bob',
    avatarUrl: '/avatars/bob.png',
    bio: 'Loves books',
    followerCount: 2,
    followingCount: 1,
    followerUsernames: ['u1'],
    followingUsernames: ['u2'],
  };

  const sampleBook: BookDTO = {
    isbn: 'isbn-xyz',
    title: 'My Book',
    author: 'Alice',
    coverUrl: '/covers/xyz.jpg',
    publisher: 'PubCo',
    edition: 1,
    pages: 150,
    language: 'EN',
    publicationDate: '2020-10-10',
    external: true,
  };

  it('searchUsers("") retorna [] sem chamar api', async () => {
    const res = await SearchService.searchUsers('');
    expect(res).toEqual([]);
    expect((global.fetch as jest.Mock).mock.calls.length).toBe(0);
  });

  it('searchUsers chama endpoint e retorna UserDTO[]', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse([sampleUser]),
    );
    const res = await SearchService.searchUsers('bob', 10);
    expect(res).toEqual([sampleUser]);
  });

  it('searchBooks("") retorna [] sem chamar api', async () => {
    const res = await SearchService.searchBooks('');
    expect(res).toEqual([]);
  });

  it('searchBooks chama endpoint e retorna BookDTO[]', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse([sampleBook]),
    );
    await SearchService.searchBooks('query', 5);
    const [url] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toMatch(/^\/api\/openLibrary\?q=query&limit=5/);
  });

  it('search delega corretamente entre aba "users" e "books"', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse([sampleUser]),
    );
    const users = await SearchService.search('bob', 'users');
    expect(users).toEqual([sampleUser]);

    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse([sampleBook]),
    );
    const books = await SearchService.search('hello', 'books');
    expect(books).toEqual([sampleBook]);
  });
});
