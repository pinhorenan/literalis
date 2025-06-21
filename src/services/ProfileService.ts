// File: src/services/ProfileService.ts

import { httpClient } from '@services/HTTPClient';
import type { UserDTO } from '@dto/user.dto';

export const ProfileService = {
  get: (username: string) => httpClient.get<UserDTO>(`/api/users/${username}`),

  update: (username: string, data: Partial<UserDTO>) => httpClient.patch<UserDTO>(`/api/users/${username}`, data),
};