/**
 * StatCard.jsx
 * Reusable metric card for dashboards.
 * Shows icon, label, value, and optional trend.
 */
export default function StatCard({ icon, label, value, sub, gradient, trend, trendUp }) {
  return (
    <div className={`rounded-2xl p-4 text-white shadow-lg ${gradient || "grad-primary"} animate-slide-up`}>
      <div className="flex items-start justify-between">
        <div className="text-2xl">{icon}</div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 ${trendUp ? "text-emerald-200" : "text-red-200"}`}>
            {trendUp ? "▲" : "▼"} {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm font-semibold mt-0.5 opacity-90">{label}</p>
        {sub && <p className="text-xs opacity-70 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
