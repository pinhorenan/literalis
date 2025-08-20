'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSuggestedUsers } from '@/hooks/user';
import { FollowButton } from '@/components/FollowButton';
import { toast } from 'sonner';
import type { MinimalUser } from '@/types/user';

export function SuggestionsPanel() {
  const { status, data } = useSession();
  if (!data?.user) {
    return null;
  }
  const viewer = data.user;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: suggestions, isLoading, isError } = useSuggestedUsers(5);

  if (status !== 'authenticated') return null;

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* ---- Perfil do viewer ---- */}
      <div className="card-surface p-3">
        <Link
          href={`/${viewer.username}/profile`}
          className="hover:bg-muted/50 group flex items-center gap-3 rounded-md p-2"
        >
          <div className="relative">
            <Avatar className="ring-border h-12 w-12 border shadow-sm ring-1">
              <AvatarImage src={viewer.avatarUrl || undefined} />
              <AvatarFallback className="from-primary/20 to-secondary/20 bg-gradient-to-br font-semibold">
                {viewer.name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="border-background absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border bg-green-500" />
          </div>
          <div className="flex flex-col truncate">
            <span className="group-hover:text-primary truncate font-semibold">{viewer.name}</span>
            <span className="text-muted-foreground truncate text-sm font-medium">
              @{viewer.username}
            </span>
          </div>
        </Link>
      </div>

      {/* ---- Sugestões ---- */}
      <div className="card-surface overflow-hidden">
        <div className="from-primary/5 to-secondary/5 border-border/50 border-b bg-gradient-to-r px-4 py-3">
          <h3 className="text-foreground flex items-center gap-2 font-semibold">
            <span className="bg-primary h-2 w-2 animate-pulse rounded-full"></span>
            Perfis recomendados
          </h3>
        </div>

        <div className="divide-border/50 divide-y">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <MobileUserRowSkeleton key={i} delay={i * 100} />
            ))}
          {isError && (
            <div className="px-4 py-8 text-center">
              <p className="text-destructive font-medium">
                Não foi possível carregar as sugestões.
              </p>
            </div>
          )}
          {suggestions?.map((user) => (
            <MobileSuggestionRow key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileSuggestionRow({ user }: { user: MinimalUser }) {
  const handleToggleFollow = (wasFollowing: boolean, username: string) => {
    if (wasFollowing) {
      toast.success(`Você deixou de seguir @${username}`);
    } else {
      toast.success(`Você agora segue @${username}`);
    }
  };

  return (
    <div className="hover:bg-muted/50 group flex items-center gap-4 p-4">
      <Link href={`/${user.username}/profile`} className="flex flex-1 items-center gap-4 truncate">
        <div className="relative">
          <Avatar className="ring-border h-12 w-12 border shadow-sm ring-1">
            <AvatarImage src={user.avatarUrl || undefined} />
            <AvatarFallback className="from-muted to-muted/60 bg-gradient-to-br font-medium">
              {user.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="border-background absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border bg-green-500" />
        </div>
        <div className="flex flex-col truncate">
          <span className="group-hover:text-primary truncate font-semibold transition-colors">
            {user.name}
          </span>
          <span className="text-muted-foreground text-sm font-medium">@{user.username}</span>
        </div>
      </Link>

      <FollowButton
        username={user.username}
        variant="outline"
        size="sm"
        showIcon={false}
        className="ml-auto px-4 py-2"
        onToggle={handleToggleFollow}
      />
    </div>
  );
}

export function MobileUserRowSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex animate-pulse items-center gap-4 p-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="bg-muted ring-border h-12 w-12 rounded-full ring-1" />
      <div className="flex-1 space-y-2">
        <div className="bg-muted h-4 w-32 rounded" />
        <div className="bg-muted/70 h-3 w-20 rounded" />
      </div>
      <div className="bg-muted/70 h-8 w-20 rounded-md" />
    </div>
  );
}
