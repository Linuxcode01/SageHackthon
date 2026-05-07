/**
 * TeacherInsights.jsx
 * AI Insights + Prediction screen for teachers.
 */
import DashboardLayout from "../../components/DashboardLayout";
import InsightCard from "../../components/InsightCard";
import PredictionCard from "../../components/PredictionCard";
import { STUDENTS, SUBJECT_MARKS } from "../../data/mockData";
import { generateTeacherInsights } from "../../utils/generateInsights";
import { predictNextScores, getImprovementChance, getRiskLevel } from "../../utils/linearRegression";

export default function TeacherInsights() {
  const avgMarks      = Math.round(STUDENTS.reduce((a, s) => a + s.marks, 0) / STUDENTS.length);
  const avgAttendance = Math.round(STUDENTS.reduce((a, s) => a + s.attendance, 0) / STUDENTS.length);
  const weakCount     = STUDENTS.filter((s) => s.marks < 60 || s.attendance < 65).length;
  const insights      = generateTeacherInsights({ avgMarks, attendance: avgAttendance, weakCount, totalStudents: STUDENTS.length });

  const historicalMarks = [68, 71, 69, 75, 78, 82];
  const [next1, next2]  = predictNextScores(historicalMarks, 2);
  const improvement     = getImprovementChance(historicalMarks);
  const { level: risk } = getRiskLevel(avgMarks, avgAttendance);

  return (
    <DashboardLayout title="AI Insights" subtitle="Machine learning powered analysis">
      <div className="space-y-6">

        {/* Header banner */}
        <div className="grad-primary rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🧠</div>
            <div>
              <h2 className="text-xl font-bold">AI Analysis Complete</h2>
              <p className="text-white/80 text-sm mt-1">
                Based on {STUDENTS.length} students' data across {SUBJECT_MARKS.length} subjects.
                Last updated: just now.
              </p>
              <div className="flex gap-3 mt-3 flex-wrap">
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Linear Regression ✓</span>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">RAG Analysis ✓</span>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Pattern Detection ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">✨ AI-Generated Insights</h3>
          <div className="space-y-3">
            {insights.map((ins) => (
              <InsightCard key={ins.id} icon={ins.icon} title={ins.title} text={ins.text} type={ins.type} />
            ))}
          </div>
        </div>

        {/* Predictions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PredictionCard predicted={Math.round(next1)} improvement={improvement} risk={risk} />
          <PredictionCard predicted={Math.round(next2)} improvement={Math.min(100, improvement + 5)} risk={risk === "High" ? "Medium" : "Low"} subject="Next Semester" />
        </div>

        {/* Subject-wise predictions */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📚 Subject-wise Predictions</h3>
          <div className="space-y-3">
            {SUBJECT_MARKS.map((s) => {
              const pred = Math.min(100, Math.round(s.marks * 1.05));
              const imp  = Math.round(50 + (s.marks - 65) * 1.5);
              return (
                <div key={s.subject} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-12 text-center">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{s.subject}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Current: {s.marks}</span>
                      <span>Predicted: {pred}</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full grad-primary rounded-full transition-all duration-700" style={{ width: `${s.marks}%` }} />
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${imp > 60 ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                    {imp}% chance
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
