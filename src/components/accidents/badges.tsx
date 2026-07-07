const SEVERITY_STYLE: Record<string, string> = {
  MINOR: "bg-emerald-50 text-emerald-700",
  MODERATE: "bg-amber-50 text-amber-700",
  SEVERE: "bg-red-50 text-red-700",
};

const SEVERITY_LABEL: Record<string, string> = {
  MINOR: "เล็กน้อย",
  MODERATE: "ปานกลาง",
  SEVERE: "รุนแรง",
};

const STATUS_STYLE: Record<string, string> = {
  OPEN: "bg-red-50 text-red-700",
  INVESTIGATING: "bg-amber-50 text-amber-700",
  CLOSED: "bg-emerald-50 text-emerald-700",
};

const STATUS_LABEL: Record<string, string> = {
  OPEN: "เปิดเคส",
  INVESTIGATING: "กำลังตรวจสอบ",
  CLOSED: "ปิดเคสแล้ว",
};

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SEVERITY_STYLE[severity] ?? "bg-slate-100 text-slate-600"}`}
    >
      {SEVERITY_LABEL[severity] ?? severity}
    </span>
  );
}

export function AccidentStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[status] ?? "bg-slate-100 text-slate-600"}`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export { SEVERITY_LABEL, STATUS_LABEL };
