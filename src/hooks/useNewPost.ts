// src/hooks/useNewPost.ts
import { useState, useCallback, useMemo } from 'react';
import { PostService } from '@/src/lib/services/postService';

export default function useNewPost(onSuccess?: () => void) {
  const [selectedBook, setSelectedBook] = useState('');
  const [excerpt, setExcerpt]           = useState('');
  const [currentPage, setCurrentPage]   = useState(1);
  const [pagesTotal, setPagesTotal]     = useState(1);
  const progress = useMemo(
    () => Math.round((currentPage / pagesTotal) * 100),
    [currentPage, pagesTotal]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleBookSelect = useCallback((isbn: string, pages = 1) => {
    setSelectedBook(isbn);
    setPagesTotal(Math.max(1, pages));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const submit = useCallback(async () => {
    if (!selectedBook) return;
    setLoading(true); setError(null);
    try {
      await PostService.create(selectedBook, excerpt.trim(), progress);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally { setLoading(false); }
  }, [selectedBook, excerpt, progress, onSuccess]);

  return {
    selectedBook,
    handleBookSelect,
    excerpt,
    setExcerpt,
    currentPage,
    handlePageChange,
    progress,
    loading,
    error,
    submit,
  };
}
