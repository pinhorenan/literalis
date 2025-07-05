// src/components/skeletons/UserRowSkeleton.tsx
export default function UserRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-2 p-2">
      <div className="bg-muted size-8 rounded-full" />
      <div className="flex-1 space-y-1">
        <div className="bg-muted h-3 w-1/2 rounded" />
        <div className="bg-muted/70 h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}
