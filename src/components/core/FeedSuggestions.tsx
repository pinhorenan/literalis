// src/components/layout/sidebars/SuggestionsSidebar.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSuggestedUsers } from '@/hooks/user';
import { FollowButton } from '@/components/layout/buttons/FollowButton';
import { toast } from 'sonner';
import type { MinimalUser } from '@/types/user';

export function FeedSuggestions() {
  const { status, data } = useSession();
  if (!data?.user) {
    return null;
  }
  const viewer = data.user;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: suggestions, isLoading, isError } = useSuggestedUsers(5);

  if (status !== 'authenticated') return null;

  return (
    <div className="animate-in slide-in-from-right-6 m-8 ml-0 duration-700">
      {/* ---- Perfil do viewer ---- */}
      <div className="bg-card mb-6 rounded-lg p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <Link
          href={`/${viewer.username}/profile`}
          className="hover:bg-muted/50 group flex items-center gap-3 rounded-lg p-3 transition-all duration-200"
        >
          <div className="relative">
            <Avatar className="border-background ring-primary/20 h-12 w-12 border-2 shadow-sm ring-2">
              <AvatarImage src={viewer.avatarUrl || undefined} />
              <AvatarFallback className="from-primary/20 to-secondary/20 bg-gradient-to-br font-semibold">
                {viewer.name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="border-background absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 bg-green-500" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-md group-hover:text-primary truncate font-semibold transition-colors">
              {viewer.name}
            </span>
            <span className="text-muted-foreground truncate text-sm font-medium">
              @{viewer.username}
            </span>
          </div>
        </Link>
      </div>

      {/* ---- Sugestões ---- */}
      <div className="bg-card overflow-hidden rounded-lg shadow-sm">
        <div className="from-primary/5 to-secondary/5 border-border/50 border-b bg-gradient-to-r px-4 py-3">
          <h3 className="text-foreground flex items-center gap-2 font-semibold">
            <span className="bg-primary h-2 w-2 animate-pulse rounded-full"></span>
            Perfis recomendados
          </h3>
        </div>

        <div className="p-2">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => <UserRowSkeleton key={i} delay={i * 100} />)}
          {isError && (
            <div className="px-4 py-6 text-center">
              <p className="text-destructive text-sm font-medium">
                Não foi possível carregar as sugestões.
              </p>
            </div>
          )}
          {suggestions?.map((user, index) => (
            <SuggestionRow key={user.id} user={user} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SuggestionRow({ user, index = 0 }: { user: MinimalUser; index?: number }) {
  const handleToggleFollow = (wasFollowing: boolean, username: string) => {
    if (wasFollowing) {
      toast.success(`Você deixou de seguir @${username}`);
    } else {
      toast.success(`Você agora segue @${username}`);
    }
  };

  return (
    <div
      className="animate-in slide-in-from-right-4 duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="hover:bg-muted/50 group flex items-center gap-3 rounded-lg p-3 transition-all duration-200">
        <Link
          href={`/${user.username}/profile`}
          className="flex flex-1 items-center gap-3 truncate"
        >
          <div className="relative">
            <Avatar className="ring-border h-10 w-10 border shadow-sm ring-1">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="from-muted to-muted/60 bg-gradient-to-br text-xs font-medium">
                {user.name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="border-background absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border bg-green-500" />
          </div>
          <div className="flex flex-col truncate">
            <span className="group-hover:text-primary truncate text-sm font-semibold transition-colors">
              {user.name}
            </span>
            <span className="text-muted-foreground text-xs font-medium">@{user.username}</span>
          </div>
        </Link>

        <FollowButton
          username={user.username}
          variant="outline"
          size="sm"
          showIcon={false}
          className="ml-auto px-3 py-1.5 text-xs transition-transform hover:scale-105"
          onToggle={handleToggleFollow}
        />
      </div>
    </div>
  );
}

export function UserRowSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex animate-pulse items-center gap-3 rounded-lg p-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="bg-muted ring-border h-10 w-10 rounded-full ring-1" />
      <div className="flex-1 space-y-2">
        <div className="bg-muted h-3 w-24 rounded" />
        <div className="bg-muted/70 h-2.5 w-16 rounded" />
      </div>
      <div className="bg-muted/70 h-7 w-16 rounded-md" />
    </div>
  );
}
