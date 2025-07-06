'use client';

import React from 'react';
import clsx from 'clsx';
import { Grid3x3, List, Image as ImageIcon } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BookCard, BookCover, BookTile } from '@/components/core/Book';
import { useUserShelf, type ShelfFilters } from '@/hooks/bookshelf/useUserShelf';
import { useDebounce } from '@/hooks/useDebounce';
import type { ShelfItem } from '@/types/index';

const PAGE_SIZE = 20;

type ViewMode = 'card' | 'compact' | 'cover';

export default function BookshelfClient({ username, isOwn }: { username: string; isOwn: boolean }) {
  /* ---------------------- estado de filtros & modo ---------------------- */
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 300);

  const [status, setStatus] = React.useState<string>('all');
  const [mode, setMode] = React.useState<ViewMode>('card');

  /* --------------------------- paginação ------------------------------- */
  const [cursorStack, setCursorStack] = React.useState<(string | undefined)[]>([undefined]);
  const cursor = cursorStack.at(-1);

  const filters: ShelfFilters = {
    query: debouncedQuery || undefined,
    status: status === 'all' ? undefined : status,
  };

  const { data, isLoading, isError } = useUserShelf(username, cursor, PAGE_SIZE, filters);

  const pageIndex = cursorStack.length;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : undefined;

  const goNext = () => data?.nextCursor && setCursorStack([...cursorStack, data.nextCursor]);
  const goPrev = () => cursorStack.length > 1 && setCursorStack(cursorStack.slice(0, -1));

  /* ---------------------------- UI ------------------------------------ */
  if (isLoading) return <p>Carregando estante…</p>;
  if (isError || !data) return <p>Erro ao carregar estante.</p>;

  return (
    <main className="p-4">
      <h1 className="mb-4 text-2xl font-bold">
        {isOwn ? 'Minha Estante' : `Estante de ${username}`}
      </h1>

      {/* ---------- toolbar de busca / filtros / modo ---------- */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* pesquisa */}
        <Input
          placeholder="Buscar título ou autor…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:max-w-xs"
        />

        {/* status */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="TO_READ">Para ler</SelectItem>
            <SelectItem value="READING">Lendo</SelectItem>
            <SelectItem value="READ">Lidos</SelectItem>
            <SelectItem value="ABANDONED">Abandonados</SelectItem>
          </SelectContent>
        </Select>

        {/* modo de exibição */}
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(v) => v && setMode(v as ViewMode)}
          className="ml-auto"
        >
          <ToggleGroupItem value="card" aria-label="Modo detalhado">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="compact" aria-label="Modo compacto">
            <Grid3x3 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="cover" aria-label="Somente capas">
            <ImageIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* ---------------- grade/lista de livros ---------------- */}
      <div
        className={clsx(
          mode === 'card' && 'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
          mode === 'compact' &&
            'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
          mode === 'cover' && 'grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8',
        )}
      >
        {data.items.map((item: ShelfItem) => {
          if (mode === 'cover') {
            return <BookCover key={item.bookIsbn} isbn={item.bookIsbn} />;
          }

          if (mode === 'compact') {
            return <BookTile key={item.bookIsbn} isbn={item.bookIsbn} />;
          }

          /* modo "card" detalhado */
          return <BookCard key={item.bookIsbn} isbn={item.bookIsbn} />;
        })}
      </div>

      {/* ----------------------- paginação ---------------------- */}
      <Pagination className="mt-8">
        <PaginationContent>
          {pageIndex > 1 && <PaginationPrevious onClick={goPrev} className="cursor-pointer" />}

          <PaginationItem>
            <PaginationLink isActive size="default">
              {pageIndex}
              {totalPages ? ` / ${totalPages}` : ''}
            </PaginationLink>
          </PaginationItem>

          {data.nextCursor && <PaginationNext onClick={goNext} className="cursor-pointer" />}
        </PaginationContent>
      </Pagination>
    </main>
  );
}
