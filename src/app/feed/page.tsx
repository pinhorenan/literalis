// app/feed/page.tsx
import { auth } from '@/lib/auth';
import FeedClient from './client';

export default async function FeedPage() {
  const session = await auth();

  if (!session) {
    return <div>Você precisa estar logado para acessar o feed.</div>;
  }

  return <FeedClient session={session} />;
}
