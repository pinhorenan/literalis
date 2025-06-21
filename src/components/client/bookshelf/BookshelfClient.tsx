// File: src/components/client/bookshelf/BookshelfClient.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Grid, List, SortAsc, SortDesc } from 'lucide-react';
import clsx from 'clsx';

import { Button } from   '@components/client/ui/Buttons';
import SearchBar  from   '@components/client/ui/SearchBar';
import ShelfItem  from   '@components/client/bookshelf/BookShelfItem';

import { BookshelfService } from '@services/BookshelfService';
import type { UserBookDTO } from '@models/userBook.dto';

interface BookshelfClientProps {
  initialItems: UserBookDTO[];
  username: string;
  isOwner: boolean;
}

type SortKey = 'title' | 'author' | 'progressPct' | 'addedAt';

export default function BookshelfClient({
  initialItems,
  username,
  isOwner,
}: BookshelfClientProps) {
  const [userBooks, setUserBooks] = useState<UserBookDTO[]>(initialItems);
  const [filterText, setFilterText] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const updateProgress = useCallback(
    async (isbn: string, oldPct: number) => {
      // TODO: substituir prompt por modal customizado
      const input = prompt('Novo progresso (0-100):', oldPct.toString());
      if (!input) return;
      const pct = Math.max(0, Math.min(100, parseInt(input, 10)));
      if (isNaN(pct)) return;

      // Usa o método `update` do serviço, passando só o campo que mudou
      await BookshelfService.update(isbn, { progressPct: pct });
      setUserBooks((list) =>
        list.map((u) =>
          u.book.isbn === isbn
            ? {
                ...u,
                progressPct: pct,
                // Recalcula pages caso disponível
                progressPages: u.book.pages != null
                  ? Math.round((u.book.pages * pct) / 100)
                  : u.progressPages,
              }
            : u
        )
      );
    },
    []
  );

  const removeBook = useCallback(
    async (isbn: string) => {
      // TODO: substituir confirm por modal customizado
      if (!confirm('Remover este livro da sua estante?')) return;
      // Usa o método `remove` do serviço
      await BookshelfService.remove(isbn);
      setUserBooks((list) => list.filter((u) => u.book.isbn !== isbn));
    },
    []
  );

  const displayed = useMemo(() => {
    return userBooks
      .filter((u) => {
        const { title, author } = u.book;
        return (
          title.toLowerCase().includes(filterText.toLowerCase()) ||
          author.toLowerCase().includes(filterText.toLowerCase())
        );
      })
      .sort((a, b) => {
        let va: string | number = '';
        let vb: string | number = '';
        switch (sortKey) {
          case 'title':
            va = a.book.title;
            vb = b.book.title;
            break;
          case 'author':
            va = a.book.author;
            vb = b.book.author;
            break;
          case 'progressPct':
            va = a.progressPct ?? 0;
            vb = b.progressPct ?? 0;
            break;
          case 'addedAt':
            va = a.addedAt;
            vb = b.addedAt;
            break;
        }
        if (va < vb) return sortOrder === 'asc' ? -1 : 1;
        if (va > vb) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [userBooks, filterText, sortKey, sortOrder]);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Barra de controle */}
      <div className="flex flex-col gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-sm p-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={filterText}
          onChange={setFilterText}
          placeholder="Buscar na estante..."
        />
        <div className="flex flex-wrap gap-4 items-center justify-between sm:justify-end w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Ordenar:</label>
            <select
              className="border border-[var(--border-base)] rounded-md p-1 text-sm bg-[var(--surface-bg)] focus:outline-none focus:ring-1 focus:ring-[var(--border-hover)]"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              <option value="title">Título</option>
              <option value="author">Autor</option>
              <option value="progressPct">Progresso</option>
              <option value="addedAt">Adicionado em</option>
            </select>
            <Button
              variant="icon"
              size="sm"
              aria-label="Inverter ordem"
              onClick={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              icon={sortOrder === 'asc' ? SortAsc : SortDesc}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="icon"
              size="sm"
              active={viewMode === 'grid'}
              aria-label="Ver em grade"
              onClick={() => setViewMode('grid')}
              icon={Grid}
            />
            <Button
              variant="icon"
              size="sm"
              active={viewMode === 'list'}
              aria-label="Ver em lista"
              onClick={() => setViewMode('list')}
              icon={List}
            />
          </div>
        </div>
      </div>

      {/* Lista de Livros */}
      <div
        className={clsx(
          viewMode === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
            : 'flex flex-col gap-4'
        )}
      >
        {displayed.map((u) => (
          <ShelfItem
            key={u.book.isbn}
            item={u}
            viewMode={viewMode}
            isOwner={isOwner}
            onEdit={() => updateProgress(u.book.isbn, u.progressPct ?? 0)}
            onDelete={() => removeBook(u.book.isbn)}
          />
        ))}
      </div>

      {displayed.length === 0 && (
        <p className="text-center text-[var(--text-tertiary)] italic py-6">
          Nenhum livro encontrado.
        </p>
      )}
    </section>
  );
}
