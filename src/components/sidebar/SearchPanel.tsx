'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchPanelProps {
  isExpanded: boolean;
  onClose: () => void;
}

// Mock data for search results
const mockSearchResults = [
  {
    id: '1',
    username: 'joao_leitor',
    name: 'João Silva',
    avatarUrl: '/api/placeholder/40/40',
    type: 'user' as const,
  },
  {
    id: '2',
    username: 'maria_books',
    name: 'Maria dos Livros',
    avatarUrl: '/api/placeholder/40/40',
    type: 'user' as const,
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    coverUrl: '/uploads/covers/1984.jpg',
    type: 'book' as const,
  },
  {
    id: '4',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    coverUrl: '/uploads/covers/dom-casmurro.jpg',
    type: 'book' as const,
  },
];

export function SearchPanel({ isExpanded, onClose }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState(['joao_leitor', 'maria_books', '1984', 'Dom Casmurro']);

  const filteredResults = searchQuery
    ? mockSearchResults.filter(
        (item) =>
          (item.type === 'user' &&
            (item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.name?.toLowerCase().includes(searchQuery.toLowerCase()))) ||
          (item.type === 'book' &&
            (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.author.toLowerCase().includes(searchQuery.toLowerCase()))),
      )
    : [];

  return (
    <div
      className={cn(
        'bg-background border-border/50 absolute left-full top-0 z-50 h-full w-96 border-r transition-transform duration-300 ease-in-out',
        isExpanded ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-border/50 flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">Pesquisa</h2>
          <button onClick={onClose} className="hover:bg-muted rounded-full p-2 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="border-border/50 border-b p-4">
          <div className="relative">
            <Search
              className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 transform"
              size={18}
            />
            <Input
              placeholder="Pesquisar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted/50 border-none pl-10"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {searchQuery ? (
            // Search Results
            <div className="p-4">
              {filteredResults.length > 0 ? (
                <div className="space-y-3">
                  {filteredResults.map((item) => (
                    <div
                      key={item.id}
                      className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
                    >
                      {item.type === 'user' ? (
                        <>
                          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                            <span className="text-sm font-medium">
                              {item.name?.[0] || item.username[0]}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.username}</p>
                            <p className="text-muted-foreground text-xs">{item.name}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded">
                            <span className="text-xs">📚</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-muted-foreground text-xs">{item.author}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  <Search size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Nenhum resultado encontrado</p>
                </div>
              )}
            </div>
          ) : (
            // Recent Searches
            <div className="p-4">
              <h3 className="text-muted-foreground mb-3 text-sm font-medium">Recentes</h3>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Search size={16} className="text-muted-foreground" />
                      <span className="text-sm">{search}</span>
                    </div>
                    <button className="hover:bg-muted rounded-full p-1 transition-colors">
                      <X size={14} className="text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full p-2 text-left text-sm text-blue-600 hover:text-blue-700">
                Limpar tudo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
