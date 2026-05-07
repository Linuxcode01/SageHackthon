/**
 * AdminAnalytics.jsx — Institution-wide analytics for admin.
 */
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import { DEPARTMENTS, STUDENT_GROWTH } from "../../data/mockData";

const ATTENDANCE_TREND = [
  { month: "Aug", cse: 88, ece: 84, mech: 80, it: 86 },
  { month: "Sep", cse: 86, ece: 82, mech: 78, it: 84 },
  { month: "Oct", cse: 84, ece: 83, mech: 79, it: 85 },
  { month: "Nov", cse: 85, ece: 81, mech: 77, it: 83 },
  { month: "Dec", cse: 87, ece: 84, mech: 80, it: 86 },
  { month: "Jan", cse: 85, ece: 82, mech: 79, it: 84 },
];

export default function AdminAnalytics() {
  return (
    <DashboardLayout title="Analytics" subtitle="Institution-wide performance analytics">
      <div className="space-y-6">

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Best Department",  value: "CSE",   sub: "78% avg marks",  color: "text-emerald-500" },
            { label: "Needs Attention",  value: "MECH",  sub: "70% avg marks",  color: "text-amber-500"   },
            { label: "Total Enrollment", value: "1,500", sub: "+8.7% YoY",      color: "text-primary-500" },
            { label: "Avg Pass Rate",    value: "88.4%", sub: "All departments", color: "text-cyan-500"   },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-white mt-1">{s.label}</p>
              <p className="text-xs text-slate-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Student growth */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📈 Student Enrollment Growth (5 Years)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={STUDENT_GROWTH} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Bar dataKey="students" name="Students" radius={[6, 6, 0, 0]}>
                {STUDENT_GROWTH.map((_, i) => <Cell key={i} fill={`hsl(${240 + i * 10}, 70%, ${55 + i * 3}%)`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance trend */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">📅 Department Attendance Trends</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={ATTENDANCE_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[70, 95]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Legend />
              <Line type="monotone" dataKey="cse"  stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="CSE"  />
              <Line type="monotone" dataKey="ece"  stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} name="ECE"  />
              <Line type="monotone" dataKey="mech" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="MECH" />
              <Line type="monotone" dataKey="it"   stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="IT"   />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department marks comparison */}
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">🏛️ Department Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DEPARTMENTS} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={45} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              <Legend />
              <Bar dataKey="avgMarks" name="Avg Marks" fill="#6366f1" radius={[0, 6, 6, 0]} />
              <Bar dataKey="passRate" name="Pass Rate" fill="#10b981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </DashboardLayout>
  );
}
