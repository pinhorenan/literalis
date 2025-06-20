// File: app/api/users/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession }          from 'next-auth'
import { authOptions }               from '@server/auth'
import prisma                        from '@server/prisma'

export const runtime = 'nodejs'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      username: true,
      name: true,
      bio: true,
      avatarUrl: true,
      email: true,
    },
  });

  if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })

  const [ followerCount, followingCount ] = await Promise.all([
    prisma.follow.count({ where: { followedId: username } }),
    prisma.follow.count({ where: { followerId: username } }),
  ]);

  const [ followers, following ] = await Promise.all([
    prisma.follow.findMany({
      where: { followedId: username },
      select: { followerId: true },
    }),
    prisma.follow.findMany({
      where: { followerId: username },
      select: { followedId: true },
    })
  ])

  const followerUsernames = followers.map(f => f.followerId);
  const followingUsernames = following.map(f => f.followedId);

  return NextResponse.json({
    ...user,
    followerCount,
    followingCount,
    followers: followerUsernames,
    following: followingUsernames,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  };
  const isSelf  = session.user.username === username;
  const isAdmin = session.user.role === 'ADMIN';
  if (!isSelf && !isAdmin) {
    return NextResponse.json({ error: 'Proibido' }, { status: 403 })
  };

  const { name, bio, avatarUrl } = await req.json()
  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Nome inválido' }, { status: 400 })
  };

  const updatedUser = await prisma.user.update({
    where: { username },
    data: { name, bio, avatarUrl },
    select: {
      username: true, 
      name: true, 
      bio: true, 
      avatarUrl: true,
      email: true,
    },
  });

  const [ followerCount, followingCount, followers, following ] = await Promise.all([
    prisma.follow.count({ where: { followedId: username } }),
    prisma.follow.count({ where: { followerId: username } }),
    prisma.follow.findMany({
      where: { followedId: username },
      select: { followerId: true },
    }),
    prisma.follow.findMany({
      where: { followerId: username },
      select: { followedId: true },
    }),
  ]);

  const followerUsernames = followers.map(f => f.followerId);
  const followingUsernames = following.map(f => f.followedId);

  return NextResponse.json({
    ...updatedUser,
    followerCount,
    followingCount,
    followerUsernames,
    followingUsernames,
  });
}

/* --------------------------- DELETE (opcional) ----------------------- */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  const session = await getServerSession(authOptions)
  if (!session || session.user.username !== username) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  await prisma.user.delete({ where: { username } })
  return NextResponse.json({ success: true })
}
