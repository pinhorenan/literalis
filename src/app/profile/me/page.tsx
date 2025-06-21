// File: src/app/profile/me/page.tsx
import { redirect }           from 'next/navigation';
import { getServerSession }   from 'next-auth';
import { authOptions }        from '@/src/lib/auth/auth';

export default async function Me() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.username) {
    return redirect('/signin');
  }

  return redirect(`/profile/${session.user.username}`);
}
