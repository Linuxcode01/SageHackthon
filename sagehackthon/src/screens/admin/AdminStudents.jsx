/**
 * AdminStudents.jsx — Student management for admin.
 */
import { useState } from "react";
import { Search, Download, UserPlus } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { STUDENTS } from "../../data/mockData";

export default function AdminStudents() {
  const [search, setSearch] = useState("");
  const filtered = STUDENTS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search)
  );

  return (
    <DashboardLayout title="Student Management" subtitle={`${STUDENTS.length} students enrolled`}>
      <div className="space-y-4">
        <div className="card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 flex-1">
            <Search size={14} className="text-slate-400" />
            <input className="bg-transparent text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 outline-none w-full"
              placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button className="btn-outline text-xs px-3 py-2 gap-1.5"><Download size={14} /> Export</button>
            <button className="btn-primary text-xs px-3 py-2 gap-1.5"><UserPlus size={14} /> Add Student</button>
          </div>
        </div>

        <div className="card p-5 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                {["Student", "Roll No.", "Department", "Marks", "Attendance", "GPA", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full grad-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium text-slate-800 dark:text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-slate-500 dark:text-slate-400">{s.roll}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{s.dept}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">{s.marks}</td>
                  <td className="py-3 px-3">
                    <span className={`font-semibold ${s.attendance < 70 ? "text-red-500" : s.attendance < 80 ? "text-amber-500" : "text-emerald-500"}`}>{s.attendance}%</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">{s.gpa}</td>
                  <td className="py-3 px-3">
                    <span className={`badge ${s.status === "Excellent" ? "badge-excellent" : s.status === "Good" ? "badge-good" : s.status === "Average" ? "badge-average" : "badge-risk"}`}>{s.status}</span>
                  </td>
                  <td className="py-3 px-3 flex gap-2">
                    <button className="text-xs text-primary-500 hover:text-primary-600 font-semibold">View</button>
                    <button className="text-xs text-red-400 hover:text-red-500 font-semibold">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-3">Showing {filtered.length} of {STUDENTS.length} students</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
