// src/hooks/post/useFeedPosts.ts
'use client';

import useSWR from 'swr';
import { PostService } from '@services/server/post.service';
import type { PostDTO } from '@models/post.dto';

interface FeedOptions {
  onlyFollowing: boolean;
  limit?: number;
  fallbackData?: PostDTO[];
}

export default function useFeedPosts({ onlyFollowing, limit = 20, fallbackData }: FeedOptions) {
  const { data, error, isLoading } = useSWR<PostDTO[]>(
    ['feed', onlyFollowing, limit],
    () => PostService.getMany({ onlyFollowing, take: limit }),
    {
      fallbackData,
      revalidateOnFocus: false,
    }
  );

  return { posts: data ?? [], error, isLoading };
}
