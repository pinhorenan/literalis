// src/services/AuthService.ts
import { httpClient } from '@services/HTTPClient';
import type { SignUpDTO } from '@dto/auth.dto';
import type { UserDTO }   from '@dto/user.dto';

export const AuthService = {
  signUp: (data: SignUpDTO) =>
    httpClient.post<UserDTO>('/api/auth/signup', data),
};
