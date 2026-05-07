/**
 * TeacherAnalytics.jsx
 * Detailed analytics screen for teachers with multiple charts.
 */
import { BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import { MARKS_TREND, SUBJECT_MARKS, STUDENTS } from "../../data/mockData";

const GRADE_DIST = [
  { grade: "A+", count: 2, fill: "#6366f1" },
  { grade: "A",  count: 3, fill: "#8b5cf6" },
  { grade: "B+", count: 4, fill: "#06b6d4" },
  { grade: "B",  count: 2, fill: "#10b981" },
  { grade: "C",  count: 1, fill: "#f59e0b" },
  { grade: "F",  count: 0, fill: "#ef4444" },
];

const RADAR_DATA = SUBJECT_MARKS.map((s) => ({ subject: s.subject, score: s.marks, fullMark: 100 }));

export default function TeacherAnalytics() {
  return (
    <DashboardLayout title="Analytics" subtitle="Detailed performance analytics">
      <div className="space-y-6">

        {/* Summary row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Highest Score",  value: "95",  sub: "Divya Kapoor",  color: "text-emerald-500" },
            { label: "Lowest Score",   value: "42",  sub: "Rohan Das",     color: "text-red-500"     },
            { label: "Class Median",   value: "76",  sub: "50th percentile", color: "text-primary-500" },
            { label: "Std. Deviation", value: "17.2",sub: "Score spread",  color: "text-amber-500"   },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-white mt-1">{s.label}</p>
              <p className="text-xs text-slate-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Marks trend + Grade distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📈 Monthly Marks Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MARKS_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                <Legend />
                <Line type="monotone" dataKey="avg" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} name="Actual" connectNulls={false} />
                <Line type="monotone" dataKey="predicted" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">🎓 Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={GRADE_DIST} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]}>
                  {GRADE_DIST.map((g, i) => <Cell key={i} fill={g.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject radar + Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">🕸️ Subject Radar</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Class Avg" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📚 Subject Performance</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={SUBJECT_MARKS} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="subject" tick={{ fontSize: 11 }} width={45} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                <Bar dataKey="marks" name="Avg Marks" radius={[0, 6, 6, 0]}>
                  {SUBJECT_MARKS.map((_, i) => <Cell key={i} fill={`hsl(${240 + i * 15}, 70%, 60%)`} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top & Bottom performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { title: "🏆 Top Performers", students: [...STUDENTS].sort((a, b) => b.marks - a.marks).slice(0, 5), color: "text-emerald-500" },
            { title: "⚠️ Needs Attention", students: [...STUDENTS].sort((a, b) => a.marks - b.marks).slice(0, 5), color: "text-red-500" },
          ].map(({ title, students, color }) => (
            <div key={title} className="card p-5">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">{title}</h3>
              <div className="space-y-3">
                {students.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400 w-5">#{i + 1}</span>
                    <div className="w-8 h-8 rounded-full grad-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{s.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
                          <div className="h-full grad-primary rounded-full" style={{ width: `${s.marks}%` }} />
                        </div>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${color}`}>{s.marks}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
