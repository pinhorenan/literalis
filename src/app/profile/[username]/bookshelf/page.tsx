// src/app/profile/[username]/bookshelf/page.tsx
import { ReactNode } from 'react';

interface BookshelfPageProps {
  params: { username: string };
}

export default function BookshelfPage({ params }: BookshelfPageProps): ReactNode {
  const { username } = params;

  return (
    <main className="mx-auto my-8 max-w-2xl">
      <h1 className="mb-4 text-2xl font-semibold">Livros de {username}</h1>
      {/* Aqui você pode adicionar a lógica para exibir os livros do usuário */}
      <p>Esta é a prateleira de livros de {username}.</p>
    </main>
  );
}
