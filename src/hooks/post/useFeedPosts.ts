import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { feedDiscover, feedFriends } from '@clients/post.client';
import type { PostDTO } from '@models/post.model';

interface Params {
  onlyFollowing: boolean;
  limit: number;
  fallbackData?: PostDTO[];
}

export default function useFeedPosts({
  onlyFollowing,
  limit,
  fallbackData,
}: Params) {
  const key = ['feed', onlyFollowing ? 'friends' : 'discover', limit] as const;

  return useQuery<PostDTO[], Error, PostDTO[], typeof key>({
    queryKey: key,
    queryFn: () =>
      onlyFollowing ? feedFriends(limit) : feedDiscover(limit),
    initialData: fallbackData,
    staleTime: 1000 * 60 * 2,
  });
}
