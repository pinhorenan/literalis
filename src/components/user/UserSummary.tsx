'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MinimalUserDTO } from '@/src/hooks/types/user.type';

export function UserSummary({ user }: { user: MinimalUserDTO }) {
  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatarUrl} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="text-sm font-medium">{user.name}</div>
    </div>
  );
}
