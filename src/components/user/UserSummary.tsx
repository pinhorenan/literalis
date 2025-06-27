'use server';

import UserAvatar from '@components/user/UserAvatar';
import Link from 'next/link';
import type { MinimalUserDTO } from '@models/userModels';

interface Props {
  user: MinimalUserDTO;
  size?: 'sm' | 'md' | 'lg';
  redirect?: boolean;
  className?: string;
}

export default function UserSummary({ user, size = 'md', redirect = true, className = '' }: Props) {
  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-md' : 'text-lg';

  return (
    <div className={`flex w-full items-center gap-3 ${className}`}>
      <UserAvatar user={user} size={size} redirect={redirect} />
      <div>
        {redirect ? (
          <Link
            href={`/profile/${user.username}`}
            className={`${textSize} font-bold text-[var(--text-primary)] hover:underline`}
          >
            {user.name}
          </Link>
        ) : (
          <p className={`${textSize} font-bold text-[var(--text-primary)]`}>{user.name}</p>
        )}
        <p className="text-sm text-[var(--text-secondary)]">@{user.username}</p>
      </div>
    </div>
  );
}
