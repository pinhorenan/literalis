// src/app/[username]/profile/page.tsx
import ProfileHeader from '@/components/pages/profile/ProfileHeader';
import { UserStats } from '@/components/pages/profile/UserStats';
import { UserPosts } from '@/components/pages/profile/UserPosts';
import { Toaster } from '@/components/ui/sonner';
import { ReactNode } from 'react';
import './profile.css';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<ReactNode> {
  const { username } = await params;

  return (
    <main className="container mx-auto px-4 py-6 max-w-6xl space-y-8">
      <Toaster position="bottom-right" />
      
      {/* Profile Header */}
      <div className="profile-enter">
        <ProfileHeader username={username} />
      </div>
      
      {/* User Statistics */}
      <div className="stats-enter">
        <UserStats username={username} />
      </div>
      
      {/* User Posts */}
      <div className="posts-enter">
        <UserPosts username={username} />
      </div>
    </main>
  );
}
