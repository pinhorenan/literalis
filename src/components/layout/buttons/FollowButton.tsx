'use client';

import React from 'react';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToggleFollow } from '@/hooks/user/useToggleFollow';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  username: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
  onToggle?: (isFollowing: boolean, username: string) => void;
}

export function FollowButton({
  username,
  variant = 'default',
  size = 'default',
  className,
  showIcon = true,
  fullWidth = false,
  onToggle,
}: FollowButtonProps) {
  const { data: session } = useSession();
  const viewerUsername = session?.user?.username;
  
  const { data: profile, isLoading: profileLoading } = useUserProfile(username);
  const toggleFollow = useToggleFollow(username);

  // Não mostrar botão se for o próprio usuário
  if (viewerUsername === username) {
    return null;
  }

  // Se não há sessão, não mostrar botão
  if (!session?.user) {
    return null;
  }

  // Loading state enquanto busca perfil
  if (profileLoading) {
    return (
      <Button variant="outline" size={size} disabled className={className}>
        <Loader2 className="h-4 w-4 animate-spin" />
        Carregando...
      </Button>
    );
  }

  const isFollowing = profile?.isFollowing ?? false;
  const isPending = toggleFollow.isPending;

  const handleToggleFollow = async () => {
    const wasFollowing = isFollowing;
    
    try {
      await toggleFollow.mutateAsync();
      onToggle?.(wasFollowing, username);
    } catch (error) {
      console.error('Erro ao alterar seguimento:', error);
      onToggle?.(wasFollowing, username);
    }
  };

  const getButtonText = () => {
    if (isPending) return 'Carregando...';
    return isFollowing ? 'Seguindo' : 'Seguir';
  };

  const getButtonIcon = () => {
    if (isPending) return <Loader2 className="h-4 w-4 animate-spin" />;
    return isFollowing ? <UserCheck className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />;
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      size={size}
      onClick={handleToggleFollow}
      disabled={isPending}
      className={cn(
        'transition-colors duration-200',
        fullWidth && 'w-full',
        isFollowing && 'border-primary text-primary hover:bg-primary hover:text-primary-foreground',
        className
      )}
    >
      {showIcon && getButtonIcon()}
      {getButtonText()}
    </Button>
  );
}

export default FollowButton;
