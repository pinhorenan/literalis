// src/app/[username]/bookshelf/client.tsx

'use client';
import React from 'react';
import clsx from 'clsx';
import { Grid3x3, Image as ImageIcon, MoreVertical, Trash2, Edit, Plus } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BookCover } from '@/components/core/Book';
import { useUserShelf, type ShelfFilters } from '@/hooks/bookshelf/useUserShelf';
import { useUpdateShelfItem } from '@/hooks/bookshelf/useUpdateShelfItem';
import { useDeleteShelfItem } from '@/hooks/bookshelf/useDeleteShelfItem';
import { useUpsertShelfItem } from '@/hooks/bookshelf/useUpsertShelfItem';
import { useBook } from '@/hooks/book/useBook';
import { useDebounce } from '@/hooks/useDebounce';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { ShelfItem } from '@/types/index';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const PAGE_SIZE = 20;

type ViewMode = 'compact' | 'cover';

export default function BookshelfClient({ username, isOwn }: { username: string; isOwn: boolean }) {
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 300);

  const router = useRouter();

  const [status, setStatus] = React.useState<string>('all');
  const [mode, setMode] = React.useState<ViewMode>('cover');
  const [sortBy, setSortBy] = React.useState<string>('addedAt');

  const [cursorStack, setCursorStack] = React.useState<(string | undefined)[]>([undefined]);
  const cursor = cursorStack.at(-1);

  // Estados para modais - definidos antes de qualquer return condicional
  const [editingItem, setEditingItem] = React.useState<ShelfItem | null>(null);
  const [deletingItem, setDeletingItem] = React.useState<ShelfItem | null>(null);

  const { data: session } = useSession();

  // Hooks de data fetching
  const filters: ShelfFilters = {
    query: debouncedQuery || undefined,
    status: status === 'all' ? undefined : status,
    sortBy: sortBy || undefined,
  };

  const { data, isLoading, isError } = useUserShelf(username, cursor, PAGE_SIZE, filters);

  // Hooks de mutação
  const updateShelfItem = useUpdateShelfItem(username, editingItem?.bookIsbn || 'temp');
  const deleteShelfItem = useDeleteShelfItem(username);
  const addToMyShelf = useUpsertShelfItem(session?.user?.username || '');

  if (!session?.user?.id) {
    router.push('/auth/signin');
    return null;
  }

  const userId = session.user.id;
  const viewerUsername = session.user.username;

  const pageIndex = cursorStack.length;
  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : undefined;

  const goNext = () => data?.nextCursor && setCursorStack([...cursorStack, data.nextCursor]);
  const goPrev = () => cursorStack.length > 1 && setCursorStack(cursorStack.slice(0, -1));

  // Função para calcular progresso
  const calculateProgress = (item: ShelfItem, totalPages?: number) => {
    if (!totalPages || !item.currentPage) return 0;
    return Math.min(100, (item.currentPage / totalPages) * 100);
  };

  // Handlers para modais
  const handleEditProgress = (item: ShelfItem) => {
    setEditingItem(item);
  };

  const handleDeleteItem = (item: ShelfItem) => {
    setDeletingItem(item);
  };

  const handleUpdateProgress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const formData = new FormData(e.currentTarget);
    const currentPage = parseInt(formData.get('currentPage') as string) || 0;
    const status = formData.get('status') as string;
    const rating = parseInt(formData.get('rating') as string) || undefined;

    try {
      await updateShelfItem.mutateAsync({
        currentPage,
        status: status as any,
        rating,
        isPrivate: editingItem.isPrivate,
      });
      setEditingItem(null);
      toast.success('Progresso atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      toast.error('Falha ao atualizar progresso');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    try {
      await deleteShelfItem.mutateAsync(deletingItem.bookIsbn);
      setDeletingItem(null);
      toast.success('Livro removido da estante');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro ao deletar item:', errorMessage);
      toast.error('Falha ao remover livro da estante');
    }
  };

  // Função para adicionar livro à minha estante
  const handleAddToMyShelf = async (isbn: string) => {
    if (!viewerUsername) return;

    try {
      await addToMyShelf.mutateAsync({
        userId: userId!,
        bookIsbn: isbn,
        status: 'TO_READ',
        isPrivate: false,
      });
      toast.success('Livro adicionado à sua estante');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      console.error('Erro ao adicionar livro à estante:', errorMessage);
      toast.error('Falha ao adicionar livro à estante');
    }
  };

  // Componente para item da estante com controles
  const BookShelfItem = ({ item }: { item: ShelfItem }) => {
    const { data: book } = useBook(item.bookIsbn);
    const progress = calculateProgress(item, book?.totalPages);

    if (mode === 'cover') {
      return (
        <div className="group relative">
          <div
            className="cursor-pointer transition-all ease-in-out hover:scale-105 hover:shadow-lg"
            onClick={!isOwn ? () => handleAddToMyShelf(item.bookIsbn) : undefined}
          >
            <BookCover isbn={item.bookIsbn} className="transition-all ease-in-out" />
          </div>

          {/* Barra de progresso para modo cover */}
          {item.status === 'READING' && progress > 0 && (
            <div className="absolute bottom-1 left-1 right-1">
              <Progress value={progress} className="h-1" />
            </div>
          )}

          {/* Menu de ações */}
          {isOwn ? (
            <div className="absolute right-1 top-1 opacity-0 transition-opacity hover:scale-105 group-hover:opacity-100">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleEditProgress(item)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar progresso
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteItem(item)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover da estante
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToMyShelf(item.bookIsbn);
                }}
                disabled={addToMyShelf.isPending}
                title="Adicionar à minha estante"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (mode === 'compact') {
      return (
        <div
          className={clsx(
            'flex gap-3 rounded-lg p-2 transition-colors',
            isOwn ? 'hover:bg-muted/30' : 'hover:bg-muted/30 cursor-pointer',
          )}
          onClick={!isOwn ? () => handleAddToMyShelf(item.bookIsbn) : undefined}
        >
          <BookCover isbn={item.bookIsbn} width={48} height={72} />
          <div className="flex-1 space-y-1">
            <h4 className="line-clamp-1 text-sm font-medium">{book?.title}</h4>
            <p className="text-muted-foreground line-clamp-1 text-xs">{book?.authors?.[0]?.name}</p>

            {/* Status e progresso */}
            <div className="space-y-1">
              <p className="text-xs capitalize">
                {item.status === 'TO_READ'
                  ? 'Para ler'
                  : item.status === 'READING'
                    ? 'Lendo'
                    : item.status === 'READ'
                      ? 'Lido'
                      : 'Abandonado'}
              </p>

              {item.status === 'READING' && book?.totalPages && (
                <div className="space-y-1">
                  <Progress value={progress} className="h-1.5" />
                  <p className="text-muted-foreground text-xs">
                    {item.currentPage || 0} / {book.totalPages} páginas ({Math.round(progress)}%)
                  </p>
                </div>
              )}

              {item.rating && <p className="text-xs">★ {item.rating}/5</p>}
            </div>
          </div>

          {/* Menu de ações para modo compacto */}
          {isOwn ? (
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleEditProgress(item)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar progresso
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteItem(item)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover da estante
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToMyShelf(item.bookIsbn);
                }}
                disabled={addToMyShelf.isPending}
                title="Adicionar à minha estante"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  /* ---------------------------- UI ------------------------------------ */
  if (isLoading)
    return (
      <main className="m-4 flex flex-col gap-6">
        {/* ---------- toolbar de busca / filtros / modo ---------- */}
        <div className="bg-card flex flex-wrap items-center gap-4 rounded-lg p-4">
          {/* pesquisa */}
          <Input
            placeholder="Buscar título ou autor…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:max-w-xs"
          />

          {/* status */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="TO_READ">Para ler</SelectItem>
              <SelectItem value="READING">Lendo</SelectItem>
              <SelectItem value="READ">Lidos</SelectItem>
              <SelectItem value="ABANDONED">Abandonados</SelectItem>
            </SelectContent>
          </Select>

          {/* ordenação */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="addedAt">Data de adição</SelectItem>
              <SelectItem value="title">Título</SelectItem>
              <SelectItem value="author">Autor</SelectItem>
              <SelectItem value="rating">Avaliação</SelectItem>
              <SelectItem value="progress">Progresso</SelectItem>
            </SelectContent>
          </Select>

          {/* modo de exibição */}
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(v) => v && setMode(v as ViewMode)}
            className="ml-auto border"
          >
            <ToggleGroupItem value="compact" aria-label="Modo compacto">
              <Grid3x3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="cover" aria-label="Somente capas">
              <ImageIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* ---------------- grade/lista de livros (skeleton) ---------------- */}
        <div
          className={clsx(
            mode === 'compact' &&
              'bg-card grid grid-cols-2 gap-4 rounded-lg p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
            mode === 'cover' &&
              'bg-card grid grid-cols-2 gap-3 rounded-lg p-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7',
          )}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index}>
              {mode === 'cover' && (
                <div className="group cursor-pointer">
                  <div className="bg-muted aspect-[2/3] animate-pulse rounded-md shadow-sm transition-all duration-200" />
                </div>
              )}
              {mode === 'compact' && (
                <div className="hover:bg-muted/30 flex gap-3 rounded-lg p-2 transition-colors">
                  <div className="bg-muted h-16 w-12 flex-shrink-0 animate-pulse rounded shadow-sm" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="bg-muted h-4 animate-pulse rounded" />
                    <div className="bg-muted/70 h-3 w-3/4 animate-pulse rounded" />
                    <div className="bg-muted/50 h-3 w-1/2 animate-pulse rounded" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* skeleton da paginação */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="bg-muted h-10 w-20 animate-pulse rounded" />
            <div className="bg-muted h-10 w-16 animate-pulse rounded" />
            <div className="bg-muted h-10 w-20 animate-pulse rounded" />
          </div>
        </div>
      </main>
    );

  if (isError || !data) return <p>Erro ao carregar estante.</p>;

  return (
    <main className="m-4 flex flex-col gap-6">
      <Toaster position="bottom-right" />
      {/* ---------- toolbar de busca / filtros / modo ---------- */}
      <div className="bg-card flex flex-wrap items-center gap-4 rounded-lg p-4">
        {/* pesquisa */}
        <Input
          placeholder="Buscar título ou autor…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:max-w-xs"
        />

        {/* status */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="TO_READ">Para ler</SelectItem>
            <SelectItem value="READING">Lendo</SelectItem>
            <SelectItem value="READ">Lidos</SelectItem>
            <SelectItem value="ABANDONED">Abandonados</SelectItem>
          </SelectContent>
        </Select>

        {/* ordenação */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="addedAt">Data de adição</SelectItem>
            <SelectItem value="title">Título</SelectItem>
            <SelectItem value="author">Autor</SelectItem>
            <SelectItem value="rating">Avaliação</SelectItem>
            <SelectItem value="progress">Progresso</SelectItem>
          </SelectContent>
        </Select>

        {/* modo de exibição */}
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(v) => v && setMode(v as ViewMode)}
          className="ml-auto border"
        >
          <ToggleGroupItem value="compact" aria-label="Modo compacto">
            <Grid3x3 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="cover" aria-label="Somente capas">
            <ImageIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* ---------------- grade/lista de livros ---------------- */}
      <div
        className={clsx(
          mode === 'compact' &&
            'bg-card grid grid-cols-2 gap-4 rounded-lg p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
          mode === 'cover' &&
            'bg-card grid grid-cols-2 gap-3 rounded-lg p-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7',
        )}
      >
        {data.items.map((item: ShelfItem) => (
          <BookShelfItem key={item.bookIsbn} item={item} />
        ))}
      </div>

      {/* ----------------------- paginação ---------------------- */}
      <Pagination>
        <PaginationContent>
          {pageIndex > 1 && <PaginationPrevious onClick={goPrev} className="cursor-pointer" />}

          <PaginationItem>
            <PaginationLink isActive size="default">
              {pageIndex}
              {totalPages ? ` / ${totalPages}` : ''}
            </PaginationLink>
          </PaginationItem>

          {data.nextCursor && <PaginationNext onClick={goNext} className="cursor-pointer" />}
        </PaginationContent>
      </Pagination>

      {/* Modal de edição de progresso */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Progresso</DialogTitle>
            <DialogDescription>
              Atualize o progresso de leitura e outras informações do livro.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={handleUpdateProgress} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={editingItem.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TO_READ">Para ler</SelectItem>
                    <SelectItem value="READING">Lendo</SelectItem>
                    <SelectItem value="READ">Lido</SelectItem>
                    <SelectItem value="ABANDONED">Abandonado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPage">Página atual</Label>
                <Input
                  id="currentPage"
                  name="currentPage"
                  type="number"
                  min="0"
                  defaultValue={editingItem.currentPage || 0}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Avaliação (1-5)</Label>
                <Select name="rating" defaultValue={editingItem.rating?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma avaliação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem avaliação</SelectItem>
                    <SelectItem value="1">★☆☆☆☆ (1)</SelectItem>
                    <SelectItem value="2">★★☆☆☆ (2)</SelectItem>
                    <SelectItem value="3">★★★☆☆ (3)</SelectItem>
                    <SelectItem value="4">★★★★☆ (4)</SelectItem>
                    <SelectItem value="5">★★★★★ (5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateShelfItem.isPending}>
                  {updateShelfItem.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remover da estante</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja remover este livro da sua estante? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeletingItem(null)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteShelfItem.isPending}
            >
              {deleteShelfItem.isPending ? 'Removendo...' : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
