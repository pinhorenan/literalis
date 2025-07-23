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
    <div className={cn('flex items-center bg-card rounded-lg border shadow-sm p-4', className)}>
      <Button
        aria-label="Livro anterior"
        variant="ghost"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canPrev}
        className={cn(
          "z-10 rounded-full p-3 transition-all duration-200 hover:scale-110",
          canPrev 
            ? "hover:bg-primary/10 hover:text-primary" 
            : "opacity-50 cursor-not-allowed"
        )}
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <div ref={emblaRef} className="overflow-hidden mx-4 flex-1" style={{ height: 220 }}>
        <div className="flex h-full items-center rounded-lg gap-4">
          {books.map((book, index) => (
            <div
              key={book.isbn}
              className="flex-shrink-0 group"
              style={{ 
                flex: `0 0 ${100 / dynamicSlides}%`,
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="mx-auto transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <BookCover 
                  isbn={book.isbn} 
                  width={120} 
                  height={180} 
                  className="shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg" 
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
          "z-10 rounded-full p-3 transition-all duration-200 hover:scale-110",
          canNext 
            ? "hover:bg-primary/10 hover:text-primary" 
            : "opacity-50 cursor-not-allowed"
        )}
      >
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
}
