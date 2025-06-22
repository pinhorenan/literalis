// src/components/client/ui/FollowButton.tsx
'use client';

import React, { useState } from 'react';
import { Users }  from 'lucide-react';
import { Button } from '@components/client/ui/Buttons';
import useFollowStatus from '@hooks/useFollowStatus';

interface FollowButtonProps {
  targetUsername: string;
  className?: string;
}

export default function FollowButton({
  targetUsername,
  className = '',
}: FollowButtonProps) {
  const [hover, setHover] = useState(false);
  
  const { 
    isFollowing, 
    toggleFollow,
  } = useFollowStatus(
    targetUsername,
    0,
    0,
    false
  );

  const label = isFollowing ? hover ? 'Deixar de seguir' : 'Seguindo' : 'Seguir';
  
  return (
    <Button
      size="sm"
      onClick={toggleFollow}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      variant="default"
      className={`flex gap-1 ${className}`}
    >
      <Users size={16} /> {label}
    </Button>
  );
}
