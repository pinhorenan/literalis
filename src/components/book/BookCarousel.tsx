'use client';
import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import BookCover from '@/src/components/book/BookCover';
import type { BookDTO } from '@/src/hooks/types/book.type';
import { cn } from '@/src/lib/utils';

interface BookCarouselProps {
  books: BookDTO[];
  slidesToShow?: number;
  className?: string;
}

export default function BookCarousel({
  books,
  slidesToShow = 6,
  className = '',
}: BookCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
    slidesToScroll: slidesToShow,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

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

  return (
    <div className={cn('relative', className)}>
      {/* viewport com altura fixa */}
      <div ref={emblaRef} className="overflow-hidden" style={{ height: 220 }}>
        {/* track sem justify-around, só alinhamento no início */}
        <div className="flex h-full items-center">
          {books.map((book, idx) => (
            <div
              key={book.isbn + idx}
              className="flex-shrink-0 px-4"
              style={{ flex: `0 0 ${100 / slidesToShow}%` }}
            >
              <BookCover book={book} width={120} height={180} className="mx-auto max-w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* botões Prev/Next */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canPrev}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full"
      >
        <ArrowLeft />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canNext}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full"
      >
        <ArrowRight />
      </Button>
    </div>
  );
}
