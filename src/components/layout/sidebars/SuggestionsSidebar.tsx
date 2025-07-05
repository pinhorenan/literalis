// src/components/layout/sidebars/SuggestionsSidebar.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Skeleton from '@/components/skeletons/UserRowSkeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSuggestedUsers, useToggleFollow } from '@/hooks/user';
import type { MinimalUser } from '@/types/user';

export function SuggestionsSidebar() {
  const { status, data } = useSession();
  const viewer = data?.user!;

  const { data: suggestions, isLoading, isError } = useSuggestedUsers(5);

  if (status !== 'authenticated') return null;

  return (
    <Sidebar side="right" variant="inset" collapsible="icon">
      {/* ---- Perfil do viewer ---- */}
      <SidebarHeader>
        <Link
          href={`/${viewer.username}/profile`}
          className="hover:bg-surface-alt flex items-center gap-3 rounded-md p-2 transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={viewer.avatarUrl || undefined} />
            <AvatarFallback>{viewer.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <span className="truncate text-sm font-semibold">{viewer.name}</span>
            <span className="text-muted-foreground truncate text-xs">@{viewer.username}</span>
          </div>
        </Link>
      </SidebarHeader>

      {/* ---- Sugestões ---- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Perfis recomendados</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)}

              {isError && (
                <p className="text-destructive px-2 py-4 text-sm">
                  Não foi possível carregar as sugestões.
                </p>
              )}

              {suggestions?.map((user) => (
                <SuggestionRow key={user.id} user={user} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function SuggestionRow({ user }: { user: MinimalUser }) {
  const toggleFollow = useToggleFollow(user.username);

  return (
    <SidebarMenuItem>
      <div className="hover:bg-surface-alt flex items-center gap-3 rounded-md p-2 transition-colors">
        <Link
          href={`/${user.username}/profile`}
          className="flex flex-1 items-center gap-3 truncate"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl || undefined} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <span className="truncate text-sm font-medium">{user.name}</span>
            <span className="text-muted-foreground truncate text-xs">@{user.username}</span>
          </div>
        </Link>

        <button
          aria-label={`Seguir ${user.name}`}
          className="bg-primary ml-auto rounded-full px-3 py-1 text-sm text-white transition-opacity disabled:opacity-60"
          disabled={toggleFollow.isPending}
          onClick={(e) => {
            e.stopPropagation();
            toggleFollow.mutate();
          }}
        >
          Seguir
        </button>
      </div>
    </SidebarMenuItem>
  );
}
