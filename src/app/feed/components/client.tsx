// src/app/feed/client.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAllBooks } from '@/hooks/book';
import { useFeedPosts } from '@/hooks/post';
import ErrorState from '@/components/core/ErrorState';
import PostCard from '@/components/core/PostCard';
import { BookCover } from '@/components/core/Book';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MinimalBook } from '@/types/book';

// Feed-specific Book Carousel
function FeedBookCarousel({
  books,
  isVisible,
  onToggleVisibility,
}: {
  books: MinimalBook[];
  isVisible: boolean;
  onToggleVisibility: () => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const getSlidesForWidth = useCallback(() => {
    const w = window.innerWidth;
    if (w >= 1280) return 8; // XL screens - mais livros
    if (w >= 1024) return 7; // Desktop - aumentado para preencher melhor
    if (w >= 768) return 4; // Tablet - mantido
    if (w >= 640) return 3; // Mobile large - mantido
    return 2; // Mobile - mantido original
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
    <div className="mx-auto w-full">
      {/* Header com botão de toggle */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-lg font-semibold">Livros em destaque</h2>
        <Button
          onClick={onToggleVisibility}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {isVisible ? 'Ocultar' : 'Mostrar'}
        </Button>
      </div>

      {/* Carrossel com animação */}
      <div
        className={cn(
          'feed-carousel transition-all duration-300 ease-in-out',
          !isVisible && 'h-0 overflow-hidden opacity-0',
        )}
      >
        {isVisible && (
          <div
            aria-label="Livros em destaque"
            className={cn(
              'group/carousel bg-card relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:p-6',
              'animate-in slide-in-from-top-4 duration-300',
            )}
          >
            <div
              ref={emblaRef}
              className={cn('cursor-grab overflow-hidden active:cursor-grabbing')}
            >
              <div className={cn('flex items-stretch gap-3 sm:gap-4')}>
                {books.map((book) => (
                  <div
                    key={book.isbn}
                    className="relative flex-shrink-0"
                    style={{ flex: `0 0 ${100 / dynamicSlides}%` }}
                  >
                    <div
                      className={cn(
                        'carousel-item mx-auto w-full max-w-[70px] transition-transform duration-200 will-change-transform sm:max-w-[80px] md:max-w-[85px] lg:max-w-[90px] xl:max-w-[95px] 2xl:max-w-[100px]',
                        isDragging && 'pointer-events-none',
                      )}
                    >
                      <BookCover
                        isbn={book.isbn}
                        fluid
                        className="rounded-xl shadow-sm"
                        book={{ isbn: book.isbn, coverUrl: book.coverUrl }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient edges */}
            <div className="from-card pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r to-transparent sm:w-8" />
            <div className="from-card pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l to-transparent sm:w-8" />

            {/* Controls */}
            <div className="absolute inset-y-0 left-2 flex flex-col justify-center sm:left-3">
              <Button
                aria-label="Livro anterior"
                size="icon"
                variant="ghost"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canPrev}
                className={cn(
                  'ring-border/50 h-8 w-8 rounded-full opacity-0 ring-1 backdrop-blur-sm transition-all duration-200 focus:opacity-100 group-hover/carousel:opacity-100 sm:h-9 sm:w-9',
                  canPrev
                    ? 'hover:bg-primary/10 hover:text-primary'
                    : 'cursor-not-allowed opacity-40',
                )}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-2 flex flex-col justify-center sm:right-3">
              <Button
                aria-label="Próximo livro"
                size="icon"
                variant="ghost"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canNext}
                className={cn(
                  'ring-border/50 h-8 w-8 rounded-full opacity-0 ring-1 backdrop-blur-sm transition-all duration-200 focus:opacity-100 group-hover/carousel:opacity-100 sm:h-9 sm:w-9',
                  canNext
                    ? 'hover:bg-primary/10 hover:text-primary'
                    : 'cursor-not-allowed opacity-40',
                )}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
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
  const [isCarouselVisible, setIsCarouselVisible] = useState(true);

  return (
    <header className="mx-auto w-full">
      {/* Carousel */}
      <section className="section-y">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
          <FeedBookCarousel
            books={books}
            isVisible={isCarouselVisible}
            onToggleVisibility={() => setIsCarouselVisible(!isCarouselVisible)}
          />
        </div>
      </section>

      {/* Filters */}
      <section className="section-y-compact">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
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
          className="bg-card mx-auto w-full max-w-2xl animate-pulse overflow-hidden rounded-2xl border shadow-sm"
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
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Header skeleton */}
          <div className="mb-4 flex items-center justify-between">
            <div className="skeleton h-7 w-40 rounded" />
            <div className="skeleton h-8 w-20 rounded" />
          </div>
          {/* Carousel skeleton */}
          <div className="bg-card relative overflow-hidden rounded-2xl border p-4 shadow-sm sm:p-6">
            <div className="flex items-stretch gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex-shrink-0" style={{ flex: `0 0 ${100 / 4}%` }}>
                  <div className="skeleton mx-auto aspect-[2/3] w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-1 flex-col pb-8">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
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
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
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
