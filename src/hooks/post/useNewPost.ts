'use client';

import { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { createPostRequest } from '@services/client/post.service';
import type { UserBookDTO } from '@models/userBook.dto';

export default function useNewPost(
  bookshelf: UserBookDTO[],
  onSuccess: () => void
) {
  const [selectedBook, setSelectedBook] = useState('');
  const [content, setContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBookSelect = (isbn: string) => {
    setSelectedBook(isbn);
    setCurrentPage(1);
    setError(null);
  };

  const progress = useMemo(() => {
    const selected = bookshelf.find(b => b.book.isbn === selectedBook);
    if (!selected || !selected.book.pages) return 0;
    return Math.min(100, Math.round((currentPage / selected.book.pages) * 100));
  }, [selectedBook, currentPage, bookshelf]);

  async function submit() {
    if (!selectedBook || !content.trim()) {
      const msg = 'Livro e conteúdo são obrigatórios';
      toast.error(msg);
      setError(msg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createPostRequest({
        bookIsbn: selectedBook,
        content: content.trim(),
        progress,
      });

      toast.success('Post criado com sucesso');
      onSuccess();
    } catch {
      const msg = 'Erro ao criar post';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return {
    selectedBook,
    handleBookSelect,
    content,
    setContent,
    currentPage,
    handlePageChange: setCurrentPage,
    progress,
    loading,
    error,
    submit,
  };
}
