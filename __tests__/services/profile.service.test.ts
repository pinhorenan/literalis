// src/services/profile/__tests__/profile.service.test.ts
import { bookRepository } from '@repositories/book.repository';
import { bookshelfRepository } from '@repositories/bookshelf.repository';
import { followRepository } from '@repositories/follow.repository';
import { postRepository } from '@repositories/post.repository';
import { userRepository } from '@repositories/user.repository';
import { ProfileService } from '@services/profile.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@repositories/user.repository', () => ({ userRepository: { findByUsername: vi.fn() } }));
vi.mock('@repositories/post.repository', () => ({ postRepository: { findByAuthor: vi.fn() } }));
vi.mock('@repositories/book.repository', () => ({ bookRepository: { findByIsbn: vi.fn() } }));
vi.mock('@repositories/comment.repository', () => ({ commentRepository: { findByPost: vi.fn() } }));
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

describe('ProfileService', () => {
  let service: ProfileService;
  const mockUser = {
    username: 'alice',
    name: 'Alice',
    avatarUrl: '/a.jpg',
    bio: 'Bio',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ProfileService();
  });

  it('should return empty profile on no data', async () => {
    (userRepository.findByUsername as vi.Mock).mockResolvedValue(mockUser);
    (postRepository.findByAuthor as vi.Mock).mockResolvedValue([]);
    (followRepository.findFollowers as vi.Mock).mockResolvedValue([]);
    (followRepository.findFollowing as vi.Mock).mockResolvedValue([]);
    (bookshelfRepository.findPublicByOwner as vi.Mock).mockResolvedValue([]);

    const result = await service.getPublicProfile('alice');
    expect(result.user.username).toBe('alice');
    expect(result.posts).toEqual([]);
    expect(result.followers).toEqual([]);
    expect(result.following).toEqual([]);
    expect(result.bookshelfEntries).toEqual([]);
  });

  it('should throw if user not found', async () => {
    (userRepository.findByUsername as vi.Mock).mockResolvedValue(null);
    await expect(service.getPublicProfile('bob')).rejects.toThrow('Usuário não encontrado');
  });

  it('should throw if a book in a post is not found', async () => {
    (userRepository.findByUsername as vi.Mock).mockResolvedValue(mockUser);
    const rawPost = {
      id: 'p1',
      bookIsbn: 'isbn1',
      content: '',
      currentPage: 1,
      progress: 10,
      totalPages: 100,
      rating: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorUsername: 'alice',
    };
    (postRepository.findByAuthor as vi.Mock).mockResolvedValue([rawPost as any]);
    (bookRepository.findByIsbn as vi.Mock).mockResolvedValue(null);
    await expect(service.getPublicProfile('alice')).rejects.toThrow('Livro isbn1 não encontrado');
  });
});
