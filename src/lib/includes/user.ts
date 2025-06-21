// src/lib/repository/user.includes.ts
import type { db } from '@prisma/client'

export const publicUserSelect = {
  username:  true,
  name:      true,
  avatarUrl: true,
  bio:       true,
  createdAt: true,
  updatedAt: true,
} as const

/** Retorna apenas os Campos e Relações necessárias para montar o DTO */
export function userSelectArgs(viewerUsername?: string | null): { select: db.userSelect } {
  return {
    select: {
      ...publicUserSelect,

      // Contagens
      _count: {
        select: {
          posts:     true,
          bookshelf: true,
          followers: true,
          following: true,
        },
      },

      // Relações para follower/following (só usernames e ordenados)
      followers: {
        select: { followerUsername: true },
        orderBy: { createdAt: 'asc' },   // TS infere 'asc' como SortOrder via contexto
      },
      following: {
        select: { followedUsername: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  }
}
