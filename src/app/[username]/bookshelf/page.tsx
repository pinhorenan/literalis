// src/app/[username]/bookshelf/page.tsx
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUserByUsername } from '@/services/user.service';
import BookshelfClient from './client';

export default async function BookshelfPage({ params }: { params: Promise<{ username: string }> }) {
  const session = await auth();
  const { username } = await params;

  const user = await getUserByUsername(username);
  if (!user) {
    return notFound();
  }

  const isOwn = session?.user?.id === user.id;

  return <BookshelfClient userId={user.id} username={user.username!} isOwn={isOwn} />;
}
