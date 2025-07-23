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
  const viewer = data?.user!;

  const { data: suggestions, isLoading, isError } = useSuggestedUsers(5);

  if (status !== 'authenticated') return null;

  return (
    <div className="ml-0 m-8 animate-in slide-in-from-right-6 duration-700">
      {/* ---- Perfil do viewer ---- */}
      <div className="bg-card rounded-lg border shadow-sm p-4 mb-6 hover:shadow-md transition-shadow duration-300">
        <Link
          href={`/${viewer.username}/profile`}
          className="hover:bg-muted/50 flex items-center gap-3 rounded-lg p-3 transition-all duration-200 group"
        >
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-background shadow-sm ring-2 ring-primary/20">
              <AvatarImage src={viewer.avatarUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 font-semibold">
                {viewer.name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <div className="flex flex-col truncate">
            <span className="truncate text-md font-semibold group-hover:text-primary transition-colors">
              {viewer.name}
            </span>
            <span className="text-muted-foreground truncate text-sm font-medium">
              @{viewer.username}
            </span>
          </div>
        </Link>
      </div>

      {/* ---- Sugestões ---- */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-4 py-3 border-b border-border/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Perfis recomendados
          </h3>
        </div>
        
        <div className="p-2">
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <UserRowSkeleton key={i} delay={i * 100} />
          ))}
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
      <div className="hover:bg-muted/50 flex items-center gap-3 rounded-lg p-3 transition-all duration-200 group">
        <Link href={`/${user.username}/profile`} className="flex items-center gap-3 truncate flex-1">
          <div className="relative">
            <Avatar className="h-10 w-10 border ring-1 ring-border shadow-sm">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-muted to-muted/60 font-medium text-xs">
                {user.name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-background" />
          </div>
          <div className="flex flex-col truncate">
            <span className="truncate text-sm font-semibold group-hover:text-primary transition-colors">
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
          className="ml-auto text-xs px-3 py-1.5 hover:scale-105 transition-transform"
          onToggle={handleToggleFollow}
        />
      </div>
    </div>
  );
}

export function UserRowSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div 
      className="flex animate-pulse items-center gap-3 p-3 rounded-lg"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="bg-muted w-10 h-10 rounded-full ring-1 ring-border" />
      <div className="flex-1 space-y-2">
        <div className="bg-muted h-3 w-24 rounded" />
        <div className="bg-muted/70 h-2.5 w-16 rounded" />
      </div>
      <div className="bg-muted/70 h-7 w-16 rounded-md" />
    </div>
  );
}
