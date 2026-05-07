/**
 * StudentPerformance.jsx — Detailed performance analytics for students.
 */
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import { STUDENT_TREND, STUDENT_SUBJECTS } from "../../data/mockData";

export default function StudentPerformance() {
  return (
    <DashboardLayout title="My Performance" subtitle="Detailed academic analytics">
      <div className="space-y-6">

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Best Subject",   value: "AI/ML",  sub: "91/100",  color: "text-emerald-500" },
            { label: "Needs Work",     value: "DBMS",   sub: "62/100",  color: "text-amber-500"   },
            { label: "Avg Score",      value: "79.7",   sub: "All subjects", color: "text-primary-500" },
            { label: "Improvement",    value: "+17",    sub: "vs last sem", color: "text-cyan-500"  },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-white mt-1">{s.label}</p>
              <p className="text-xs text-slate-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📈 Performance Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={STUDENT_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Legend />
              <Line type="monotone" dataKey="marks" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 5 }} name="My Marks" connectNulls={false} />
              <Line type="monotone" dataKey="predicted" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject bar chart */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📚 Subject-wise Marks</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={STUDENT_SUBJECTS} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Bar dataKey="marks" name="My Marks" radius={[6, 6, 0, 0]}>
                {STUDENT_SUBJECTS.map((s, i) => (
                  <Cell key={i} fill={s.marks >= 80 ? "#10b981" : s.marks >= 65 ? "#6366f1" : "#f59e0b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed subject table */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📋 Subject Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {["Subject", "Marks", "Grade", "Progress", "Status"].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STUDENT_SUBJECTS.map((s) => (
                  <tr key={s.subject} className="border-b border-slate-50 dark:border-slate-800 hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition-colors">
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-white">{s.subject}</td>
                    <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-200">{s.marks}/{s.max}</td>
                    <td className="py-3 px-3">
                      <span className={`badge ${s.marks >= 80 ? "badge-excellent" : s.marks >= 65 ? "badge-good" : "badge-average"}`}>{s.grade}</span>
                    </td>
                    <td className="py-3 px-3 w-40">
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.marks >= 80 ? "bg-emerald-500" : s.marks >= 65 ? "bg-primary-500" : "bg-amber-500"}`} style={{ width: `${s.marks}%` }} />
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-xs font-semibold ${s.marks >= 80 ? "text-emerald-500" : s.marks >= 65 ? "text-primary-500" : "text-amber-500"}`}>
                        {s.marks >= 80 ? "Excellent" : s.marks >= 65 ? "Good" : "Needs Work"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
