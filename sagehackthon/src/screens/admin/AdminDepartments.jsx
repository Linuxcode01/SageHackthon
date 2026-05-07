/**
 * AdminDepartments.jsx — Department analytics for admin.
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import { DEPARTMENTS } from "../../data/mockData";

export default function AdminDepartments() {
  const sorted = [...DEPARTMENTS].sort((a, b) => b.avgMarks - a.avgMarks);

  return (
    <DashboardLayout title="Departments" subtitle="Department-wise analytics">
      <div className="space-y-6">

        {/* Chart */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📊 Department Comparison</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={DEPARTMENTS} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Legend />
              <Bar dataKey="avgMarks"   name="Avg Marks"   fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="passRate"   name="Pass Rate"   fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="attendance" name="Attendance"  fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department table */}
        <div className="card p-5 overflow-x-auto">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">🏛️ Department Details</h3>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                {["Rank", "Department", "Students", "Teachers", "Avg Marks", "Pass Rate", "Attendance", "Trend"].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, i) => (
                <tr key={d.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition-colors">
                  <td className="py-3 px-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? "bg-amber-400" : i === 1 ? "bg-slate-400" : i === 2 ? "bg-orange-400" : "bg-slate-200 text-slate-600"}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-800 dark:text-white">{d.name}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{d.students}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{d.teachers}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                        <div className="h-full grad-primary rounded-full" style={{ width: `${d.avgMarks}%` }} />
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{d.avgMarks}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-emerald-500">{d.passRate}%</td>
                  <td className="py-3 px-3 font-semibold text-primary-500">{d.attendance}%</td>
                  <td className="py-3 px-3">
                    <span className={`badge ${d.trend.startsWith("+") ? "badge-excellent" : "badge-risk"}`}>{d.trend}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </DashboardLayout>
  );
}
