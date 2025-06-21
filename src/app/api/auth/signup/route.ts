// File: pages/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { prisma } from '@server/prisma'; // ajuste o import conforme seu path
import type { SignUpDTO } from '@dto/auth.dto';
import type { UserDTO }   from '@dto/user.dto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserDTO | { error: string; errors?: any }>
) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', ['POST']).status(405).end();
  }

  const { username, name, email, password, avatarUrl, bio } = req.body as SignUpDTO;

  // validações básicas
  if (!username || !name || !password) {
    return res.status(400).json({ error: 'username, name e password são obrigatórios' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(409).json({ error: 'Usuário já existe' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        name,
        email,
        password: hashed,
        avatarUrl: avatarUrl || '/assets/avatars/default.jpg',
        bio,
      },
      select: {
        username: true,
        name: true,
        email: true,
        avatarUrl: true,
        bio: true,
      }
    });

    // mapeia para UserDTO
    const dto: UserDTO = {
      username: user.username,
      name:     user.name,
      avatarUrl:user.avatarUrl!,
      bio:      user.bio || 'Esse usuário ainda não tem uma bio.',
    };

    return res.status(201).json(dto);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno ao criar usuário' });
  }
}
