// app/[username]/profile/page.tsx
import ProfileHeader from '@/src/components/pages/profile/ProfileHeader';
import { ReactNode } from 'react';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps): Promise<ReactNode> {
  const { username } = await params;

  return (
    <main className="mx-auto my-8 max-w-2xl">
      <ProfileHeader username={username} />
      {/* aqui tem q adicionar os posts etc... */}
    </main>
  );
}
