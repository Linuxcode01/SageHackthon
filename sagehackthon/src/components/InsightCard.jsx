
const TYPE_STYLES = {
  success: "border-l-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
  warning: "border-l-amber-400  bg-amber-50  dark:bg-amber-900/20",
  danger:  "border-l-red-400    bg-red-50    dark:bg-red-900/20",
  info:    "border-l-blue-400   bg-blue-50   dark:bg-blue-900/20",
};
const TITLE_STYLES = {
  success: "text-emerald-700 dark:text-emerald-400",
  warning: "text-amber-700  dark:text-amber-400",
  danger:  "text-red-700    dark:text-red-400",
  info:    "text-blue-700   dark:text-blue-400",
};

export default function InsightCard({ icon, title, text, type = "info" }) {
  return (
    <div className={`border-l-4 rounded-r-xl p-4 animate-slide-up ${TYPE_STYLES[type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">{icon}</span>
        <div>
          <p className={`text-sm font-semibold ${TITLE_STYLES[type]}`}>{title}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}
