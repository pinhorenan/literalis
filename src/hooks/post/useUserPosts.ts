// src/hooks/post/useUserPosts.ts
import useSWR from 'swr';
import { fetchPosts } from '@services/client/post.service';

export default function useUserPosts(username: string) {
  const { data, error, isLoading } = useSWR(['posts-user', username], () =>
    fetchPosts({ authorUsername: username })
  );

  return {
    posts: data ?? [],
    error,
    isLoading,
  };
}
