// File: src/components/server/user/UserSummary.tsx
import UserAvatar from '@components/server/user/UserAvatar';
import Link       from 'next/link';
import type { UserDTO } from '@dto/user.dto';

export interface UserSummaryProps {
  user: UserDTO;
  size?: 'sm' | 'md' | 'lg';
  redirect?: boolean;
  className?: string;
}

export default function UserSummary({
  user,
  size = 'md',
  redirect = true,
  className = '',
}: UserSummaryProps) {
  const textSize = size === 'sm'
    ? 'text-sm'
    : size === 'md'
      ? 'text-md'
      : 'text-lg';

  return (
    <div className={`flex items-center gap-3 w-full ${className}`}>
      <UserAvatar user={user} size={size} redirect={redirect} />
      <div>
        {redirect ? (
          <Link
            href={`/profile/${user.username}`}
            className={`${textSize} text-[var(--text-primary)] font-bold hover:underline`}
          >
            {user.name}
          </Link>
        ) : (
          <p className={`${textSize} text-[var(--text-primary)] font-bold`}>
            {user.name}
          </p>
        )}
        <p className="text-sm text-[var(--text-secondary)]">
          @{user.username}
        </p>
      </div>
    </div>
  );
}
