// app/feed/client.tsx
'use client';

import { Session } from 'next-auth';
import { useAllBooks } from '@/hooks/book/useAllBooks';
import BookCarousel from '@/src/components/core/BookCarousel';

export default function FeedClient({ session }: { session: Session | null }) {
  const username = session?.user.username ?? 'leitor';
  const { data: carouselBooks = [], isLoading, error } = useAllBooks();

  if (isLoading) return <p>Carregando livros...</p>;
  if (error) return <p>Erro ao carregar livros.</p>;

  return (
    <main className="bg-background flex h-full w-full flex-col">
      <section className="flex flex-1 flex-col items-center overflow-y-auto px-4 pb-8">
        <div className="w-full max-w-2xl">
          <BookCarousel
            books={carouselBooks}
            slidesToShow={4}
            className="border-accent rounded-lg border"
          />
        </div>

        <div className="w-full max-w-2xl py-6">
          <h1 className="mb-6 text-2xl font-bold">Olá {username}! Aqui está o seu feed 📚 </h1>
        </div>
      </section>
    </main>
  );
}
