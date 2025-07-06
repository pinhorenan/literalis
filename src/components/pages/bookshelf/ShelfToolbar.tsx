'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid3x3, List, Image as ImageIcon, X } from 'lucide-react';

type ViewMode = 'card' | 'compact' | 'cover';

interface ShelfToolbarProps {
  query: string;
  onQueryChange: (v: string) => void;
  status: string | undefined;
  onStatusChange: (s: string | undefined) => void;
  mode: ViewMode;
  onModeChange: (m: ViewMode) => void;
}

export function ShelfToolbar({
  query,
  onQueryChange,
  status,
  onStatusChange,
  mode,
  onModeChange,
}: ShelfToolbarProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      {/* Pesquisa */}
      <Input
        placeholder="Buscar título ou autor…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full sm:max-w-xs"
      />

      {/* Filtro de status */}
      <Select value={status} onValueChange={onStatusChange}>
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

      {/* Alternância de layout */}
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(v: ViewMode) => v && onModeChange(v as ViewMode)}
        className="ml-auto"
      >
        <ToggleGroupItem value="card" aria-label="Modo detalhado">
          <List className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="compact" aria-label="Modo compacto">
          <Grid3x3 className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="cover" aria-label="Somente capas">
          <ImageIcon className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Limpar filtros */}
      {(query || status !== 'all') && (
        <button
          onClick={() => {
            onQueryChange('');
            onStatusChange('all');
          }}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
        >
          <X size={14} /> Limpar
        </button>
      )}
    </div>
  );
}
