// src/components/skeletons/FeedSkeleton.tsx
export default function FeedSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex animate-pulse flex-col gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-muted h-24 w-full rounded-lg" />
      ))}
    </div>
  );
}
