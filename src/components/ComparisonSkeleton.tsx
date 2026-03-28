import Skeleton from "./Skeleton";

function DrugCardSkeleton() {
  return (
    <div className="card space-y-5">
      {/* Title + badge */}
      <div className="flex items-start justify-between">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      {/* 3 info sections */}
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="flex-shrink-0 w-8 h-8 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-full max-w-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ComparisonSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Two input fields at top */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* Two side-by-side drug info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <DrugCardSkeleton />
        <DrugCardSkeleton />
      </div>

      {/* Merged side effects section */}
      <div className="card">
        <div className="mb-5 space-y-1">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-3 w-60" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" style={{ width: `${56 + (i * 13) % 48}px` }} />
                <Skeleton className="h-3 w-10" />
              </div>
              <div className="flex gap-2">
                <Skeleton
                  className="h-2 rounded-full flex-1"
                  style={{ width: `${85 - i * 8}%` }}
                />
                <Skeleton
                  className="h-2 rounded-full flex-1"
                  style={{ width: `${70 - i * 5}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
