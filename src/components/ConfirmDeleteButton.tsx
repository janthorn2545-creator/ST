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
        className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        {label}
      </button>
    </form>
  );
}
