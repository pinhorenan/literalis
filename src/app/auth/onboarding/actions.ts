// src/app/auth/onboarding/actions.ts
'use server';

import { auth, unstable_update } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function completeOnboarding(
  _prevState: { success: boolean; error?: string },
  formData: FormData,
) {
  const username = (formData.get('username') as string)?.trim();
  const name = (formData.get('name') as string)?.trim() || undefined;
  const selectedBooks = formData.get('selectedBooks') as string;
  const selectedUsers = formData.get('selectedUsers') as string;

  if (!username || !/^[a-z0-9_]{3,32}$/i.test(username)) {
    return { success: false, error: 'Username inválido' };
  }

  const session = await auth();
  if (!session?.user) return { success: false, error: 'Não autenticado' };

  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) return { success: false, error: 'Username já existe' };

  try {
    // Atualizar usuário com username e nome
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username,
        name: name || session.user.name,
      },
    });

    // Adicionar livros selecionados à estante
    if (selectedBooks) {
      const bookIsbns = JSON.parse(selectedBooks) as string[];
      if (bookIsbns.length > 0) {
        const shelfItems = bookIsbns.map((isbn) => ({
          userId: session.user.id!,
          bookIsbn: isbn,
          status: 'TO_READ' as const,
          isPrivate: false,
          addedAt: new Date(),
        }));

        await prisma.bookshelfItem.createMany({
          data: shelfItems,
        });
      }
    }

    // Seguir usuários selecionados
    if (selectedUsers) {
      const usernames = JSON.parse(selectedUsers) as string[];
      if (usernames.length > 0) {
        // Buscar IDs dos usuários pelos usernames
        const usersToFollow = await prisma.user.findMany({
          where: { username: { in: usernames } },
          select: { id: true },
        });

        if (usersToFollow.length > 0) {
          const follows = usersToFollow.map((user) => ({
            followerId: session.user.id!,
            followedId: user.id,
            createdAt: new Date(),
          }));

          await prisma.follow.createMany({
            data: follows,
          });
        }
      }
    }

    await unstable_update({ user: { username, name } });

    return { success: true };
  } catch (error) {
    console.error('Erro no onboarding:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
}
