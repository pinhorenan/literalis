// File: src/app/profile/me/bookshelf/page.tsx
import { getServerSession }   from 'next-auth';
import { redirect }           from 'next/navigation';
import { authOptions }        from '@/src/lib/auth/auth';

export default async function MeBookshelf() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.username) {
    return redirect('/signin');
  }

  return redirect(`/profile/${session.user.username}/bookshelf`);
}
