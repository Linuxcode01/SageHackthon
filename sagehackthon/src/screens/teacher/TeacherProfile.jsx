/**
 * TeacherProfile.jsx — Teacher profile and settings screen.
 */
import { useState } from "react";
import { Save, Moon, Sun, Bell, Shield, LogOut } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function TeacherProfile() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout title="Profile & Settings" subtitle="Manage your account">
      <div className="max-w-2xl space-y-5">

        {/* Profile card */}
        <div className="card p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl grad-primary flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {user?.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{user?.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.designation}</p>
              <p className="text-sm text-primary-500 font-medium">{user?.department}</p>
              <span className="badge bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400 mt-1">
                Teacher
              </span>
            </div>
          </div>
        </div>

        {/* Edit profile */}
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-slate-800 dark:text-white">Edit Profile</h3>
          {[
            { label: "Full Name",   value: user?.name,        type: "text"  },
            { label: "Email",       value: user?.email,       type: "email" },
            { label: "Department",  value: user?.department,  type: "text"  },
            { label: "Subject",     value: user?.subject,     type: "text"  },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">{f.label}</label>
              <input type={f.type} defaultValue={f.value} className="input" />
            </div>
          ))}
          <button onClick={handleSave} className="btn-primary gap-2">
            <Save size={16} />
            {saved ? "Saved! ✓" : "Save Changes"}
          </button>
        </div>

        {/* Settings */}
        <div className="card p-5 space-y-3">
          <h3 className="font-semibold text-slate-800 dark:text-white">Settings</h3>
          {[
            { icon: dark ? Sun : Moon, label: dark ? "Switch to Light Mode" : "Switch to Dark Mode", action: toggleTheme, color: "text-amber-500" },
            { icon: Bell,   label: "Notification Preferences", action: () => {}, color: "text-blue-500"    },
            { icon: Shield, label: "Privacy & Security",       action: () => {}, color: "text-emerald-500" },
          ].map(({ icon: Icon, label, action, color }) => (
            <button key={label} onClick={action}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left">
              <Icon size={18} className={color} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
              <span className="ml-auto text-slate-300 dark:text-slate-600">›</span>
            </button>
          ))}
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
          >
            <LogOut size={18} className="text-red-500" />
            <span className="text-sm font-medium text-red-500">Logout</span>
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}
