export default function Loading() {
  return (
    <div className="space-y-6 p-8">
      <div className="h-8 w-52 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    </div>
  );
}
