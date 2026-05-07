export function SkeletonCard() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton h-8 w-1/2" />
      <div className="skeleton h-3 w-2/3" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton h-5 w-1/4 mb-4" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="skeleton h-4 w-1/4" />
          <div className="skeleton h-4 w-1/4" />
          <div className="skeleton h-4 w-1/4" />
          <div className="skeleton h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="card p-4">
      <div className="skeleton h-5 w-1/3 mb-4" />
      <div className="skeleton h-48 w-full rounded-xl" />
    </div>
  );
}

export default function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonTable />
    </div>
  );
}
