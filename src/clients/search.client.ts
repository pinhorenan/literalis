// src/clients/searchClient.ts
import { SearchResultDTO } from '@models/search-result.model';

const SEARCH_BASE = '/api/search';

/**
 * Busca global de usuários e livros.
 * GET /api/search?query=...&userLimit=...&bookLimit=...
 */
export async function search(
  query: string,
  userLimit = 20,
  bookLimit = 20,
): Promise<SearchResultDTO> {
  const params = new URLSearchParams({
    query,
    userLimit: String(userLimit),
    bookLimit: String(bookLimit),
  });
  const res = await fetch(`${SEARCH_BASE}?${params}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro na busca global');
  }
  return res.json();
}
