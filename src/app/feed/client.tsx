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
    <main className="animate-in fade-in mx-auto flex h-full flex-col duration-700">
      {/* ---- Book Carousel ---- */}
      <section className="flex w-full flex-col items-center px-4 py-6">
        <div className="w-full max-w-4xl">
          <div className="mb-4 text-center">
            <h2 className="text-foreground mb-2 text-xl font-semibold">Livros em Destaque</h2>
            <p className="text-muted-foreground text-sm">
              Explore nossa seleção de livros populares
            </p>
          </div>
          <BookCarousel
            aria-label="Livros em destaque"
            books={books}
            slidesToShow={4}
            responsive={{ 1024: 4, 640: 2, 0: 1 }}
            className="animate-in slide-in-from-top-6 delay-200 duration-500"
          />
        </div>
      </section>

      {/* ---- Feed Posts ---- */}
      <section className="mt-6 flex flex-1 flex-col items-center overflow-y-auto px-4 pb-8">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <div className="animate-in slide-in-from-bottom-4 space-y-2 text-center delay-300 duration-500">
            <h1 className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
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
              )),
            )}
          </div>

          {/* sentinel */}
          <div ref={ref} />

          {isFetchingNextPage && <FeedSkeleton rows={3} />}

          {!hasNextPage && data?.pages?.[0]?.items && data.pages[0].items.length > 0 && (
            <div className="animate-in fade-in py-8 text-center duration-500">
              <p className="text-muted-foreground text-sm">Você chegou ao fim do seu feed! 📚</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function FeedSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-card animate-pulse overflow-hidden rounded-lg border shadow-sm"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Header skeleton */}
          <div className="border-border/50 flex items-center gap-3 border-b p-4">
            <div className="bg-muted h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="bg-muted h-4 w-32 rounded" />
              <div className="bg-muted/70 h-3 w-20 rounded" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="flex gap-4 p-4">
            <div className="bg-muted h-28 w-20 flex-shrink-0 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <div className="bg-muted h-4 w-3/4 rounded" />
                <div className="bg-muted/70 h-3 w-1/2 rounded" />
              </div>
              <div className="bg-muted/50 h-2 w-full rounded-full" />
              <div className="space-y-2">
                <div className="bg-muted/70 h-3 w-full rounded" />
                <div className="bg-muted/70 h-3 w-4/5 rounded" />
              </div>
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="border-border/50 flex items-center gap-4 border-t p-4">
            <div className="flex gap-2">
              <div className="bg-muted h-8 w-16 rounded" />
              <div className="bg-muted h-8 w-16 rounded" />
            </div>
            <div className="bg-muted ml-4 h-8 flex-1 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
