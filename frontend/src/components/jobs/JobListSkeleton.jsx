import GlassCard from "../GlassCard.jsx";

export default function JobListSkeleton({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <GlassCard key={i} className="animate-pulse p-5">
          <div className="flex gap-4">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-100" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-5 w-[66%] rounded-lg bg-slate-100" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
              <div className="mt-3 flex gap-2">
                <div className="h-6 w-16 rounded-full bg-slate-100" />
                <div className="h-6 w-20 rounded-full bg-slate-100" />
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </>
  );
}
