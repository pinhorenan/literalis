// src/app/(home)/page.tsx
'use client';

import { useState } from 'react';
import { userMock1 } from '@/src/models/mocks/user.mocks';
import * as books from '@/src/models/mocks/book.mocks';
import { postsMock } from '@/src/models/mocks/post.mocks';
import type { BookDTO } from '@/src/models/types/book.type';

import BookCarousel from '@/src/components/BookCarousel';
import PostCard from '@/src/components/PostCard';

export default function HomePage() {
  const [showCarousel] = useState(true);

  // pega todos os bookMockX exportados
  const carouselBooks = Object.values(books).filter(
    (b): b is BookDTO => typeof b === 'object' && 'isbn' in b,
  );

  return (
    <main className="bg-background flex h-full w-full flex-col">
      {showCarousel && (
        <div className="p-4">
          <BookCarousel
            books={carouselBooks}
            slidesToShow={6}
            className="border border-transparent"
          />
        </div>
      )}

      <section className="flex flex-1 flex-col items-center overflow-y-auto px-4 pb-8">
        <div className="w-full max-w-2xl py-6">
          <h1 className="mb-6 text-2xl font-bold">Olá {userMock1.name}! Aqui está o seu feed 📚</h1>

          <div className="space-y-6">
            {postsMock.map((post) => (
              <PostCard key={post.postID} {...post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
