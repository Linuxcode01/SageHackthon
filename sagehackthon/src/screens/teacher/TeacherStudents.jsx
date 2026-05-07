/**
 * TeacherStudents.jsx
 * Full student management table with search and filter.
 */
import { useState } from "react";
import { Search, Download, UserPlus } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { STUDENTS } from "../../data/mockData";

const STATUS_BADGE = {
  Excellent: "badge-excellent", Good: "badge-good",
  Average: "badge-average", Weak: "badge-weak", "At Risk": "badge-risk",
};

export default function TeacherStudents() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort]     = useState("name");

  const filtered = STUDENTS
    .filter((s) => {
      const q = search.toLowerCase();
      return (
        (s.name.toLowerCase().includes(q) || s.roll.includes(q)) &&
        (filter === "All" || s.status === filter)
      );
    })
    .sort((a, b) => {
      if (sort === "marks")      return b.marks - a.marks;
      if (sort === "attendance") return b.attendance - a.attendance;
      if (sort === "gpa")        return b.gpa - a.gpa;
      return a.name.localeCompare(b.name);
    });

  return (
    <DashboardLayout title="Students" subtitle={`${STUDENTS.length} students enrolled`}>
      <div className="space-y-4">

        {/* Controls */}
        <div className="card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 flex-1">
            <Search size={14} className="text-slate-400" />
            <input
              className="bg-transparent text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 outline-none w-full"
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
              className="text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl px-3 py-2 outline-none cursor-pointer">
              {["All", "Excellent", "Good", "Average", "Weak", "At Risk"].map((f) => <option key={f}>{f}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl px-3 py-2 outline-none cursor-pointer">
              <option value="name">Sort: Name</option>
              <option value="marks">Sort: Marks</option>
              <option value="attendance">Sort: Attendance</option>
              <option value="gpa">Sort: GPA</option>
            </select>
            <button className="btn-outline text-xs px-3 py-2 gap-1.5">
              <Download size={14} /> Export
            </button>
            <button className="btn-primary text-xs px-3 py-2 gap-1.5">
              <UserPlus size={14} /> Add Student
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card p-5 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                {["#", "Student", "Roll No.", "Marks /100", "Attendance", "GPA", "Status", "Action"].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition-colors">
                  <td className="py-3 px-3 text-slate-400 text-xs">{i + 1}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full grad-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-slate-500 dark:text-slate-400">{s.roll}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full">
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
                  <td className="py-3 px-3"><span className={STATUS_BADGE[s.status] || "badge"}>{s.status}</span></td>
                  <td className="py-3 px-3">
                    <button className="text-xs text-primary-500 hover:text-primary-600 font-semibold">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-400">No students found.</div>
          )}
          <p className="text-xs text-slate-400 mt-3">Showing {filtered.length} of {STUDENTS.length} students</p>
        </div>

      </div>
    </DashboardLayout>
  );
}
