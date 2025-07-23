// src/components/bookshelf/BookshelfStats.tsx
'use client';

import { Book, Clock, CheckCircle, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BookshelfStatsProps {
  stats: {
    total: number;
    reading: number;
    read: number;
    toRead: number;
    avgRating: number;
  };
  isOwn: boolean;
}

export function BookshelfStats({ stats, isOwn }: BookshelfStatsProps) {
  const statItems = [
    {
      label: 'Total',
      value: stats.total,
      icon: Book,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Lendo',
      value: stats.reading,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Lidos',
      value: stats.read,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Quero ler',
      value: stats.toRead,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  // Só mostra avaliação média se tiver livros avaliados
  if (stats.avgRating > 0) {
    statItems.push({
      label: 'Avaliação',
      value: Number(stats.avgRating.toFixed(1)),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    });
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in slide-in-from-top duration-500">
      {statItems.map((stat, index) => (
        <Card 
          key={stat.label}
          className="hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4 text-center">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.bgColor} mb-2 transition-transform duration-300 hover:scale-110`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-foreground">
                {stat.label === 'Avaliação' ? `${stat.value}★` : stat.value}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {stat.label}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
