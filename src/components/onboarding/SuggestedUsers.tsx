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
      onUsersSelected(selectedUsers.filter(user => user !== username));
    } else {
      onUsersSelected([...selectedUsers, username]);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Carregando perfis recomendados...</h3>
          <p className="text-muted-foreground text-sm">
            Encontrando leitores interessantes para você seguir
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="bg-muted h-4 rounded w-3/4" />
                  <div className="bg-muted h-3 rounded w-1/2" />
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
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Conecte-se com outros leitores</h3>
        <p className="text-muted-foreground text-sm">
          Siga alguns perfis para começar a ver conteúdo no seu feed e descobrir novas recomendações.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        <div className="text-center animate-in fade-in duration-300">
          <p className="text-sm text-muted-foreground">
            {selectedUsers.length} {selectedUsers.length === 1 ? 'usuário selecionado' : 'usuários selecionados'}
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
  delay = 0 
}: { 
  user: MinimalUser; 
  isSelected: boolean; 
  onToggle: () => void; 
  delay?: number;
}) {
  return (
    <Card 
      className={`
        p-4 cursor-pointer transition-all duration-300 hover:shadow-md group
        ${isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/30'}
        animate-in slide-in-from-bottom-4 duration-500
      `}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onToggle}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-12 h-12 ring-2 ring-background">
              <AvatarImage src={user.avatarUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 font-semibold">
                {user.name?.[0] || user.username[0]}
              </AvatarFallback>
            </Avatar>
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center animate-in zoom-in-75 duration-200">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
              {user.name || user.username}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              @{user.username}
            </p>
          </div>
        </div>
        
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className="w-full transition-all duration-200"
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Seguindo
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Seguir
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
