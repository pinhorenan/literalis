// src/services/session.service.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@libs/authOptions';

/**
 * Verifica se o usuário está autenticado.
 * @returns Verdadeiro se o usuário estiver autenticado, falso caso contrário.
 */
export async function isAuthenticated() {
  const session = await getViewerSession();
  return !!session;
}

/**
 * Obtém a sessão do usuário atual.
 * @returns A sessão do usuário ou null se não houver sessão.
 */
export async function getViewerSession() {
  const session = await getServerSession(authOptions);
  return session;
}

/**
 * Obtém o usuário autenticado.
 * @returns O usuário autenticado ou null se não houver sessão.
 */
export async function getViewerUser() {
  const session = await getViewerSession();
  return session?.user || null;
}
