import { Activity, AlertTriangle, CheckCircle2, Flame } from "lucide-react";

const TONE_CONFIG = {
  default: {
    border: "border-indigo-500",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500",
    valueColor: "text-slate-900 dark:text-white",
    Icon: Activity,
  },
  success: {
    border: "border-emerald-500",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    valueColor: "text-emerald-500",
    Icon: CheckCircle2,
  },
  warning: {
    border: "border-amber-500",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    valueColor: "text-amber-500",
    Icon: AlertTriangle,
  },
  danger: {
    border: "border-rose-500",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
    valueColor: "text-rose-500",
    Icon: Flame,
  },
} as const;

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: keyof typeof TONE_CONFIG;
}) {
  const { border, iconBg, iconColor, valueColor, Icon } = TONE_CONFIG[tone];

  return (
    <div className={`glass-card glass-card-hover rounded-3xl border-l-4 p-6 ${border}`}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <div className={`rounded-xl p-2 ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <p className={`mt-3 text-3xl font-black ${valueColor}`}>{value}</p>
      {hint && <p className="mt-1 text-xs font-medium text-slate-400">{hint}</p>}
    </div>
  );
}
