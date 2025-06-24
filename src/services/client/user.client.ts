// src/services/client/user.client.ts
import type {
  UserProfileDTO,
  UserDTO,
  MinimalUserDTO,
} from '@/src/models/user.model';

const BASE = '/api/users';

async function jsonFetch<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export interface CursorPage<T> {
  items: T[];
  nextCursor?: string;
}

export const UserClient = {
  /* ---------------------------------- read --------------------------------- */
  /** Perfil público (ou privado se auth && username === viewer) */
  get(username: string): Promise<UserProfileDTO> {
    return jsonFetch(`${BASE}/${username}`);
  },

  /** Perfil privado do viewer (inclui email) */
  me(): Promise<UserProfileDTO & { email: string }> {
    return jsonFetch(`${BASE}/me`);
  },

  /* --------------------------------- write --------------------------------- */
  update(username: string, data: Partial<UserDTO>): Promise<UserDTO> {
    return jsonFetch(`${BASE}/${username}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  toggleFollow(username: string): Promise<{ followed: boolean }> {
    return jsonFetch(`${BASE}/${username}/follow`, { method: 'PATCH' });
  },

  /* ------------------------------ collections ------------------------------ */
  followers(
    username: string,
    limit = 20,
    cursor?: string
  ): Promise<CursorPage<MinimalUserDTO>> {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (cursor) qs.set('cursor', cursor);
    return jsonFetch(`${BASE}/${username}/followers?${qs.toString()}`);
  },

  following(
    username: string,
    limit = 20,
    cursor?: string
  ): Promise<CursorPage<MinimalUserDTO>> {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (cursor) qs.set('cursor', cursor);
    return jsonFetch(`${BASE}/${username}/following?${qs.toString()}`);
  },

  search(q: string): Promise<MinimalUserDTO[]> {
    return jsonFetch(`${BASE}/search?q=${encodeURIComponent(q)}`);
  },
};
