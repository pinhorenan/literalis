// src/hooks/useFollowStatus.ts
import { useState, useCallback } from 'react';
import { FollowService } from '@services/FollowService';

export default function useFollowStatus(
  username: string,
  initialFollowerCount: number,
  initialFollowing: boolean
) {
  const [isFollowing, setIsFollowing]   = useState(initialFollowing);
  const [followerCount, setFollowerCnt] = useState(initialFollowerCount);
  const [loading, setLoading]           = useState(false);

  const toggleFollow = useCallback(async () => {
    setLoading(true);
    try {
      const res = await FollowService.toggle(username);
      setIsFollowing(res.isFollowing);
      setFollowerCnt(res.followerCount);
    } finally {
      setLoading(false);
    }
  }, [username]);

  return { isFollowing, followerCount, loading, toggleFollow };
}
