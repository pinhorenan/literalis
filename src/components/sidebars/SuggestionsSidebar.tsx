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
import { userMock1, userMock2, userMock3 } from '@/src/lib/mocks/user.mocks';

export function SuggestionsSidebar() {
  const suggestions = [userMock2, userMock3];

  return (
    <Sidebar side="right" variant="inset" collapsible="icon" className="">
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={userMock1.avatarUrl} />
            <AvatarFallback>{userMock1.name}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-md flex flex-col">{userMock1.name}</span>
            <span className="text-muted-foreground text-sm">@{userMock1.username}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sugestões para você</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {suggestions.map((u) => (
                <SidebarMenuItem key={u.username} className="flex">
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
