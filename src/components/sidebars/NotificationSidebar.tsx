'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell } from 'lucide-react';
import { notificationsMock } from '@/src/lib/mocks/notifications.mocks'; // todo

export function NotificationSidebar() {
  return (
    <Sidebar side="right" variant="inset" collapsible="icon">
      <SidebarHeader className="flex-row items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Bell className="size-5" /> Notificações
        </h2>
        <Badge variant="destructive">{notificationsMock.length}</Badge>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          <SidebarGroup>
            <SidebarGroupContent>
              {notificationsMock.map((n) => (
                <div key={n.id} className="hover:bg-accent/50 flex gap-3 rounded-md p-2">
                  <Avatar className="size-8">
                    <AvatarImage src={n.actor.avatarUrl} />
                    <AvatarFallback>{n.actor.name}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm">
                      <strong>{n.actor.name}</strong> {n.message}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {n.createdAt.toISOString()}
                    </span>
                  </div>
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <button type="button" className="w-full py-2 text-center text-sm hover:underline">
          Ver tudo
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
