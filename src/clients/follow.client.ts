// src/clients/followClient.ts
import { MinimalUserDTO } from '@models/user.model';

const FOLLOW_BASE = '/api/follow';

export interface ToggleFollowResponse {
  following: boolean;
}

/**
 * Alterna o status de follow para um usuário alvo.
 * POST /api/follow/:targetUsername
 */
export async function toggleFollow(targetUsername: string): Promise<ToggleFollowResponse> {
  const res = await fetch(`${FOLLOW_BASE}/${encodeURIComponent(targetUsername)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? 'Erro ao alternar follow');
  }
  return data as ToggleFollowResponse;
}

/**
 * Lista quem segue o usuário especificado.
 * GET /api/follow/:username/followers
 */
export async function listFollowers(username: string): Promise<MinimalUserDTO[]> {
  const res = await fetch(`${FOLLOW_BASE}/${encodeURIComponent(username)}/followers`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao listar seguidores');
  }
  return res.json();
}

/**
 * Lista quem o usuário especificado está seguindo.
 * GET /api/follow/:username/following
 */
export async function listFollowing(username: string): Promise<MinimalUserDTO[]> {
  const res = await fetch(`${FOLLOW_BASE}/${encodeURIComponent(username)}/following`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao listar seguindo');
  }
  return res.json();
}
