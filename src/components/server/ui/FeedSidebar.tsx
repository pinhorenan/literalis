// File: src/components/server/ui/FeedSidebar.tsx
import { getServerSession } from 'next-auth';
import { authOptions }      from '@server/auth';
import { prisma }           from '@server/prisma';
import SidebarShell         from '@components/server/ui/SidebarShell';
import UserSummary          from '@components/server/user/UserSummary';
import UserSuggestions      from '@components/server/user/UserSuggestions';
import type { UserDTO }     from '@dto/user.dto';

interface FeedSidebarProps { onNewBook?: () => void }

export default async function FeedSidebar({ onNewBook }: FeedSidebarProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const user = await prisma.user.findUnique({
    where:  { username: session.user.username },
    select: { username: true, name: true, avatarUrl: true },
  });

  if (!user) return null;

  return (
    <SidebarShell position="right">
      <UserSummary user={user as UserDTO} size="lg" redirect />
      <hr className="border-[var(--border-subtle)] mt-4 mb-2" />
      <UserSuggestions />
    </SidebarShell>
  );
}
