// File: src/components/client/ui/FollowButton.tsx
'use client';

import React, { useState } from 'react';
import useFollow  from '@hooks/useFollow';
import { Users }  from 'lucide-react';
import { Button } from '@components/client/ui/Buttons';

interface FollowButtonProps {
  targetUsername: string;
  initialFollowing?: boolean;
  onToggle?: (nowFollowing: boolean) => void;
  className?: string;
}

export default function FollowButton({
  targetUsername,
  initialFollowing = false,
  onToggle,
  className = '',
}: FollowButtonProps) {
  const [hover, setHover] = useState(false);
  const { following, toggleFollow, loading, loggedIn } = useFollow(targetUsername, initialFollowing);

  const handleToggle = async () => {
    const newFollowing = !following;
    await toggleFollow();
    onToggle?.(newFollowing);
  };

  const label = following ? (hover ? 'Deixar de seguir' : 'Seguindo') : 'Seguir';

  return (
    <Button
      size="sm"
      onClick={handleToggle}
      disabled={!loggedIn || loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      variant="default"
      className={`flex gap-1 ${className}`}
    >
      <Users size={16} /> {label}
    </Button>
  );
}
