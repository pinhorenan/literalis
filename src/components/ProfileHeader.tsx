// src/components/ProfileHeader.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToggleFollow } from '@/hooks/useToggleFollow';
import { useBooksCount } from '@/hooks/useBooksCount';
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
    <header className="flex flex-col items-center rounded-lg bg-white p-6 shadow">
      <Image
        src={user.avatarUrl || '/default-avatar.png'}
        alt={`${user.username}'s avatar`}
        width={120}
        height={120}
        className="rounded-full"
      />
      <h1 className="mt-4 text-2xl font-semibold">
        {user.name} <span className="text-gray-500">@{user.username}</span>
      </h1>
      <p className="mt-2 text-center text-gray-700">{user.bio}</p>

      <div className="mt-4 flex space-x-4 text-gray-600">
        <span>{counts.followers} seguidores</span>
        <span>{counts.following} seguindo</span>
        <Link href={`/profile/${username}/bookshelf`} className="hover:underline">
          {isBooksCountLoading ? '...' : `${booksCount} livros na estante`}
        </Link>
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
