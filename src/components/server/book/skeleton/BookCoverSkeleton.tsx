// File: src/components/server/book/BookCoverSkeleton.tsx
import clsx from 'clsx';

export default function BookCoverSkeleton({
  width = 120,
  height = 180,
  className = '',
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'bg-[var(--surface-card)] border border-[var(--border-base)] rounded animate-pulse',
        className
      )}
      style={{ width, height }}
    />
  );
}
