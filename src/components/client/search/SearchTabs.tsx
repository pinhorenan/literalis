// File: src/components/client/search/SearchTabs.tsx
'use client';

interface SearchTabsProps {
  selected: 'books' | 'users';
  onSelect: (tab: 'books' | 'users') => void;
}

export default function SearchTabs({ selected, onSelect }: SearchTabsProps) {
  return (
    <div className="flex gap-4 border-b border-[var(--border-base)]">
      {(['books', 'users'] as const).map(type => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className={`
            pb-2
            text-sm
            font-medium
            ${selected === type
              ? 'border-b-2 border-[var(--color-primary)] text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)]'}
          `}
        >
          {type === 'books' ? 'Livros' : 'Usuários'}
        </button>
      ))}
    </div>
  );
}
