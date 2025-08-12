// src/app/feed/client.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAllBooks } from '@/hooks/book';
import { useFeedPosts } from '@/hooks/post';
import ErrorState from '@/components/core/ErrorState';
import PostCard from '@/components/core/PostCard';
import { BookCover } from '@/components/core/Book';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MinimalBook } from '@/types/book';

// Feed-specific Book Carousel
function FeedBookCarousel({ books }: { books: MinimalBook[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const getSlidesForWidth = useCallback(() => {
    const w = window.innerWidth;
    if (w >= 1024) return 5;
    if (w >= 768) return 4;
    if (w >= 640) return 3;
    return 2;
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    const onPointerDown = () => setIsDragging(true);
    const onPointerUp = () => setIsDragging(false);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('pointerDown', onPointerDown);
    emblaApi.on('pointerUp', onPointerUp);
    onSelect();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onResize = () => emblaApi.reInit();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [emblaApi]);

  const dynamicSlides = typeof window === 'undefined' ? 2 : getSlidesForWidth();

  return (
    <div
      aria-label="Livros em destaque"
      className={cn(
        'group/carousel bg-card relative overflow-hidden rounded-lg border px-2.5 py-2.5 shadow-sm transition-colors sm:px-3 md:px-4',
        'mx-auto max-w-5xl',
      )}
    >
      <div ref={emblaRef} className={cn('cursor-grab overflow-hidden active:cursor-grabbing')}>
        <div className={cn('flex items-stretch gap-3 sm:gap-3.5 md:gap-4')}>
          {books.map((book) => (
            <div
              key={book.isbn}
              className="relative flex-shrink-0"
              style={{ flex: `0 0 ${100 / dynamicSlides}%` }}
            >
              <div
                className={cn(
                  'mx-auto w-full max-w-[84px] transition-transform duration-200 will-change-transform sm:max-w-[96px] md:max-w-[108px] lg:max-w-[116px] xl:max-w-[124px] 2xl:max-w-[132px]',
                  isDragging && 'pointer-events-none',
                )}
              >
                <BookCover
                  isbn={book.isbn}
                  fluid
                  className="rounded-md shadow-sm"
                  book={{ isbn: book.isbn, coverUrl: book.coverUrl }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient edges */}
      <div className="from-card pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r to-transparent sm:w-6 md:w-8" />
      <div className="from-card pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l to-transparent sm:w-6 md:w-8" />

      {/* Controls */}
      <div className="absolute inset-y-0 left-1 flex flex-col justify-center sm:left-1.5">
        <Button
          aria-label="Livro anterior"
          size="icon"
          variant="ghost"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canPrev}
          className={cn(
            'ring-border/50 h-7 w-7 rounded-full opacity-0 ring-1 backdrop-blur-sm transition-all duration-200 focus:opacity-100 group-hover/carousel:opacity-100 sm:h-8 sm:w-8',
            canPrev ? 'hover:bg-primary/10 hover:text-primary' : 'cursor-not-allowed opacity-40',
          )}
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-1 flex flex-col justify-center sm:right-1.5">
        <Button
          aria-label="Próximo livro"
          size="icon"
          variant="ghost"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canNext}
          className={cn(
            'ring-border/50 h-7 w-7 rounded-full opacity-0 ring-1 backdrop-blur-sm transition-all duration-200 focus:opacity-100 group-hover/carousel:opacity-100 sm:h-8 sm:w-8',
            canNext ? 'hover:bg-primary/10 hover:text-primary' : 'cursor-not-allowed opacity-40',
          )}
        >
          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
}

// Feed-specific Filters
function FeedFilters() {
  const [active, setActive] = useState('all');
  const chips = [
    { id: 'all', label: 'Tudo' },
    { id: 'seguindo', label: 'Seguindo' },
    { id: 'resenhas', label: 'Resenhas' },
    { id: 'citacoes', label: 'Citações' },
    { id: 'progresso', label: 'Progresso' },
    { id: 'listas', label: 'Listas' },
  ];

  return (
    <nav aria-label="Filtros do feed" className="relative">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-2">
        {chips.map((c) => {
          const selected = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={cn(
                'whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                selected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80',
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// Feed Header
function FeedHeader({ books }: { books: MinimalBook[] }) {
  return (
    <header className="mx-auto w-full">
      {/* Carousel */}
      <section className="section-y">
        <div className="app-container max-w-6xl">
          <FeedBookCarousel books={books} />
        </div>
      </section>

      {/* Filters */}
      <section className="section-y-compact">
        <div className="app-container max-w-2xl">
          <FeedFilters />
        </div>
      </section>
    </header>
  );
}

// Feed Skeletons
function FeedSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="w-full space-y-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-card animate-pulse overflow-hidden rounded-2xl border shadow-sm"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center gap-3 p-4 sm:p-6">
            <div className="bg-muted h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="bg-muted h-4 w-32 rounded" />
              <div className="bg-muted/70 h-3 w-20 rounded" />
            </div>
          </div>
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
          <div className="flex items-center gap-4 border-t p-4 sm:p-6">
            <div className="bg-muted h-8 w-16 rounded" />
            <div className="bg-muted h-8 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FullFeedSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <main className="page">
      <section className="section-y">
        <div className="app-container max-w-6xl">
          <div className="bg-card relative overflow-hidden rounded-lg border px-2.5 py-2.5 shadow-sm sm:px-3 md:px-4">
            <div className="flex items-stretch gap-2 sm:gap-2.5 md:gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0" style={{ flex: `0 0 ${100 / 4}%` }}>
                  <div className="skeleton mx-auto aspect-[2/3] w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-1 flex-col pb-8">
        <div className="app-container w-full max-w-2xl">
          <div className="skeleton mb-4 h-8 w-40 rounded" />
          <FeedSkeleton rows={rows} />
        </div>
      </section>
    </main>
  );
}

export default function FeedClient() {
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
    <main className="page">
      <FeedHeader books={books} />

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
