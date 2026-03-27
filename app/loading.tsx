import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-[#050505] text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40 rounded-full bg-white/10" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-24 rounded-full bg-white/10" />
            <Skeleton className="h-9 w-28 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <Skeleton className="h-4 w-28 rounded-full bg-white/10" />
            <Skeleton className="h-12 w-full bg-white/10" />
            <Skeleton className="h-12 w-5/6 bg-white/10" />
            <Skeleton className="h-5 w-2/3 bg-white/10" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-11 w-36 rounded-full bg-white/10" />
              <Skeleton className="h-11 w-32 rounded-full bg-white/10" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Skeleton className="h-24 rounded-2xl bg-white/10" />
              <Skeleton className="h-24 rounded-2xl bg-white/10" />
              <Skeleton className="h-24 rounded-2xl bg-white/10" />
            </div>
          </div>
          <Skeleton className="h-72 w-full rounded-[32px] bg-white/10 sm:h-80" />
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`package-skeleton-${index}`}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <Skeleton className="h-40 w-full rounded-xl bg-white/10" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-2/3 bg-white/10" />
                <Skeleton className="h-4 w-1/2 bg-white/10" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Skeleton className="h-8 w-20 rounded-full bg-white/10" />
                <Skeleton className="h-8 w-24 rounded-full bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
