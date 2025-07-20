// src/components/pages/profile/UserStats.tsx
'use client';

import { useBooksCount, useUserProfile } from '@/hooks/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Users, Heart, TrendingUp } from 'lucide-react';

interface UserStatsProps {
  username: string;
}

export function UserStats({ username }: UserStatsProps) {
  const { data: profile, isLoading: profileLoading } = useUserProfile(username);
  const { data: booksCount, isLoading: booksLoading } = useBooksCount(username);

  if (profileLoading || booksLoading) {
    return <UserStatsSkeleton />;
  }

  if (!profile) {
    return null;
  }

  const stats = [
    {
      title: 'Livros',
      value: booksCount?.books ?? 0,
      icon: BookOpen,
      description: 'Na estante',
      color: 'text-blue-600'
    },
    {
      title: 'Seguidores',
      value: profile.counts.followers,
      icon: Users,
      description: 'Te seguem',
      color: 'text-green-600'
    },
    {
      title: 'Seguindo',
      value: profile.counts.following,
      icon: TrendingUp,
      description: 'Você segue',
      color: 'text-purple-600'
    },
    {
      title: 'Posts',
      value: profile.counts.posts ?? 0,
      icon: Heart,
      description: 'Publicados',
      color: 'text-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-700 delay-200">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={stat.title} 
            className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-2">
              <div className={`mx-auto p-2 rounded-full bg-muted ${stat.color} transition-transform duration-300 hover:scale-110`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.description}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function UserStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="text-center">
          <CardHeader className="pb-2">
            <Skeleton className="h-8 w-8 rounded-full mx-auto" />
          </CardHeader>
          <CardContent className="pb-4">
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
