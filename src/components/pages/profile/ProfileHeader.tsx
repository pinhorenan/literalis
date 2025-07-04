// src/components/ProfileHeader.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useUserProfile } from '@/src/hooks/user/useUserProfile';
import { useToggleFollow } from '@/src/hooks/user/useToggleFollow';
import { useBooksCount } from '@/src/hooks/user/useBooksCount';
import { use } from 'react';

export default function ProfileHeader({ username }: { username: string }) {
  const { data: session } = useSession();
  const viewerUsername = session?.user?.username;

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useUserProfile(username);

  const toggleFollow = useToggleFollow(username);

  const { data: booksCountData, isLoading: isBooksCountLoading } = useBooksCount(username);

  if (isProfileLoading || !profile) {
    return <div>Carregando perfil...</div>;
  }

  if (isProfileError) {
    return <div>Erro ao carregar perfil.</div>;
  }

  const { user, counts, isFollowing } = profile;
  const isMe = viewerUsername === username;
  const booksCount = booksCountData?.booksCount ?? counts.posts;

  return (
    <header className="bg-card flex items-center gap-6 rounded-lg p-6 shadow">
      <Image
        src={user.avatarUrl || '/default-avatar.png'}
        alt={`${user.username}'s avatar`}
        width={120}
        height={120}
        className="rounded-full"
      />
      <div>
        <h1 className="mt-4 text-2xl font-semibold">{user.name}</h1>
        <span className="text-primary">@{user.username}</span>

        <div className="flex gap-4">
          <span>{counts.followers} seguidores</span>
          <span>{counts.following} seguindo</span>
          <Link href={`/profile/${username}/bookshelf`} className="hover:underline">
            {isBooksCountLoading ? '...' : `${booksCount} livros`}
          </Link>
        </div>

        <p className="text-secondary">{user.bio}</p>
      </div>

      {!isMe && (
        <button
          className={`mt-4 rounded px-4 py-2 ${isFollowing ? 'bg-gray-200' : 'bg-blue-600 text-white'}`}
          onClick={() => toggleFollow.mutate()}
          disabled={toggleFollow.isPending}
        >
          {toggleFollow.isPending ? '...' : isFollowing ? 'Deixar de seguir' : 'Seguir'}
        </button>
      )}
    </header>
  );
}
