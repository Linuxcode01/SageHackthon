/**
 * AdminDashboard.jsx
 * Institutional Administrator main dashboard.
 * Shows institution-wide analytics, department performance, AI insights.
 */
import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import InsightCard from "../../components/InsightCard";
import NotificationPanel from "../../components/NotificationPanel";
import SkeletonDashboard from "../../components/SkeletonLoader";
import { DEPARTMENTS, STUDENT_GROWTH, PASS_FAIL, NOTIFICATIONS } from "../../data/mockData";
import { generateAdminInsights, generateAdminInsightsFromOllama } from "../../utils/generateInsights";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
  const { user }        = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const totalStudents = DEPARTMENTS.reduce((a, d) => a + d.students, 0);
  const totalTeachers = DEPARTMENTS.reduce((a, d) => a + d.teachers, 0);
  const avgPassRate   = Math.round(DEPARTMENTS.reduce((a, d) => a + d.passRate, 0) / DEPARTMENTS.length);
  const avgAttendance = Math.round(DEPARTMENTS.reduce((a, d) => a + d.attendance, 0) / DEPARTMENTS.length);
  const fallbackInsights = generateAdminInsights({ departments: DEPARTMENTS, totalStudents, passRate: avgPassRate });
  const [insights, setInsights] = useState(fallbackInsights);

  useEffect(() => {
    let alive = true;
    const data = { departments: DEPARTMENTS, totalStudents, passRate: avgPassRate };

    (async () => {
      const generated = await generateAdminInsightsFromOllama(data);
      if (alive) setInsights(generated);
    })();

    return () => {
      alive = false;
    };
  }, [totalStudents, avgPassRate]);

  if (loading) return <DashboardLayout title="Admin Dashboard"><SkeletonDashboard /></DashboardLayout>;

  return (
    <DashboardLayout
      title={`Welcome, ${user?.name?.split(" ")[0]} 👋`}
      subtitle={`${user?.designation} · ${user?.institution}`}
    >
      <div className="space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="🎓" label="Total Students"  value={totalStudents.toLocaleString()} sub="Enrolled this year"  gradient="grad-primary" trend="8.7%" trendUp />
          <StatCard icon="👨‍🏫" label="Total Teachers"  value={totalTeachers}                  sub="Active faculty"     gradient="grad-cyan"    trend="3%"   trendUp />
          <StatCard icon="✅" label="Pass Rate"        value={`${avgPassRate}%`}              sub="Institution avg"    gradient="grad-success" trend="2.1%" trendUp />
          <StatCard icon="📅" label="Avg Attendance"  value={`${avgAttendance}%`}            sub="All departments"    gradient="grad-warning" trend="1%"   trendUp />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Student growth */}
          <div className="card p-5 lg:col-span-2">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📈 Student Enrollment Growth</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={STUDENT_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 5 }} name="Students" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pass/Fail pie */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">🎯 Pass / Fail Rate</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={PASS_FAIL} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {PASS_FAIL.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-2xl font-bold text-primary-600 dark:text-primary-400 -mt-2">{avgPassRate}%</p>
            <p className="text-center text-xs text-slate-400">Pass Rate</p>
          </div>
        </div>

        {/* Department performance bar chart */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">🏛️ Department Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DEPARTMENTS} barSize={28}>
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

        {/* Department cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEPARTMENTS.map((d) => (
            <div key={d.id} className="card p-4 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-lg">{d.name}</h4>
                  <p className="text-xs text-slate-400">{d.students} students · {d.teachers} teachers</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${d.trend.startsWith("+") ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {d.trend}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Avg Marks",  value: `${d.avgMarks}%` },
                  { label: "Pass Rate",  value: `${d.passRate}%` },
                  { label: "Attendance", value: `${d.attendance}%` },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
                    <p className="text-sm font-bold text-primary-600 dark:text-primary-400">{s.value}</p>
                    <p className="text-[10px] text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights + Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">✨ AI Institutional Insights</h3>
            <div className="space-y-3">
              {insights.map((ins) => (
                <InsightCard key={ins.id} icon={ins.icon} title={ins.title} text={ins.text} type={ins.type} />
              ))}
            </div>
          </div>
          <NotificationPanel notifications={NOTIFICATIONS} />
        </div>

      </div>
    </DashboardLayout>
  );
}
