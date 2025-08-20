// src/components/pages/profile/ProfileHeader.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Users, BookOpen, Edit3 } from 'lucide-react';
import { useBooksCount, useUserProfile } from '@/hooks/user';
import { FollowButton } from '@/components/FollowButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function ProfileHeader({ username }: { username: string }) {
  const { data: session } = useSession();
  const viewerUsername = session?.user?.username;

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useUserProfile(username);

  const { data: BooksCount, isLoading: isBooksCountLoading } = useBooksCount(username);

  if (isProfileLoading || !profile) {
    return <ProfileHeaderSkeleton />;
  }

  if (isProfileError) {
    return (
      <div className="bg-card flex flex-col items-center justify-center rounded-lg p-8 text-center">
        <h2 className="text-destructive text-xl font-semibold">Erro ao carregar perfil</h2>
        <p className="text-muted-foreground mt-2">
          Não foi possível carregar as informações do usuário.
        </p>
      </div>
    );
  }

  const { user, counts, isFollowing } = profile;
  const isMe = viewerUsername === username;
  const booksCount = BooksCount?.books ?? counts.books ?? 0;

  const handleToggleFollow = (isFollowing: boolean, username: string) => {
    if (isFollowing) {
      toast.success(`Você deixou de seguir @${username}`);
    } else {
      toast.success(`Você agora segue @${username}`);
    }
  };

  return (
    <div className="card-surface overflow-hidden">
      {/* Header Cover - subtle gradient */}
      <div className="from-primary/20 to-secondary/20 relative h-28 overflow-hidden bg-gradient-to-r md:h-32">
        <div className="absolute inset-0 bg-black/0" />
      </div>

      {/* Profile Content */}
      <div className="px-5 pb-5">
        {/* Avatar and Actions */}
        <div className="-mt-14 mb-3 flex items-end justify-between">
          <div className="relative">
            <div className="bg-background rounded-full p-1">
              <Image
                src={user.avatarUrl || '/default-avatar.png'}
                alt={`${user.username}'s avatar`}
                width={96}
                height={96}
                className="border-background rounded-full border-4 shadow-sm"
              />
            </div>
          </div>

          <div className="mb-3 flex gap-2">
            {isMe ? (
              <Button variant="outline" size="sm">
                <Edit3 className="mr-2 h-4 w-4" />
                Editar perfil
              </Button>
            ) : (
              <FollowButton
                username={username}
                variant="default"
                size="default"
                onToggle={handleToggleFollow}
              />
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-3">
          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>

          {user.bio && <p className="text-sm leading-relaxed">{user.bio}</p>}

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm">
            <Link
              href={`/${username}/bookshelf`}
              className="hover:text-primary flex items-center gap-1 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">{isBooksCountLoading ? '...' : booksCount}</span>
              <span className="text-muted-foreground">livros</span>
            </Link>

            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="font-medium">{counts.followers}</span>
              <span className="text-muted-foreground">seguidores</span>
            </div>

            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="font-medium">{counts.following}</span>
              <span className="text-muted-foreground">seguindo</span>
            </div>
          </div>

          {/* Status Badge */}
          {isFollowing && !isMe && (
            <Badge variant="secondary" className="w-fit">
              Te segue
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileHeaderSkeleton() {
  return (
    <div className="card-surface overflow-hidden">
      {/* Header Cover Skeleton */}
      <Skeleton className="h-28 w-full" />

      {/* Profile Content Skeleton */}
      <div className="px-6 pb-6">
        <div className="-mt-14 mb-3 flex items-end justify-between">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="mb-4 h-10 w-32" />
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-32" />
          </div>

          <Skeleton className="h-12 w-full" />

          <div className="flex gap-6">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
