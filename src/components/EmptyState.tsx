export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/30 px-6 py-14 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
      {message}
    </div>
  );
}
