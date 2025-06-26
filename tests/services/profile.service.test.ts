import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';

// -- mocks --------------------------------------------------------------------
vi.mock('@repositories/user.repository', () => ({
  userRepository: { findByUsername: vi.fn() },
}));
vi.mock('@repositories/post.repository', () => ({
  postRepository: { findByAuthor: vi.fn() },
}));
vi.mock('@repositories/book.repository', () => ({
  bookRepository: { findByIsbn: vi.fn() },
}));
vi.mock('@repositories/comment.repository', () => ({
  commentRepository: { findByPost: vi.fn() },
}));
vi.mock('@repositories/commentLike.repository', () => ({
  commentLikeRepository: { findByComment: vi.fn() },
}));
vi.mock('@repositories/postLike.repository', () => ({
  postLikeRepository: { findByPost: vi.fn() },
}));
vi.mock('@repositories/follow.repository', () => ({
  followRepository: { findFollowers: vi.fn(), findFollowing: vi.fn() },
}));
vi.mock('@repositories/bookshelf.repository', () => ({
  bookshelfRepository: { findPublicByOwner: vi.fn() },
}));

// -- imports após mocks -------------------------------------------------------
import { ProfileService } from '@services/profile.service';
import { userRepository } from '@repositories/user.repository';
import { postRepository } from '@repositories/post.repository';
import { bookRepository } from '@repositories/book.repository';
import { commentRepository } from '@repositories/comment.repository';
import { commentLikeRepository } from '@repositories/commentLike.repository';
import { postLikeRepository } from '@repositories/postLike.repository';
import { followRepository } from '@repositories/follow.repository';
import { bookshelfRepository } from '@repositories/bookshelf.repository';

describe('ProfileService', () => {
  let svc: ProfileService;
  const username = 'alice';
  const now = new Date();

  const user = {
    username,
    name: 'A',
    avatarUrl: '',
    bio: '',
    createdAt: now,
    updatedAt: now,
  } as any;
  const book = {
    isbn: 'b1',
    title: 'X',
    pages: 100,
    author: '',
    publisher: '',
    edition: 1,
    language: '',
    publicationDate: now,
    coverUrl: '',
    external: false,
  } as any;
  const post = {
    id: 'p1',
    content: 'c',
    currentPage: 10,
    totalPages: 100,
    rating: 5,
    createdAt: now,
    updatedAt: now,
    authorUsername: username,
    bookIsbn: book.isbn,
  } as any;
  const comment = {
    id: 'c1',
    content: 'o',
    createdAt: now,
    updatedAt: now,
    authorUsername: 'bob',
  } as any;
  const fRec = { followerUsername: 'x' } as any;
  const gRec = { followedUsername: 'y' } as any;
  const entry = {
    ownerUsername: username,
    bookIsbn: book.isbn,
    currentPage: 0,
    status: 'TO_READ',
    isPrivate: false,
    addedAt: now,
    updatedAt: now,
    removedAt: null,
    rating: null,
  } as any;

  beforeEach(() => {
    svc = new ProfileService();
    vi.clearAllMocks();
  });

  it('monta o PublicProfileDTO completo', async () => {
    (userRepository.findByUsername as Mock).mockResolvedValueOnce(user);

    (postRepository.findByAuthor as Mock).mockResolvedValueOnce([post]);
    (bookRepository.findByIsbn as Mock).mockResolvedValueOnce(book);
    (commentRepository.findByPost as Mock).mockResolvedValueOnce([comment]);
    (userRepository.findByUsername as Mock).mockResolvedValueOnce({
      username: 'bob',
      name: 'B',
      avatarUrl: '',
    });
    (commentLikeRepository.findByComment as Mock).mockResolvedValueOnce([
      { userUsername: 'bob', createdAt: now, commentId: comment.id },
    ]);
    (userRepository.findByUsername as Mock).mockResolvedValueOnce({
      username: 'bob',
      name: 'B',
      avatarUrl: '',
    });
    (postLikeRepository.findByPost as Mock).mockResolvedValueOnce([
      { userUsername: 'y', createdAt: now, postId: post.id },
    ]);
    (userRepository.findByUsername as Mock).mockResolvedValueOnce({
      username: 'y',
      name: 'Y',
      avatarUrl: '',
    });

    (followRepository.findFollowers as Mock).mockResolvedValueOnce([fRec]);
    (userRepository.findByUsername as Mock).mockResolvedValueOnce({
      username: 'x',
      name: 'X',
      avatarUrl: '',
    });
    (followRepository.findFollowing as Mock).mockResolvedValueOnce([gRec]);
    (userRepository.findByUsername as Mock).mockResolvedValueOnce({
      username: 'y',
      name: 'Y',
      avatarUrl: '',
    });

    (bookshelfRepository.findPublicByOwner as Mock).mockResolvedValueOnce([entry]);
    (bookRepository.findByIsbn as Mock).mockResolvedValueOnce(book);

    const profile = await svc.getPublicProfile(username);
    expect(profile).toMatchObject({
      user: { username },
      posts: [{ id: 'p1' }],
      followers: [{ username: 'x' }],
      following: [{ username: 'y' }],
      bookshelfEntries: [{ book: { isbn: 'b1' } }],
    });
  });

  it('lança se usuário não existe', async () => {
    (userRepository.findByUsername as Mock).mockResolvedValueOnce(null);

    await expect(svc.getPublicProfile(username)).rejects.toThrow('Usuário não encontrado');
  });
});
