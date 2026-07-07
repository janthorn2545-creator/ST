"use client";

export function ConfirmDeleteButton({
  action,
  confirmMessage = "ยืนยันการลบรายการนี้ใช่หรือไม่?",
  label = "ลบ",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-xl px-3 py-1.5 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-500/10"
      >
        {label}
      </button>
    </form>
  );
}
