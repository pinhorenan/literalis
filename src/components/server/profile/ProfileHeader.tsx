// File: src/components/server/profile/ProfileHeader.tsx
import Link from 'next/link';
import { BookOpen, MessageSquare, Edit2 } from 'lucide-react';
import { Button } from '@components/client/ui/Buttons';
import FollowButton from '@components/client/ui/FollowButton';
import UserAvatar from '@components/server/user/UserAvatar';
import type { UserDTO } from '@dto/user.dto';

interface Props {
  user: UserDTO;
  isSelf: boolean;
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
  onFollowToggle: () => void;
  onEditClick: () => void;
}

export default function ProfileHeader({
  user,
  isSelf,
  isFollowing,
  followerCount,
  followingCount,
  onFollowToggle,
  onEditClick,
}: Props) {
  return (
    <div className="
      flex flex-col items-center
      md:flex-row md:items-center
      justify-between gap-4
      border-b border-[var(--border-base)] pb-4
    ">
      <UserAvatar user={user} redirect={false} size="xl" />

      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-2 gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
          <div className="flex space-x-4 text-sm">
            <span><strong>{followerCount}</strong> Seguidores</span>
            <span><strong>{followingCount}</strong> Seguindo</span>
          </div>
        </div>

        <p className="text-sm text-[var(--text-secondary)]">
          {user.bio ?? 'Este usuário ainda não escreveu uma biografia.'}
        </p>

        <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
          <Link href={`/profile/${user.username}/bookshelf`}>
            <Button variant="default" size="sm" className="gap-1">
              <BookOpen size={16} /> Estante
            </Button>
          </Link>

          {!isSelf && (
            <>
              <Button variant="default" size="sm" className="gap-1">
                <MessageSquare size={16} /> Mensagem
              </Button>
              <FollowButton
                targetUsername={user.username}
                initialFollowing={isFollowing}
                onToggle={onFollowToggle}
                className="flex items-center gap-1"
              />
            </>
          )}

          {isSelf && (
            <Button variant="default" size="sm" onClick={onEditClick} className="gap-1">
              <Edit2 size={16} /> Editar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
