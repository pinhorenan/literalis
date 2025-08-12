// src/app/[username]/profile/page.tsx
import ProfileHeader from '@/components/pages/profile/ProfileHeader';
import { UserStats } from '@/components/pages/profile/UserStats';
import { UserPosts } from '@/components/pages/profile/UserPosts';
import { ReactNode } from 'react';
import './profile.css';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<ReactNode> {
  const { username } = await params;

  return (
    <main className="app-container max-w-4xl space-y-6 py-2">
      {/* Profile Header */}
      <div className="profile-enter">
        <ProfileHeader username={username} />
      </div>

      {/* User Statistics */}
      <div className="stats-enter">
        <UserStats username={username} />
      </div>

      {/* User Posts */}
      <div>
        <UserPosts username={username} />
      </div>
    </main>
  );
}
