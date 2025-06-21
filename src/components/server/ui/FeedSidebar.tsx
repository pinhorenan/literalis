// File: src/components/server/ui/FeedSidebar.tsx
import SidebarShell     from '@components/server/ui/SidebarShell';
import UserSummary      from '@components/server/user/UserSummary';
import UserSuggestions  from '@components/server/user/UserSuggestions';
import { getViewer }    from '@lib/auth/viewer';
import type { UserDTO } from '@models/user.dto';

interface FeedSidebarProps {
  onNewBook?: () => void;
}

export default async function FeedSidebar({ onNewBook }: FeedSidebarProps) {
  // Usa nosso helper que retorna null se não autenticado
  const viewer = await getViewer(false);
  if (!viewer) return null;

  // viewer já tem username, name, avatarUrl e bio
  const user: UserDTO = viewer;

  return (
    <SidebarShell position="right">
      <UserSummary user={user} size="lg" redirect />
      <hr className="border-[var(--border-subtle)] mt-4 mb-2" />
      <UserSuggestions />
    </SidebarShell>
  );
}
