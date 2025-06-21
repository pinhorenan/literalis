// File: tests/FollowService.test.ts
import { FollowService } from '@/src/lib/services/FollowService';

describe('FollowService', () => {
  it('toggle segue/deixade seguir', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ isFollowing: true, followerCount: 2 }),
    );
    const res = await FollowService.toggle('alice');
    expect(res.isFollowing).toBe(true);
  });

  it('isFollowing devolve boolean', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({ isFollowing: false }),
    );
    expect(await FollowService.isFollowing('alice')).toBe(false);
  });

  it('followers paginação', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse([{ username: 'u1' }]),
    );
    await FollowService.followers('alice', 2, 10);
    const [url] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/users/alice/followers?page=2&limit=10');
  });

  it('following paginação', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse([{ username: 'u1' }]),
    );
    await FollowService.following('bob');
    const [url] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/users/bob/following?page=1&limit=20');
  });

  it('followers usa defaults page=1 e limit=20 quando não passo args', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse([{ username: 'u1' }]),
    );
    await FollowService.followers('alice');
    const [url] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/users/alice/followers?page=1&limit=20');
  });
  
  it('following permite paginação customizada', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse([{ username: 'u2' }]),
    );
    await FollowService.following('bob', 3, 5);
    const [url] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/users/bob/following?page=3&limit=5');
  });
});
