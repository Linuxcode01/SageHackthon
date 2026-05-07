/**
 * AdminReports.jsx — Reports and export screen for admin.
 */
import { useState } from "react";
import { Download, FileText, CheckCircle } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";

const REPORTS = [
  { id: 1, name: "Student Performance Report",    desc: "Complete marks and GPA analysis",         type: "PDF",  size: "2.4 MB", date: "Jan 2025" },
  { id: 2, name: "Attendance Summary Report",     desc: "Department-wise attendance analytics",    type: "Excel", size: "1.8 MB", date: "Jan 2025" },
  { id: 3, name: "AI Insights Report",            desc: "AI-generated performance insights",       type: "PDF",  size: "3.1 MB", date: "Jan 2025" },
  { id: 4, name: "Department Comparison Report",  desc: "Cross-department performance analysis",   type: "PDF",  size: "1.5 MB", date: "Dec 2024" },
  { id: 5, name: "At-Risk Students Report",       desc: "Students needing immediate intervention", type: "Excel", size: "0.9 MB", date: "Jan 2025" },
  { id: 6, name: "Faculty Performance Report",    desc: "Teacher ratings and student feedback",    type: "PDF",  size: "2.0 MB", date: "Dec 2024" },
];

export default function AdminReports() {
  const [downloading, setDownloading] = useState(null);
  const [downloaded, setDownloaded]   = useState([]);

  const handleDownload = async (id) => {
    setDownloading(id);
    await new Promise((r) => setTimeout(r, 1200));
    setDownloading(null);
    setDownloaded((prev) => [...prev, id]);
    setTimeout(() => setDownloaded((prev) => prev.filter((d) => d !== id)), 3000);
  };

  return (
    <DashboardLayout title="Reports" subtitle="Download and export institutional reports">
      <div className="space-y-4 max-w-3xl">

        {/* Generate new report */}
        <div className="card p-5 border-l-4 border-l-primary-400 bg-primary-50 dark:bg-primary-900/20">
          <h3 className="font-semibold text-primary-700 dark:text-primary-400 mb-3">📊 Generate Custom Report</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select className="input text-sm">
              <option>Select Department</option>
              <option>CSE</option><option>ECE</option><option>MECH</option><option>CIVIL</option><option>IT</option>
            </select>
            <select className="input text-sm">
              <option>Select Period</option>
              <option>This Semester</option><option>Last Semester</option><option>This Year</option>
            </select>
            <button className="btn-primary text-sm gap-2"><FileText size={16} /> Generate Report</button>
          </div>
        </div>

        {/* Report list */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📁 Available Reports</h3>
          <div className="space-y-3">
            {REPORTS.map((r) => (
              <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${r.type === "PDF" ? "bg-red-100 dark:bg-red-900/30" : "bg-emerald-100 dark:bg-emerald-900/30"}`}>
                  <FileText size={18} className={r.type === "PDF" ? "text-red-500" : "text-emerald-500"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.desc}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-[10px] text-slate-400">{r.type}</span>
                    <span className="text-[10px] text-slate-400">{r.size}</span>
                    <span className="text-[10px] text-slate-400">{r.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(r.id)}
                  disabled={downloading === r.id}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${downloaded.includes(r.id) ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 hover:bg-primary-200"}`}
                >
                  {downloading === r.id ? (
                    <span className="w-3 h-3 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                  ) : downloaded.includes(r.id) ? (
                    <><CheckCircle size={12} /> Done</>
                  ) : (
                    <><Download size={12} /> Download</>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
