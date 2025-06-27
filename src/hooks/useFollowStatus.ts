import { useState } from 'react';
import { toggleFollow } from '@clients/follow.client';
import { useFollowContext } from '@/src/contexts/followContext';

export default function useFollowStatus(
  targetUsername: string,
  _initialFollowers?: number,
  _initialFollowing?: number,
  initialIsFollowing = false,
) {
  const { getFollow, setFollow } = useFollowContext();
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    getFollow(targetUsername) ?? initialIsFollowing,
  );

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await toggleFollow(targetUsername);
      setIsFollowing(res.following);
      setFollow(targetUsername, res.following);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { isFollowing, loading, toggleFollow: handleToggle };
}
