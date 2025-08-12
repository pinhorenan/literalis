// src/app/feed/client.tsx
'use client';

import { useInView } from 'react-intersection-observer';
import { useAllBooks } from '@/hooks/book';
import { useFeedPosts } from '@/hooks/post';
import BookCarousel, { BookCarouselSkeleton } from '@/components/core/BookCarousel';
import FeedFilters from '../../components/core/FeedFilters';
import ErrorState from '@/components/core/ErrorState';
import PostCard from '@/components/core/PostCard';

export default function FeedClient() {
  // Username can be used for future personalization; removed to keep file lint-clean

  const { data: books = [] } = useAllBooks();

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFeedPosts();

  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => inView && hasNextPage && fetchNextPage(),
  });

  if (isLoading) return <FullFeedSkeleton rows={3} />;
  if (isError) return <ErrorState />;

  return (
    <main className="mx-auto flex h-full min-h-screen flex-col">
      {/* Book Carousel Section */}
      <section className="w-full py-3 md:py-5">
        <div className="app-container max-w-6xl">
          <BookCarousel
            aria-label="Livros em destaque"
            books={books}
            slidesToShow={2}
            responsive={{ 1024: 5, 768: 4, 640: 3, 0: 2 }}
            className="mx-auto max-w-5xl"
          />
        </div>
      </section>

      {/* Minimal filter chips */}
      <section className="w-full">
        <div className="app-container max-w-2xl">
          <FeedFilters />
        </div>
      </section>

      {/* Feed Posts Section */}
      <section className="flex flex-1 flex-col pb-8">
        <div className="app-container w-full max-w-2xl">
          <div className="space-y-6">
            {data?.pages.flatMap((p, pageIndex) =>
              p.items.map((post, postIndex) => (
                <div
                  key={post.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${(pageIndex * 3 + postIndex) * 100}ms` }}
                >
                  <PostCard post={post} />
                </div>
              )),
            )}
          </div>

          {/* Loading sentinel */}
          <div ref={ref} className="py-4" />

          {isFetchingNextPage && <FeedSkeleton rows={2} />}

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
    <div className="w-full space-y-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-card animate-pulse overflow-hidden rounded-2xl border border-[#2c2823] shadow-sm"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Header skeleton */}
          <div className="flex items-center gap-3 p-4 sm:p-6">
            <div className="bg-muted h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="bg-muted h-4 w-32 rounded" />
              <div className="bg-muted/70 h-3 w-20 rounded" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-6 sm:p-6">
            <div className="bg-muted mx-auto h-36 w-24 flex-shrink-0 rounded-xl sm:mx-0 sm:h-44 sm:w-28" />
            <div className="flex-1 space-y-3">
              <div className="space-y-2 text-center sm:text-left">
                <div className="bg-muted mx-auto h-6 w-3/4 rounded sm:mx-0" />
                <div className="bg-muted/70 mx-auto h-4 w-1/2 rounded sm:mx-0" />
              </div>
              <div className="bg-muted/50 h-2 w-full rounded-full" />
              <div className="space-y-2">
                <div className="bg-muted/70 h-3 w-full rounded" />
                <div className="bg-muted/70 h-3 w-4/5 rounded" />
              </div>
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="flex items-center gap-4 border-t border-[#2c2823] p-4 sm:p-6">
            <div className="bg-muted h-8 w-16 rounded" />
            <div className="bg-muted h-8 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Full page skeleton including header + carousel placeholder to prevent layout shift
function FullFeedSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <main className="mx-auto flex h-full min-h-screen flex-col">
      {/* Carousel section placeholder */}
      <section className="w-full py-3 md:py-5">
        <div className="app-container max-w-6xl">
          <BookCarouselSkeleton slides={4} />
        </div>
      </section>

      {/* Feed posts skeleton */}
      <section className="flex flex-1 flex-col pb-8">
        <div className="app-container w-full max-w-2xl">
          <div className="skeleton mb-4 h-8 w-40 rounded" />
          <FeedSkeleton rows={rows} />
        </div>
      </section>
    </main>
  );
}
