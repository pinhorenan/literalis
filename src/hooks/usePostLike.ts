// src/hooks/usePostLike.ts
import { useCallback } from 'react';
import useSWR from 'swr';
import { PostService } from '@/src/lib/services/postService';

export default function usePostLike(
  postId: string,
  initialLiked: boolean,
  initialCount: number
) {
  const { data, mutate, isValidating } = useSWR(
    ['postLike', postId],
    () => Promise.resolve({ liked: initialLiked, count: initialCount }),
    { fallbackData: { liked: initialLiked, count: initialCount } }
  );

  const toggleLike = useCallback(async () => {
    if (!postId) return;
    const optimistic = { liked: !data!.liked, count: data!.liked ? data!.count - 1 : data!.count + 1 };
    mutate(optimistic, false);
    try {
      const res = await PostService.toggleLike(postId);
      mutate({ liked: res.likedByMe, count: res.likeCount }, false);
    } catch {
      mutate(); // rollback
    }
  }, [postId, data, mutate]);

  return { liked: data!.liked, likeCount: data!.count, loading: isValidating, toggleLike };
}
