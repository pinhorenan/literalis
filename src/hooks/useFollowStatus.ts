'use client';

import { useState } from 'react';
import { FollowService } from '@services/server/follow.service';
import { useFollowContext } from '@context/followContext';
import { toast } from 'react-hot-toast';

export default function useFollowStatus(
  targetUsername: string,
  initialFollowerCount: number,
  initialFollowingCount: number,
  initialIsFollowing?: boolean // agora opcional
) {
  const { getFollow, setFollow } = useFollowContext();

  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [followingCount] = useState(initialFollowingCount);

  // Resolve via contexto ou fallback inicial
  const isFollowing = getFollow(targetUsername);
  const resolvedIsFollowing = isFollowing !== undefined ? isFollowing : (initialIsFollowing ?? false);

  const toggleFollow = async () => {
    const optimistic = !resolvedIsFollowing;
    setFollow(targetUsername, optimistic);
    setFollowerCount(c => optimistic ? c + 1 : c - 1);

    try {
      await FollowService.toggleFollow(targetUsername);
    } catch {
      toast.error('Erro ao atualizar status de seguir');
      setFollow(targetUsername, !optimistic);
      setFollowerCount(c => !optimistic ? c + 1 : c - 1);
    }
  };

  return { isFollowing: resolvedIsFollowing, followerCount, followingCount, toggleFollow };
}
