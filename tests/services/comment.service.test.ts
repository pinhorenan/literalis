import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@repositories/post.repository', () => ({
  postRepository: { findById: vi.fn() },
}));
vi.mock('@repositories/comment.repository', () => ({
  commentRepository: {
    create: vi.fn(),
    findById: vi.fn(),
    findByPost: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));
vi.mock('@repositories/commentLike.repository', () => ({
  commentLikeRepository: { findByComment: vi.fn() },
}));
vi.mock('@repositories/user.repository', () => ({
  userRepository: { findByUsername: vi.fn() },
}));

import { CommentService } from '@services/comment.service';
import { postRepository } from '@repositories/post.repository';
import { commentRepository } from '@repositories/comment.repository';
import { commentLikeRepository } from '@repositories/commentLike.repository';
import { userRepository } from '@repositories/user.repository';
import { NotificationService } from '@services/notification.service';

describe('CommentService', () => {
  let svc: CommentService;
  const postId = 'p1';
  const commentId = 'c1';
  const author = 'alice';
  const now = new Date();
  const rawPost = { id: postId, authorUsername: 'bob' } as any;
  const rawComment = {
    id: commentId,
    postId,
    authorUsername: author,
    content: 'c',
    createdAt: now,
    updatedAt: now,
  } as any;
  const user = { username: author, name: 'A', avatarUrl: '' } as any;

  const pRepo = vi.mocked(postRepository, true);
  const cRepo = vi.mocked(commentRepository, true);
  const clRepo = vi.mocked(commentLikeRepository, true);
  const uRepo = vi.mocked(userRepository, true);

  beforeEach(() => {
    svc = new CommentService();
    vi.clearAllMocks();
  });

  it('throws if post not found', async () => {
    pRepo.findById.mockResolvedValueOnce(null);
    await expect(svc.addComment(postId, author, 'x')).rejects.toThrow('Post não encontrado');
  });

  it('creates comment and notifies', async () => {
    pRepo.findById.mockResolvedValueOnce(rawPost);
    cRepo.create.mockResolvedValueOnce(rawComment);
    vi.spyOn(NotificationService.prototype, 'notifyComment').mockResolvedValueOnce();
    uRepo.findByUsername.mockResolvedValueOnce(user);

    const dto = await svc.addComment(postId, author, 'hi');
    expect(dto.id).toBe(commentId);
    expect(NotificationService.prototype.notifyComment).toHaveBeenCalledWith(
      rawPost.authorUsername,
      author,
      postId,
    );
  });

  it('throws if not found or wrong author', async () => {
    cRepo.findById.mockResolvedValueOnce(null);
    await expect(svc.editComment(commentId, author, 'x')).rejects.toThrow(
      'Comentário não encontrado',
    );
    cRepo.findById.mockResolvedValueOnce({ ...rawComment, authorUsername: 'bob' });
    await expect(svc.editComment(commentId, author, 'x')).rejects.toThrow(
      'Comentário não encontrado',
    );
  });

  it('updates and returns DTO', async () => {
    cRepo.findById.mockResolvedValueOnce(rawComment);
    cRepo.update.mockResolvedValueOnce({ ...rawComment, content: 'upd' } as any);
    uRepo.findByUsername.mockResolvedValueOnce(user);

    const dto = await svc.editComment(commentId, author, 'upd');
    expect(dto.content).toBe('upd');
  });

  it('throws if comment or post missing', async () => {
    cRepo.findById.mockResolvedValueOnce(null);
    await expect(svc.deleteComment(commentId, author)).rejects.toThrow('Comentário não encontrado');
    cRepo.findById.mockResolvedValueOnce(rawComment);
    pRepo.findById.mockResolvedValueOnce(null);
    await expect(svc.deleteComment(commentId, author)).rejects.toThrow('Post não encontrado');
  });

  it('throws if no permission', async () => {
    cRepo.findById.mockResolvedValueOnce(rawComment);
    pRepo.findById.mockResolvedValueOnce({ authorUsername: 'someone' } as any);
    await expect(svc.deleteComment(commentId, 'other')).rejects.toThrow(
      'Sem permissão para excluir',
    );
  });

  it('deletes if author or post-owner', async () => {
    cRepo.findById.mockResolvedValueOnce(rawComment);
    pRepo.findById.mockResolvedValueOnce({ authorUsername: author } as any);
    await svc.deleteComment(commentId, author);
    expect(cRepo.delete).toHaveBeenCalledWith(commentId);
  });

  it('sorts and maps comments + likes', async () => {
    const older = { ...rawComment, createdAt: new Date(1) };
    const newer = { ...rawComment, id: 'c2', createdAt: new Date(2) };
    cRepo.findByPost.mockResolvedValueOnce([newer, older]);
    clRepo.findByComment.mockResolvedValueOnce([
      { userUsername: author, createdAt: now, commentId: 'c1' } as any,
    ]);
    uRepo.findByUsername.mockResolvedValueOnce(user);
    uRepo.findByUsername.mockResolvedValueOnce(user);

    const out = await svc.listComments(postId, 2);
    expect(out.map((c) => c.id)).toEqual(['c2', 'c1']);
    expect(clRepo.findByComment).toHaveBeenCalledWith('c1', 20);
  });
});
