// tests/FeedService.test.ts
import { FeedService } from '@/src/services/FeedService';

describe('FeedService', () => {
  it('fetch padrão', async () => {
    const payload = { items: [], nextCursor: null };
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse(payload),
    );

    const res = await FeedService.fetch({});
    expect(res).toEqual(payload);
    const [url] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/feed?limit=20');
  });

  it('fetch com todos parâmetros', async () => {
    (global.fetch as any).mockResolvedValue(
      global.__createFetchResponse({}),
    );

    await FeedService.fetch({
      mode: 'friends',
      username: 'bob',
      limit: 5,
      cursor: 'abc',
    });

    const [url] = (global.fetch as any).mock.calls[0];
    expect(url).toBe('/api/feed?mode=friends&user=bob&limit=5&cursor=abc');
  });
});
