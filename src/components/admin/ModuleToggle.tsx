"use client";

import { useState, useTransition } from "react";
import { setModuleVisibility } from "@/app/actions/modules";

export function ModuleToggle({ moduleId, initialVisible }: { moduleId: string; initialVisible: boolean }) {
  const [visible, setVisible] = useState(initialVisible);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !visible;
    setVisible(next);
    startTransition(async () => {
      await setModuleVisibility(moduleId, next);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      role="switch"
      aria-checked={visible}
      className={[
        "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-60",
        visible ? "bg-emerald-500" : "bg-slate-300",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          visible ? "translate-x-5" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}
