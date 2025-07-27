// src/components/pages/profile/UserPosts.tsx
'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useUserPosts } from '@/hooks/post';
import PostCard from '@/components/core/PostCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, MessageSquare, Heart, Users } from 'lucide-react';

interface UserPostsProps {
  username: string;
}

export function UserPosts({ username }: UserPostsProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'reviews' | 'activity'>('posts');

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUserPosts(username);

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => inView && hasNextPage && fetchNextPage(),
  });

  if (isLoading) {
    return <UserPostsSkeleton />;
  }

  if (isError) {
    return (
      <div className="bg-card rounded-lg p-8 text-center">
        <h3 className="text-destructive mb-2 text-lg font-semibold">Erro ao carregar posts</h3>
        <p className="text-muted-foreground">Não foi possível carregar os posts do usuário.</p>
      </div>
    );
  }

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-card flex rounded-lg p-1">
        <Button
          variant={activeTab === 'posts' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('posts')}
          className="flex-1"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Posts
        </Button>
        <Button
          variant={activeTab === 'reviews' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('reviews')}
          className="flex-1"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Resenhas
        </Button>
        <Button
          variant={activeTab === 'activity' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('activity')}
          className="flex-1"
        >
          <Heart className="mr-2 h-4 w-4" />
          Atividade
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <EmptyState activeTab={activeTab} username={username} />
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Infinite scroll sentinel */}
            <div ref={ref} />

            {isFetchingNextPage && <UserPostsSkeleton rows={3} />}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({ activeTab, username }: { activeTab: string; username: string }) {
  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'posts':
        return {
          title: 'Nenhum post ainda',
          description: `${username} ainda não publicou nenhum post.`,
          icon: MessageSquare,
        };
      case 'reviews':
        return {
          title: 'Nenhuma resenha ainda',
          description: `${username} ainda não escreveu nenhuma resenha.`,
          icon: BookOpen,
        };
      case 'activity':
        return {
          title: 'Nenhuma atividade ainda',
          description: `${username} ainda não tem atividades públicas.`,
          icon: Heart,
        };
      default:
        return {
          title: 'Nenhum conteúdo',
          description: 'Não há conteúdo para exibir.',
          icon: MessageSquare,
        };
    }
  };

  const { title, description, icon: Icon } = getEmptyMessage();

  return (
    <div className="bg-card rounded-lg p-12 text-center">
      <Icon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function UserPostsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
