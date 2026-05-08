/**
 * TeacherDashboard.jsx
 * Main overview screen for teachers.
 * Shows stats, student table, charts, and AI insights.
 */
import { useState, useEffect } from "react";
import { Users, TrendingUp, Calendar, Search, Filter } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import InsightCard from "../../components/InsightCard";
import PredictionCard from "../../components/PredictionCard";
import NotificationPanel from "../../components/NotificationPanel";
import SkeletonDashboard from "../../components/SkeletonLoader";
import {
  STUDENTS, MARKS_TREND, SUBJECT_MARKS, ATTENDANCE_PIE, NOTIFICATIONS,
} from "../../data/mockData";
import { generateTeacherInsights, generateTeacherInsightsFromOllama } from "../../utils/generateInsights";
import { predictNextScores, getImprovementChance, getRiskLevel } from "../../utils/linearRegression";
import { useAuth } from "../../context/AuthContext";

const STATUS_BADGE = {
  Excellent: "badge-excellent",
  Good:      "badge-good",
  Average:   "badge-average",
  Weak:      "badge-weak",
  "At Risk": "badge-risk",
};

export default function TeacherDashboard() {
  const { user }          = useAuth();
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Compute stats
  const totalStudents = STUDENTS.length;
  const avgMarks      = Math.round(STUDENTS.reduce((a, s) => a + s.marks, 0) / totalStudents);
  const avgAttendance = Math.round(STUDENTS.reduce((a, s) => a + s.attendance, 0) / totalStudents);
  const weakCount     = STUDENTS.filter((s) => s.marks < 60 || s.attendance < 65).length;
  const fallbackInsights = generateTeacherInsights({ avgMarks, attendance: avgAttendance, weakCount, totalStudents });
  const [insights, setInsights] = useState(fallbackInsights);

  useEffect(() => {
    let alive = true;
    const data = { avgMarks, attendance: avgAttendance, weakCount, totalStudents };

    (async () => {
      const generated = await generateTeacherInsightsFromOllama(data);
      if (alive) setInsights(generated);
    })();

    return () => {
      alive = false;
    };
  }, [avgMarks, avgAttendance, weakCount, totalStudents]);

  // Prediction
  const historicalMarks = MARKS_TREND.filter((m) => m.avg !== null).map((m) => m.avg);
  const [nextScore]     = predictNextScores(historicalMarks, 1);
  const improvement     = getImprovementChance(historicalMarks);
  const { level: risk } = getRiskLevel(avgMarks, avgAttendance);

  // Filter students
  const filtered = STUDENTS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search);
    const matchFilter = filter === "All" || s.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return <DashboardLayout title="Teacher Dashboard"><SkeletonDashboard /></DashboardLayout>;

  return (
    <DashboardLayout
      title={`Welcome, ${user?.name?.split(" ")[0]} 👋`}
      subtitle={`${user?.department} · ${user?.subject}`}
    >
      <div className="space-y-6">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="👥" label="Total Students"   value={totalStudents} sub="Active this semester" gradient="grad-primary" trend="8%" trendUp />
          <StatCard icon="📊" label="Average Marks"    value={`${avgMarks}%`} sub="Class performance"  gradient="grad-cyan"    trend="5%" trendUp />
          <StatCard icon="📅" label="Attendance Rate"  value={`${avgAttendance}%`} sub="This month"    gradient="grad-success" trend="2%" trendUp />
          <StatCard icon="⚠️" label="At-Risk Students" value={weakCount}     sub="Need intervention"   gradient="grad-warning" trend="1" trendUp={false} />
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Line chart — marks trend */}
          <div className="card p-5 lg:col-span-2">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-primary-500" /> Marks Trend & Prediction
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MARKS_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Legend />
                <Line type="monotone" dataKey="avg"       stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} name="Actual Avg" connectNulls={false} />
                <Line type="monotone" dataKey="predicted" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart — attendance */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-primary-500" /> Attendance
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={ATTENDANCE_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {ATTENDANCE_PIE.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-2xl font-bold text-primary-600 dark:text-primary-400 -mt-2">{avgAttendance}%</p>
            <p className="text-center text-xs text-slate-400">Average Attendance</p>
          </div>
        </div>

        {/* ── Subject Performance Bar Chart ── */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <Filter size={16} className="text-primary-500" /> Subject-wise Performance
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SUBJECT_MARKS} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="marks" name="Avg Marks" radius={[6, 6, 0, 0]}>
                {SUBJECT_MARKS.map((_, i) => (
                  <Cell key={i} fill={`hsl(${240 + i * 15}, 70%, ${55 + i * 3}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── AI Insights + Prediction ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              ✨ AI-Generated Insights
            </h3>
            <div className="space-y-3">
              {insights.map((ins) => (
                <InsightCard key={ins.id} icon={ins.icon} title={ins.title} text={ins.text} type={ins.type} />
              ))}
            </div>
          </div>
          <div>
            <PredictionCard predicted={Math.round(nextScore)} improvement={improvement} risk={risk} />
            <div className="mt-4">
              <NotificationPanel notifications={NOTIFICATIONS.slice(0, 3)} />
            </div>
          </div>
        </div>

        {/* ── Student Performance Table ── */}
        <div className="card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Users size={16} className="text-primary-500" /> Student Performance
            </h3>
            <div className="flex gap-2 sm:ml-auto flex-wrap">
              {/* Search */}
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2">
                <Search size={14} className="text-slate-400" />
                <input
                  className="bg-transparent text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 outline-none w-32"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl px-3 py-2 outline-none cursor-pointer"
              >
                {["All", "Excellent", "Good", "Average", "Weak", "At Risk"].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {["Student", "Roll No.", "Marks", "Attendance", "GPA", "Status"].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} className={`border-b border-slate-50 dark:border-slate-800 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/50 dark:bg-slate-800/30"}`}>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full grad-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono text-xs">{s.roll}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full w-16">
                          <div className="h-full grad-primary rounded-full" style={{ width: `${s.marks}%` }} />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{s.marks}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-semibold ${s.attendance < 70 ? "text-red-500" : s.attendance < 80 ? "text-amber-500" : "text-emerald-500"}`}>
                        {s.attendance}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">{s.gpa}</td>
                    <td className="py-3 px-3">
                      <span className={STATUS_BADGE[s.status] || "badge"}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-8 text-slate-400">No students found matching your search.</div>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-3">Showing {filtered.length} of {totalStudents} students</p>
        </div>

      </div>
    </DashboardLayout>
  );
}
