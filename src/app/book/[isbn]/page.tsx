// src/app/book/[isbn]/page.tsx
import { notFound } from 'next/navigation';
import { Toaster } from '@/components/ui/sonner';
import { BookCover, BookInfo } from '@/components/core/Book';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBookByIsbn } from '@/services/book.service';
import { auth } from '@/lib/auth';
import { BookOpen, Users, Calendar, Building2 } from 'lucide-react';
import Link from 'next/link';

interface BookPageProps {
  params: Promise<{ isbn: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { isbn } = await params;
  const session = await auth();

  const book = await getBookByIsbn(isbn);
  if (!book) {
    return notFound();
  }

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <Toaster position="bottom-right" />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Book Cover & Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="flex justify-center">
              <BookCover
                isbn={book.isbn}
                width={300}
                height={450}
                className="rounded-lg shadow-lg"
              />
            </div>

            {session && (
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href={`/${session.user.username}/bookshelf`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Adicionar à Estante
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Ver na Comunidade
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-4">
            <h1 className="text-foreground text-3xl font-bold">{book.title}</h1>

            <div className="text-muted-foreground flex flex-wrap items-center gap-2">
              <span className="text-lg">por {book.authors.map((a) => a.name).join(', ')}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {book.genres?.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Book Information Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <BookOpen className="h-4 w-4" />
                  Detalhes do Livro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {book.totalPages && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Páginas:</span>
                    <span>{book.totalPages}</span>
                  </div>
                )}
                {book.language && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Idioma:</span>
                    <span className="capitalize">{book.language}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ISBN:</span>
                  <span className="font-mono text-xs">{book.isbn}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Building2 className="h-4 w-4" />
                  Publicação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {book.publisher && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Editora:</span>
                    <span>{book.publisher.name}</span>
                  </div>
                )}
                {book.publicationDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ano:</span>
                    <span>{new Date(book.publicationDate).getFullYear()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Community Activity Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Atividade da Comunidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground py-8 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>Posts e resenhas da comunidade serão exibidos aqui.</p>
                <p className="mt-2 text-sm">Esta funcionalidade será implementada em breve.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
