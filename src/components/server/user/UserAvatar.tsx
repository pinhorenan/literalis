// File: src/components/server/user/UserAvatar.tsx
import Image from 'next/image';
import Link  from 'next/link';
import type { PublicUserDTO } from '@/src/models/user.model';

export interface UserAvatarProps {
  user: PublicUserDTO;
  redirect?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function UserAvatar({
  user,
  redirect = true,
  size = 'md',
  className = '',
}: UserAvatarProps) {
  const { username, name, avatarUrl } = user;
  const dimension = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 94,
  }[size];

  const content = (
    <Image
      src={avatarUrl}
      alt={name}
      width={dimension}
      height={dimension}
      className={`rounded-full border border-[var(--border-subtle)] transition-colors duration-200 ease-in-out hover:border-[var(--border-base)] ${className}`}
    />
  );

  return redirect
    ? <Link href={`/profile/${username}`}>{content}</Link>
    : content;
}
