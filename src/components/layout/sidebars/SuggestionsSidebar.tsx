'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { userMock2, userMock3 } from '@/src/lib/mocks/user.mocks';
import { useSession } from 'next-auth/react';

export function SuggestionsSidebar() {
  const session = useSession();
  if (session.status !== 'authenticated') {
    return null; // nao renderisza, mas whatever pq o middleware n deveria deixar chegar aqui
  }
  const viewer = session.data?.user;

  const suggestions = [userMock2, userMock3];

  return (
    <Sidebar side="right" variant="inset" collapsible="icon" className="">
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={viewer.avatarUrl!} />
          </Avatar>
          <div className="flex flex-col">
            <span className="text-md flex flex-col">{viewer.name}</span>
            <span className="text-muted-foreground text-sm">@{viewer.username}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Perfis recomendados</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {suggestions.map((u) => (
                <SidebarMenuItem key={u.username} className="flex py-2">
                  <SidebarMenuButton>
                    <div className="flex w-full items-center gap-2 p-2">
                      <Avatar className="size-8">
                        <AvatarImage src={u.avatarUrl} />
                        <AvatarFallback>{u.name}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col truncate">
                        <span className="txt-md truncate font-medium">{u.name}</span>
                        <span className="txt-sm text-muted-foreground truncate">@{u.username}</span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
