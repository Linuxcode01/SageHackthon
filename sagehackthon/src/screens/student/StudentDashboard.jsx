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
import { generateStudentInsights, generateStudentInsightsFromOllama } from "../../utils/generateInsights";
import { predictNextScores, getImprovementChance, getRiskLevel } from "../../utils/linearRegression";
import { useAuth } from "../../context/AuthContext";
import { getResultsByStudent, getAssignmentsByStudent } from "../../services/backendApi.js";

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
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [studentData, setStudentData] = useState(null);
  const [results, setResults] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Fetch data from backend
  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      try {
        if (!user?._id) {
          setLoading(false);
          return;
        }

        const [resultsData, assignmentsData] = await Promise.all([
          getResultsByStudent(user._id),
          getAssignmentsByStudent(user._id),
        ]);

        if (alive) {
          setResults(resultsData || []);
          setAssignments(assignmentsData || []);
          setStudentData(user);
        }
      } catch (err) {
        console.warn("[StudentDashboard] Failed to fetch backend data:", err);
        // Keep using mock data on error
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchData();

    return () => {
      alive = false;
    };
  }, [user?._id]);

  // Transform results into historical marks for trend
  const historicalMarks = results.length > 0
    ? results.slice(0, 6).map((r) => r.marksObtained)
    : STUDENT_TREND.filter((m) => m.marks !== null).map((m) => m.marks);

  const [nextScore]     = predictNextScores(historicalMarks, 1);
  const improvement     = getImprovementChance(historicalMarks);
  const { level: risk } = getRiskLevel(historicalMarks.at(-1), user?.attendance || 88);

  // Calculate stats from backend data or use defaults
  const avgMarks = results.length > 0
    ? Math.round(results.reduce((a, r) => a + r.marksObtained, 0) / results.length)
    : 82;
  const currentAttendance = studentData?.attendance || user?.attendance || 88;
  const currentGPA = studentData?.gpa || user?.gpa || 8.2;
  const currentRank = user?.rank || "#4";

  const fallbackInsights = generateStudentInsights({
    marks: avgMarks,
    attendance: currentAttendance,
    gpa: currentGPA,
    subjects: results.length > 0
      ? results.map((r) => ({ subject: r.subject, marks: r.marksObtained, grade: r.grade }))
      : STUDENT_SUBJECTS,
  });
  const [insights, setInsights] = useState(fallbackInsights);

  useEffect(() => {
    let alive = true;
    const data = {
      marks: avgMarks,
      attendance: currentAttendance,
      gpa: currentGPA,
      subjects: results.length > 0
        ? results.map((r) => ({ subject: r.subject, marks: r.marksObtained, grade: r.grade }))
        : STUDENT_SUBJECTS,
    };

    (async () => {
      const generated = await generateStudentInsightsFromOllama(data);
      if (alive) setInsights(generated);
    })();

    return () => {
      alive = false;
    };
  }, [avgMarks, results]);

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
          <StatCard icon="📊" label="Overall Marks"  value={`${avgMarks}/100`} sub="Current semester"  gradient="grad-primary" trend="5%" trendUp />
          <StatCard icon="📅" label="Attendance"     value={`${currentAttendance}%`}    sub="This month"        gradient="grad-cyan"    trend="3%" trendUp />
          <StatCard icon="🎓" label="Current GPA"    value={currentGPA.toFixed(1)}    sub="Out of 10"         gradient="grad-success" trend="0.3" trendUp />
          <StatCard icon="🏆" label="Class Rank"     value={currentRank}     sub="Out of 12 students" gradient="grad-warning" trend="2" trendUp />
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
            {(results.length > 0
              ? results.map((r) => ({ subject: r.subject, marks: r.marksObtained, grade: r.grade }))
              : STUDENT_SUBJECTS
            ).map((s) => (
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
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📝 Recent Assignments</h3>
          <div className="space-y-3">
            {assignments.slice(0, 5).map((a) => (
              <div key={a._id} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{a.title}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      a.status === "Graded" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      a.status === "Submitted" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{a.subject} · Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                </div>
                {a.status === "Graded" && (
                  <div className="text-center">
                    <p className="font-bold text-lg text-primary-600 dark:text-primary-400">{a.marksObtained}</p>
                    <p className="text-xs text-slate-400">/ {a.maxMarks}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Goal tracker */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">🎯 Semester Goals</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { goal: "Achieve 85+ marks",    progress: avgMarks, target: 85, color: "bg-primary-500" },
              { goal: "Maintain 90% attendance", progress: currentAttendance, target: 90, color: "bg-cyan-500" },
              { goal: "GPA above 8.5",        progress: Math.round(currentGPA * 10), target: 85, color: "bg-accent-500" },
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
