// app/profile/[username]/page.tsx

import ProfileHeader from '@/components/ProfileHeader';
import { ReactNode } from 'react';

// Esta é uma Server Component por padrão
// Ela recebe o username via params e renderiza o Header (que é Client Component)
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
      {/* Aqui você pode futuramente adicionar o feed de posts, modais, etc. */}
    </main>
  );
}
