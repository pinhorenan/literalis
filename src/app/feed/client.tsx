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
    <main className="mx-auto flex h-full flex-col">
      {/* ---- Book Carousel ---- */}
      <section className="flex flex-col items-center w-fit max-w-fit">
        <div className="w-fit max-w-2xl">
          <BookCarousel
            aria-label="Livros em destaque"
            books={books}
            slidesToShow={4}
            responsive={{ 1024: 4, 640: 2, 0: 1 }}
          />
        </div>
      </section>

      {/* ---- Feed Posts ---- */}
      <section className="mt-6 flex flex-1 flex-col items-center overflow-y-auto pb-8">
        <div className="flex w-full max-w-2xl flex-col gap-4">
          <h1 className="mb-6 text-2xl font-bold">Olá {username}! Aqui está o seu feed.</h1>

          {data?.pages.flatMap((p) =>
            p.items.map((post) => <PostCard key={post.id} post={post} />),
          )}

          {/* sentinel */}
          <div ref={ref} />

          {isFetchingNextPage && <FeedSkeleton rows={6} />}
        </div>
      </section>
    </main>
  );
}

function FeedSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="mx-auto flex animate-pulse flex-col gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-muted h-24 w-full rounded-lg" />
      ))}
    </div>
  );
}
