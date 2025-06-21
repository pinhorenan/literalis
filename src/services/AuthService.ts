// File: src/services/AuthService.ts

import { httpClient } from '@services/HTTPClient';
import type { SignInDTO, SignUpDTO } from '@dto/auth.dto';
import type { UserDTO } from '@dto/user.dto';

export const AuthService = {
  signUp: (data: SignUpDTO) => httpClient.post<UserDTO>('/api/auth/signup', data),
  signIn: (credentials: SignInDTO) =>
    httpClient.post<{ ok: boolean; url?: string; error?: string }>('/api/auth/signin', credentials),
  signOut: () => httpClient.post<{ ok: boolean }>('/api/auth/signout'),
  /** Returns the currently authenticated user or `null` if not signed in. */
  getSession: () => httpClient.get<UserDTO | null>('/api/auth/session'),
};