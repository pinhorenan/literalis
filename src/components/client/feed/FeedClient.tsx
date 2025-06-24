// src/components/client/feed/FeedClient.tsx
'use client';

import React, { useState } from 'react';
import useFeedPosts from '@hooks/post/useFeedPosts';
import { Button } from '@components/client/ui/Buttons';
import PostCard from '@/src/components/client/post/Post';
import PostSkeleton from '@components/server/post/PostSkeleton';
import type { PostDTO } from '@/src/models/post.model';

type Tab = 'discover' | 'friends';

interface FeedClientProps {
  initialPosts: PostDTO[];
  initialTab: Tab;
}

export default function FeedClient({ initialPosts, initialTab }: FeedClientProps) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const onlyFollowing = tab === 'friends';

  const { posts, error, isLoading } = useFeedPosts({
    onlyFollowing,
    limit: 20,
    fallbackData: initialPosts,
  });

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
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
            post={{
              ...post,
              comments: post.comments ?? [],
              // `isFollowingAuthor` agora será preenchido no componente PostCard via contexto, se necessário
            }}
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
        {(['discover', 'friends'] as const).map(t => (
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
