'use client';

import { useState } from 'react';
import { userMock1 } from '@/src/lib/mocks/user.mocks';
import * as books from '@/src/lib/mocks/book.mocks';
import { postsMock } from '@/src/lib/mocks/post.mocks';
import type { BookDTO } from '@/src/hooks/types/book.type';
import { getServerSession } from 'next-auth';
import { options } from '@/src/lib/auth';
import type { Session } from 'next-auth';

import BookCarousel from '@/src/components/book/BookCarousel';
import PostCard from '@/src/components/PostCard';

export default function HomePage() {
  // Obtém a sessão do usuário
  const session = getServerSession(options) as Promise<Session | null>;

  const [showCarousel] = useState(true);

  // pega todos os bookMockX exportados
  const carouselBooks = Object.values(books).filter(
    (b): b is BookDTO => typeof b === 'object' && 'isbn' in b,
  );

  return (
    <main className="bg-background flex h-full w-full flex-col">
      <section className="flex flex-1 flex-col items-center overflow-y-auto px-4 pb-8">
        {showCarousel && (
          <div className="w-full max-w-2xl">
            <BookCarousel
              books={carouselBooks}
              slidesToShow={4}
              className="border-accent rounded-lg border"
            />
          </div>
        )}

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
