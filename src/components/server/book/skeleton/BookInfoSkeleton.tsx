// File: src/components/server/book/BookInfoSkeleton.tsx
import clsx from 'clsx';

export default function BookInfoSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <div className="h-6 w-3/4 bg-[var(--surface-card)] rounded animate-pulse" />
      <div className="h-4 w-1/2 bg-[var(--surface-card)] rounded animate-pulse" />
      <div className="h-4 w-1/3 bg-[var(--surface-card)] rounded animate-pulse" />
      <div className="h-4 w-1/4 bg-[var(--surface-card)] rounded animate-pulse" />
    </div>
  );
}