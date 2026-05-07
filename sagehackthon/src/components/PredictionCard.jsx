
import { TrendingUp, Target, AlertCircle, Zap } from "lucide-react";

export default function PredictionCard({ predicted, improvement, risk, subject }) {
  const riskColor = risk === "High" ? "text-red-500" : risk === "Medium" ? "text-amber-500" : "text-emerald-500";
  const riskBg    = risk === "High" ? "bg-red-50 dark:bg-red-900/20" : risk === "Medium" ? "bg-amber-50 dark:bg-amber-900/20" : "bg-emerald-50 dark:bg-emerald-900/20";

  return (
    <div className="card p-4 space-y-4 animate-slide-up">
      <div className="flex items-center gap-2">
        <Zap size={16} className="text-primary-500" />
        <p className="font-semibold text-sm text-slate-800 dark:text-white">
          {subject ? `${subject} Prediction` : "AI Performance Prediction"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Predicted Score */}
        <div className="text-center p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
          <Target size={18} className="text-primary-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{predicted}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Predicted Score</p>
        </div>

        {/* Improvement Chance */}
        <div className="text-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
          <TrendingUp size={18} className="text-emerald-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{improvement}%</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Improvement</p>
        </div>

        {/* Risk Level */}
        <div className={`text-center p-3 rounded-xl ${riskBg}`}>
          <AlertCircle size={18} className={`${riskColor} mx-auto mb-1`} />
          <p className={`text-lg font-bold ${riskColor}`}>{risk}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Risk Level</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Confidence Score</span>
          <span>{improvement}%</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full grad-primary rounded-full transition-all duration-700"
            style={{ width: `${improvement}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 italic">
        * Prediction based on Linear Regression model using historical performance data.
      </p>
    </div>
  );
}
