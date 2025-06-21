// src/hooks/useFeed.ts
import useSWRInfinite from 'swr/infinite';
import { FeedService } from '@services/FeedService';
import type { PostDTO } from '@models/post.dto';

export default function useFeed(mode: 'discover' | 'friends', limit = 20) {
  const getKey = (pageIndex: number, prev: PostDTO[] | null) => {
    if (prev && prev.length < limit) return null; // reached end
    const cursor = pageIndex === 0 ? undefined : prev?.[prev.length - 1]?.createdAt;
    return ['feed', mode, limit, cursor ?? 'start'];
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    (_: any, mode: any,) => FeedService.getFeed(mode)
  );

  const posts = data ? data.flatMap(f => f.posts) : [];
  const loadMore = () => setSize(size + 1);

  return { posts, loading: isLoading, error, loadMore, hasMore: !error && (data?.[data.length - 1]?.posts.length === limit) };
}
