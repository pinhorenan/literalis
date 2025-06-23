'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@components/client/ui/Buttons';
import type { BookshelfDTO } from '@/src/models/bookshelf.dto';

export interface NewPostFormProps {
  books: BookshelfDTO[];
  loadingBooks: boolean;
  booksError: string | null;
  selectedBook: string;
  onBookSelect: (isbn: string) => void;
  content: string;
  onContentChange: (value: string) => void;
  currentPage: number;
  onPageChange: (value: number) => void;
  progress: number;
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
}

export default function NewPostForm({
  books,
  loadingBooks,
  booksError,
  selectedBook,
  onBookSelect,
  content,
  onContentChange,
  currentPage,
  onPageChange,
  progress,
  onSubmit,
  onCancel,
  loading,
  error,
}: NewPostFormProps) {
  const selected = books.find(u => u.book.isbn === selectedBook);

  return (
    <div className="max-w-3xl mt-4">
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
        className="grid md:grid-cols-2 gap-6 p-4 border rounded bg-[var(--surface-bg)]"
      >
        {/* Seleção de livro */}
        <div>
          <label className="block mb-1 font-medium">Livro</label>
          {loadingBooks ? (
            <p>Carregando livros…</p>
          ) : booksError ? (
            <p className="text-red-500">{booksError}</p>
          ) : (
            <select
              className="w-full border rounded p-2"
              value={selectedBook}
              onChange={e => onBookSelect(e.target.value)}
              required
            >
              <option value="" disabled>Selecione um livro…</option>
              {books.map(u => (
                <option key={u.book.isbn} value={u.book.isbn}>
                  {u.book.title} (atual: pág. {u.currentPage})
                </option>
              ))}
            </select>
          )}

          {selected && (
            <div className="flex gap-4 mt-4">
              <Image
                src={selected.book.coverUrl}
                alt={selected.book.title}
                width={96}
                height={144}
                className="rounded border"
              />
              <div>
                <strong>{selected.book.title}</strong>
                <p className="text-sm text-[var(--text-secondary)]">
                  {selected.book.pages ?? 0} páginas
                </p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Você está na página: {selected.currentPage}
                </p>
              </div>
            </div>
          )}

          {selected && (
            <div className="mt-4">
              <label className="block mb-1">Nova página atual</label>
              <input
                type="number"
                min={1}
                max={selected.book.pages ?? 0}
                value={currentPage}
                onChange={e => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) {
                    const max = selected.book.pages ?? 0;
                    onPageChange(Math.max(1, Math.min(v, max)));
                  }
                }}
                className="w-full border rounded p-2"
                required
              />
              <small className="text-xs text-[var(--text-tertiary)]">
                Progresso: {progress}%
              </small>
            </div>
          )}

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Texto do post */}
        <div className="flex flex-col">
          <label className="block mb-1">Trecho ou comentário</label>
          <textarea
            className="w-full border rounded p-2 flex-1"
            value={content}
            onChange={e => onContentChange(e.target.value)}
            placeholder="Escreva algo sobre o livro…"
            rows={5}
            required
          />
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-2 md:col-span-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Publicando…' : 'Publicar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
