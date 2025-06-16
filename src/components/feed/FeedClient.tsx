// File: src/components/feed/FeedClient.tsx
'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { Button } from '@components/ui/Buttons';
import PostCard                 from '@components/post/PostCard';
import PostSkeleton             from '@components/post/PostSkeleton';
import type { ClientPost }      from '@/src/types/posts';

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' })
    .then((r) => {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    });

interface FeedClientProps {
  initialPosts: ClientPost[];
  initialTab: Tab;
}

interface FeedResponse {
  posts: ClientPost[];
}

export default function FeedClient({ initialPosts, initialTab }: FeedClientProps) {

  // todo: adicionar aqui um carrossel de livros recomendados
  

  const [tab, setTab] = useState<Tab>(initialTab);
  const mode = tab === 'friends' ? 'friends' : 'discover';
  const [followedMap, setFollowedMap] = useState(() => {
    const map: Record<string, boolean> = {};
    for (const post of initialPosts) {
      map[post.author.username] = post.isFollowingAuthor;
    }
    return map;
  })

  const updateFollowedMap = (username: string, isFollowing: boolean) => {
    setFollowedMap((prev) => ({ ...prev, [username]: isFollowing }));
  }

  const { data, error, isLoading } = useSWR<FeedResponse>(
    `/api/feed?mode=${mode}&limit=20`, // ? adicionar paginação OU scroll infinito
    fetcher,
    {
      fallbackData: { posts: initialPosts },
    }
  );

  const posts = data?.posts ?? [];

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">

      {/* Leituras recomendadas */}
      <div className="rounded-xl bg-[var(--surface-card)] border border-[var(--border-subtle)] px-6 py-4 shadow-sm text-sm text-[var(--text-tertiary)]">
        Descubra livros recomendados para você - em breve! (WIP)
      </div>

      {/* Botão de alternância entre tabs */}
      <FeedSwitch onChange={setTab} />

      {/* Feed de posts */}
      {isLoading ? (
        <PostSkeleton />
      ) : error ? (
        <div className="text-center p-4 rounded-md bg-red-50 text-red-500 border border-red-200">
          Ocorreu um erro ao carregar o feed: {(error as Error).message}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-[var(--text-tertiary)] italic py-8">
          Não há posts para exibir.
        </div>
      ) : (
        posts.map((post) => 
        <PostCard 
          key={post.id} 
          post={{
            ...post,
            isFollowingAuthor: followedMap[post.author.username] ?? false,
        }} 
        onFollowChange={(nowFollowing) => updateFollowedMap(post.author.username, nowFollowing)}
        />)
      )}

    </section>
  );
}

type Tab = 'discover' | 'friends';

export function FeedSwitch({ onChange }: { onChange: (t: Tab) => void }) {
  const [tab, setTab] = useState<Tab>('discover');

  const switchTo = (t: Tab) => {
    if (t === tab) return;
    setTab(t);
    onChange(t);
  };

  return (
    <div className="flex items-center gap-2 my-2">
      <div className="flex-1 h-[2px] bg-[var(--surface-card)]" />

      <div className="flex gap-2 px-1 py-1 shadow-sm rounded-xl bg-[var(--surface-card)] border border-[var(--border-base)]">
        <Button variant="default" size="sm" active={tab === 'discover'} onClick={() => switchTo('discover')}>
          Descobrir
        </Button>
        <Button variant="default" size="sm" active={tab === 'friends'}  onClick={() => switchTo('friends')}>
          Seguindo
        </Button>
      </div>

      <div className="flex-1 h-[2px] bg-[var(--surface-card)]" />
    </div>
  );
}
