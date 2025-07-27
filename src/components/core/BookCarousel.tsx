// src/components/core/BookCarousel.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BookCover } from '@/components/core/Book';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MinimalBook } from '@/types/book';

export interface BookCarouselProps {
  books: MinimalBook[];
  slidesToShow?: number;
  responsive?: Record<number, number>;
  className?: string;
}

export default function BookCarousel({
  books,
  slidesToShow = 1,
  responsive = { 640: 2, 1024: 4 },
  className = '',
}: BookCarouselProps) {
  /* ----- Embla ----- */
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

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
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onResize = () => emblaApi.reInit();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [emblaApi]);

  const dynamicSlides = typeof window === 'undefined' ? slidesToShow : getSlidesForWidth();

  return (
    <div className={cn('bg-card flex items-center rounded-lg border p-4 shadow-sm', className)}>
      <Button
        aria-label="Livro anterior"
        variant="ghost"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canPrev}
        className={cn(
          'z-10 rounded-full p-3 transition-all duration-200 hover:scale-110',
          canPrev ? 'hover:bg-primary/10 hover:text-primary' : 'cursor-not-allowed opacity-50',
        )}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div ref={emblaRef} className="mx-4 flex-1 overflow-hidden" style={{ height: 220 }}>
        <div className="flex h-full items-center gap-4 rounded-lg">
          {books.map((book, index) => (
            <div
              key={book.isbn}
              className="group flex-shrink-0"
              style={{
                flex: `0 0 ${100 / dynamicSlides}%`,
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="mx-auto transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                <BookCover
                  isbn={book.isbn}
                  width={120}
                  height={180}
                  className="rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        aria-label="Próximo livro"
        variant="ghost"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canNext}
        className={cn(
          'z-10 rounded-full p-3 transition-all duration-200 hover:scale-110',
          canNext ? 'hover:bg-primary/10 hover:text-primary' : 'cursor-not-allowed opacity-50',
        )}
      >
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
