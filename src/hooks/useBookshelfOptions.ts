// File: src/hooks/useBookshelfOptions.ts
import useSWR from 'swr';
import { BookshelfService } from '@services/BookshelfService';
import type { UserBookDTO } from '@dto/userBook.dto';

export default function useBookshelfOptions() {
  const { data, error, isLoading } = useSWR<UserBookDTO[]>(
    'bookshelf-options',                        // chave arbitrária SWR
    () => BookshelfService.getShelfOptions()    // não passamos a key ao service
  );

  return {
    books: data ?? [],
    loading: isLoading,
    error,
  };
}
