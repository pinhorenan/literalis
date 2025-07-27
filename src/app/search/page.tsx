// src/app/search/page.tsx
'use client';

import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookCover } from '@/components/core/Book';
import { Toaster } from '@/components/ui/sonner';
import { Search, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'books' | 'users'>('books');
  const debouncedQuery = useDebounce(query, 300);

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <Toaster position="bottom-right" />

      <div className="space-y-6">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold">Buscar</h1>
          <p className="text-muted-foreground">
            Encontre livros e usuários na comunidade Literalis
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mx-auto max-w-lg">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            type="text"
            placeholder="Digite o que você está procurando..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="py-3 pl-10 pr-4 text-base"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-muted flex rounded-lg p-1">
            <Button
              variant={activeTab === 'books' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('books')}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Livros
            </Button>
            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('users')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Usuários
            </Button>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {!debouncedQuery ? (
            <EmptyState activeTab={activeTab} />
          ) : (
            <SearchResults query={debouncedQuery} activeTab={activeTab} />
          )}
        </div>
      </div>
    </main>
  );
}

function EmptyState({ activeTab }: { activeTab: 'books' | 'users' }) {
  const isBooks = activeTab === 'books';

  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
        <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
          {isBooks ? (
            <BookOpen className="text-muted-foreground h-8 w-8" />
          ) : (
            <Users className="text-muted-foreground h-8 w-8" />
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {isBooks ? 'Procurar Livros' : 'Procurar Usuários'}
          </h3>
          <p className="text-muted-foreground text-sm">
            {isBooks
              ? 'Digite o título, autor ou ISBN de um livro para começar a busca.'
              : 'Digite o nome ou nome de usuário para encontrar outros leitores.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SearchResults({ query, activeTab }: { query: string; activeTab: 'books' | 'users' }) {
  // Esta é uma implementação placeholder
  // Em uma implementação real, você faria chamadas para APIs de busca

  return (
    <Card>
      <CardContent className="py-12 text-center">
        <div className="space-y-4">
          <Search className="text-muted-foreground mx-auto h-12 w-12 opacity-50" />
          <div>
            <h3 className="mb-2 text-lg font-semibold">Resultados de busca</h3>
            <p className="text-muted-foreground">
              Funcionalidade de busca será implementada em breve.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Buscando por: "{query}" em {activeTab === 'books' ? 'livros' : 'usuários'}
            </p>
          </div>
          <div className="pt-4">
            <Button variant="outline" asChild>
              <Link href="/feed">Voltar ao Feed</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
