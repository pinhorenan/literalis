// File: tests/services/PostService.test.ts
import { PostService }  from '@/src/lib/services/postService';
import type { PostDTO } from '@models/post.dto';
import type { UserDTO } from '@models/user.dto';
import type { BookDTO } from '@models/book.dto';
import type { CommentDTO } from '@models/comment.dto';

describe('PostService', () => {
  const sampleUser: UserDTO = {
    username: 'u1',
    name: 'User One',
    avatarUrl: '/avatars/u1.png',
    bio: 'Author bio',
    followerCount: 5,
    followingCount: 2,
    followerUsernames: ['u2'],
    followingUsernames: ['u3'],
  };

  const sampleBook: BookDTO = {
    isbn: 'isbn-123',
    title: 'Sample Book',
    author: 'Jane Doe',
    coverUrl: '/covers/isbn-123.jpg',
    publisher: 'Acme',
    edition: 1,
    pages: 100,
    language: 'EN',
    publicationDate: '2022-01-01',
    external: false,
  };

  const sampleComment: CommentDTO = {
    id: 'c1',
    content: 'Nice post',
    createdAt: '2025-06-20T00:00:00Z',
    updatedAt: '2025-06-20T00:00:00Z',
    likeCount: 0,
    likedByMe: false,
    author: sampleUser,
  };

  const samplePost: PostDTO = {
    id: 'p1',
    content: 'Hello world',
    progress: 10,
    createdAt: '2025-06-20T00:00:00Z',
    updatedAt: '2025-06-20T00:00:00Z',
    likeCount: 2,
    commentCount: 1,
    likedByMe: false,
    isFollowingAuthor: true,
    isInMyBookshelf: false,
    author: sampleUser,
    book: sampleBook,
    commentsPreview: [sampleComment],
  };

  it('create envia { bookIsbn, excerpt, progress } e retorna PostDTO completo', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse(samplePost),
    );

    await PostService.create(sampleBook.isbn, 'Hello world', 10);
    const [, opts] = (global.fetch as jest.Mock).mock.calls[0];

    expect(JSON.parse(opts.body as string)).toEqual({
      bookIsbn: sampleBook.isbn,
      excerpt: 'Hello world',
      progress: 10,
    });
  });

  it('get retorna PostDTO completo', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse(samplePost),
    );
    const res = await PostService.get('p1');
    expect(res).toEqual(samplePost);
  });

  it('update retorna PostDTO com novo progress', async () => {
    const updated = { ...samplePost, progress: 20 };
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse(updated),
    );
    const res = await PostService.update('p1', { progress: 20 });
    expect(res.progress).toBe(20);
  });

  it('delete retorna { deleted: boolean }', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse({ deleted: true }),
    );
    const res = await PostService.delete('p1');
    expect(res.deleted).toBe(true);
  });

  it('toggleLike retorna likeCount e likedByMe', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse({ likeCount: 3, likedByMe: true }),
    );
    const res = await PostService.toggleLike('p1');
    expect(res.likeCount).toBe(3);
    expect(res.likedByMe).toBe(true);
  });

  it('addComment retorna CommentDTO completo', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse(sampleComment),
    );
    const res = await PostService.addComment('p1', 'Nice post');
    expect(res).toEqual(sampleComment);
  });

  it('comments retorna CommentDTO[]', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse([sampleComment]),
    );
    const res = await PostService.comments('p1', 5, 'cur');
    expect(res).toEqual([sampleComment]);
  });

  it('updateComment retorna CommentDTO atualizado', async () => {
    const edited = { ...sampleComment, content: 'Edited' };
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse(edited),
    );
    const res = await PostService.updateComment('p1', 'c1', 'Edited');
    expect(res.content).toBe('Edited');
  });

  it('deleteComment retorna { deleted: boolean }', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse({ deleted: true }),
    );
    const res = await PostService.deleteComment('p1', 'c1');
    expect(res.deleted).toBe(true);
  });

describe('PostService – cobertura de comments defaults', () => {
  const sampleComment: CommentDTO = {
    id: 'c1',
    content: 'Nice post',
    createdAt: '2025-06-20T00:00:00Z',
    updatedAt: '2025-06-20T00:00:00Z',
    likeCount: 0,
    likedByMe: false,
    author: {
      username: 'u1',
      name: 'User One',
      avatarUrl: '/avatars/u1.png',
      bio: 'bio',
      followerCount: 0,
      followingCount: 0,
      followerUsernames: [],
      followingUsernames: [],
    },
  };

  it('comments sem args usa limit=20 e sem cursor', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse([sampleComment]),
    );
    await PostService.comments('p1');
    const [url] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/posts/p1/comments?limit=20');
  });

  it('comments com cursor e default de limit', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      global.__createFetchResponse([sampleComment]),
    );
    await PostService.comments('p1', undefined, 'cur2');
    const [url] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/posts/p1/comments?limit=20&cursor=cur2');
  });
});

});


