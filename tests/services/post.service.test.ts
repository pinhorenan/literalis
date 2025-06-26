import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@repositories/bookshelf.repository', () => ({
  bookshelfRepository: { findByOwnerAndBook: vi.fn(), update: vi.fn() },
}));
vi.mock('@repositories/book.repository', () => ({
  bookRepository: { findByIsbn: vi.fn() },
}));
vi.mock('@repositories/post.repository', () => ({
  postRepository: {
    create: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findByAuthors: vi.fn(),
    findExcludingAuthors: vi.fn(),
  },
}));
vi.mock('@repositories/user.repository', () => ({
  userRepository: { findByUsername: vi.fn() },
}));
vi.mock('@repositories/follow.repository', () => ({
  followRepository: { findFollowing: vi.fn() },
}));
vi.mock('@services/like.service', () => ({
  LikeService: class {
    listPostLikes = vi.fn().mockResolvedValue([]);
  },
}));

import { PostService } from '@services/post.service';
import { bookshelfRepository } from '@repositories/bookshelf.repository';
import { bookRepository } from '@repositories/book.repository';
import { postRepository } from '@repositories/post.repository';
import { userRepository } from '@repositories/user.repository';
import { followRepository } from '@repositories/follow.repository';

describe('PostService', () => {
  let svc: PostService;
  const author = 'alice';
  const isbn = 'ISBN1';
  const postId = 'p1';
  const now = new Date();

  const entry = { ownerUsername: author, bookIsbn: isbn, currentPage: 1 } as any;
  const book = { isbn, pages: 100 } as any;
  const rawPost = {
    id: postId,
    authorUsername: author,
    bookIsbn: isbn,
    content: 'c',
    currentPage: 50,
    totalPages: 100,
    progress: 50,
    rating: 5,
    createdAt: now,
    updatedAt: now,
  } as any;

  const bsRepo = vi.mocked(bookshelfRepository, true);
  const bRepo = vi.mocked(bookRepository, true);
  const pRepo = vi.mocked(postRepository, true);
  const uRepo = vi.mocked(userRepository, true);
  const fRepo = vi.mocked(followRepository, true);

  beforeEach(() => {
    svc = new PostService();
    vi.clearAllMocks();
  });

  it('throws if entry not found', async () => {
    bsRepo.findByOwnerAndBook.mockResolvedValueOnce(null);
    await expect(
      svc.createPost({ authorUsername: author, bookIsbn: isbn, content: 'c', currentPage: 10 }),
    ).rejects.toThrow('Entrada de estante não encontrada');
  });

  it('throws if book not found', async () => {
    bsRepo.findByOwnerAndBook.mockResolvedValueOnce(entry);
    bRepo.findByIsbn.mockResolvedValueOnce(null);
    await expect(
      svc.createPost({ authorUsername: author, bookIsbn: isbn, content: 'c', currentPage: 10 }),
    ).rejects.toThrow('Livro não encontrado');
  });

  it('throws if currentPage > pages', async () => {
    bsRepo.findByOwnerAndBook.mockResolvedValueOnce(entry);
    bRepo.findByIsbn.mockResolvedValueOnce({ ...book, pages: 5 });
    await expect(
      svc.createPost({ authorUsername: author, bookIsbn: isbn, content: 'c', currentPage: 10 }),
    ).rejects.toThrow('Página atual excede total de páginas');
  });

  it('creates, updates shelf and returns DTO', async () => {
    bsRepo.findByOwnerAndBook.mockResolvedValueOnce(entry);
    bRepo.findByIsbn.mockResolvedValueOnce(book);
    pRepo.create.mockResolvedValueOnce(rawPost);
    bsRepo.update.mockResolvedValueOnce({} as any);
    uRepo.findByUsername.mockResolvedValueOnce({ username: author } as any);

    const dto = await svc.createPost({
      authorUsername: author,
      bookIsbn: isbn,
      content: 'c',
      currentPage: 50,
      rating: 5,
    });
    expect(dto.id).toBe(postId);
    expect(dto.progress).toBe(50);
    expect(bsRepo.update).toHaveBeenCalledWith(author, isbn, {
      currentPage: 50,
      rating: 5,
      status: 'READING',
    });
  });

  it('throws if post not found or wrong author', async () => {
    pRepo.findById.mockResolvedValueOnce(null);
    await expect(svc.editPost(postId, author, {})).rejects.toThrow('Post não encontrado');
    pRepo.findById.mockResolvedValueOnce({ id: postId, authorUsername: 'bob' } as any);
    await expect(svc.editPost(postId, author, {})).rejects.toThrow('Post não encontrado');
  });

  it('throws if book not found', async () => {
    const post = { id: postId, authorUsername: author, bookIsbn: isbn, progress: 0 } as any;
    pRepo.findById.mockResolvedValueOnce(post);
    bRepo.findByIsbn.mockResolvedValueOnce(null);
    await expect(svc.editPost(postId, author, {})).rejects.toThrow('Livro não encontrado');
  });

  it('throws if currentPage > pages', async () => {
    const post = { id: postId, authorUsername: author, bookIsbn: isbn, progress: 0 } as any;
    pRepo.findById.mockResolvedValueOnce(post);
    bRepo.findByIsbn.mockResolvedValueOnce({ pages: 5 } as any);
    await expect(svc.editPost(postId, author, { currentPage: 10 })).rejects.toThrow(
      'Página excede total de páginas',
    );
  });

  it('updates and returns DTO', async () => {
    const post = { id: postId, authorUsername: author, bookIsbn: isbn, progress: 0 } as any;
    const updated = { ...post, content: 'x', currentPage: 5, progress: 5 } as any;
    pRepo.findById.mockResolvedValueOnce(post);
    bRepo.findByIsbn.mockResolvedValueOnce(book);
    pRepo.update.mockResolvedValueOnce(updated);
    uRepo.findByUsername.mockResolvedValueOnce({ username: author } as any);

    const dto = await svc.editPost(postId, author, { content: 'x', currentPage: 5 });
    expect(dto.content).toBe('x');
    expect(dto.currentPage).toBe(5);
  });

  it('deletes when valid', async () => {
    pRepo.findById.mockResolvedValueOnce({ id: postId, authorUsername: author } as any);
    await svc.deletePost(postId, author);
    expect(pRepo.delete).toHaveBeenCalledWith(postId);
  });

  it('returns empty if no following', async () => {
    fRepo.findFollowing.mockResolvedValueOnce([]);
    await expect(svc.feedFriends(author)).resolves.toEqual([]);

    pRepo.findExcludingAuthors.mockResolvedValueOnce([]);
    await expect(svc.feedDiscover(author)).resolves.toEqual([]);
  });

  it('builds feed via private buildPostDTO', async () => {
    fRepo.findFollowing.mockResolvedValueOnce([{ followedUsername: 'u' }] as any);
    vi.spyOn(PostService.prototype as any, 'buildPostDTO').mockResolvedValueOnce({
      foo: 'bar',
    } as any);
    pRepo.findByAuthors.mockResolvedValueOnce([{ id: 'x' }] as any);

    const out = await svc.feedFriends(author, 5, 'cur');
    expect(out).toEqual([{ foo: 'bar' }]);
    expect((PostService.prototype as any).buildPostDTO).toHaveBeenCalledWith({ id: 'x' }, author);
  });
});
