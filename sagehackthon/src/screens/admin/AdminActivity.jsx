/**
 * AdminActivity.jsx — System activity logs for admin.
 */
import DashboardLayout from "../../components/DashboardLayout";
import { ACTIVITY_LOGS } from "../../data/mockData";
import { Upload, Plus, Download, Brain, Edit } from "lucide-react";

const TYPE_CONFIG = {
  upload: { icon: Upload, color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-900/20"    },
  create: { icon: Plus,   color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  export: { icon: Download,color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  ai:     { icon: Brain,  color: "text-primary-500", bg: "bg-primary-50 dark:bg-primary-900/20" },
  update: { icon: Edit,   color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-900/20"  },
};

export default function AdminActivity() {
  return (
    <DashboardLayout title="Activity Logs" subtitle="System activity and audit trail">
      <div className="max-w-2xl space-y-4">
        <div className="card p-5">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">🕐 Recent Activity</h3>
          <div className="space-y-3">
            {ACTIVITY_LOGS.map((log) => {
              const cfg = TYPE_CONFIG[log.type] || TYPE_CONFIG.update;
              const Icon = cfg.icon;
              return (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                    <Icon size={16} className={cfg.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{log.action}</p>
                    <p className="text-xs text-slate-400">by {log.user}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{log.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
