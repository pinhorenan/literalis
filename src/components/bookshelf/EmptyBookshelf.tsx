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
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
            <Search className="text-muted-foreground h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Nenhum livro encontrado</h3>
            <p className="text-muted-foreground max-w-md text-sm">
              Não encontramos livros que correspondam aos seus filtros. Tente ajustar os critérios
              de busca.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isOwn) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center space-y-6 py-16 text-center">
          <div className="from-primary/20 to-secondary/20 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br">
            <BookOpen className="text-primary h-10 w-10" />
          </div>
          <div className="max-w-md space-y-3">
            <h3 className="text-xl font-semibold">Sua estante está vazia</h3>
            <p className="text-muted-foreground">
              Comece a adicionar livros para organizar sua biblioteca pessoal e acompanhar seu
              progresso de leitura.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 bg-gradient-to-r"
            >
              <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                Buscar livros
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/feed">
                <BookOpen className="mr-2 h-4 w-4" />
                Ver recomendações
              </Link>
            </Button>
          </div>
          <div className="bg-muted/30 mt-8 max-w-sm rounded-lg p-4">
            <h4 className="mb-2 text-sm font-medium">💡 Dica</h4>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Você pode adicionar livros diretamente das estantes de outros usuários ou importar sua
              lista de leitura.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center space-y-6 py-16 text-center">
        <div className="from-muted to-muted/60 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br">
          <BookOpen className="text-muted-foreground h-10 w-10" />
        </div>
        <div className="max-w-md space-y-3">
          <h3 className="text-xl font-semibold">Estante privada</h3>
          <p className="text-muted-foreground">
            @{username} ainda não adicionou livros públicos à estante ou preferiu manter a
            biblioteca privada.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" asChild>
            <Link href={`/${username}/profile`}>Ver perfil</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Descobrir livros
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
