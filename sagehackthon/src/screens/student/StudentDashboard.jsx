/**
 * StudentDashboard.jsx
 * Personal dashboard for students — overview, stats, AI feedback, prediction.
 */
import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import InsightCard from "../../components/InsightCard";
import PredictionCard from "../../components/PredictionCard";
import SkeletonDashboard from "../../components/SkeletonLoader";
import { STUDENT_TREND, STUDENT_SUBJECTS, ATTENDANCE_PIE } from "../../data/mockData";
import { generateStudentInsights } from "../../utils/generateInsights";
import { predictNextScores, getImprovementChance, getRiskLevel } from "../../utils/linearRegression";
import { useAuth } from "../../context/AuthContext";

// Motivational quotes
const QUOTES = [
  "Success is the sum of small efforts repeated day in and day out. 🌟",
  "The secret of getting ahead is getting started. 🚀",
  "Believe you can and you're halfway there. 💪",
  "Education is the most powerful weapon you can use to change the world. 📚",
];

export default function StudentDashboard() {
  const { user }        = useAuth();
  const [loading, setLoading] = useState(true);
  // useState ensures the quote is stable across re-renders (no impure call in render)
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const historicalMarks = STUDENT_TREND.filter((m) => m.marks !== null).map((m) => m.marks);
  const [nextScore]     = predictNextScores(historicalMarks, 1);
  const improvement     = getImprovementChance(historicalMarks);
  const { level: risk } = getRiskLevel(historicalMarks.at(-1), 88);

  const insights = generateStudentInsights({
    marks: historicalMarks.at(-1),
    attendance: 88,
    gpa: 8.2,
    subjects: STUDENT_SUBJECTS,
  });

  if (loading) return <DashboardLayout title="Student Dashboard"><SkeletonDashboard /></DashboardLayout>;

  return (
    <DashboardLayout
      title={`Hi, ${user?.name?.split(" ")[0]} 👋`}
      subtitle={`${user?.rollNumber} · ${user?.course} · ${user?.semester}`}
    >
      <div className="space-y-6">

        {/* Motivation card */}
        <div className="grad-primary rounded-2xl p-5 text-white flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">Daily Motivation</p>
            <p className="text-sm font-medium leading-relaxed">{quote}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="📊" label="Overall Marks"  value="82/100" sub="Current semester"  gradient="grad-primary" trend="5%" trendUp />
          <StatCard icon="📅" label="Attendance"     value="88%"    sub="This month"        gradient="grad-cyan"    trend="3%" trendUp />
          <StatCard icon="🎓" label="Current GPA"    value="8.2"    sub="Out of 10"         gradient="grad-success" trend="0.3" trendUp />
          <StatCard icon="🏆" label="Class Rank"     value="#4"     sub="Out of 12 students" gradient="grad-warning" trend="2" trendUp />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card p-5 lg:col-span-2">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📈 My Performance Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={STUDENT_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
                <Legend />
                <Line type="monotone" dataKey="marks"     stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} name="My Marks" connectNulls={false} />
                <Line type="monotone" dataKey="predicted" stroke="#a78bfa" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📅 My Attendance</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={ATTENDANCE_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                  {ATTENDANCE_PIE.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-2xl font-bold text-primary-600 dark:text-primary-400 -mt-2">88%</p>
            <p className="text-center text-xs text-slate-400">My Attendance</p>
          </div>
        </div>

        {/* Subject marks */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📚 Subject-wise Performance</h3>
          <div className="space-y-3">
            {STUDENT_SUBJECTS.map((s) => (
              <div key={s.subject} className="flex items-center gap-4">
                <div className="w-14 text-xs font-semibold text-slate-500 dark:text-slate-400">{s.subject}</div>
                <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${s.marks >= 80 ? "bg-emerald-500" : s.marks >= 65 ? "bg-primary-500" : "bg-amber-500"}`}
                    style={{ width: `${s.marks}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 w-20 justify-end">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{s.marks}/100</span>
                  <span className="text-xs font-semibold text-slate-400">{s.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights + Prediction */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card p-5">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">🤖 AI Feedback for You</h3>
            <div className="space-y-3">
              {insights.map((ins) => (
                <InsightCard key={ins.id} icon={ins.icon} title={ins.title} text={ins.text} type={ins.type} />
              ))}
            </div>
          </div>
          <PredictionCard predicted={Math.round(nextScore)} improvement={improvement} risk={risk} />
        </div>

        {/* Goal tracker */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">🎯 Semester Goals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { goal: "Achieve 85+ marks",    progress: 82, target: 85, color: "bg-primary-500" },
              { goal: "Maintain 90% attendance", progress: 88, target: 90, color: "bg-cyan-500" },
              { goal: "GPA above 8.5",        progress: 82, target: 85, color: "bg-accent-500" },
            ].map((g) => (
              <div key={g.goal} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">{g.goal}</p>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                  <div className={`h-full ${g.color} rounded-full`} style={{ width: `${(g.progress / g.target) * 100}%` }} />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Current: {g.progress}</span>
                  <span>Target: {g.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
