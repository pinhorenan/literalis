// src/app/feed/client.tsx
'use client';

import { Session } from 'next-auth';
import { useInView } from 'react-intersection-observer';
import { useAllBooks } from '@/hooks/book';
import { useFeedPosts } from '@/hooks/post';
import BookCarousel from '@/components/core/BookCarousel';
import ErrorState from '@/components/core/ErrorState';
import PostCard from '@/components/core/PostCard';

export default function FeedClient({ session }: { session: Session }) {
  const username = session.user.username ?? 'leitor';

  const { data: books = [] } = useAllBooks();

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeedPosts();

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => inView && hasNextPage && fetchNextPage(),
  });

  if (isLoading) return <FeedSkeleton rows={3} />;
  if (isError) return <ErrorState />;

  return (
    <main className="mx-auto flex h-full flex-col animate-in fade-in duration-700">
      {/* ---- Book Carousel ---- */}
      <section className="flex flex-col items-center w-full px-4 py-6">
        <div className="w-full max-w-4xl">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Livros em Destaque</h2>
            <p className="text-muted-foreground text-sm">Explore nossa seleção de livros populares</p>
          </div>
          <BookCarousel
            aria-label="Livros em destaque"
            books={books}
            slidesToShow={4}
            responsive={{ 1024: 4, 640: 2, 0: 1 }}
            className="animate-in slide-in-from-top-6 duration-500 delay-200"
          />
        </div>
      </section>

      {/* ---- Feed Posts ---- */}
      <section className="mt-6 flex flex-1 flex-col items-center overflow-y-auto pb-8 px-4">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <div className="text-center space-y-2 animate-in slide-in-from-bottom-4 duration-500 delay-300">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Olá {username}! 
            </h1>
            <p className="text-muted-foreground">Aqui está o seu feed personalizado.</p>
          </div>

          <div className="space-y-4">
            {data?.pages.flatMap((p, pageIndex) =>
              p.items.map((post, postIndex) => (
                <div 
                  key={post.id}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${(pageIndex * 3 + postIndex) * 100}ms` }}
                >
                  <PostCard post={post} />
                </div>
              ))
            )}
          </div>

          {/* sentinel */}
          <div ref={ref} />

          {isFetchingNextPage && <FeedSkeleton rows={3} />}
          
          {!hasNextPage && data?.pages?.[0]?.items && data.pages[0].items.length > 0 && (
            <div className="text-center py-8 animate-in fade-in duration-500">
              <p className="text-muted-foreground text-sm">
                Você chegou ao fim do seu feed! 📚
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function FeedSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="mx-auto flex flex-col gap-4 w-full max-w-2xl">
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className="bg-card border rounded-lg shadow-sm overflow-hidden animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Header skeleton */}
          <div className="flex items-center gap-3 p-4 border-b border-border/50">
            <div className="w-10 h-10 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-32" />
              <div className="h-3 bg-muted/70 rounded w-20" />
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="flex gap-4 p-4">
            <div className="w-20 h-28 bg-muted rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted/70 rounded w-1/2" />
              </div>
              <div className="h-2 bg-muted/50 rounded-full w-full" />
              <div className="space-y-2">
                <div className="h-3 bg-muted/70 rounded w-full" />
                <div className="h-3 bg-muted/70 rounded w-4/5" />
              </div>
            </div>
          </div>
          
          {/* Actions skeleton */}
          <div className="flex items-center gap-4 p-4 border-t border-border/50">
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-muted rounded" />
              <div className="h-8 w-16 bg-muted rounded" />
            </div>
            <div className="flex-1 h-8 bg-muted rounded ml-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
