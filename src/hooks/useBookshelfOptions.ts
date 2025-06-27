import { useBookshelfEntries } from './useBookshelf';

export default function useBookshelfOptions() {
  const {
    data = [],
    isLoading,
    error,
  } = useBookshelfEntries(true);

  return {
    books: data,
    loading: isLoading,
    error: (error as Error | undefined)?.message || null,
  };
}
