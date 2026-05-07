/**
 * StudentSubjects.jsx — Subject details and study resources.
 */
import DashboardLayout from "../../components/DashboardLayout";
import { STUDENT_SUBJECTS } from "../../data/mockData";

const RESOURCES = {
  Math:  ["Khan Academy", "NPTEL Mathematics", "MIT OpenCourseWare"],
  DSA:   ["LeetCode", "GeeksforGeeks", "Striver's DSA Sheet"],
  DBMS:  ["NPTEL DBMS", "W3Schools SQL", "Database Design Course"],
  OS:    ["NPTEL OS", "Operating Systems: Three Easy Pieces", "Neso Academy"],
  CN:    ["Kurose & Ross Textbook", "NPTEL CN", "Cisco Networking Academy"],
  "AI/ML": ["Coursera ML by Andrew Ng", "Fast.ai", "Kaggle Learn"],
};

export default function StudentSubjects() {
  return (
    <DashboardLayout title="My Subjects" subtitle="Subject-wise performance and resources">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {STUDENT_SUBJECTS.map((s) => (
          <div key={s.subject} className="card p-5 card-hover">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">{s.subject}</h3>
                <p className="text-xs text-slate-400">Semester 5 · 4 Credits</p>
              </div>
              <span className={`badge ${s.marks >= 80 ? "badge-excellent" : s.marks >= 65 ? "badge-good" : "badge-average"}`}>
                {s.grade}
              </span>
            </div>

            {/* Score */}
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl font-black text-primary-600 dark:text-primary-400">{s.marks}</span>
              <span className="text-slate-400 text-sm mb-1">/ {s.max}</span>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all duration-700 ${s.marks >= 80 ? "bg-emerald-500" : s.marks >= 65 ? "bg-primary-500" : "bg-amber-500"}`}
                style={{ width: `${s.marks}%` }}
              />
            </div>

            {/* Status */}
            <p className={`text-xs font-semibold mb-3 ${s.marks >= 80 ? "text-emerald-500" : s.marks >= 65 ? "text-primary-500" : "text-amber-500"}`}>
              {s.marks >= 80 ? "✅ Excellent — Keep it up!" : s.marks >= 65 ? "📈 Good — Room to improve" : "⚠️ Needs attention — Focus here"}
            </p>

            {/* Resources */}
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">📚 Study Resources</p>
              <div className="flex flex-wrap gap-1.5">
                {(RESOURCES[s.subject] || []).map((r) => (
                  <span key={r} className="text-xs px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
