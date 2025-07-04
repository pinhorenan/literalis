'use server';

import { auth, unstable_update } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function completeOnboarding(
  _prevState: { success: boolean; error?: string },
  formData: FormData
) {
  const username = (formData.get('username') as string)?.trim();

  if (!username || !/^[a-z0-9_]{3,32}$/i.test(username)) {
    return { success: false, error: 'Username inválido' };
  }

  const session = await auth();
  if (!session?.user) return { success: false, error: 'Não autenticado' };

  const exists = await prisma.user.findUnique({ where: { username } });
  if (exists) return { success: false, error: 'Username já existe' };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { username },
  });

  await unstable_update({ user: { username } });

  return { success: true };
}
