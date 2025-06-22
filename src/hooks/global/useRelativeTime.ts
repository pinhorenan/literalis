// src/hooks/global/useRelativeTime.ts
'use client';

import { useEffect, useState } from 'react';

export default function useRelativeTime(date: string | Date): string {
  const [relative, setRelative] = useState(() => formatRelativeTime(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setRelative(formatRelativeTime(date));
    }, 30 * 1000); // atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, [date]);

  return relative;
}

function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = typeof date === 'string' ? new Date(date) : date;

  const seconds = Math.floor((now.getTime() - target.getTime()) / 1000);
  if (seconds < 60) return 'menos de 1 min';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `há ${days} dia${days > 1 ? 's' : ''}`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `há ${weeks} semana${weeks > 1 ? 's' : ''}`;

  const months = Math.floor(days / 30);
  if (months < 12) return `há ${months} mês${months > 1 ? 'es' : ''}`;

  const years = Math.floor(days / 365);
  return `há ${years} ano${years > 1 ? 's' : ''}`;
}
