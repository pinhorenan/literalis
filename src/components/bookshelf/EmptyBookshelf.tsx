// src/components/bookshelf/EmptyBookshelf.tsx
'use client';

import { BookOpen, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface EmptyBookshelfProps {
  isOwn: boolean;
  username: string;
  hasFilters: boolean;
}

export function EmptyBookshelf({ isOwn, username, hasFilters }: EmptyBookshelfProps) {
  if (hasFilters) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Nenhum livro encontrado</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Não encontramos livros que correspondam aos seus filtros. Tente ajustar os critérios de busca.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isOwn) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-3 max-w-md">
            <h3 className="text-xl font-semibold">Sua estante está vazia</h3>
            <p className="text-muted-foreground">
              Comece a adicionar livros para organizar sua biblioteca pessoal e acompanhar seu progresso de leitura.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <Link href="/search">
                <Search className="w-4 h-4 mr-2" />
                Buscar livros
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/feed">
                <BookOpen className="w-4 h-4 mr-2" />
                Ver recomendações
              </Link>
            </Button>
          </div>
          <div className="mt-8 p-4 bg-muted/30 rounded-lg max-w-sm">
            <h4 className="font-medium mb-2 text-sm">💡 Dica</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Você pode adicionar livros diretamente das estantes de outros usuários ou importar sua lista de leitura.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/60 rounded-full flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="space-y-3 max-w-md">
          <h3 className="text-xl font-semibold">Estante privada</h3>
          <p className="text-muted-foreground">
            @{username} ainda não adicionou livros públicos à estante ou preferiu manter a biblioteca privada.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" asChild>
            <Link href={`/${username}/profile`}>
              Ver perfil
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/search">
              <Search className="w-4 h-4 mr-2" />
              Descobrir livros
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
