// File: src/services/FeedService.ts
import { httpClient } from '@services/HTTPClient';
import type { FeedResponse } from '@dto/feed.dto';

export const FeedService = {
  /**
   * Fetch timeline items.
   * • mode: 'discover' | 'friends' (optional if username defined)
   * • username: feed of a specific user
   * • limit + cursor for pagination
   */
  fetch: ({mode,username,limit = 20,cursor,}: { mode?: 'discover' | 'friends'; username?: string; limit?: number; cursor?: string; }): Promise<FeedResponse> =>
    httpClient.get<FeedResponse>('/api/feed', {
      params: { mode, user: username, limit, cursor },
    }),

  /** Alias para fetch, usado pelo client component */
  getFeed: ({
    mode,
    username,
    limit = 20,
    cursor,
  }: {
    mode?: 'discover' | 'friends';
    username?: string;
    limit?: number;
    cursor?: string;
  }): Promise<FeedResponse> =>
    FeedService.fetch({ mode, username, limit, cursor }),
};
