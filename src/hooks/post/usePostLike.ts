'use client';

import { useState } from 'react';
import { toggleLikeRequest } from '@services/client/post.service';
import { toast } from 'react-hot-toast';

export default function usePostLike(postId: string, initialLiked: boolean, initialCount: number) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    setLoading(true);
    const optimistic = !liked;
    setLiked(optimistic);
    setLikeCount(c => optimistic ? c + 1 : c - 1);

    try {
      const { liked: confirmed, likeCount: newCount } = await toggleLikeRequest(postId);
      setLiked(confirmed);
      setLikeCount(newCount);
    } catch (err) {
      toast.error('Erro ao curtir post');
      setLiked(!optimistic);
      setLikeCount(c => !optimistic ? c + 1 : c - 1);
    } finally {
      setLoading(false);
    }
  }

  return { liked, likeCount, toggleLike, loading };
}
