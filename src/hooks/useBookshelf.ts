// src/hooks/useBookshelf.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { listEntries, addEntry, updateEntry, removeEntry } from '@clients/bookshelf.client';
import type { BookshelfEntryDTO } from '@models/bookshelf-entry.model';

// → queryKeys tipadas
const QUERY_KEY_ENTRIES = (includePrivate: boolean) =>
  ['bookshelf', 'entries', includePrivate] as const;

/**
 * Lista as entradas da estante (públicas ou também privadas).
 */
export function useBookshelfEntries(
  includePrivate = false,
  options?: Omit<
    UseQueryOptions<
      BookshelfEntryDTO[],
      Error,
      BookshelfEntryDTO[],
      ReturnType<typeof QUERY_KEY_ENTRIES>
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const key = QUERY_KEY_ENTRIES(includePrivate);
  return useQuery<BookshelfEntryDTO[], Error, BookshelfEntryDTO[], typeof key>({
    queryKey: key,
    queryFn: () => listEntries(includePrivate),
    staleTime: 1000 * 60 * 5, // 5 min
    ...options,
  });
}

// invalida ambos — público e privado
const invalidateAllEntries = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: QUERY_KEY_ENTRIES(false) });
  qc.invalidateQueries({ queryKey: QUERY_KEY_ENTRIES(true) });
};

/**
 * Adiciona um livro à estante.
 * mutate(bookIsbn: string)
 */
export function useAddEntry(options?: UseMutationOptions<BookshelfEntryDTO, Error, string>) {
  const qc = useQueryClient();
  return useMutation<BookshelfEntryDTO, Error, string>({
    mutationFn: (bookIsbn) => addEntry(bookIsbn),
    ...options,
    onSuccess(data, bookIsbn, ctx) {
      invalidateAllEntries(qc);
      options?.onSuccess?.(data, bookIsbn, ctx);
    },
  });
}

/**
 * Atualiza uma entrada existente.
 * mutate(data: { currentPage?, status?, rating?, isPrivate? })
 */
export function useUpdateEntry(
  bookIsbn: string,
  options?: UseMutationOptions<BookshelfEntryDTO, Error, Parameters<typeof updateEntry>[1]>,
) {
  const qc = useQueryClient();
  return useMutation<BookshelfEntryDTO, Error, Parameters<typeof updateEntry>[1]>({
    mutationFn: (data) => updateEntry(bookIsbn, data),
    ...options,
    onSuccess(data, vars, ctx) {
      invalidateAllEntries(qc);
      options?.onSuccess?.(data, vars, ctx);
    },
  });
}

/**
 * Remove (soft-delete) uma entrada.
 * mutate()
 */
export function useRemoveEntry(bookIsbn: string, options?: UseMutationOptions<void, Error, void>) {
  const qc = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => removeEntry(bookIsbn),
    ...options,
    onSuccess(data, vars, ctx) {
      invalidateAllEntries(qc);
      options?.onSuccess?.(data, vars, ctx);
    },
  });
}
