import { useState, useMemo } from 'react';
import { createPost } from '@clients/post.client';
import type { PostCreateDTO } from '@models/post.model';
import type { BookshelfEntryDTO } from '@models/bookshelf-entry.model';

export interface UseNewPostReturn {
  selectedBook: string;
  handleBookSelect: (isbn: string) => void;
  content: string;
  setContent: (v: string) => void;
  currentPage: number;
  handlePageChange: (v: number) => void;
  progress: number;
  loading: boolean;
  error: string | null;
  submit: () => Promise<void>;
}

export default function useNewPost(
  books: BookshelfEntryDTO[],
  onSuccess?: () => void | Promise<void>,
): UseNewPostReturn {
  const [selectedBook, setSelectedBook] = useState('');
  const [content, setContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => books.find(b => b.book.isbn === selectedBook),
    [books, selectedBook],
  );

  const progress = useMemo(() => {
    if (!selected) return 0;
    return selected.totalPages
      ? Math.min(100, Math.floor((currentPage / selected.totalPages) * 100))
      : 0;
  }, [currentPage, selected]);

  const handleBookSelect = (isbn: string) => {
    setSelectedBook(isbn);
    const entry = books.find(b => b.book.isbn === isbn);
    if (entry) setCurrentPage(entry.currentPage);
  };

  const handlePageChange = (v: number) => setCurrentPage(v);

  const submit = async () => {
    if (!selectedBook) return;
    setLoading(true);
    setError(null);
    try {
      const payload: PostCreateDTO = {
        bookIsbn: selectedBook,
        content,
        currentPage,
      };
      await createPost(payload);
      await onSuccess?.();
      setSelectedBook('');
      setContent('');
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedBook,
    handleBookSelect,
    content,
    setContent,
    currentPage,
    handlePageChange,
    progress,
    loading,
    error,
    submit,
  };
}
