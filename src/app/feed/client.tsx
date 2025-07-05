// src/app/feed/client.tsx
'use client';

import { Session } from 'next-auth';
import { useInView } from 'react-intersection-observer';
import { useAllBooks } from '@/hooks/book';
import { useFeedPosts } from '@/hooks/post';
import FeedSkeleton from '@/components/skeletons/FeedSkeleton';
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
    <main className="bg-background flex h-full w-full flex-col">
      {/* ---- Book Carousel ---- */}
      <section className="flex justify-center px-4">
        <div className="w-full max-w-2xl">
          <BookCarousel
            aria-label="Livros em destaque"
            books={books}
            slidesToShow={4}
            responsive={{ 1024: 4, 640: 2, 0: 1 }}
            className="border-accent rounded-lg border"
          />
        </div>
      </section>

      {/* ---- Feed Posts ---- */}
      <section className="mt-6 flex flex-1 flex-col items-center overflow-y-auto px-4 pb-8">
        <div className="flex w-full max-w-2xl flex-col gap-4">
          <h1 className="mb-6 text-2xl font-bold">
            Olá {username}! Aqui está o seu feed. NAO AAGUENTO MASI ESSA MERDA QUERO CHORAR
          </h1>

          {data?.pages.flatMap((p) =>
            p.items.map((post) => <PostCard key={post.id} post={post} />),
          )}

          {/* sentinel */}
          <div ref={ref} />

          {isFetchingNextPage && <FeedSkeleton rows={2} />}
        </div>
      </section>
    </main>
  );
}
