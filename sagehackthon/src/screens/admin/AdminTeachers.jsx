/**
 * AdminTeachers.jsx — Teacher management for admin.
 */
import { useState } from "react";
import { Search, UserPlus, Star } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { TEACHERS } from "../../data/mockData";

export default function AdminTeachers() {
  const [search, setSearch] = useState("");
  const filtered = TEACHERS.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) || t.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Teacher Management" subtitle={`${TEACHERS.length} faculty members`}>
      <div className="space-y-4">
        <div className="card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl px-3 py-2 flex-1">
            <Search size={14} className="text-slate-400" />
            <input className="bg-transparent text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 outline-none w-full"
              placeholder="Search teachers..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn-primary text-xs px-3 py-2 gap-1.5"><UserPlus size={14} /> Add Teacher</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="card p-5 card-hover">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl grad-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 dark:text-white truncate">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.subject}</p>
                  <span className="badge bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400 mt-1">{t.dept}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
                  <p className="text-sm font-bold text-primary-600 dark:text-primary-400">{t.students}</p>
                  <p className="text-[10px] text-slate-400">Students</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{t.exp}</p>
                  <p className="text-[10px] text-slate-400">Experience</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 flex flex-col items-center">
                  <div className="flex items-center gap-0.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <p className="text-sm font-bold text-amber-500">{t.rating}</p>
                  </div>
                  <p className="text-[10px] text-slate-400">Rating</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 text-xs py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold hover:bg-primary-100 transition-colors">View</button>
                <button className="flex-1 text-xs py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 transition-colors">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
