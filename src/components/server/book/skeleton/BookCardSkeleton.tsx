// File: src/components/server/book/BookCardSkeleton.tsx
import BookCoverSkeleton from './BookCoverSkeleton';
import BookInfoSkeleton from './BookInfoSkeleton';

export function BookCardSkeleton() {
  return (
    <div
      className="
        flex gap-5 p-4 rounded-md border border-[var(--border-base)]
        bg-[var(--surface-card)]
      "
    >
      <BookCoverSkeleton width={120} height={180} />
      <BookInfoSkeleton className="flex-1" />
    </div>
  );
}