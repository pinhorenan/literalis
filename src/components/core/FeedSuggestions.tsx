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
    <div className="ml-0 m-8">
      {/* ---- Perfil do viewer ---- */}
      <div>
        <Link
          href={`/${viewer.username}/profile`}
          className="hover:bg-surface-alt flex items-center gap-3 rounded-md p-2 transition-colors"
        >
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={viewer.avatarUrl || undefined} />
            <AvatarFallback>{viewer.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <span className="truncate text-md font-semibold">{viewer.name}</span>
            <span className="text-muted-foreground truncate text-sm">@{viewer.username}</span>
          </div>
        </Link>
      </div>

      {/* ---- Sugestões ---- */}
      <div className="flex flex-col gap-2 ml-2 mt-4">
        <label className="">Perfis recomendados</label>
        
        <div className="flex flex-col gap-1">
          {isLoading && Array.from({ length: 10 }).map((_, i) => <UserRowSkeleton key={i} />)}
          {isError && (
            <p className="text-destructive px-2 py-4 text-sm">
              Não foi possível carregar as sugestões.
            </p>
          )}
          {suggestions?.map((user) => (
            <SuggestionRow key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SuggestionRow({ user }: { user: MinimalUser }) {
  const handleToggleFollow = (wasFollowing: boolean, username: string) => {
    if (wasFollowing) {
      toast.success(`Você deixou de seguir @${username}`);
    } else {
      toast.success(`Você agora segue @${username}`);
    }
  };

  return (
    <div>
      <div className="hover:bg-surface-alt flex items-center gap-3 rounded p-2 transition-colors">
        <Link href={`/${user.username}/profile`} className="flex items-center gap-2 truncate">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src={user.avatarUrl || undefined} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <span className="truncate text-xs font-medium">{user.name}</span>
            <span className="text-muted-foreground text-xs">@{user.username}</span>
          </div>
        </Link>

        <FollowButton
          username={user.username}
          variant="outline"
          size="sm"
          showIcon={false}
          className="ml-auto text-xs px-2 py-1"
          onToggle={handleToggleFollow}
        />
      </div>
    </div>
  );
}

export function UserRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-3 p-2">
      <div className="bg-muted size-10 rounded-full" />
      <div className="flex-1 space-y-1">
        <div className="bg-muted h-3 w-full rounded" />
        <div className="bg-muted/70 h-3 w-full rounded" />
      </div>
      <button className="bg-muted/70 ml-auto h-8 w-16 rounded" disabled />
    </div>
  );
}
