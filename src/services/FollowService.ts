// File: src/services/FollowService.ts

import { httpClient } from '@services/HTTPClient';
import type { UserDTO } from '@dto/user.dto';

export const FollowService = {
  toggle: (username: string) =>
    httpClient.post<{ isFollowing: boolean; followerCount: number }>(`/api/users/${username}/follow`),

  isFollowing: (username: string) =>
    httpClient.get<{ isFollowing: boolean }>(`/api/users/${username}/follow/status`).then((r) => r.isFollowing),

  followers: (username: string, page = 1, limit = 20) =>
    httpClient.get<UserDTO[]>(`/api/users/${username}/followers`, { params: { page, limit } }),

  following: (username: string, page = 1, limit = 20) =>
    httpClient.get<UserDTO[]>(`/api/users/${username}/following`, { params: { page, limit } }),
};