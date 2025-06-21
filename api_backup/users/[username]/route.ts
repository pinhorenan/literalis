// src/app/api/users/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getViewer } from '@lib/auth/viewer'
import { findUserByUsername, updateUser } from '@/src/lib/services/userService'

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const viewer = await getViewer(false)
  const { username } = params

  const userDTO = await findUserByUsername({
    username,
    viewerUsername: viewer?.username ?? null,
  })

  if (!userDTO) {
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 404 }
    )
  }

  return NextResponse.json(userDTO)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const viewer = await getViewer()
  if (!viewer) {
    return NextResponse.json(
      { error: 'Não autenticado' },
      { status: 401 }
    )
  }

  const { username } = params
  if (viewer.username !== username) {
    return NextResponse.json(
      { error: 'Sem permissão' },
      { status: 403 }
    )
  }

  const data = await req.json()
  const updated = await updateUser({
    username,
    viewerUsername: viewer.username,
    data,
  })

  return NextResponse.json(updated)
}
