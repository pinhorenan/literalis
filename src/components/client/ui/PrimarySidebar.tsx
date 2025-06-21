// File: src/components/client/ui/PrimarySidebar.tsx
'use client';

import { Home, User, BookOpen, BookPlus, Search, MessageSquare, Bell, LogOut, Moon, Sun } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

import { Button }   from '@components/client/ui/Buttons';
import { Logo }     from '@components/server/svg/Logo';
import SidebarShell from '@components/server/ui/SidebarShell';

export default function PrimarySidebar() {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const username = session?.user?.username ?? '';

  const navItems = [
    { label: 'Início',      icon: Home,            href: '/feed' },
    { label: 'Perfil',      icon: User,            href: `/profile/${username}` },
    { label: 'Estante',     icon: BookOpen,        href: `/profile/${username}/bookshelf` },
    { label: 'Buscar',      icon: Search,          href: '/search' },
    { label: 'Mensagens',   icon: MessageSquare,   href: '/feed' },
    { label: 'Notificações',icon: Bell,            href: '/feed' },
    { label: 'Publicar',    icon: BookPlus,        onClick: () => setModalOpen(true) },
  ];

  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const buttonClass =
    'bg-transparent hover:bg-[var(--surface-card-hover)] gap-3 rounded-lg border-none text-[var(--text-primary)] text-base';

  const bottomItems = [
    {
      label: isDark ? 'Tema claro' : 'Tema escuro',
      icon: isDark ? Sun : Moon,
      onClick: toggleTheme,
      show: mounted,
    },
    {
      label: 'Sair',
      icon: LogOut,
      onClick: () => signOut({ callbackUrl: '/' }),
    },
  ];

  return (
    <SidebarShell position="left">
      <div className="flex flex-col justify-between h-full py-2">
        <div>
          <div className="flex items-center gap-2 px-4">
            <Logo />
            <strong className="text-[var(--text-primary)]">Literalis</strong>
          </div>
          <nav className="flex flex-col items-start gap-1 mt-2">
            {navItems.map(({ label, icon: Icon, href, onClick }) => (
              <Button
                key={label}
                href={onClick ? undefined : href}
                onClick={onClick}
                variant="default"
                className={buttonClass}
              >
                <Icon size={30} />
                <strong>{label}</strong>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-start gap-1">
          {bottomItems.map(({ label, icon: Icon, onClick, show }) => {
            if (show === false) return null;
            return (
              <Button
                key={label}
                onClick={onClick}
                variant="default"
                className={buttonClass}
              >
                <Icon size={30} />
                <strong>{label}</strong>
              </Button>
            );
          })}
        </div>

      </div>
    </SidebarShell>
  );
}
