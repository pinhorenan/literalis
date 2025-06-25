// src/contexts/followContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

type FollowState = { [username: string]: boolean };

interface FollowContextValue {
  followMap: FollowState;
  setFollow: (username: string, isFollowing: boolean) => void;
  getFollow: (username: string) => boolean | undefined;
}

const FollowContext = createContext<FollowContextValue | null>(null);

export function FollowProvider({ children }: { children: React.ReactNode }) {
  const [followMap, setFollowMap] = useState<FollowState>({});

  const setFollow = (username: string, isFollowing: boolean) => {
    setFollowMap((prev) => ({ ...prev, [username]: isFollowing }));
  };

  const getFollow = (username: string) => followMap[username];

  return (
    <FollowContext.Provider value={{ followMap, setFollow, getFollow }}>
      {children}
    </FollowContext.Provider>
  );
}

export function useFollowContext() {
  const context = useContext(FollowContext);
  if (!context) throw new Error('useFollowContext deve ser usado dentro de um FollowProvider');
  return context;
}
