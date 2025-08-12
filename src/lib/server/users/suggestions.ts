// src/server/users/suggestions.ts
import { prisma } from '@/lib/prisma';

export async function getSuggestedUsers(viewerId: string, limit = 10) {
  const users = await prisma.$queryRaw<
    { id: string; username: string; name: string | null; avatarUrl: string | null }[]
  >`
    SELECT "User".id, username, name, "avatarUrl"
    FROM "User"
    WHERE "User".id <> ${viewerId}
      AND NOT EXISTS (
        SELECT 1 FROM "Follow"
        WHERE "Follow"."followerId" = ${viewerId}
          AND "Follow"."followedId" = "User".id
      )
    ORDER BY random()
    LIMIT ${limit};
  `;
  return users;
}
