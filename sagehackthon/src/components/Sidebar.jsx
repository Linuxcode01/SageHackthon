import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, BarChart3, Brain, MessageSquare,
  Settings, LogOut, Bell, BookOpen, TrendingUp, Building2,
  GraduationCap, FileText, ChevronLeft, ChevronRight, Sun, Moon,
  Upload, UserCog, Activity,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const MENUS = {
  teacher: [
    { to: "/teacher",            icon: LayoutDashboard, label: "Dashboard"    },
    { to: "/teacher/students",   icon: Users,           label: "Students"     },
    { to: "/teacher/analytics",  icon: BarChart3,       label: "Analytics"    },
    { to: "/teacher/insights",   icon: Brain,           label: "AI Insights"  },
    { to: "/teacher/upload",     icon: Upload,          label: "Upload Data"  },
    { to: "/teacher/chatbot",    icon: MessageSquare,   label: "AI Chatbot"   },
    { to: "/teacher/notifications", icon: Bell,         label: "Notifications"},
    { to: "/teacher/profile",    icon: Settings,        label: "Profile"      },
  ],
  student: [
    { to: "/student",            icon: LayoutDashboard, label: "Dashboard"    },
    { to: "/student/performance",icon: TrendingUp,      label: "Performance"  },
    { to: "/student/subjects",   icon: BookOpen,        label: "Subjects"     },
    { to: "/student/insights",   icon: Brain,           label: "AI Insights"  },
    { to: "/student/chatbot",    icon: MessageSquare,   label: "AI Chatbot"   },
    { to: "/student/profile",    icon: Settings,        label: "Profile"      },
  ],
  admin: [
    { to: "/admin",              icon: LayoutDashboard, label: "Dashboard"    },
    { to: "/admin/departments",  icon: Building2,       label: "Departments"  },
    { to: "/admin/students",     icon: GraduationCap,   label: "Students"     },
    { to: "/admin/teachers",     icon: UserCog,         label: "Teachers"     },
    { to: "/admin/analytics",    icon: BarChart3,       label: "Analytics"    },
    { to: "/admin/insights",     icon: Brain,           label: "AI Insights"  },
    { to: "/admin/reports",      icon: FileText,        label: "Reports"      },
    { to: "/admin/activity",     icon: Activity,        label: "Activity Logs"},
    { to: "/admin/chatbot",      icon: MessageSquare,   label: "AI Chatbot"   },
    { to: "/admin/profile",      icon: Settings,        label: "Profile"      },
  ],
};

const ROLE_LABELS = { teacher: "Teacher Portal", student: "Student Portal", admin: "Admin Portal" };
const ROLE_COLORS = { teacher: "from-indigo-600 to-purple-600", student: "from-cyan-500 to-indigo-600", admin: "from-purple-600 to-pink-600" };

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const menu = MENUS[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-40 flex flex-col
        bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800
        shadow-xl transition-all duration-300
        ${collapsed ? "w-16" : "w-60"}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-100 dark:border-slate-800 ${collapsed ? "justify-center" : ""}`}>
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ROLE_COLORS[user?.role]} flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <Brain size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-sm text-slate-800 dark:text-white leading-tight">EduInsight AI</p>
            <p className="text-[10px] text-slate-400">{ROLE_LABELS[user?.role]}</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md hover:bg-primary-50 transition-colors z-50"
      >
        {collapsed ? <ChevronRight size={12} className="text-slate-500" /> : <ChevronLeft size={12} className="text-slate-500" />}
      </button>

      {/* User avatar */}
      {!collapsed && (
        <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${ROLE_COLORS[user?.role]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {user?.avatar}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate capitalize">{user?.role}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {menu.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === `/${user?.role}`}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""} ${collapsed ? "justify-center px-0" : ""}`
            }
            title={collapsed ? label : ""}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 py-3 border-t border-slate-100 dark:border-slate-800 space-y-0.5">
        <button
          onClick={toggleTheme}
          className={`sidebar-item w-full ${collapsed ? "justify-center px-0" : ""}`}
          title={collapsed ? (dark ? "Light Mode" : "Dark Mode") : ""}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`sidebar-item w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 ${collapsed ? "justify-center px-0" : ""}`}
          title={collapsed ? "Logout" : ""}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
