/**
 * AdminInsights.jsx — AI insights for institutional admin.
 */
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import InsightCard from "../../components/InsightCard";
import { DEPARTMENTS } from "../../data/mockData";
import { generateAdminInsights, generateAdminInsightsFromOllama } from "../../utils/generateInsights";

export default function AdminInsights() {
  const fallbackInsights = generateAdminInsights({ departments: DEPARTMENTS, totalStudents: 1500, passRate: 88 });
  const [insights, setInsights] = useState(fallbackInsights);

  useEffect(() => {
    let alive = true;
    const data = { departments: DEPARTMENTS, totalStudents: 1500, passRate: 88 };

    (async () => {
      const generated = await generateAdminInsightsFromOllama(data);
      if (alive) setInsights(generated);
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <DashboardLayout title="AI Insights" subtitle="Institution-wide AI analysis">
      <div className="space-y-6">

        {/* Banner */}
        <div className="grad-rose rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🏛️</div>
            <div>
              <h2 className="text-xl font-bold">Institutional AI Analysis</h2>
              <p className="text-white/80 text-sm mt-1">
                Analyzing data from {DEPARTMENTS.length} departments, 1,500 students, and 75 faculty members.
              </p>
              <div className="flex gap-3 mt-3 flex-wrap">
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Risk Analysis ✓</span>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Trend Detection ✓</span>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Recommendations ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">✨ AI-Generated Institutional Insights</h3>
          <div className="space-y-3">
            {insights.map((ins) => (
              <InsightCard key={ins.id} icon={ins.icon} title={ins.title} text={ins.text} type={ins.type} />
            ))}
          </div>
        </div>

        {/* Risk matrix */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">⚠️ Department Risk Matrix</h3>
          <div className="space-y-3">
            {DEPARTMENTS.map((d) => {
              const risk = d.avgMarks < 72 ? "High" : d.avgMarks < 76 ? "Medium" : "Low";
              const riskColor = risk === "High" ? "text-red-500 bg-red-50 dark:bg-red-900/20" : risk === "Medium" ? "text-amber-500 bg-amber-50 dark:bg-amber-900/20" : "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
              return (
                <div key={d.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-16 font-bold text-slate-700 dark:text-slate-200">{d.name}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Avg: {d.avgMarks}%</span>
                      <span>Pass: {d.passRate}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full grad-primary rounded-full" style={{ width: `${d.avgMarks}%` }} />
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${riskColor}`}>{risk} Risk</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
