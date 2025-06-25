// src/clients/authClient.ts
import { UserCreateDTO, UserDTO } from '@models/user.model'; //

const AUTH_BASE = '/api/auth';

export async function register(data: UserCreateDTO): Promise<UserDTO> {
  const res = await fetch(`${AUTH_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao registrar usuário');
  }
  return res.json();
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(payload: ChangePasswordDTO): Promise<void> {
  const res = await fetch(`${AUTH_BASE}/change-password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Erro ao alterar senha');
  }
}
