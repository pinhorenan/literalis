// src/lib/repository/user.repository.ts
import { db } from '@lib/db'
import { userSelectArgs } from '@/src/lib/includes/user'

/**
 * Busca o usuário e retorna os dados brutos do Prisma
 */
export async function findUserRaw(params: {
  username: string
  viewerUsername?: string | null
}) {
  const { username, viewerUsername = null } = params
  return db.user.findUnique({
    where: { username },
    ...userSelectArgs(viewerUsername),
  })
}
