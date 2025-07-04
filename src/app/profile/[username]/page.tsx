// app/profile/[username]/page.tsx
import ProfileHeader from '@/src/components/pages/profile/ProfileHeader';
import { ReactNode } from 'react';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps): ReactNode {
  const { username } = params;

  return (
    <main className="mx-auto my-8 max-w-2xl">
      <ProfileHeader username={username} />
      {/* aqui tem q adicionar os posts etc... */}
    </main>
  );
}
