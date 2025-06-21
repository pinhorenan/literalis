// File: src/components/client/post/NewPost.tsx
'use client';

import React, { useState }  from 'react';
import { useSession }       from 'next-auth/react';
import { Dialog }           from '@headlessui/react';
import { BookPlus }         from 'lucide-react';
import { Button }           from '@components/client/ui/Buttons';
import NewPostForm          from '@components/client/post/NewPostForm';
import useBookshelfOptions  from '@hooks/useBookshelfOptions';
import useNewPost           from '@hooks/useNewPost';
import { BookshelfService } from '@services/BookshelfService';

export default function NewPost() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  // Hook que busca os livros da estante (UserBookDTO[])
  const { books, loading: loadingBooks, error: booksError } = useBookshelfOptions();

  // Hook que gerencia o estado do novo post
  const {
    selectedBook,
    handleBookSelect,
    excerpt,
    setExcerpt,
    currentPage,
    handlePageChange,
    progress,
    loading: submitting,
    error: submitError,
    submit,
  } = useNewPost(async () => {
    // Ao salvar o post, atualiza também o progresso na estante
    if (selectedBook) {
      await BookshelfService.updateProgress(
        selectedBook,
        progress
      );
    }
    setOpen(false);
  });

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        iconSize={30}
        variant="default"
        className="bg-transparent hover:bg-[var(--surface-card-hover)] gap-3 rounded-lg border-none"
      >
        <BookPlus />
        <strong className="text-lg text-[var(--text-secondary)]">Publicar</strong>
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-3xl rounded-md bg-[var(--surface-bg)] p-6 border border-[var(--border-base)] shadow-lg overflow-y-auto max-h-[90vh]">
            <Dialog.Title as="h2" className="text-lg font-bold mb-4">
              Novo Post
            </Dialog.Title>
            <NewPostForm
              books={books}
              loadingBooks={loadingBooks}
              booksError={booksError}
              selectedBook={selectedBook}
              onBookSelect={handleBookSelect}
              excerpt={excerpt}
              onExcerptChange={setExcerpt}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              progress={progress}
              onSubmit={submit}
              onCancel={() => setOpen(false)}
              loading={submitting}
              error={submitError}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
