// File: src/components/client/search/SearchTabs.tsx
'use client';

interface SearchTabsProps {
  selected: 'books' | 'users';
  onSelect: (tab: 'books' | 'users') => void;
}

const tabs = [
  { key: 'books', label: 'Livros' },
  { key: 'users', label: 'Usuários' },
] as const;

export default function SearchTabs({ selected, onSelect }: SearchTabsProps) {
  return (
    <div className="flex gap-4 border-b border-[var(--border-base)]">
      {tabs.map(( { key, label }) => (
        <button key={key} onClick={() => onSelect(key)}
          className={`
            pb-2
            text-sm
            font-medium
            ${selected === key
              ? 'border-b-2 border-[var(--color-primary)] text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)]'}
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
