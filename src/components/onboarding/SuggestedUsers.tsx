// src/components/onboarding/SuggestedUsers.tsx
'use client';

import { useState } from 'react';
import { UserPlus, Check } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSuggestedUsers } from '@/hooks/user';
import type { MinimalUser } from '@/types/user';

interface SuggestedUsersProps {
  onUsersSelected: (users: string[]) => void;
  selectedUsers: string[];
}

export function SuggestedUsers({ onUsersSelected, selectedUsers }: SuggestedUsersProps) {
  const { data: users = [], isLoading } = useSuggestedUsers(8);

  const toggleUser = (username: string) => {
    if (selectedUsers.includes(username)) {
      onUsersSelected(selectedUsers.filter((user) => user !== username));
    } else {
      onUsersSelected([...selectedUsers, username]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-semibold">Carregando perfis recomendados...</h3>
          <p className="text-muted-foreground text-sm">
            Encontrando leitores interessantes para você seguir
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-3 p-4">
              <div className="flex items-center gap-3">
                <div className="bg-muted h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="bg-muted h-4 w-3/4 rounded" />
                  <div className="bg-muted h-3 w-1/2 rounded" />
                </div>
              </div>
              <div className="bg-muted h-8 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold">Conecte-se com outros leitores</h3>
        <p className="text-muted-foreground text-sm">
          Siga alguns perfis para começar a ver conteúdo no seu feed e descobrir novas
          recomendações.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {users.map((user, index) => (
          <UserCard
            key={user.id}
            user={user}
            isSelected={selectedUsers.includes(user.username)}
            onToggle={() => toggleUser(user.username)}
            delay={index * 100}
          />
        ))}
      </div>

      {selectedUsers.length > 0 && (
        <div className="animate-in fade-in text-center duration-300">
          <p className="text-muted-foreground text-sm">
            {selectedUsers.length}{' '}
            {selectedUsers.length === 1 ? 'usuário selecionado' : 'usuários selecionados'}
          </p>
        </div>
      )}
    </div>
  );
}

function UserCard({
  user,
  isSelected,
  onToggle,
  delay = 0,
}: {
  user: MinimalUser;
  isSelected: boolean;
  onToggle: () => void;
  delay?: number;
}) {
  return (
    <Card
      className={`group cursor-pointer p-4 transition-all duration-300 hover:shadow-md ${isSelected ? 'ring-primary bg-primary/5 ring-2' : 'hover:bg-muted/30'} animate-in slide-in-from-bottom-4 duration-500`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onToggle}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="ring-background h-12 w-12 ring-2">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="from-primary/20 to-secondary/20 bg-gradient-to-br font-semibold">
                {user.name?.[0] || user.username[0]}
              </AvatarFallback>
            </Avatar>
            {isSelected && (
              <div className="bg-primary animate-in zoom-in-75 absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full duration-200">
                <Check className="text-primary-foreground h-3 w-3" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="group-hover:text-primary truncate text-sm font-semibold transition-colors">
              {user.name || user.username}
            </p>
            <p className="text-muted-foreground truncate text-xs">@{user.username}</p>
          </div>
        </div>

        <Button
          variant={isSelected ? 'default' : 'outline'}
          size="sm"
          className="w-full transition-all duration-200"
        >
          {isSelected ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Seguindo
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Seguir
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
