// src/components/pages/profile/ProfileTabs.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPosts } from './UserPosts';
import { BookOpen, MessageSquare, Heart, Calendar } from 'lucide-react';

interface ProfileTabsProps {
  username: string;
}

export function ProfileTabs({ username }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="posts" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Posts</span>
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Resenhas</span>
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline">Atividade</span>
        </TabsTrigger>
        <TabsTrigger value="reading" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Lendo</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="posts" className="mt-6">
        <UserPosts username={username} />
      </TabsContent>
      
      <TabsContent value="reviews" className="mt-6">
        <div className="bg-card rounded-lg p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Resenhas em breve</h3>
          <p className="text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
        </div>
      </TabsContent>
      
      <TabsContent value="activity" className="mt-6">
        <div className="bg-card rounded-lg p-8 text-center">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Atividade em breve</h3>
          <p className="text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
        </div>
      </TabsContent>
      
      <TabsContent value="reading" className="mt-6">
        <div className="bg-card rounded-lg p-8 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Histórico de leitura em breve</h3>
          <p className="text-muted-foreground">Esta funcionalidade será implementada em breve.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
