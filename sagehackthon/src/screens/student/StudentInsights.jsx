/**
 * StudentInsights.jsx — AI insights and prediction for students.
 */
import DashboardLayout from "../../components/DashboardLayout";
import InsightCard from "../../components/InsightCard";
import PredictionCard from "../../components/PredictionCard";
import { STUDENT_SUBJECTS } from "../../data/mockData";
import { generateStudentInsights } from "../../utils/generateInsights";
import { predictNextScores, getImprovementChance, getRiskLevel } from "../../utils/linearRegression";

export default function StudentInsights() {
  const historicalMarks = [65, 70, 68, 75, 80, 82];
  const [next1, next2]  = predictNextScores(historicalMarks, 2);
  const improvement     = getImprovementChance(historicalMarks);
  const { level: risk } = getRiskLevel(82, 88);

  const insights = generateStudentInsights({ marks: 82, attendance: 88, gpa: 8.2, subjects: STUDENT_SUBJECTS });

  return (
    <DashboardLayout title="AI Insights" subtitle="Personalized AI analysis for you">
      <div className="space-y-6">

        {/* Banner */}
        <div className="grad-cyan rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🧠</div>
            <div>
              <h2 className="text-xl font-bold">Your Personal AI Analysis</h2>
              <p className="text-white/80 text-sm mt-1">
                Based on your performance across 6 subjects and attendance data.
              </p>
              <div className="flex gap-3 mt-3 flex-wrap">
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Trend Analysis ✓</span>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Prediction Model ✓</span>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Study Plan ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">✨ AI Feedback for You</h3>
          <div className="space-y-3">
            {insights.map((ins) => (
              <InsightCard key={ins.id} icon={ins.icon} title={ins.title} text={ins.text} type={ins.type} />
            ))}
          </div>
        </div>

        {/* Predictions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PredictionCard predicted={Math.round(next1)} improvement={improvement} risk={risk} />
          <PredictionCard predicted={Math.round(next2)} improvement={Math.min(100, improvement + 8)} risk="Low" subject="Next Semester" />
        </div>

        {/* Subject improvement probability */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📊 Subject Improvement Probability</h3>
          <div className="space-y-3">
            {STUDENT_SUBJECTS.map((s) => {
              const prob = Math.round(50 + (s.marks - 65) * 1.2);
              return (
                <div key={s.subject} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="w-14 text-xs font-semibold text-slate-500 dark:text-slate-400">{s.subject}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Current: {s.marks}/100</span>
                      <span>Predicted: {Math.min(100, s.marks + 5)}/100</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.marks >= 80 ? "bg-emerald-500" : s.marks >= 65 ? "bg-primary-500" : "bg-amber-500"}`} style={{ width: `${s.marks}%` }} />
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${prob > 60 ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                    {Math.max(0, Math.min(100, prob))}%
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
