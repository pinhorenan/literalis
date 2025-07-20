// src/components/pages/profile/ProfileHeader.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Calendar, MapPin, Link as LinkIcon, Users, BookOpen, Edit3 } from 'lucide-react';
import { useBooksCount, useUserProfile } from '@/hooks/user';
import { FollowButton } from '@/components/layout/buttons/FollowButton';
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
        <h2 className="text-xl font-semibold text-destructive">Erro ao carregar perfil</h2>
        <p className="text-muted-foreground mt-2">Não foi possível carregar as informações do usuário.</p>
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
    <div className="bg-card rounded-lg overflow-hidden shadow-lg animate-in slide-in-from-top-4 duration-700">
      {/* Header Cover - Enhanced Gradient Background */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-32 md:h-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20 animate-pulse" />
          <div className="absolute bottom-2 left-8 w-16 h-16 rounded-full bg-white/10 animate-pulse delay-300" />
          <div className="absolute top-8 left-1/3 w-12 h-12 rounded-full bg-white/15 animate-pulse delay-700" />
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="px-6 pb-6">
        {/* Avatar and Actions */}
        <div className="flex items-end justify-between -mt-16 mb-4">
          <div className="relative">
            <div className="bg-background rounded-full p-1">
              <Image
                src={user.avatarUrl || '/default-avatar.png'}
                alt={`${user.username}'s avatar`}
                width={120}
                height={120}
                className="rounded-full border-4 border-background shadow-lg"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mb-4">
            {isMe ? (
              <Button variant="outline" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
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
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>

          {user.bio && (
            <p className="text-sm leading-relaxed">{user.bio}</p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm">
            <Link 
              href={`/${username}/bookshelf`} 
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">
                {isBooksCountLoading ? '...' : booksCount}
              </span>
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
    <div className="bg-card rounded-lg overflow-hidden shadow-lg">
      {/* Header Cover Skeleton */}
      <Skeleton className="h-32 w-full" />
      
      {/* Profile Content Skeleton */}
      <div className="px-6 pb-6">
        <div className="flex items-end justify-between -mt-16 mb-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-10 w-32 mb-4" />
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
