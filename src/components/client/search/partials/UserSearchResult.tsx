// src/components/client/search/partials/UserSearchResult.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { PublicUserDTO } from '@/src/models/user.model';

export default function UserSearchResult({ users }: { users: PublicUserDTO[] }) {
  return (
    <>
      {users.map(user => (
        <Link
          key={user.username}
          href={`/profile/${user.username}`}
          className="flex items-center gap-3"
        >
          <Image
            src={user.avatarUrl}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span>{user.name}</span>
        </Link>
      ))}
    </>
  );
}
