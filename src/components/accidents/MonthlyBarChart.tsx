const THAI_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

const MAX_BAR_HEIGHT_PX = 120;

export function MonthlyBarChart({ counts }: { counts: number[] }) {
  const max = Math.max(1, ...counts);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="mb-4 text-sm font-medium text-slate-500">
        จำนวนอุบัติเหตุรายเดือน (ปีนี้)
      </p>
      <div className="flex items-end gap-2" style={{ height: MAX_BAR_HEIGHT_PX + 40 }}>
        {counts.map((count, i) => {
          const barHeightPx = count === 0 ? 2 : Math.max((count / max) * MAX_BAR_HEIGHT_PX, 4);
          const isPeak = count > 0 && count === max;
          return (
            <div
              key={i}
              className="group relative flex flex-1 flex-col items-center justify-end"
              style={{ height: MAX_BAR_HEIGHT_PX + 40 }}
              title={`${THAI_MONTHS[i]}: ${count} รายการ`}
            >
              {isPeak && (
                <span className="mb-1 text-xs font-medium text-slate-600">{count}</span>
              )}
              <div
                className="w-full max-w-[24px] rounded-t-[4px] bg-blue-500 transition-colors group-hover:bg-blue-600"
                style={{ height: barHeightPx }}
              />
              <span className="mt-2 text-[11px] text-slate-400">{THAI_MONTHS[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
