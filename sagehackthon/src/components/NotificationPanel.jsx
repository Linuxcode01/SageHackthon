
import { Bell, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

const TYPE_CONFIG = {
  warning: { icon: AlertTriangle, bg: "bg-amber-50 dark:bg-amber-900/20",  border: "border-amber-200 dark:border-amber-800",  text: "text-amber-600 dark:text-amber-400",  dot: "bg-amber-400" },
  success: { icon: CheckCircle,   bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-400" },
  info:    { icon: Info,          bg: "bg-blue-50 dark:bg-blue-900/20",    border: "border-blue-200 dark:border-blue-800",    text: "text-blue-600 dark:text-blue-400",    dot: "bg-blue-400" },
  danger:  { icon: XCircle,       bg: "bg-red-50 dark:bg-red-900/20",      border: "border-red-200 dark:border-red-800",      text: "text-red-600 dark:text-red-400",      dot: "bg-red-400" },
};

export default function NotificationPanel({ notifications = [] }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={18} className="text-primary-500" />
        <h3 className="font-semibold text-slate-800 dark:text-white">Notifications</h3>
        <span className="ml-auto badge bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
          {notifications.filter((n) => !n.read).length} new
        </span>
      </div>
      <div className="space-y-3">
        {notifications.map((n) => {
          const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.bg} ${cfg.border} ${!n.read ? "opacity-100" : "opacity-60"} transition-opacity`}
            >
              <Icon size={16} className={`mt-0.5 flex-shrink-0 ${cfg.text}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{n.title}</p>
                  {!n.read && <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.msg}</p>
                <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
