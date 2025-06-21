// File: src/components/client/feed/FeedClient.tsx
'use client';

import React, { useState, useCallback } from 'react';
import useSWR from 'swr';
import { Button } from '@components/client/ui/Buttons';
import PostCard from '@components/client/post/PostCard';
import PostSkeleton from '@components/server/post/PostSkeleton';
import { FeedService } from '@services/FeedService';
import type { PostDTO } from '@dto/post.dto';
import type { FeedResponse } from '@dto/feed.dto';

type Tab = 'discover' | 'friends';

interface FeedClientProps {
  initialPosts: PostDTO[];
  initialTab: Tab;
}

export default function FeedClient({ initialPosts, initialTab }: FeedClientProps) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const mode = tab === 'friends' ? 'friends' : 'discover';

  const [followMap, setFollowMap] = useState<Record<string, boolean>>(
    () => Object.fromEntries(initialPosts.map(p => [p.author.username, p.isFollowingAuthor]))
  );

  const updateFollow = useCallback((username: string, following: boolean) => {
    setFollowMap(prev => ({ ...prev, [username]: following }));
  }, []);

  const { data, error, isLoading } = useSWR<FeedResponse>(
    ['feed', mode, 20],
    () => FeedService.getFeed({ mode, limit: 20 }),
    { fallbackData: { posts: initialPosts } }
  );

  const posts = data?.posts ?? [];

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Leituras recomendadas (WIP) */}
      <div className="rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] px-6 py-4 shadow-sm text-sm text-[var(--text-tertiary)]">
        Descubra livros recomendados para você – em breve!
      </div>

      <FeedSwitch current={tab} onChange={setTab} />

      {isLoading ? (
        <PostSkeleton />
      ) : error ? (
        <div className="text-center p-4 rounded-md bg-red-50 text-red-500 border border-red-200">
          Erro ao carregar o feed: {(error as Error).message}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-[var(--text-tertiary)] italic py-8">
          Não há posts para exibir.
        </div>
      ) : (
        posts.map(post => (
          <PostCard
            key={post.id}
            post={{ ...post, isFollowingAuthor: followMap[post.author.username] }}
            onFollowChange={now => updateFollow(post.author.username, now)}
          />
        ))
      )}
    </section>
  );
}

interface FeedSwitchProps {
  current: Tab;
  onChange: (tab: Tab) => void;
}

export function FeedSwitch({ current, onChange }: FeedSwitchProps) {
  const toggle = (t: Tab) => t !== current && onChange(t);

  return (
    <div className="flex items-center gap-2 my-2">
      <div className="flex-1 h-[2px] bg-[var(--surface-card)]" />

      <div className="flex gap-2 px-1 py-1 shadow-sm rounded-xl bg-[var(--surface-card)] border border-[var(--border-base)]">
        {(['discover', 'friends'] as Tab[]).map(t => (
          <Button
            key={t}
            variant="default"
            size="sm"
            active={current === t}
            onClick={() => toggle(t)}
          >
            {t === 'discover' ? 'Descobrir' : 'Seguindo'}
          </Button>
        ))}
      </div>

      <div className="flex-1 h-[2px] bg-[var(--surface-card)]" />
    </div>
);
}
