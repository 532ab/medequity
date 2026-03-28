import Skeleton from "./Skeleton";

export default function ResultsSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Heading bar */}
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-24" />
      </div>

      {/* DrugInfo-like card */}
      <div className="card space-y-5">
        {/* Title + badge */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Skeleton className="h-6 w-48" />
          </div>
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>

        {/* 3 info sections: icon + 2 text lines */}
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="flex-shrink-0 w-8 h-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full max-w-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Warnings section */}
        <div className="border-t border-themed pt-4 space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-full max-w-lg" />
          <Skeleton className="h-3 w-5/6 max-w-md" />
        </div>
      </div>

      {/* SideEffectsChart-like card */}
      <div className="card">
        <div className="mb-5 space-y-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3 w-56" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" style={{ width: `${60 + (i * 17) % 50}px` }} />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton
                className="h-2 rounded-full"
                style={{ width: `${90 - i * 7}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ReportsOverTime area chart placeholder */}
      <div className="card">
        <div className="mb-4 space-y-1">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-3 w-52" />
        </div>
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>

      {/* Two half-width cards: Outcomes + Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Outcomes card */}
        <div className="card space-y-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-3 w-48" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Demographics card */}
        <div className="card space-y-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
