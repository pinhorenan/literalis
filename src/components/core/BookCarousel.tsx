// src/components/core/BookCarousel.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BookCover } from '@/components/core/Book';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MinimalBook } from '@/types/book';

/* -------- props -------- */
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

  /* ----- responsividade: recalcula slidesToShow em resize ----- */
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

  /* força reinit ao mudar width → slidesToShow */
  useEffect(() => {
    if (!emblaApi) return;
    const onResize = () => emblaApi.reInit();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [emblaApi]);

  const dynamicSlides = typeof window === 'undefined' ? slidesToShow : getSlidesForWidth();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        aria-label="Livro anterior"
        variant="outline"
        size="icon"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canPrev}
        className="z-10"
      >
        <ArrowLeft className="bg-card rounded-full" />
      </Button>

      {/* viewport */}
      <div ref={emblaRef} className="overflow-hidden" style={{ height: 220 }}>
        {/* track */}
        <div className="flex h-full items-center rounded-lg">
          {books.map((book) => (
            <div
              key={book.isbn}
              className="flex-shrink-0"
              style={{ flex: `0 0 ${100 / dynamicSlides}%` }}
            >
              <BookCover isbn={book.isbn} width={120} height={180} className="mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* nav buttons */}

      <Button
        aria-label="Próximo livro"
        variant="outline"
        size="icon"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canNext}
        className="z-10"
      >
        <ArrowRight className="bg-card rounded-full" />
      </Button>
    </div>
  );
}
