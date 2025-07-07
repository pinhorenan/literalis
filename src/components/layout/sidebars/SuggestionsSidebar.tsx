// src/components/layout/sidebars/SuggestionsSidebar.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
    <Sidebar side="right" variant="sidebar" collapsible="icon">
      {/* ---- Perfil do viewer ---- */}
      <SidebarHeader>
        <Link
          href={`/${viewer.username}/profile`}
          className="hover:bg-surface-alt flex items-center gap-3 rounded-md p-2 transition-colors"
        >
          <Avatar className="h-18 w-18 border">
            <AvatarImage src={viewer.avatarUrl || undefined} />
            <AvatarFallback>{viewer.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <span className="truncate text-lg font-semibold">{viewer.name}</span>
            <span className="text-muted-foreground truncate text-sm">@{viewer.username}</span>
          </div>
        </Link>
      </SidebarHeader>

      {/* ---- Sugestões ---- */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Perfis recomendados</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && Array.from({ length: 10 }).map((_, i) => <UserRowSkeleton key={i} />)}

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
        <Link href={`/${user.username}/profile`} className="flex items-center gap-2 truncate">
          <Avatar className="h-10 w-10 border">
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
          className="bg-card ml-auto rounded-sm border px-3 py-1.5 text-sm"
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
