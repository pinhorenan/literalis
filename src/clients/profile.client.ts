// src/clients/profileClient.ts
import { PublicProfileDTO } from '@models/profile.model';

const PROFILE_BASE = '/api/profile';

/**
 * Recupera perfil público de um usuário, incluindo posts, seguidores,
 * following e entradas públicas da estante.
 * GET /api/profile/:username
 */
export async function getPublicProfile(username: string): Promise<PublicProfileDTO> {
  const res = await fetch(`${PROFILE_BASE}/${encodeURIComponent(username)}`);
  if (res.status === 404) {
    throw new Error('Usuário não encontrado');
  }
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao carregar perfil');
  }
  return res.json();
}
