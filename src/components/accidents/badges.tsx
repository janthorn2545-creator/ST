const SEVERITY_STYLE: Record<string, string> = {
  MINOR: "bg-emerald-500/10 text-emerald-500",
  MODERATE: "bg-amber-500/10 text-amber-500",
  SEVERE: "bg-rose-500/10 text-rose-500",
};

const SEVERITY_LABEL: Record<string, string> = {
  MINOR: "เล็กน้อย",
  MODERATE: "ปานกลาง",
  SEVERE: "รุนแรง",
};

const STATUS_STYLE: Record<string, string> = {
  OPEN: "bg-rose-500/10 text-rose-500",
  INVESTIGATING: "bg-amber-500/10 text-amber-500",
  CLOSED: "bg-emerald-500/10 text-emerald-500",
};

const STATUS_LABEL: Record<string, string> = {
  OPEN: "เปิดเคส",
  INVESTIGATING: "กำลังตรวจสอบ",
  CLOSED: "ปิดเคสแล้ว",
};

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SEVERITY_STYLE[severity] ?? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
    >
      {SEVERITY_LABEL[severity] ?? severity}
    </span>
  );
}

export function AccidentStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[status] ?? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export { SEVERITY_LABEL, STATUS_LABEL };
