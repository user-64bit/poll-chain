import { Card } from "./ui/card";

export function PollCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div className="loading-placeholder h-6 w-20 rounded-full" />
        <div className="loading-placeholder h-4 w-8 rounded" />
      </div>
      <div className="space-y-2">
        <div className="loading-placeholder h-5 w-3/4 rounded" />
        <div className="loading-placeholder h-5 w-1/2 rounded" />
      </div>
      <div className="mt-auto space-y-3">
        <div className="loading-placeholder h-8 w-full rounded-lg" />
        <div className="flex items-center justify-between">
          <div className="loading-placeholder h-4 w-24 rounded" />
          <div className="loading-placeholder h-7 w-16 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

export function PollGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PollCardSkeleton key={i} />
      ))}
    </div>
  );
}
