/**
 * StudentProfile.jsx — Student profile screen.
 */
import { useState } from "react";
import { Save, Moon, Sun, LogOut } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  return (
    <DashboardLayout title="My Profile" subtitle="Manage your account">
      <div className="max-w-2xl space-y-5">

        {/* Profile card */}
        <div className="card p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl grad-cyan flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {user?.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{user?.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.rollNumber}</p>
              <p className="text-sm text-primary-500 font-medium">{user?.course} · {user?.semester}</p>
              <span className="badge bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400 mt-1">Student</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
            {[
              { label: "GPA",        value: "8.2"  },
              { label: "Attendance", value: "88%"  },
              { label: "Rank",       value: "#4"   },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-black text-primary-600 dark:text-primary-400">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Edit */}
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-white">Edit Profile</h3>
          {[
            { label: "Full Name",  value: user?.name,       type: "text"  },
            { label: "Email",      value: user?.email,      type: "email" },
            { label: "Roll Number",value: user?.rollNumber, type: "text"  },
            { label: "Course",     value: user?.course,     type: "text"  },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">{f.label}</label>
              <input type={f.type} defaultValue={f.value} className="input" />
            </div>
          ))}
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="btn-primary gap-2">
            <Save size={16} /> {saved ? "Saved! ✓" : "Save Changes"}
          </button>
        </div>

        {/* Settings */}
        <div className="card p-5 space-y-2">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Settings</h3>
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left">
            {dark ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-500" />}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{dark ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button onClick={() => { logout(); navigate("/login"); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left">
            <LogOut size={18} className="text-red-500" />
            <span className="text-sm font-medium text-red-500">Logout</span>
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}
