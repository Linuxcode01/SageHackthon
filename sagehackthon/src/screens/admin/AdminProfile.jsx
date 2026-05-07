/**
 * AdminProfile.jsx — Admin profile and settings.
 */
import { useState } from "react";
import { Save, Moon, Sun, LogOut, Shield } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  return (
    <DashboardLayout title="Profile & Settings" subtitle="Manage your admin account">
      <div className="max-w-2xl space-y-5">

        <div className="card p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl grad-rose flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {user?.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{user?.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.designation}</p>
              <p className="text-sm text-primary-500 font-medium">{user?.institution}</p>
              <span className="badge bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400 mt-1">
                <Shield size={10} className="inline mr-1" /> Administrator
              </span>
            </div>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-white">Edit Profile</h3>
          {[
            { label: "Full Name",    value: user?.name,        type: "text"  },
            { label: "Email",        value: user?.email,       type: "email" },
            { label: "Designation",  value: user?.designation, type: "text"  },
            { label: "Institution",  value: user?.institution, type: "text"  },
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
