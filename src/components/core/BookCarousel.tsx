// src/components/core/BookCarousel.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BookCover } from '@/components/core/Book';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MinimalBook } from '@/types/book';

export interface BookCarouselProps {
  books: MinimalBook[];
  slidesToShow?: number; // fallback (SSR)
  responsive?: Record<number, number>; // { breakpointWidth: slides }
  className?: string;
  autoPlayIntervalMs?: number;
  tightGaps?: boolean;
  pauseOnHover?: boolean;
}

export default function BookCarousel({
  books,
  slidesToShow = 1,
  responsive = { 480: 3, 640: 4, 768: 5, 1024: 6, 1280: 7, 1536: 8 },
  className = '',
  autoPlayIntervalMs = 0,
  tightGaps = false,
  pauseOnHover = true,
}: BookCarouselProps) {
  /* ----- Embla ----- */
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const hoverRef = useRef<HTMLDivElement | null>(null);
  const isHoveringRef = useRef(false);

  const getSlidesForWidth = useCallback(() => {
    const w = window.innerWidth;
    const bp = Object.keys(responsive)
      .map(Number)
      .filter((min) => w >= min)
      .sort((a, b) => b - a)[0];
    return responsive[bp] ?? slidesToShow;
  }, [responsive, slidesToShow]);

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

  // Auto-play (optional)
  useEffect(() => {
    if (!emblaApi || !autoPlayIntervalMs) return;
    let id: NodeJS.Timeout | undefined;

    const start = () => {
      if (id) return;
      id = setInterval(() => {
        if (!isHoveringRef.current) emblaApi.scrollNext();
      }, autoPlayIntervalMs);
    };
    const stop = () => {
      if (id) clearInterval(id);
      id = undefined;
    };

    start();

    if (pauseOnHover && hoverRef.current) {
      const el = hoverRef.current;
      const onEnter = () => (isHoveringRef.current = true);
      const onLeave = () => (isHoveringRef.current = false);
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        stop();
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      };
    }
    return () => stop();
  }, [emblaApi, autoPlayIntervalMs, pauseOnHover]);

  const dynamicSlides = typeof window === 'undefined' ? slidesToShow : getSlidesForWidth();

  return (
    <div
      ref={hoverRef}
      className={cn(
        'group/carousel bg-card relative overflow-hidden rounded-lg border px-2.5 py-2.5 shadow-sm transition-colors sm:px-3 md:px-4',
        className,
      )}
    >
      {/* Track */}
      <div ref={emblaRef} className={cn('cursor-grab overflow-hidden active:cursor-grabbing')}>
        <div
          className={cn(
            'flex items-stretch',
            tightGaps ? 'gap-2.5 sm:gap-3 md:gap-3.5' : 'gap-3 sm:gap-3.5 md:gap-4',
          )}
        >
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
      {/* Gradient edges (must be outside the track to avoid Embla counting them as slides) */}
      <div className="from-card pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r to-transparent sm:w-6 md:w-8" />
      <div className="from-card pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l to-transparent sm:w-6 md:w-8" />

      {/* Controls - appear on hover and focus, accessible via keyboard */}
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

// Skeleton for carousel placeholder
export function BookCarouselSkeleton({ slides = 5 }: { slides?: number }) {
  return (
    <div className="bg-card relative overflow-hidden rounded-lg border px-2.5 py-2.5 shadow-sm sm:px-3 md:px-4">
      <div className="flex items-stretch gap-2 sm:gap-2.5 md:gap-3">
        {Array.from({ length: slides }).map((_, i) => (
          <div key={i} className="flex-shrink-0" style={{ flex: `0 0 ${100 / slides}%` }}>
            <div className="skeleton mx-auto aspect-[2/3] w-full rounded-md" />
          </div>
        ))}
      </div>
      {/* Gradient edges outside of the track */}
      <div className="from-card pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r to-transparent sm:w-6 md:w-8" />
      <div className="from-card pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l to-transparent sm:w-6 md:w-8" />
    </div>
  );
}
