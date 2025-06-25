// src/clients/userClient.ts
import { UserDTO, UserUpdateDTO } from '@models/user.model'; //

const USERS_BASE = '/api/users';

export async function getUserByUsername(username: string): Promise<UserDTO> {
  const res = await fetch(`${USERS_BASE}/${encodeURIComponent(username)}`);
  if (res.status === 404) throw new Error('Usuário não encontrado');
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao buscar usuário');
  }
  return res.json();
}

export async function updateUser(username: string, data: UserUpdateDTO): Promise<UserDTO> {
  const res = await fetch(`${USERS_BASE}/${encodeURIComponent(username)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (res.status === 403) throw new Error('Proibido: somente o próprio usuário pode atualizar');
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao atualizar usuário');
  }
  return res.json();
}
