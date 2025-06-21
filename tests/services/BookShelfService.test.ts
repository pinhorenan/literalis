// File: tests/services/BookshelfService.test.ts
import { BookshelfService } from '@services/BookshelfService';
import type { UserBookDTO } from '@dto/userBook.dto';
import type { UserDTO } from '@dto/user.dto';
import type { BookDTO } from '@dto/book.dto';

describe('BookshelfService', () => {
  // Exemplo de DTOs baseados nos seus modelos
  const sampleUser: UserDTO = {
    username: 'user1',
    name: 'User One',
    avatarUrl: '/avatars/user1.png',
    bio: 'Avid reader',
    followerCount: 10,
    followingCount: 5,
    followerUsernames: ['user2', 'user3'],
    followingUsernames: ['user4'],
  };

  const sampleBook: BookDTO = {
    isbn: '1234567890',
    title: 'The Great Book',
    author: 'Jane Doe',
    coverUrl: '/covers/1234567890.jpg',
    publisher: 'Books Corp',
    edition: 2,
    pages: 200,
    language: 'EN',
    publicationDate: '2021-05-01',
    external: false,
  };

  const sampleEntry: UserBookDTO = {
    user: sampleUser,
    book: sampleBook,
    progressPages: 20,
    progressPct: 10,           // 20/200 * 100
    addedAt: '2025-06-20T00:00:00Z',
    updatedAt: '2025-06-21T00:00:00Z',
    status: 'READING',
    isPrivate: false,
  };

  it('list devolve array completo', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse([sampleEntry]),
    );
    const res = await BookshelfService.list();
    expect(res).toEqual([sampleEntry]);
  });

  it('get busca item específico', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse(sampleEntry),
    );
    const res = await BookshelfService.get(sampleBook.isbn);
    expect(res.book.isbn).toBe(sampleBook.isbn);
    expect(res.progressPages).toBe(20);
  });

  it('add envia POST e retorna item', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse(sampleEntry),
    );
    const res = await BookshelfService.add(sampleBook.isbn);
    expect(res.book.isbn).toBe(sampleBook.isbn);
  });

  it('remove envia DELETE e confirma remoção', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse({ removed: true }),
    );
    const res = await BookshelfService.remove(sampleBook.isbn);
    expect(res.removed).toBe(true);
  });

  it('update PATCHa progresso e retorna DTO atualizado', async () => {
    const updatedEntry: UserBookDTO = {
      ...sampleEntry,
      progressPages: 60,
      progressPct: 30,         // 60/200 * 100
    };
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse(updatedEntry),
    );

    // conforme service, update recebe { progress: number }
    const res = await BookshelfService.update(sampleBook.isbn, { progressPages: 60 });
    expect(res.progressPages).toBe(60);
    expect(res.progressPct).toBe(30);
  });

  it('toggle devolve added boolean', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse({ added: true }),
    );
    const { added } = await BookshelfService.toggle(sampleBook.isbn);
    expect(added).toBe(true);
  });

  it('isInShelf devolve boolean puro', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse({ added: false }),
    );
    const inShelf = await BookshelfService.isInShelf(sampleBook.isbn);
    expect(inShelf).toBe(false);
  });

  it('getOptions devolve lista leve', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse([sampleEntry]),
    );
    const opts = await BookshelfService.getOptions();
    expect(opts).toHaveLength(1);
    expect(opts[0].book.isbn).toBe(sampleBook.isbn);
  });
});
